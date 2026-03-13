import { Link, useLocation } from '@tanstack/react-router'
import { Route as indexRoute } from './routes/index'
import { Route as aboutRoute } from './routes/about'
import { Route as booksRoute } from './routes/books'
import { Route as clientsRoute } from './routes/clients'
import { ShoppingCartOutlined } from '@ant-design/icons'
import { Route as salesRoute } from './routes/sales'
import { Space, type MenuProps } from 'antd'
import { BookOutlined, HomeOutlined, InfoOutlined } from '@ant-design/icons'
import { TeamOutlined } from '@ant-design/icons'
import Menu from 'antd/es/menu/menu'

// shared components
import { AppBreadcrumb } from './shared/components/AppBreadcrumb'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation()

  let selectedKey: string
  if (location.pathname === '/') {
    selectedKey = 'home'
  } else if (location.pathname.startsWith('/books')) {
    selectedKey = 'books'
  } else if (location.pathname.startsWith('/clients')) {
    selectedKey = 'clients'
  } else if (location.pathname.startsWith('/sales')) {
    selectedKey = 'sales'
  } else if (location.pathname === '/about') {
    selectedKey = 'about'
  } else {
    selectedKey = 'home' // fallback
  }

  const items: Required<MenuProps>['items'] = [
    {
      label: <Link to={indexRoute.to}>Home</Link>,
      key: 'home',
      icon: <HomeOutlined />,
    },
    {
      label: <  Link to={booksRoute.to}>Books</Link>,
      key: 'books',
      icon: <BookOutlined />,
    },
    {
      label: <Link to={clientsRoute.to}>Clients</Link>,
      key: 'clients',
      icon: <TeamOutlined />,
    },
    {
      label: <Link to={salesRoute.to}>Sales</Link>,
      key: 'sales',
      icon: <ShoppingCartOutlined />,
    },
    {
      label: <Link to={aboutRoute.to}>About</Link>,
      key: 'about',
      icon: <InfoOutlined />,
    },
  ]

  return (
    <Space
      direction="vertical"
      style={{
        width: '100%',
        height: '100vh',
      }}
    >
      <div
        style={{
          textAlign: 'left',
          width: '100%',
          backgroundColor: '#395E66',
          color: 'white',
        }}
      >
        <h2 style={{ marginTop: '0' }}>Babel&apos;s Library</h2>
        <Menu mode="horizontal" items={items} selectedKeys={[selectedKey]} />
      </div>
      <div style={{ width: '100%', overflowY: 'scroll' }}>
        <AppBreadcrumb />
        {children}
      </div>
    </Space>
  )
}
