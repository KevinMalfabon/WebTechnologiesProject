import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Layout } from '../Layout'
import { ConfigProvider, theme } from 'antd'

const RootLayout = () => {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#8c5e3c', // Warm book-leather brown
          colorBgContainer: '#ffffff',
          colorBgLayout: '#fdfaf5', // Soft parchment background
          borderRadius: 6,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
        components: {
          Breadcrumb: {
            itemColor: 'rgba(0, 0, 0, 0.45)',
            lastItemColor: '#8c5e3c', // Makes the current page brown
          },
        },
      }}
    >
      <Layout>
        <Outlet />
      </Layout>
    </ConfigProvider>
  )
}

export const Route = createRootRoute({ component: RootLayout })
