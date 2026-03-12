import { Skeleton, Space, Typography } from 'antd'
import { useClientDetailsProvider } from '../providers/useClientDetailsProvider'
import { useEffect } from 'react'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Link } from '@tanstack/react-router'
import { Route as clientsRoute } from '../../routes/clients'
import { Route as booksRoute } from '../../routes/books'
import { useClientSalesProvider } from '../providers/useClientSalesProvider'
import { useState } from 'react'
import { Modal, Button, List } from 'antd'

interface ClientDetailsProps {
  id: string
}

export const ClientDetails = ({ id }: ClientDetailsProps) => {
  const { isLoading, client, loadClient } = useClientDetailsProvider(id)
  const { sales, loadSales } = useClientSalesProvider(id)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    loadClient()
  }, [id])

  if (isLoading) return <Skeleton active />

  return (
    <Space direction="vertical" style={{ textAlign: 'left', width: '95%' }}>
      <Link to={clientsRoute.to}>
        <ArrowLeftOutlined />
      </Link>

      <Typography.Title level={1}>
        {client?.firstName} {client?.lastName}
      </Typography.Title>

      <Typography.Title level={4}>{client?.email ?? '—'}</Typography.Title>

      <Typography.Text type="secondary">
        {client?.picture ?? ''}
      </Typography.Text>

      <Button
        type="primary"
        onClick={() => {
          loadSales()
          setIsModalOpen(true)
        }}
      >
        Ver libros comprados
      </Button>

      <Modal
        title="Libros comprados"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <List
          itemLayout="horizontal"
          dataSource={sales}
          renderItem={sale => (
            <List.Item>
              <List.Item.Meta
                title={
                  <Link
                    to={booksRoute.to + '/$bookId'}
                    params={{ bookId: sale.bookId }}
                  >
                    {sale.book?.title}
                  </Link>
                }
                description={`Fecha de compra: ${new Date(sale.purchasedAt).toLocaleDateString()}`}
              />
            </List.Item>
          )}
        />
      </Modal>
    </Space>
  )
}
