import type { BookModel } from '../books/BookModel'

export type AuthorModel = {
  id: string
  firstName: string
  lastName: string
  info?: string
  bookCount?: number
  books?: BookModel[]
}

export type CreateAuthorModel = {
  firstName: string
  lastName: string
  info: string
}

export type UpdateAuthorModel = Partial<CreateAuthorModel>
