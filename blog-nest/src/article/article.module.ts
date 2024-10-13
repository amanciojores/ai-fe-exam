import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { FirebaseRepository } from 'src/FirebaseService/firebase.service';
import { FirebaseModule } from 'src/FirebaseService/firebase.module';

@Module({
  imports: [FirebaseModule],
  controllers: [ArticleController],
  providers: [
    ArticleService,
    {
      provide: FirebaseRepository,
      useFactory: (firebaseApp) =>
        new FirebaseRepository(firebaseApp, 'article'),
      inject: ['FIREBASE_APP'],
    },
  ],
})
export class ArticleModule {}
