import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { FirebaseRepository } from 'src/FirebaseService/firebase.service';

@Injectable()
export class ArticleService {
  private readonly repository: FirebaseRepository<any>;

  constructor(private readonly firebaseRepo: FirebaseRepository<any>) {
    this.repository = firebaseRepo;
  }

  createArticle(createArticleDto: any, file: Express.Multer.File) {
    return this.repository.saveArticle(createArticleDto, file);
  }

  findAllArticle() {
    return this.repository.getAllDocuments();
  }

  findOne(id: number) {
    return `This action returns a #${id} article`;
  }

  updateArticle(
    id: string,
    updateArticleDto: UpdateArticleDto,
    file: Express.Multer.File,
    userType?: string | null,
  ) {
    return this.repository.saveArticle(updateArticleDto, file, id);
  }

  remove(id: number) {
    return `This action removes a #${id} article`;
  }
}
