import { useEffect } from 'react'
import { useBookProvider } from './books/providers/useBookProvider' // Adjust path if needed
import { BookListItem } from './books/components/BookListItem'
import { Row, Col, Typography, Button } from 'antd'
import { Link } from '@tanstack/react-router'

const { Title } = Typography

function App() {
  const { books, loadBooks } = useBookProvider()

  useEffect(() => {
    loadBooks()
  }, [])

  const featuredBooks = books.slice(0, 3)

  return (
    <div style={{ padding: '2rem' }}>
      {/* Hero Section */}
      <section
        style={{
          textAlign: 'center',
          marginBottom: '4rem',
          padding: '4rem 0',
          background: '#f0f2f5',
        }}
      >
        <Title>Welcome to the Book Shop</Title>
        <p>Discover your next favorite read today.</p>
        <Link to="/books">
          <Button type="primary" size="large">
            Browse All Books
          </Button>
        </Link>
      </section>

      {/* Featured Books Section */}
      <section>
        <Title level={2}>Featured Picks</Title>
        <Row gutter={[24, 24]}>
          {featuredBooks.map(book => (
            <Col xs={24} sm={12} md={8} key={book.id}>
              <BookListItem book={book} />
            </Col>
          ))}
        </Row>
      </section>
    </div>
  )
}

export default App
