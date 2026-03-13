import { useEffect, useState } from 'react'
import type { SaleModel, UpdateSaleModel } from '../SaleModel'
import { Button, Col, DatePicker, Modal, Row, Select, Typography } from 'antd'
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  CalendarOutlined,
  UserOutlined,
  BookOutlined,
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
        gutter={16}
        style={{
          width: '100%',
          minHeight: '92px',
          borderRadius: '16px',
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(247,248,252,0.98) 100%)',
          margin: '0 0 1rem 0',
          padding: '1rem 1rem',
          display: 'flex',
          alignItems: 'center',
          border: '1px solid #e8ebf2',
          boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
          transition: 'all 0.2s ease',
        }}
      >
        <Col span={7}>
          {isEditing ? (
            <div>
              <Text
                style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  color: '#7a869a',
                  marginBottom: '.4rem',
                }}
              >
                Client
              </Text>
              <Select
                placeholder="Select a client"
                value={clientId || undefined}
                onChange={value => setClientId(value)}
                loading={isLoadingClients}
                style={{ width: '100%' }}
                options={clients.map(client => ({
                  value: client.id,
                  label: `${client.firstName} ${client.lastName}`,
                }))}
                showSearch
                optionFilterProp="label"
                size="large"
              />
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '.75rem',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  backgroundColor: '#eaf2ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#2563eb',
                  flexShrink: 0,
                }}
              >
                <UserOutlined />
              </div>

              <div>
                <Text
                  style={{
                    display: 'block',
                    fontSize: '0.8rem',
                    color: '#7a869a',
                    marginBottom: '.15rem',
                  }}
                >
                  Client
                </Text>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: '#1f2937',
                    lineHeight: 1.2,
                  }}
                >
                  {sale.client
                    ? `${sale.client.firstName} ${sale.client.lastName}`
                    : 'Unknown client'}
                </div>
              </div>
            </div>
          )}
        </Col>

        <Col span={7}>
          {isEditing ? (
            <div>
              <Text
                style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  color: '#7a869a',
                  marginBottom: '.4rem',
                }}
              >
                Book
              </Text>
              <Select
                placeholder="Select a book"
                value={bookId || undefined}
                onChange={value => setBookId(value)}
                loading={isLoadingBooks}
                style={{ width: '100%' }}
                options={books.map(book => ({
                  value: book.id,
                  label: book.title,
                }))}
                showSearch
                optionFilterProp="label"
                size="large"
              />
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '.75rem',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  backgroundColor: '#f3e8ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#9333ea',
                  flexShrink: 0,
                }}
              >
                <BookOutlined />
              </div>

              <div>
                <Text
                  style={{
                    display: 'block',
                    fontSize: '0.8rem',
                    color: '#7a869a',
                    marginBottom: '.15rem',
                  }}
                >
                  Book
                </Text>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: '#1f2937',
                    lineHeight: 1.2,
                  }}
                >
                  {sale.book ? sale.book.title : 'Unknown book'}
                </div>
              </div>
            </div>
          )}
        </Col>

        <Col span={6}>
          {isEditing ? (
            <div>
              <Text
                style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  color: '#7a869a',
                  marginBottom: '.4rem',
                }}
              >
                Purchase date
              </Text>
              <DatePicker
                style={{ width: '100%' }}
                value={purchasedAt ? dayjs(purchasedAt) : null}
                onChange={date => {
                  setPurchasedAt(date ? dayjs(date).format('YYYY-MM-DD') : '')
                }}
                size="large"
              />
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '.75rem',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  backgroundColor: '#ecfdf5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#059669',
                  flexShrink: 0,
                }}
              >
                <CalendarOutlined />
              </div>

              <div>
                <Text
                  style={{
                    display: 'block',
                    fontSize: '0.8rem',
                    color: '#7a869a',
                    marginBottom: '.15rem',
                  }}
                >
                  Purchase date
                </Text>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: '.98rem',
                    color: '#1f2937',
                  }}
                >
                  {sale.purchasedAt}
                </div>
              </div>
            </div>
          )}
        </Col>

        <Col span={4}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '.5rem',
              alignItems: 'center',
              height: '100%',
            }}
          >
            {isEditing ? (
              <>
                <Button
                  type="primary"
                  onClick={onValidateEdit}
                  disabled={!canSave}
                  style={{
                    borderRadius: '10px',
                    boxShadow: '0 4px 12px rgba(22, 119, 255, 0.25)',
                  }}
                >
                  <CheckOutlined />
                </Button>

                <Button
                  onClick={onCancelEdit}
                  style={{
                    borderRadius: '10px',
                  }}
                >
                  <CloseOutlined />
                </Button>
              </>
            ) : (
              <Button
                type="primary"
                onClick={() => setIsEditing(true)}
                style={{
                  borderRadius: '10px',
                  boxShadow: '0 4px 12px rgba(22, 119, 255, 0.25)',
                }}
              >
                <EditOutlined />
              </Button>
            )}

            <Button
              danger
              onClick={() => setIsDeleteModalOpen(true)}
              style={{
                borderRadius: '10px',
                boxShadow: '0 4px 12px rgba(220, 38, 38, 0.18)',
              }}
            >
              <DeleteOutlined />
            </Button>
          </div>
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
