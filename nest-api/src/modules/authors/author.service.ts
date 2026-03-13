import { Injectable } from '@nestjs/common';
import { AuthorModel, CreateAuthorModel, UpdateAuthorModel } from './author.model';
import { AuthorRepository } from './author.repository';

@Injectable()
export class AuthorService {
  constructor(private readonly authorRepository: AuthorRepository) {}

  public async getBookCount(id:string): Promise<number> {
    return this.authorRepository.getBookCount(id);
  }

  public async getAllAuthors(): Promise<AuthorModel[]> {
    return this.authorRepository.getAllAuthors();
  }

  public async getAuthorById(id:string): Promise<AuthorModel | undefined> {
    return this.authorRepository.getAuthorById(id);
  }

  public async createAuthor(author: CreateAuthorModel): Promise<AuthorModel> {
    return this.authorRepository.createAuthor(author);
  }

  public async deleteAuthor(id: string): Promise<void>{
    return this.authorRepository.deleteAuthor(id);
  }

  public async updateAuthor(id:string, author: UpdateAuthorModel): Promise<AuthorModel | undefined> {
    return this.authorRepository.updateAuthor(id,author);
  }
}
