import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post('add')
  @UseInterceptors(
    FileInterceptor('image', { storage: multer.memoryStorage() }),
  )
  createArticle(
    @Body() createArticleDto: any,
    @Req() request: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const newData = {
      ...createArticleDto,
      writer: request.cookies['__Secure__'],
    };
    return this.articleService.createArticle(newData, file);
  }

  @Patch('update/:id')
  @UseInterceptors(
    FileInterceptor('image', { storage: multer.memoryStorage() }),
  )
  updateArticle(
    @Body() createArticleDto: any,
    @Req() request: Request,
    @UploadedFile() file: Express.Multer.File,
    @Param('id') articleId: string,
  ) {
    const userType = request.cookies['__userType__'];
    const user = request.cookies['__Secure__'];
    const newData = {
      ...createArticleDto,
      writer: userType == 'writer' ? user : '',
      editor: userType == 'editor' ? user : '',
      image: file ?? '',
    };
    return this.articleService.updateArticle(articleId, newData, file);
  }

  @Get()
  findAll() {
    return this.articleService.findAllArticle();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articleService.remove(+id);
  }
}
