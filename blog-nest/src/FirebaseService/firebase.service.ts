import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { app } from 'firebase-admin';
import { IRepository } from './dto/firebase.dto';

import { CreateUserDto } from 'src/Users/dto/create-user.dto';
import * as admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';
import { CreateCompanyDto } from 'src/company/dto/create-company.dto';
import { error } from 'console';

@Injectable()
export class FirebaseRepository<T> implements IRepository<T> {
  #db: FirebaseFirestore.Firestore;
  #collection: FirebaseFirestore.CollectionReference;
  #bucket: any;

  constructor(
    @Inject('FIREBASE_APP') public firebaseApp: app.App,
    private readonly collectionName: string,
  ) {
    this.#db = firebaseApp.firestore();
    this.#collection = this.#db.collection(collectionName);
    this.#bucket = admin.storage().bucket();
  }

  private async populateReferences(data: any): Promise<any> {
    const populatedData: any = {};

    for (const [key, value] of Object.entries(data)) {
      if (value instanceof admin.firestore.DocumentReference) {
        try {
          const refDoc = await value.get();
          populatedData[key] = refDoc.exists
            ? { id: refDoc.id, ...refDoc.data() }
            : null;
        } catch (error) {
          console.error(`Error fetching reference for field ${key}:`, error);
          populatedData[key] = null;
        }
      } else if (value instanceof admin.firestore.Timestamp) {
        populatedData[key] = value.toDate();
      } else if (Array.isArray(value)) {
        populatedData[key] = await Promise.all(
          value.map((item) => this.populateReferences(item)),
        );
      } else if (typeof value === 'object' && value !== null) {
        populatedData[key] = await this.populateReferences(value);
      } else {
        populatedData[key] = value;
      }
    }

    return populatedData;
  }

  async addDocument(data: T, documentID: string): Promise<string> {
    try {
      const snapshot = this.#collection.doc(documentID);
      await snapshot.set(data);
      return 'Success';
    } catch (err) {
      return 'Error' + err;
    }
  }

  async addDocumentWithoutId(data: T, file: any): Promise<string> {
    try {
      const fileName = `${uuidv4()}-${file.originalname}`;
      const modifiedFileName = fileName.replace(/\s+/g, '_');
      const fileUpload = this.#bucket.file(modifiedFileName);
      let documentToAdd: string;

      const stream = fileUpload.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
      });

      switch (this.collectionName) {
        case 'company':
          documentToAdd = 'name';
          break;
        case 'article':
          documentToAdd = 'id';
          break;
        default:
          null;
      }

