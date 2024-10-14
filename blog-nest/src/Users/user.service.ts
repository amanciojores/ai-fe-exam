import { Injectable } from '@nestjs/common';
import { FirebaseRepository } from '../FirebaseService/firebase.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  private readonly repository: FirebaseRepository<CreateUserDto>;

  constructor(
    private readonly firebaseRepo: FirebaseRepository<CreateUserDto>,
  ) {
    this.repository = firebaseRepo;
  }

  async createUser(createUserDto: CreateUserDto, documentID: string) {
    return this.repository.addDocument(createUserDto, documentID);
  }

  async findAllUsers() {
    return this.repository.getAllDocuments();
  }

  async findUserById(id: string) {
    return this.repository.getDocumentById(id);
  }

  async loginUser(bearerToken: any) {
    return this.repository.logInUser(bearerToken);
  }

  async updateUser(id: string, updateUserDto: Partial<UpdateUserDto>) {
    return this.repository.updateDocument(id, updateUserDto);
  }

  // async deleteUser(id: string) {
  //   return this.repository.deleteDocument(id);
  // }
}
