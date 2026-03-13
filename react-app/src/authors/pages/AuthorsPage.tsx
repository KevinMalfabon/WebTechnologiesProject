import { Outlet } from '@tanstack/react-router'
import { AuthorList } from '../components/AuthorList'
import { Typography, Space, Card } from 'antd'
import { TeamOutlined } from '@ant-design/icons'

export function AuthorsPage() {
  return (
    <Card
      style={{
        width: '100%',
        margin: '1rem',
      }}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Typography.Title
          level={2}
          style={{
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '1rem',
            color: 'var(--ant-color-text-heading)',
          }}
        >
          <TeamOutlined />
          Authors
        </Typography.Title>
        <AuthorList />
        <Outlet />
      </Space>
    </Card>
  )
}