      const snapshot = this.#collection.doc(
        data[documentToAdd].replace(/\s+/g, '_'),
      );
      const documentCheck = await snapshot.get();

      if (documentCheck.exists) {
        throw new Error('Document already exists');
      }

      return new Promise((resolve, reject) => {
        stream.on('error', (error: any) => {
          console.error(error);
          reject(new Error('Error uploading file'));
        });

        stream.on('finish', async () => {
          await fileUpload.makePublic();

          const publicUrl = `https://storage.googleapis.com/${this.#bucket.name}/${fileUpload.name}`;

          if (this.collectionName == 'company') {
            const newData = data as CreateCompanyDto;
            const snapshot = this.#collection.doc(
              newData.name.replace(/\s+/g, '_'),
            );
            const documentCheck = await snapshot.get();

            if (documentCheck.exists) {
              return reject(new Error('Document already exists'));
            }

            await snapshot.set({
              logo: publicUrl,
              ...newData,
            });
          }
          resolve('Success');
        });

        stream.end(file.buffer);
      });
    } catch (error) {
      return `${error}`;
    }
  }

  async updateCompany(
    id: string,
    data: Partial<T>,
    file?: Express.Multer.File,
  ): Promise<string> {
    try {
      const filteredDocument = Object.fromEntries(
        Object.entries(data).filter(
          ([_, value]) => value != '' && value != 'undefined',
        ),
      );

      const ref = this.#collection.doc(id);
      const snapshot = await ref.get();

      if (!snapshot.exists) {
        throw new Error('Document does not exist');
      }

      let updateData = { ...filteredDocument };

      if (file) {
        const fileName = `${uuidv4()}-${file.originalname.replace(/\s+/g, '_')}`;
        const fileUpload = this.#bucket.file(fileName);

        const stream = fileUpload.createWriteStream({
          metadata: {
            contentType: file.mimetype,
          },
        });

        await new Promise<void>((resolve, reject) => {
          stream.on('error', (error: any) => {
            console.error(error);
            reject(new Error('Error uploading file'));
          });

          stream.on('finish', async () => {
            await fileUpload.makePublic();
            const publicUrl = `https://storage.googleapis.com/${this.#bucket.name}/${fileUpload.name}`;
            updateData['logo'] = publicUrl;
            resolve();
          });

          stream.end(file.buffer);
        });
      }

      await ref.update(updateData);

      return 'Success';
    } catch (error) {
      console.error('Error updating document:', error);
      return `Error: ${error.message}`;
    }
  }

  async getAllDocuments(): Promise<T[]> {
    const snapshot = await this.#collection.get();
    const documents = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const data = doc.data();
        const populatedData = await this.populateReferences(data);
        return { id: doc.id, ...populatedData } as T;
      }),
    );
    return documents;
  }

  async getDocumentById(id: string): Promise<T> {
    const snapshot = await this.#collection.get();
    return snapshot.docs.find((data) => data.id == id) as T;
  }

  async logInUser(verifiedToken: any): Promise<T> {
    const snapshot = await this.#collection.get();
    return snapshot.docs
      .find((data) => data.id === verifiedToken.uid)
      .data() as T;
  }

  async updateDocument(id: string, documentUpdate: T): Promise<string> {
    try {
      const snapshot = this.#collection.doc(id);
      const filteredDocument = Object.fromEntries(
        Object.entries(documentUpdate).filter(([_, value]) => value != ''),
      );
      await snapshot.update(filteredDocument);
      return 'Success';
    } catch (err) {
      return 'Error' + err;
    }
  }

  async addArticle(data: T, file?: Express.Multer.File) {
    const authorUid = await admin.auth().verifyIdToken(data['writer']);
    const authorRef = this.#db.collection('users').doc(authorUid.uid);
    const companyRef = this.#db.collection('company').doc(data['company']);

    const blogDoc = {
      ...data,
      writer: authorRef,
      company: companyRef,
      editor: '',
    };

    try {
      if (file) {
        const fileName = `${uuidv4()}-${file.originalname.replace(/\s+/g, '_')}`;
        const fileUpload = this.#bucket.file(fileName);
        const stream = fileUpload.createWriteStream({
          metadata: {
            contentType: file.mimetype,
          },
        });
        await new Promise<void>((resolve, reject) => {
          stream.on('error', (error: any) => {
            console.error(error);
            reject(new Error('Error uploading file'));
          });
          stream.on('finish', async () => {
            await fileUpload.makePublic();
            const publicUrl = `https://storage.googleapis.com/${this.#bucket.name}/${fileUpload.name}`;
            blogDoc['image'] = publicUrl;
            resolve();
          });
          stream.end(file.buffer);
        });
      }
      this.#collection.add(blogDoc);
      return 'Success';
    } catch (err) {
      return 'Failed';
    }
  }

  async updateArticle(id: string, data: T, file?: Express.Multer.File) {
    const authorUid = await admin.auth().verifyIdToken(data['writer']);
    const authorRef = this.#db.collection('users').doc(authorUid.uid);
    const articleRef = this.#collection.doc(id);
    let companyRef;
    if (data['company']) {
      companyRef = this.#db.collection('company').doc(data['company']);
    }
    const blogDoc = {
      ...data,
      writer: authorRef,
      company: companyRef ?? '',
      editor: '',
    };
    const filteredDocument = Object.fromEntries(
      Object.entries(blogDoc).filter(
        ([_, value]) => value != '' && value != 'undefined',
      ),
    );
    try {
      if (file) {
        const fileName = `${uuidv4()}-${file.originalname.replace(/\s+/g, '_')}`;
        const fileUpload = this.#bucket.file(fileName);
        const stream = fileUpload.createWriteStream({
          metadata: {
            contentType: file.mimetype,
          },
        });
        await new Promise<void>((resolve, reject) => {
          stream.on('error', (error: any) => {
            console.error(error);
            reject(new Error('Error uploading file'));
          });
          stream.on('finish', async () => {
            await fileUpload.makePublic();
            const publicUrl = `https://storage.googleapis.com/${this.#bucket.name}/${fileUpload.name}`;
            blogDoc['image'] = publicUrl;
            resolve();
          });
          stream.end(file.buffer);
        });
      }
      articleRef.update(filteredDocument);
      return 'Success';
    } catch (err) {
      return 'Failed';
    }
  }

  async saveArticle(data: T, file?: Express.Multer.File, id?: string | null) {
    const users = this.#db.collection('users');

    let authorRef: any;
    let companyRef: any;
    let editorRef: any;

    if (data['company']) {
      companyRef = this.#db.collection('company').doc(data['company']);
    }
    if (data['editor'] != 'initial' && data['editor'] != '') {
      const editorUid = await admin.auth().verifyIdToken(data['editor']);
      editorRef = users.doc(editorUid.uid);
    }
    if (data['writer'] != 'initial' && data['writer'] != '') {
      const authorUid = await admin.auth().verifyIdToken(data['writer']);
      authorRef = users.doc(authorUid.uid);
    }

    const blogDoc = {
      ...data,
      writer: authorRef,
      company: companyRef ?? '',
      editor: editorRef ?? '',
    };

    const filteredDocument = Object.fromEntries(
      Object.entries(blogDoc).filter(
        ([_, value]) =>
          value != '' && value != 'undefined' && value != undefined,
      ),
    );

    try {
      if (file) {
        const publicUrl = await this.uploadFile(file, this.#bucket);
        filteredDocument['image'] = publicUrl;
        blogDoc['image'] = publicUrl;
      }

      if (id) {
        const articleRef = this.#collection.doc(id);
        await articleRef.update(filteredDocument);
      } else {
        await this.#collection.add(blogDoc);
      }

      return 'Success';
    } catch (err) {
      console.error(err);
      return 'Failed';
    }
  }

  private async uploadFile(
    file: Express.Multer.File,
    bucket: any,
  ): Promise<string> {
    const fileName = `${uuidv4()}-${file.originalname.replace(/\s+/g, '_')}`;
    const fileUpload = bucket.file(fileName);

    const stream = fileUpload.createWriteStream({
      metadata: { contentType: file.mimetype },
    });

    return new Promise((resolve, reject) => {
      stream.on('error', (error: any) => {
        console.error(error);
        reject(new Error('Error uploading file'));
      });

      stream.on('finish', async () => {
        await fileUpload.makePublic();
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
        resolve(publicUrl);
      });

      stream.end(file.buffer);
    });
  }
}
