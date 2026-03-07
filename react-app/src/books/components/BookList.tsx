import { useEffect } from 'react'
import { useBookProvider } from '../providers/useBookProvider'
import { BookListItem } from './BookListItem'
import { CreateBookModal } from './CreateBookModal'
import { Row, Col, Typography } from 'antd'

const { Title } = Typography

export function BookList() {
  const { books, loadBooks, createBook } = useBookProvider()

  useEffect(() => {
    loadBooks()
  }, [])

  return (
    <div style={{ padding: '2rem' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}
      >
        <Title level={2} style={{ margin: 0 }}>
          Library
        </Title>
        <CreateBookModal onCreate={createBook} />
      </div>
      <Row gutter={[24, 24]}>
        {books.map(book => (
          <Col xs={24} sm={12} md={8} lg={6} xl={4} key={book.id}>
            <BookListItem book={book} />
          </Col>
        ))}
      </Row>
    </div>
  )
}
