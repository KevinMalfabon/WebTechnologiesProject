import { createFileRoute } from '@tanstack/react-router'
import { ClientDetails } from '../clients/components/ClientDetails'

export const Route = createFileRoute('/clients/$clientId')({
  component: ClientDetailsPage,
})

function ClientDetailsPage() {
  const { clientId } = Route.useParams()
  return <ClientDetails id={clientId} />
}