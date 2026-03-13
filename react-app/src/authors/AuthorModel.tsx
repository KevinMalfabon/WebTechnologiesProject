export type AuthorModel = {
  id: string
  firstName: string
  lastName: string
  info?: string
}

export type CreateAuthorModel = {
  firstName: string
  lastName: string
  info: string
}

export type UpdateAuthorModel = Partial<CreateAuthorModel>
