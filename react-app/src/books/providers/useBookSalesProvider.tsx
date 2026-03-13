import { useState } from 'react'
import axios from 'axios'
import type { SaleModel, CreateSaleModel } from '../../sales/SaleModel'

export const useBookSalesProvider = (bookId: string) => {
  const [sales, setSales] = useState<SaleModel[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const loadSales = () => {
    setIsLoading(true)
    axios
      .get(
        `http://localhost:3000/sales?bookId=${bookId}&limit=100&offset=0&sort=purchasedAt,DESC`,
      )
      .then(res => {
        setSales(res.data.data ?? res.data)
      })
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false))
  }

  const createSale = (sale: CreateSaleModel) => {
    axios
      .post('http://localhost:3000/sales', sale)
      .then(() => loadSales())
      .catch(err => console.error(err))
  }

  return { sales, isLoading, loadSales, createSale }
}
