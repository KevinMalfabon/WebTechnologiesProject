import { useState } from 'react'
import axios from 'axios'
import type { SaleModel } from '../../sales/SaleModel'

export const useClientSalesProvider = (clientId: string) => {
  const [sales, setSales] = useState<SaleModel[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const loadSales = () => {
    setIsLoading(true)
    axios
      .get(`http://localhost:3000/sales?clientId=${clientId}`)
      .then(res => {
        setSales(res.data.data ?? res.data)
      })
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false))
  }

  return { sales, isLoading, loadSales }
}
