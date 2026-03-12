import { Breadcrumb } from 'antd'
import {
  HomeOutlined,
  BookOutlined,
  TeamOutlined,
  UserOutlined,
  InfoOutlined,
} from '@ant-design/icons'
import { useMatches, type RouteMatch } from '@tanstack/react-router'

type AnyParams = Record<string, string | undefined>

type AnyRouteMatch = RouteMatch<
  string, // route id
  string, // full path
  AnyParams, // params
  unknown, // full search
  unknown, // loader data
  unknown, // context
  unknown // loader deps
>

export function AppBreadcrumb() {
  const matches = useMatches() as AnyRouteMatch[]

  // only show the current route in the menu of the breadcrumb
  // matches is ordered from the last entry
  const breadcrumbItems = []
  const last = matches[matches.length - 1]
  if (last) {
    const isHome = last.pathname === '/'
    const isBooks = last.pathname.startsWith('/books')
    const isClients = last.pathname.startsWith('/clients')
    const isAuthors = last.pathname.startsWith('/authors')
    const isAbout = last.pathname === '/about'
    const dyn = last.params && Object.values(last.params)[0]

    const titleNode = (
      <span>
        {isHome && (
          <>
            <HomeOutlined /> Home
          </>
        )}
        {isBooks && (
          <>
            <BookOutlined /> Books
          </>
        )}
        {isClients && (
          <>
            <TeamOutlined /> Clients
          </>
        )}
        {isAuthors && (
          <>
            <UserOutlined /> Authors
          </>
        )}
        {isAbout && (
          <>
            <InfoOutlined /> About
          </>
        )}
        {dyn}
      </span>
    )

    breadcrumbItems.push({ key: last.id, title: titleNode })
  }

  return (
    <div style={{ padding: '16px 24px 0' }}>
      <Breadcrumb separator=">" items={breadcrumbItems} />
    </div>
  )
}
