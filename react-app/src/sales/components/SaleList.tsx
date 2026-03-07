import { useEffect } from 'react'
import { Card, Col, Row, Typography } from 'antd'
import { useSaleProvider } from '../providers/useSaleProvider'
import { SaleListItem } from './SaleListItem'
import { CreateSaleModal } from './CreateSaleModal'

const { Title, Text } = Typography

export function SaleList() {
  const { sales, loadSales, deleteSale, updateSale, createSale } =
    useSaleProvider()

  useEffect(() => {
    loadSales()
  }, [])

  return (
    <div
      style={{
        padding: '1.5rem',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      <Card
        style={{
          borderRadius: '20px',
          border: '1px solid #e8ebf2',
          boxShadow: '0 12px 32px rgba(15, 23, 42, 0.06)',
          marginBottom: '1.5rem',
        }}
        bodyStyle={{ padding: '1.5rem' }}
      >
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col>
            <Title level={2} style={{ margin: 0 }}>
              Sales
            </Title>
            <Text type="secondary" style={{ fontSize: '0.95rem' }}>
              Manage purchase records and prepare the data for client and book
              relationships.
            </Text>
          </Col>

          <Col>
            <CreateSaleModal onCreate={createSale} />
          </Col>
        </Row>
      </Card>

      <div>
        {sales.map(sale => (
          <SaleListItem
            key={sale.id}
            sale={sale}
            onDelete={deleteSale}
            onUpdate={updateSale}
          />
        ))}
      </div>
    </div>
  )
}
