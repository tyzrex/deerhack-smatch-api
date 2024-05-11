import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './entities/company.entity';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { generateCompanyData } from 'src/faker/faker-script';
import * as bcrypt from 'bcrypt';
@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private jwtService: JwtService,
  ) {}
  create(createCompanyDto: CreateCompanyDto) {
    const exits = this.companyRepository.findOne({
      where: { hrEmail: createCompanyDto.hrEmail },
    });
    if (exits) {
      throw new HttpException('Company already exits', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = bcrypt.hashSync(createCompanyDto.password, 10);
    return this.companyRepository.save({
      ...createCompanyDto,
      password: hashedPassword,
    });
  }
  async login(loginDetails: any) {
    const company = await this.companyRepository.findOne({
      where: { hrEmail: loginDetails.email },
    });
    if (!company) {
      throw new HttpException('Company not found', 404);
    }
    const isMatch = await bcrypt.compare(
      loginDetails.password,
      company?.password,
    );
    if (!isMatch) {
      throw new HttpException('Invalid credentials', 401);
    }
    // creating jwt
    const { CompanyId, name, hrEmail } = company;
    const payload = { id: CompanyId, name, email: hrEmail, type: 'company' };
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: '7d',
      }),
    };
  }
  findAll() {
    return this.companyRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} company`;
  }

  update(id: number, updateCompanyDto: UpdateCompanyDto) {
    return `This action updates a #${id} company`;
  }

  remove(id: number) {
    return `This action removes a #${id} company`;
  }
  async companyFaker() {
    const numCompanies = 10; // Change this to the desired number of fake companies
    for (let i = 0; i < numCompanies; i++) {
      const companyData = await generateCompanyData();
      companyData.password = bcrypt.hashSync(companyData.password, 10);
      await this.companyRepository.save(companyData);
    }
  }
  async getMe(user) {
    return user;
  }
  async findfromEmail(email: string) {
    return this.companyRepository.findOne({
      where: { hrEmail: email },
    });
  }
}
