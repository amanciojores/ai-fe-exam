import { Module } from '@nestjs/common';
import { ProtectedController } from './protected.controller';
import { FirebaseRepository } from 'src/FirebaseService/firebase.service';
import { FirebaseModule } from 'src/FirebaseService/firebase.module';
import { UserModule } from 'src/Users/user.module';
import { UserService } from 'src/Users/user.service';
import { ProtectedService } from './protected.service';
@Module({
  imports: [FirebaseModule, UserModule],
  controllers: [ProtectedController],
  providers: [
    UserService,
    ProtectedService,
    {
      provide: FirebaseRepository,
      useFactory: (firebaseApp) => new FirebaseRepository(firebaseApp, 'users'),
      inject: ['FIREBASE_APP'],
    },
  ],
})
export class ProtectedModule {}
