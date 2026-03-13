import React, { useEffect, useState } from 'react'
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
import axios from 'axios'


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

type BreadcrumbItem = {
  key: string
  title: React.ReactNode
}

export function AppBreadcrumb(): JSX.Element {
  const matches = useMatches() as AnyRouteMatch[]
  const [bookName, setBookName] = useState<string | null>(null)

  const last = matches[matches.length - 1]
  const dyn = last?.params && Object.values(last.params)[0]
  const isBooks = last?.pathname.startsWith('/books') ?? false
  const hasBookId = isBooks && dyn

  useEffect(() => {
    if (hasBookId) {
      axios
        .get(`http://localhost:3000/books/${dyn}`)
        .then(res => setBookName(res.data.title ?? null))
        .catch(() => setBookName(null))
    } else {
      setBookName(null)
    }
  }, [hasBookId, dyn])

  const breadcrumbItems: BreadcrumbItem[] = []

  if (last) {
    const isHome = last.pathname === '/'
    const isClients = last.pathname.startsWith('/clients')
    const isAuthors = last.pathname.startsWith('/authors')
    const isSales = last.pathname.startsWith('/sales')
    const isAbout = last.pathname === '/about'

    const domainIcon = isHome ? <HomeOutlined /> :
      isBooks ? <BookOutlined /> :
      isClients ? <TeamOutlined /> :
      isAuthors ? <UserOutlined /> :
      isSales ? <ShoppingCartOutlined /> :
      isAbout ? <InfoOutlined /> : null

    const domainLabel = isHome ? 'Home' :
      isBooks ? 'Books' :
      isClients ? 'Clients' :
      isAuthors ? 'Authors' :
      isSales ? 'Sales' :
      isAbout ? 'About' : ''

    const domainLink = isBooks ? '/books' :
      isClients ? '/clients' :
      isSales ? '/sales' : undefined

    if (dyn && domainLink) {
      // Detail page: show parent domain as link, then detail name
      breadcrumbItems.push({
        key: 'domain',
        title: (
          <Link to={domainLink}>
            {domainIcon} {domainLabel}
          </Link>
        ),
      })

      const detailLabel = isBooks && bookName ? bookName : dyn

      breadcrumbItems.push({
        key: 'detail',
        title: (
          <span
            style={{
              maxWidth: 200,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: 'inline-block',
              verticalAlign: 'bottom',
            }}
          >
            {detailLabel}
          </span>
        ),
      })
    } else {
      // List or static page: single breadcrumb item
      breadcrumbItems.push({
        key: last.id,
        title: (
          <span>
            {domainIcon} {domainLabel}
          </span>
        ),
      })
    }
  }

  return (
    <div
      style={{
        padding: '16px 24px 0',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        maxWidth: '100%',
      }}
    >
      <Breadcrumb separator=">" items={breadcrumbItems} />
    </div>
  )
}
