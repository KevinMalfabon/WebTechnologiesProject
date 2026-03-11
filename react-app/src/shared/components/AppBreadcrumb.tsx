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
  const breadcrumbItems: Array<{ key: string; title: React.ReactNode }> = []
  const last = matches[matches.length - 1]

  matches.forEach((m, idx) => {
    const isHome = m.pathname === '/'
    const isBooks = m.pathname.startsWith('/books')
    const isClients = m.pathname.startsWith('/clients')
    const isAuthors = m.pathname.startsWith('/authors')
    const isSales = m.pathname.startsWith('/sales')
    const isAbout = m.pathname === '/about'
    const dyn = m.params && Object.values(m.params)[0]

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

    // do not include the root if we have other segments; otherwise keep it
    if (isHome && matches.length > 1) {
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
