import { useState } from 'react'
import axios from 'axios'
import type {
  ClientModel,
  CreateClientModel,
  UpdateClientModel,
} from '../ClientModel'

export const useClientProvider = () => {
  const [clients, setClients] = useState<ClientModel[]>([])

  const loadClients = () => {
    axios
      .get('http://localhost:3000/clients?limit=100&offset=0&sort=lastName,ASC')
      .then(res => {
        setClients(res.data.data)
      })
      .catch(err => console.error(err))
  }

  const createClient = (client: CreateClientModel) => {
    axios
      .post('http://localhost:3000/clients', client)
      .then(() => loadClients())
      .catch(err => console.error(err))
  }

  const updateClient = (id: string, input: UpdateClientModel) => {
    axios
      .patch(`http://localhost:3000/clients/${id}`, input)
      .then(() => loadClients())
      .catch(err => console.error(err))
  }

  const deleteClient = (id: string) => {
    axios
      .delete(`http://localhost:3000/clients/${id}`)
      .then(() => loadClients())
      .catch(err => console.error(err))
  }

  return { clients, loadClients, createClient, updateClient, deleteClient }
}