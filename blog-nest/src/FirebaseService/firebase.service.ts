import { Inject, Injectable } from '@nestjs/common';
import { app } from 'firebase-admin';
import { IRepository } from './dto/firebase.dto';

@Injectable()
export class FirebaseRepository<T> implements IRepository<T> {
  #db: FirebaseFirestore.Firestore;
  #collection: FirebaseFirestore.CollectionReference;

  constructor(
    @Inject('FIREBASE_APP') private firebaseApp: app.App,
    private readonly collectionName: string,
  ) {
    this.#db = firebaseApp.firestore();
    this.#collection = this.#db.collection(collectionName);
  }

  async addDocument(data: T): Promise<string> {
    const docRef = await this.#collection.add(data);
    return docRef.id;
  }

  async getAllDocuments(): Promise<T[]> {
    const snapshot = await this.#collection.get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as T[];
  }

  async getDocumentById(id: string): Promise<T> {
    const snapshot = await this.#collection.get();
    return snapshot.docs.find((data) => data.id == id) as T;
  }
}
