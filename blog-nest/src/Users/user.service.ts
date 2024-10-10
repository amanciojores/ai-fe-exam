import { Injectable } from '@nestjs/common';
import { FirebaseRepository } from 'src/FirebaseService/firebase.service';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  private readonly repository: FirebaseRepository<CreateUserDto>;

  constructor(
    private readonly firebaseRepo: FirebaseRepository<CreateUserDto>,
  ) {
    this.repository = firebaseRepo; // Pass the 'users' collection name during instantiation
  }

  async createUser(createUserDto: CreateUserDto) {
    return this.repository.addDocument(createUserDto);
  }

  async findAllUsers() {
    return this.repository.getAllDocuments();
  }

  // async findUserById(id: string) {
  //   return this.repository.getDocumentById(id);
  // }

  // async updateUser(id: string, updateUserDto: Partial<UpdateUserDto>) {
  //   return this.repository.updateDocument(id, updateUserDto);
  // }

  // async deleteUser(id: string) {
  //   return this.repository.deleteDocument(id);
  // }
}
