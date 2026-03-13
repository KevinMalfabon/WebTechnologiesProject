import { useEffect, useState } from 'react'
import type { SaleModel, UpdateSaleModel } from '../SaleModel'
import {
  Button,
  Col,
  DatePicker,
  Modal,
  Row,
  Select,
  Typography,
  Space,
} from 'antd'
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons'
import axios from 'axios'
import dayjs from 'dayjs'

const { Text } = Typography

interface SaleListItemProps {
  sale: SaleModel
  onDelete: (id: string) => void
  onUpdate: (id: string, input: UpdateSaleModel) => void
}

type ClientOption = {
  id: string
  firstName: string
  lastName: string
}

type BookOption = {
  id: string
  title: string
}

export function SaleListItem({ sale, onDelete, onUpdate }: SaleListItemProps) {
  const [clientId, setClientId] = useState(sale.clientId)
  const [bookId, setBookId] = useState(sale.bookId)
  const [purchasedAt, setPurchasedAt] = useState(sale.purchasedAt)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const [clients, setClients] = useState<ClientOption[]>([])
  const [books, setBooks] = useState<BookOption[]>([])
  const [isLoadingClients, setIsLoadingClients] = useState(false)
  const [isLoadingBooks, setIsLoadingBooks] = useState(false)

  const loadClients = () => {
    setIsLoadingClients(true)
    axios
      .get('http://localhost:3000/clients?limit=100&offset=0&sort=lastName,ASC')
      .then(res => {
        setClients(res.data.data ?? [])
      })
      .catch(err => console.error(err))
      .finally(() => setIsLoadingClients(false))
  }

  const loadBooks = () => {
    setIsLoadingBooks(true)
    axios
      .get('http://localhost:3000/books?limit=100&offset=0&sort=title,ASC')
      .then(res => {
        setBooks(res.data.data ?? [])
      })
      .catch(err => console.error(err))
      .finally(() => setIsLoadingBooks(false))
  }

  useEffect(() => {
    if (isEditing) {
      loadClients()
      loadBooks()
    }
  }, [isEditing])

  const onCancelEdit = () => {
    setIsEditing(false)
    setClientId(sale.clientId)
    setBookId(sale.bookId)
    setPurchasedAt(sale.purchasedAt)
  }

  const onValidateEdit = () => {
    onUpdate(sale.id, {
      clientId: clientId.trim(),
      bookId: bookId.trim(),
      purchasedAt: purchasedAt.trim(),
    })
    setIsEditing(false)
  }

  const canSave =
    clientId.trim().length > 0 &&
    bookId.trim().length > 0 &&
    purchasedAt.trim().length > 0

  return (
    <>
      <Row
        gutter={24}
        style={{
          width: '100%',
          background: '#ffffff',
          margin: '0 0 12px 0',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          border: '1px solid #f0f0f0',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          transition: 'transform 0.2s',
        }}
        className="sale-item-row"
      >
        <Col span={7}>
          {isEditing ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Select
                value={clientId || undefined}
                onChange={value => setClientId(value)}
                loading={isLoadingClients}
                style={{ width: '100%' }}
                options={clients.map(c => ({
                  value: c.id,
                  label: `${c.firstName} ${c.lastName}`,
                }))}
                showSearch
              />
            </div>
          ) : (
            <Space size="middle" align="start">
              <div>
                <Text strong style={{ fontSize: '14px' }}>
                  {sale.client
                    ? `${sale.client.firstName} ${sale.client.lastName}`
                    : 'Unknown'}
                </Text>
              </div>
            </Space>
          )}
        </Col>

        <Col span={7}>
          {isEditing ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Select
                value={bookId || undefined}
                onChange={value => setBookId(value)}
                loading={isLoadingBooks}
                style={{ width: '100%' }}
                options={books.map(b => ({ value: b.id, label: b.title }))}
                showSearch
              />
            </div>
          ) : (
            <Space size="middle">
              <div>
                <Text strong style={{ fontSize: '14px' }}>
                  {sale.book?.title || 'Unknown'}
                </Text>
              </div>
            </Space>
          )}
        </Col>

        <Col span={6}>
          <Space size="middle">
            <div>
              {isEditing ? (
                <DatePicker
                  value={purchasedAt ? dayjs(purchasedAt) : null}
                  onChange={date =>
                    setPurchasedAt(date ? date.format('YYYY-MM-DD') : '')
                  }
                  size="small"
                />
              ) : (
                <Text style={{ fontSize: '14px' }}>{sale.purchasedAt}</Text>
              )}
            </div>
          </Space>
        </Col>

        <Col span={4} style={{ textAlign: 'right' }}>
          <Space>
            {isEditing ? (
              <>
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  onClick={onValidateEdit}
                  disabled={!canSave}
                />
                <Button icon={<CloseOutlined />} onClick={onCancelEdit} />
              </>
            ) : (
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => setIsEditing(true)}
              />
            )}
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => setIsDeleteModalOpen(true)}
            />
          </Space>
        </Col>
      </Row>

      <Modal
        title="Delete this sale?"
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Delete"
        okButtonProps={{ danger: true }}
        cancelText="Cancel"
        onOk={() => {
          onDelete(sale.id)
          setIsDeleteModalOpen(false)
        }}
      >
        <p> This sale record will be removed permanently. </p>
      </Modal>
    </>
  )
}
