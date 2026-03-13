import { useState } from 'react'
import axios from 'axios'
import type { SaleModel, CreateSaleModel, UpdateSaleModel } from '../SaleModel'

export const useSaleProvider = () => {
  const [sales, setSales] = useState<SaleModel[]>([])

  const loadSales = () => {
    axios
      .get('http://localhost:3000/sales')
      .then(res => {
        setSales(res.data.data ?? res.data)
      })
      .catch(err => console.error(err))
  }

  const createSale = (sale: CreateSaleModel) => {
    axios
      .post('http://localhost:3000/sales', sale)
      .then(() => loadSales())
      .catch(err => console.error(err))
  }

  const updateSale = (id: string, input: UpdateSaleModel) => {
    axios
      .patch(`http://localhost:3000/sales/${id}`, input)
      .then(() => loadSales())
      .catch(err => console.error(err))
  }

  const deleteSale = (id: string) => {
    axios
      .delete(`http://localhost:3000/sales/${id}`)
      .then(() => loadSales())
      .catch(err => console.error(err))
  }

  return {
    sales,
    loadSales,
    createSale,
    updateSale,
    deleteSale,
  }
}
