export type AuthorModel = {
  id: string
  firstname: string
  lastname: string
  info: string
}

export type CreateAuthorModel = {
  firstname: string
  lastname: string
  info: string
}

export type UpdateAuthorModel = Partial<CreateAuthorModel>
