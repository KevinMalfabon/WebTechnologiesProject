import { Outlet } from '@tanstack/react-router'
import { SaleList } from '../components/SaleList'

export function SalesPage() {
  return (
    <div>
      <SaleList />
      <Outlet />
    </div>
  )
}
