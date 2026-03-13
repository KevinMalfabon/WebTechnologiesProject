import React from 'react'
import { Breadcrumb } from 'antd'
import {
  HomeOutlined,
  BookOutlined,
  TeamOutlined,
  UserOutlined,
  InfoOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons'
import { Link, useMatches, type RouteMatch } from '@tanstack/react-router'

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

export function AppBreadcrumb(): JSX.Element {
  const matches = useMatches() as AnyRouteMatch[]

  // only show the current route in the menu of the breadcrumb
  // matches is ordered from the last entry
  // build a breadcrumb list from all route matches so the user can
  // see the full path (e.g. “Books > 1234-uuid”) instead of only the
  // current segment.  Home is shown only on the root page.
  const [labelCache, setLabelCache] = React.useState<Record<string, string>>( {})
  const breadcrumbItems: Array<{ key: string; title: React.ReactNode }> = []

  // fetch display names for any param-based routes we encounter.  store
  // by a composite key (type-id) so books/123 and clients/123 don't clash.
  React.useEffect(() => {
    matches.forEach(m => {
      if (m.params) {
        const { bookId, clientId, saleId } = m.params as {
          bookId?: string
          clientId?: string
          saleId?: string
        }

        if (bookId) {
          const key = `book-${bookId}`
          if (!labelCache[key]) {
            fetch(`http://localhost:3000/books/${bookId}`)
              .then(r => r.json())
              .then(d => {
                if (d && d.title) {
                  setLabelCache(prev => ({ ...prev, [key]: d.title }))
                }
              })
              .catch(() => {})
          }
        }

        if (clientId) {
          const key = `client-${clientId}`
          if (!labelCache[key]) {
            fetch(`http://localhost:3000/clients/${clientId}`)
              .then(r => r.json())
              .then(d => {
                if (d && (d.firstName || d.lastName)) {
                  setLabelCache(prev => ({
                    ...prev,
                    [key]: `${d.firstName ?? ''} ${d.lastName ?? ''}`.trim(),
                  }))
                }
              })
              .catch(() => {})
          }
        }

        if (saleId) {
          const key = `sale-${saleId}`
          if (!labelCache[key]) {
            fetch(`http://localhost:3000/sales/${saleId}`)
              .then(r => r.json())
              .then(d => {
                if (d) {
                  const label =
                    d.client && d.client.firstName
                      ? `${d.client.firstName} ${d.client.lastName}`
                      : saleId
                  setLabelCache(prev => ({ ...prev, [key]: label }))
                }
              })
              .catch(() => {})
          }
        }
      }
    })
  }, [matches, labelCache])

  // always include home at the start so users can jump back
  breadcrumbItems.push({
    key: 'home',
    title: (
      <Link to="/">
        <HomeOutlined /> Home
      </Link>
    ),
  })

  matches.forEach((m, idx) => {
    const isHome = m.pathname === '/'
    const isBooks = m.pathname.startsWith('/books')
    const isClients = m.pathname.startsWith('/clients')
    const isAuthors = m.pathname.startsWith('/authors')
    const isSales = m.pathname.startsWith('/sales')
    const isAbout = m.pathname === '/about'

    // dynamic value: prefer fetched label, otherwise raw param value
    let dyn: string | undefined
    if (m.params) {
      // narrow the params to our known keys so we don't need `any`
      const params = m.params as {
        bookId?: string
        clientId?: string
        saleId?: string
      }

      if (params.bookId) {
        const key = `book-${params.bookId}`
        dyn = labelCache[key] || params.bookId
      } else if (params.clientId) {
        const key = `client-${params.clientId}`
        dyn = labelCache[key] || params.clientId
      } else if (params.saleId) {
        const key = `sale-${params.saleId}`
        dyn = labelCache[key] || params.saleId
      }
    }

    let titleNode: React.ReactNode = (
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
        {isSales && (
          <>
            <ShoppingCartOutlined /> Sales
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

    // make every crumb except the last clickable
    if (idx !== matches.length - 1) {
      titleNode = <Link to={m.pathname}>{titleNode}</Link>
    }

    // we already added home manually above; skip the automatic home entry
    if (isHome) {
      return
    }

    breadcrumbItems.push({ key: m.id, title: titleNode })
  })

  return (
    <div
      style={{
        padding: '16px 24px 0',
        backgroundColor: 'rgba(255,255,255,0.08)',
        // ensure text and separators show up against the dark page
        color: '#ffffff',
      }}
    >
      <Breadcrumb
        separator=">"
        items={breadcrumbItems}
        style={{
          color: '#f0f0f0',
        }}
      />
    </div>
  )
}
