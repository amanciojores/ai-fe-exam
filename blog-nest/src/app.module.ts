import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './Users/user.module';
import { FirebaseModule } from './FirebaseService/firebase.module';
import { ProtectedModule } from './Protected/protected.module';
import { CompanyModule } from './company/company.module';
import { ArticleModule } from './article/article.module';

@Module({
  imports: [
    ConfigModule.forRoot({ cache: true, isGlobal: true }),
    UserModule,
    FirebaseModule,
    ProtectedModule,
    CompanyModule,
    ArticleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
