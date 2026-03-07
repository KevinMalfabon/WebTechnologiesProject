export type BookModel = {
  id: string
  title: string
  yearPublished: number
  author: {
    id: string
    firstName: string
    lastName: string
  }
  coverUrl?: string
  description?: string
}

export type CreateBookModel = {
  authorId: string
  title: string
  yearPublished: number
  coverUrl?: string
  description?: string
}

export type UpdateBookModel = Partial<CreateBookModel>
