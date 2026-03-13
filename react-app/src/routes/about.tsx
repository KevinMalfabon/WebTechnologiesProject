import { createFileRoute } from '@tanstack/react-router'
import { Card, Typography, Space, List } from 'antd'
import { TeamOutlined } from '@ant-design/icons'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  const creators = [
    'Kevin de Jesus Malfabon Valencia',
    'Maksym Bidolakh',
    'Dmytro Chekhovskyi',
    'Supajira Maturossuntorn',
    'Phummiphat Karthong',
  ]

  return (
    <Card
      style={{
        width: '100%',
        maxWidth: '600px',
        margin: '2rem auto',
        textAlign: 'center',
      }}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Typography.Title
          level={2}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            color: 'var(--ant-color-text-heading)',
          }}
        >
          <TeamOutlined />
          Project Creators
        </Typography.Title>

        <List
          dataSource={creators}
          renderItem={creator => (
            <List.Item
              style={{
                justifyContent: 'center',
                border: 'none',
                padding: '0.5rem 0',
              }}
            >
              <Typography.Text
                style={{
                  fontSize: '18px',
                  fontWeight: '500',
                  color: 'var(--ant-color-text)',
                  textAlign: 'center',
                }}
              >
                {creator}
              </Typography.Text>
            </List.Item>
          )}
        />
      </Space>
    </Card>
  )
}
