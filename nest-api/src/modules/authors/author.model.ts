import { AuthorId } from './author.entity';

export type AuthorModel = {
  id: AuthorId;
  firstName: string;
  lastName: string;
  info: string;
};

export type CreateAuthorModel = {
  firstName: string;
  lastName: string;
  info: string;
};

export type UpdateAuthorModel = Partial<CreateAuthorModel>;
