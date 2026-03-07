import { useState } from 'react'
import axios from 'axios'
import type { ClientModel } from '../SaleModel'

export const useClientDetailsProvider = (id: string) => {
  const [client, setClient] = useState<ClientModel | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)

  const loadClient = () => {
    setIsLoading(true)
    axios
      .get(`http://localhost:3000/clients/${id}`)
      .then(res => {
        setClient(res.data)
      })
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false))
  }

  return { client, isLoading, loadClient }
}
