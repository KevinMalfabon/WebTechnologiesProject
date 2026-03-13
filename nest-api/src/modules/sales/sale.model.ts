export type SaleClientModel = {
  id: string;
  firstName: string;
  lastName: string;
};

export type SaleBookModel = {
  id: string;
  title: string;
};

export type SaleModel = {
  id: string;
  clientId: string;
  bookId: string;
  purchasedAt: string;
  client: SaleClientModel;
  book: SaleBookModel;
};

export type CreateSaleModel = {
  clientId: string;
  bookId: string;
  purchasedAt: string;
};

export type UpdateSaleModel = Partial<CreateSaleModel>;

export type FilterSalesModel = {
  limit: number;
  offset: number;
  sort?: Partial<Record<keyof SaleModel, 'ASC' | 'DESC'>>;
  clientId?: string;
};

export type GetSalesModel = {
  totalCount: number;
  data: SaleModel[];
};
