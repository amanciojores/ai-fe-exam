import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { FirebaseModule } from 'src/FirebaseService/firebase.module';
import { FirebaseRepository } from 'src/FirebaseService/firebase.service';

@Module({
  imports: [FirebaseModule],
  controllers: [CompanyController],
  providers: [
    CompanyService,
    {
      provide: FirebaseRepository,
      useFactory: (firebaseApp) =>
        new FirebaseRepository(firebaseApp, 'company'),
      inject: ['FIREBASE_APP'],
    },
  ],
})
export class CompanyModule {}
