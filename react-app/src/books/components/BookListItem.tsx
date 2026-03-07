import type { BookModel } from '../BookModel'
import { Card, Typography, Space } from 'antd'
import { Link } from '@tanstack/react-router'

const { Text } = Typography

interface BookListItemProps {
  book: BookModel
}

export function BookListItem({ book }: BookListItemProps) {
  // The fallback image if coverUrl doesn't exist
  const coverImage =
    book.coverUrl ||
    'https://via.placeholder.com/300x400?text=No+Cover+Available'

  return (
    <Card
      hoverable
      cover={
        <img
          alt={`${book.title} cover`}
          src={coverImage}
          style={{ height: 300, objectFit: 'cover' }}
        />
      }
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
      bodyStyle={{ flexGrow: 1 }}
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
          </Space>
        }
      />
    </Card>
  )
}
