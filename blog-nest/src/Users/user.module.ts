import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { FirebaseRepository } from 'src/FirebaseService/firebase.service';
import { FirebaseModule } from 'src/FirebaseService/firebase.module';

@Module({
  imports: [FirebaseModule],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: FirebaseRepository,
      useFactory: (firebaseApp) => new FirebaseRepository(firebaseApp, 'users'),
      inject: ['FIREBASE_APP'],
    },
  ],
})
export class UserModule {}
