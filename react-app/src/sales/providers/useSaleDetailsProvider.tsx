import { useState } from 'react'
import axios from 'axios'
import type { SaleModel } from '../SaleModel'

export const useSaleDetailsProvider = (id: string) => {
  const [sale, setSale] = useState<SaleModel | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)

  const loadSale = () => {
    setIsLoading(true)
    axios
      .get(`http://localhost:3000/sales/${id}`)
      .then(res => {
        setSale(res.data)
      })
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false))
  }

  return { sale, isLoading, loadSale }
}
