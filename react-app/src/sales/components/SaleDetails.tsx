import { Skeleton, Space, Typography } from 'antd'
import { useSaleDetailsProvider } from '../providers/useSaleDetailsProvider'
import { useEffect } from 'react'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Link } from '@tanstack/react-router'
import { Route as salesRoute } from '../../routes/sales'

interface SaleDetailsProps {
  id: string
}

export const SaleDetails = ({ id }: SaleDetailsProps) => {
  const { isLoading, sale, loadSale } = useSaleDetailsProvider(id)

  useEffect(() => {
    loadSale()
  }, [id, loadSale])

  if (isLoading) return <Skeleton active />

  return (
    <Space direction="vertical" style={{ textAlign: 'left', width: '95%' }}>
      <Link to={salesRoute.to}>
        <ArrowLeftOutlined />
      </Link>

      <Typography.Title level={1}>Sale Details</Typography.Title>

      <Typography.Title level={4}>
        Book: {sale?.book?.title ?? '—'}
      </Typography.Title>

      <Typography.Text type="secondary">
        Client: {sale?.client?.firstName} {sale?.client?.lastName}
      </Typography.Text>
    </Space>
  )
}
