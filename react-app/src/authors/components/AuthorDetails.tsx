import { Skeleton, Space, Typography } from 'antd'
import { useAuthorDetailsProvider } from '../providers/useAuthorDetailsProvider'
import { useEffect } from 'react'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Link } from '@tanstack/react-router'
import { Route as authorsRoute } from '../../routes/authors'

interface AuthorDetailsProps {
  id: string
}

export const BookDetails = ({ id }: AuthorDetailsProps) => {
  const { isLoading, author, loadAuthor } = useAuthorDetailsProvider(id)

  useEffect(() => {
    loadAuthor()
  }, [id])

  if (isLoading) {
    return <Skeleton active />
  }

  return (
    <Space direction="vertical" style={{ textAlign: 'left', width: '95%' }}>
      <Link to={authorsRoute.to}>
        <ArrowLeftOutlined />
      </Link>
      <Typography.Title level={1}>{author?.id}</Typography.Title>
      <Typography.Title level={3}>{author?.firstname}</Typography.Title>
      <Typography.Title level={3}>{author?.lastname}</Typography.Title>
    </Space>
  )
}
