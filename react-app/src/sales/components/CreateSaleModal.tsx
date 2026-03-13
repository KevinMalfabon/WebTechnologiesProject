import { useEffect, useState } from 'react'
import type { CreateSaleModel } from '../SaleModel'
import { Button, DatePicker, Modal, Select, Space } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import axios from 'axios'
import dayjs from 'dayjs'

interface CreateSaleModalProps {
  onCreate: (sale: CreateSaleModel) => void
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

export function CreateSaleModal({ onCreate }: CreateSaleModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  const [clientId, setClientId] = useState('')
  const [bookId, setBookId] = useState('')
  const [purchasedAt, setPurchasedAt] = useState('')

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
    if (isOpen) {
      loadClients()
      loadBooks()
    }
  }, [isOpen])

  const onClose = () => {
    setClientId('')
    setBookId('')
    setPurchasedAt('')
    setIsOpen(false)
  }

  const canCreate =
    clientId.trim().length > 0 &&
    bookId.trim().length > 0 &&
    purchasedAt.trim().length > 0

  return (
    <>
      <Button
        icon={<PlusOutlined />}
        type="primary"
        onClick={() => setIsOpen(true)}
      >
        Create Sale
      </Button>

      <Modal
        open={isOpen}
        onCancel={onClose}
        onOk={() => {
          onCreate({
            clientId,
            bookId,
            purchasedAt,
          })
          onClose()
        }}
        okButtonProps={{ disabled: !canCreate }}
        title="Create sale"
      >
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
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
          />

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
          />

          <DatePicker
            placeholder="Select purchase date"
            style={{ width: '100%' }}
            onChange={date => {
              setPurchasedAt(date ? dayjs(date).format('YYYY-MM-DD') : '')
            }}
          />
        </Space>
      </Modal>
    </>
  )
}
