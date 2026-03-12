export type ClientModel = {
  id: string
  firstName: string
  lastName: string
  email: string | null
  picture: string | null
  purchasedBooksCount?: number
}

export type CreateClientModel = {
  firstName: string
  lastName: string
  email?: string
  picture?: string
}

export type UpdateClientModel = Partial<CreateClientModel>
