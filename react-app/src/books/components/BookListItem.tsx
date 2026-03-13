import { useState } from 'react'
import type { BookModel } from '../BookModel'
import { Card, Typography, Space, Button, Modal, Grid } from 'antd'
import { DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { Link } from '@tanstack/react-router'

const { Text } = Typography
const { useBreakpoint } = Grid

interface BookListItemProps {
  book: BookModel
  onDelete?: (id: string) => void
}

export function BookListItem({ book, onDelete }: BookListItemProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const screens = useBreakpoint()
  const isMobile = !screens.md

  const coverImage =
    book.coverUrl ||
    'https://via.placeholder.com/300x400?text=No+Cover+Available'

  const actions = []

  if (onDelete) {
    actions.push(
      <Button
        key="delete"
        type="text"
        danger
        icon={<DeleteOutlined />}
        onClick={e => {
          e.stopPropagation()
          setIsDeleteModalOpen(true)
        }}
      >
        Delete
      </Button>,
    )
  }

  return (
    <>
      <Card
        hoverable
        cover={
          <img
            alt={`${book.title} cover`}
            src={coverImage}
            style={{ height: isMobile ? 220 : 300, objectFit: 'cover' }}
          />
        }
        style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        styles={{ body: { flexGrow: 1 } }}
        actions={actions}
      >
        <Card.Meta
          title={
            <Link to={`/books/$bookId`} params={{ bookId: book.id }}>
              {book.title}
            </Link>
          }
          description={
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <Text type="secondary">{book.yearPublished}</Text>
              <Text>
                by{' '}
                <Text strong>
                  {book.author.firstName} {book.author.lastName}
                </Text>
              </Text>
              <Space size={4}>
                <ShoppingCartOutlined style={{ color: '#8c8c8c' }} />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {book.salesCount === 1
                    ? '1 sale'
                    : `${book.salesCount ?? 0} sales`}
                </Text>
              </Space>
            </Space>
          }
        />
      </Card>

      <Modal
        title="Delete Book"
        open={isDeleteModalOpen}
        centered
        onOk={() => {
          onDelete?.(book.id)
          setIsDeleteModalOpen(false)
        }}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Yes, delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true, size: 'large' }}
        cancelButtonProps={{ size: 'large' }}
        width={isMobile ? '90%' : 520}
      >
        <Text>
          Are you sure you want to delete{' '}
          <Text strong>\&quot;{book.title}\&quot;</Text>? This action cannot be
          undone.
        </Text>
      </Modal>
    </>
  )
}
