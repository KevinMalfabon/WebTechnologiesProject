import { useEffect } from 'react'
import { useBookProvider } from '../providers/useBookProvider'
import { BookListItem } from './BookListItem'
import { CreateBookModal } from './CreateBookModal'
import { Row, Col, Typography, Grid } from 'antd'

const { Title } = Typography
const { useBreakpoint } = Grid

export function BookList() {
  const { books, loadBooks, createBook, deleteBook } = useBookProvider()
  const screens = useBreakpoint()

  useEffect(() => {
    loadBooks()
  }, [])

  const isMobile = !screens.md

  return (
    <div style={{ padding: isMobile ? '1rem' : '2rem' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: isMobile ? '1rem' : '2rem',
        }}
      >
        <Title level={isMobile ? 3 : 2} style={{ margin: 0 }}>
          Library
        </Title>
        <CreateBookModal onCreate={createBook} />
      </div>
      <Row gutter={isMobile ? [16, 16] : [24, 24]}>
        {books.map(book => (
          <Col xs={24} sm={12} md={8} lg={6} xl={4} key={book.id}>
            <BookListItem book={book} onDelete={deleteBook} />
          </Col>
        ))}
      </Row>
    </div>
  )
}
