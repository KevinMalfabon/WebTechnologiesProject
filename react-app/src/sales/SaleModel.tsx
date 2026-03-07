export type SaleModel = {
  id: string
  clientId: string
  bookId: string
  purchasedAt: string
  client?: {
    id: string
    firstName: string
    lastName: string
  }
  book?: {
    id: string
    title: string
  }
}

export type CreateSaleModel = {
  clientId: string
  bookId: string
  purchasedAt: string
}

export type UpdateSaleModel = Partial<CreateSaleModel>
