import { Injectable } from '@nestjs/common';
import {
  AuthorModel,
  CreateAuthorModel,
  UpdateAuthorModel,
} from './author.model';
import { AuthorEntity, AuthorId } from './author.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookEntity } from '../books/entities/book.entity';

@Injectable()
export class AuthorRepository {
  constructor(
    @InjectRepository(AuthorEntity)
    private readonly authorRepository: Repository<AuthorEntity>,
    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>,
  ) {}

  public async getBookCount(id: string): Promise<number> {
    const [book, bookCount] = await this.bookRepository.findAndCount({
      where: { authorId: id },
    });
    return bookCount;
  }

  public async getAllAuthors(): Promise<AuthorModel[]> {
    return this.authorRepository.find();
  }

  public async getAuthorById(id: string): Promise<AuthorModel | undefined> {
    const author = await this.authorRepository.findOne({
      where: { id },
    });
    if (!author) {
      return undefined;
    }
    return author;
  }

  public async createAuthor(author: CreateAuthorModel): Promise<AuthorModel> {
    return this.authorRepository.save(this.authorRepository.create(author));
  }

  public async deleteAuthor(id: string): Promise<void> {
    await this.authorRepository.delete(id);
  }

  public async updateAuthor(
    id: string,
    author: UpdateAuthorModel,
  ): Promise<AuthorModel | undefined> {
    const oldAuthor = await this.authorRepository.findOne({
      where: { id: id as AuthorId },
    });

    if (!oldAuthor) {
      return undefined;
    }

    await this.authorRepository.update(id, author);
  }
}