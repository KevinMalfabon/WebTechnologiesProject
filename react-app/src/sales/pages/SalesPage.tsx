import { Outlet } from '@tanstack/react-router'
import { ClientList } from '../components/SaleList'

export function ClientsPage() {
  return (
    <div>
      <ClientList />
      <Outlet />
    </div>
  )
}
