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

type RouteParams = {
  bookId?: string
  clientId?: string
  saleId?: string
}

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
        const { bookId, clientId, saleId } = m.params as RouteParams

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

  // Get the current match (last one)
  const currentMatch = matches[matches.length - 1]
  if (!currentMatch || currentMatch.pathname === '/') {
    // Only home, already added
  } else {
    const isBooks = currentMatch.pathname.startsWith('/books')
    const isClients = currentMatch.pathname.startsWith('/clients')
    const isAuthors = currentMatch.pathname.startsWith('/authors')
    const isSales = currentMatch.pathname.startsWith('/sales')
    const isAbout = currentMatch.pathname === '/about'

    // Add the section breadcrumb
    let sectionTitle: React.ReactNode = null
    let listPath = currentMatch.pathname
    if (isBooks) {
      sectionTitle = (
        <span>
          <BookOutlined /> Books
        </span>
      )
      if (currentMatch.params && (currentMatch.params as RouteParams).bookId) {
        listPath = currentMatch.pathname.replace(/\/[^\/]+$/, '')
      }
    } else if (isClients) {
      sectionTitle = (
        <span>
          <TeamOutlined /> Clients
        </span>
      )
      if (currentMatch.params && (currentMatch.params as RouteParams).clientId) {
        listPath = currentMatch.pathname.replace(/\/[^\/]+$/, '')
      }
    } else if (isAuthors) {
      sectionTitle = (
        <span>
          <UserOutlined /> Authors
      </span>
      )
    } else if (isSales) {
      sectionTitle = (
        <span>
          <ShoppingCartOutlined /> Sales
        </span>
      )
      if (currentMatch.params && (currentMatch.params as RouteParams).saleId) {
        listPath = currentMatch.pathname.replace(/\/[^\/]+$/, '')
      }
    } else if (isAbout) {
      sectionTitle = (
        <span>
          <InfoOutlined /> About
        </span>
      )
    }

    if (sectionTitle) {
      breadcrumbItems.push({
        key: 'section',
        title: <Link to={listPath}>{sectionTitle}</Link>,
      })
    }

    // Add dynamic name if it's a detail page
    if (currentMatch.params) {
      const params = currentMatch.params as RouteParams
      let dyn: string | undefined
      let key: string

      if (params.bookId) {
        key = `book-${params.bookId}`
        dyn = labelCache[key] || params.bookId
      } else if (params.clientId) {
        key = `client-${params.clientId}`
        dyn = labelCache[key] || params.clientId
      } else if (params.saleId) {
        key = `sale-${params.saleId}`
        dyn = labelCache[key] || params.saleId
      }

      if (dyn) {
        breadcrumbItems.push({
          key: 'detail',
          title: <span>{dyn}</span>,
        })
      }
    }
  }

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
