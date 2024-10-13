import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Express } from 'express';
import * as multer from 'multer';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post('add')
  @UseInterceptors(FileInterceptor('logo', { storage: multer.memoryStorage() }))
  async createCompany(
    @UploadedFile() file: Express.Multer.File,
    @Body() createCompanyDto: CreateCompanyDto,
  ) {
    if (!file) {
      return 'No Files';
    }
    return await this.companyService.createCompany(
      { ...createCompanyDto },
      file,
    );
  }

  @Get()
  findAll() {
    return this.companyService.findAllCompany();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyService.findCompanyById(id);
  }

  @Patch('update/:id')
  @UseInterceptors(FileInterceptor('logo', { storage: multer.memoryStorage() }))
  update(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
    @Body() updateCompanyDto: Partial<UpdateCompanyDto>,
  ) {
    return this.companyService.updateCompany(id, updateCompanyDto, file);
  }
}
