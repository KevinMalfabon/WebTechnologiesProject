import { AuthorId } from './author.entity';

import { BookModel } from '../books/book.model';

export type AuthorModel = {
  id: string;
  firstName: string;
  lastName: string;
  info?: string;
  bookCount?: number;
  books?: BookModel[];
};

export type CreateAuthorModel = {
  firstName: string;
  lastName: string;
  info: string;
};

export type UpdateAuthorModel = Partial<CreateAuthorModel>;
