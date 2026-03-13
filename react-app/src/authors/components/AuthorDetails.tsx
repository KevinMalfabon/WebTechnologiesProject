import { Skeleton, Space, Typography, Card, Avatar, Descriptions, Button, List } from 'antd'
import { useAuthorDetailsProvider } from '../providers/useAuthorDetailsProvider'
import { useEffect } from 'react'
import { ArrowLeftOutlined, UserOutlined } from '@ant-design/icons'
import { Link } from '@tanstack/react-router'
import { Route as authorsRoute } from '../../routes/authors'

interface AuthorDetailsProps {
  id: string
}

export const AuthorDetails = ({ id }: AuthorDetailsProps) => {
  const { isLoading, author, loadAuthor } = useAuthorDetailsProvider(id)

  useEffect(() => {
    loadAuthor()
  }, [id])

  if (isLoading) {
    return <Skeleton active />
  }

  return (
    <Card
      style={{
        width: '100%',
        maxWidth: '800px',
        margin: '1rem auto',
      }}
      title={
        <Space>
          <Link to={authorsRoute.to}>
            <Button icon={<ArrowLeftOutlined />} type="text">
              Back to Authors
            </Button>
          </Link>
        </Space>
      }
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Space align="center" size="large">
          <Avatar
            icon={<UserOutlined />}
            size={80}
            style={{
              backgroundColor: '#1890ff',
              fontSize: '32px',
            }}
          />
          <div>
            <Typography.Title level={2} style={{ margin: 0 }}>
              {author?.firstName} {author?.lastName}
            </Typography.Title>
            <Typography.Text type="secondary">
              Author ID: {author?.id}
            </Typography.Text>
          </div>
        </Space>

        <Descriptions
          title="Author Information"
          bordered
          column={{ xs: 1, sm: 2, md: 2 }}
          size="middle"
        >
          <Descriptions.Item label="First Name">
            {author?.firstName}
          </Descriptions.Item>
          <Descriptions.Item label="Last Name">
            {author?.lastName}
          </Descriptions.Item>
          <Descriptions.Item label="Books Written">
            {author?.bookCount ?? 0}
          </Descriptions.Item>
          <Descriptions.Item label="Biography" span={2}>
            {author?.info || 'No biography available'}
          </Descriptions.Item>
        </Descriptions>

        {author?.books && author.books.length > 0 && (
          <List
            header={<div>Books by this Author</div>}
            dataSource={author.books}
            renderItem={(book) => (
              <List.Item>
                <List.Item.Meta
                  title={
                    <Link
                      to="/books/$bookId"
                      params={{ bookId: book.id }}
                      style={{ color: 'inherit', textDecoration: 'none' }}
                    >
                      {book.title}
                    </Link>
                  }
                  description={`Published in ${book.yearPublished}`}
                />
              </List.Item>
            )}
            size="small"
            bordered
          />
        )}
      </Space>
    </Card>
  )
}
