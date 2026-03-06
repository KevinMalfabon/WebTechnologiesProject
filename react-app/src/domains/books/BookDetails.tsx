import React, { useEffect } from 'react'
import {
  Card,
  Descriptions,
  Typography,
  Image,
  Skeleton,
  Alert,
  Space,
} from 'antd'
// import { useParams, useLoaderData } from '@tanstack/react-router';

const { Title, Text } = Typography

import { useBookDetailsProvider } from '../../books/providers/useBookDetailsProvider'

// --- Component ---

interface BookDetailsProps {
  id?: string
}

export const BookDetails: React.FC<BookDetailsProps> = ({
  id,
}): React.ReactElement => {
  const {
    isLoading: loading,
    book,
    loadBook,
  } = useBookDetailsProvider(id || '')

  useEffect(() => {
    if (id) {
      loadBook()
    }
  }, [id])

  const error = null // Backend returns no error yet via loadBook, just isLoading and book.

  // Render loading state using Ant Design Skeleton
  if (loading) {
    return (
      <Card style={{ maxWidth: 800, margin: '24px auto' }} bordered={false}>
        <Space align="start" size="large" style={{ display: 'flex' }}>
          <Skeleton.Image active style={{ width: 200, height: 260 }} />
          <div style={{ flex: 1, minWidth: 400 }}>
            <Skeleton active paragraph={{ rows: 6 }} />
          </div>
        </Space>
      </Card>
    )
  }

  // Render error state
  if (error) {
    return (
      <Alert
        message="Error Loading Book"
        description={error}
        type="error"
        showIcon
        style={{ maxWidth: 800, margin: '24px auto' }}
      />
    )
  }

  // Render not found state
  if (!book) {
    return (
      <Alert
        message="Book Not Found"
        description="We could not find the details for the requested book."
        type="warning"
        showIcon
        style={{ maxWidth: 800, margin: '24px auto' }}
      />
    )
  }

  // Normalize author name (handles both string and object)
  const authorName: string = book.author
    ? `${book.author.firstName} ${book.author.lastName}`
    : 'Unknown Author'

  // The BookModel API currently lacks picture, description, and isbn, using placeholders.
  const picture = 'https://via.placeholder.com/200x300?text=No+Cover+Available'

  return (
    <Card style={{ maxWidth: 800, margin: '24px auto' }} hoverable>
      <Space
        align="start"
        size="large"
        style={{ display: 'flex', flexWrap: 'wrap' }}
      >
        <Image
          width={200}
          src={picture}
          alt={`${book.title} cover`}
          fallback="https://via.placeholder.com/200x300?text=No+Cover+Available"
          style={{ borderRadius: 8, objectFit: 'cover' }}
        />

        <div style={{ flex: 1, minWidth: 300 }}>
          <Title level={2} style={{ marginTop: 0 }}>
            {book.title}
          </Title>

          <Descriptions
            title="Book Information"
            bordered
            column={1}
            size="small"
          >
            <Descriptions.Item label="Author">
              <Text strong>{authorName}</Text>
            </Descriptions.Item>

            <Descriptions.Item label="Book ID">
              <Text type="secondary" code>
                {book.id}
              </Text>
            </Descriptions.Item>

            {book.yearPublished && (
              <Descriptions.Item label="Published">
                <Text>{book.yearPublished}</Text>
              </Descriptions.Item>
            )}
          </Descriptions>
        </div>
      </Space>
    </Card>
  )
}
