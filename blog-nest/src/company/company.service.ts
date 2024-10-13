import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { FirebaseRepository } from 'src/FirebaseService/firebase.service';

@Injectable()
export class CompanyService {
  private readonly repository: FirebaseRepository<CreateCompanyDto>;

  constructor(
    private readonly firebaseRepo: FirebaseRepository<CreateCompanyDto>,
  ) {
    this.repository = firebaseRepo;
  }

  async createCompany(createCompanyDto: CreateCompanyDto, file: any) {
    try {
      return await this.repository.addDocumentWithoutId(createCompanyDto, file);
    } catch (e) {
      return e;
    }
  }

  async findAllCompany() {
    return this.repository.getAllDocuments();
  }

  async findCompanyById(id: string) {
    return this.repository.getDocumentById(id);
  }

  async updateCompany(
    documentID: string,
    updatedCompanyDto: UpdateCompanyDto,
    file: Express.Multer.File,
  ) {
    return await this.repository.updateCompany(
      documentID,
      updatedCompanyDto,
      file,
    );
  }
}
