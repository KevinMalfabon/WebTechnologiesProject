import { Link, useLocation } from '@tanstack/react-router'
import { Route as indexRoute } from './routes/index'
import { Route as aboutRoute } from './routes/about'
import { Route as booksRoute } from './routes/books'
import { Route as clientsRoute } from './routes/clients'
import { Route as authorsRoute } from './routes/authors'
import { ShoppingCartOutlined } from '@ant-design/icons'
import { Route as salesRoute } from './routes/sales'
import { Layout as AntLayout, Menu, Typography, type MenuProps } from 'antd'
import { BookOutlined, HomeOutlined, InfoOutlined } from '@ant-design/icons'
import { TeamOutlined } from '@ant-design/icons'

// shared components
import { AppBreadcrumb } from './shared/components/AppBreadcrumb'

interface LayoutProps {
  children: React.ReactNode
}

const { Header, Content } = AntLayout
const { Title } = Typography

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
      label: <Link to={booksRoute.to}>Books</Link>,
      key: 'books',
      icon: <BookOutlined />,
    },
    {
      label: <Link to={authorsRoute.to}>Authors</Link>,
      key: 'authors',
      icon: <TeamOutlined />,
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
    <AntLayout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0 2rem',
          background: '#fff', // Or leave it out to use the theme default
          borderBottom: '1px solid #f0f0f0',
        }}
      >
        <Title level={4} style={{ margin: '0 2rem 0 0', whiteSpace: 'nowrap' }}>
          Babel&apos;s Library
        </Title>
        <Menu
          mode="horizontal"
          selectedKeys={[selectedKey]}
          items={items}
          style={{ flex: 1, minWidth: 0, borderBottom: 'none' }}
        />
      </Header>

      <Content style={{ padding: '0 2rem' }}>
        <AppBreadcrumb />
        <div style={{ background: '#fff', padding: '2rem', minHeight: 280 }}>
          {children}
        </div>
      </Content>
    </AntLayout>
  )
}
