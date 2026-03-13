import { useEffect } from 'react'
import { useAuthorProvider } from '../providers/useAuthorProvider'
import { AuthorListItem } from './AuthorListItem'
import { CreateAuthorModal } from './CreateAuthorModal'
import { Row, Col } from 'antd'

export function AuthorList() {
  const { authors, loadAuthors, deleteAuthor, updateAuthor, createAuthor } =
    useAuthorProvider()

  useEffect(() => {
    loadAuthors()
  }, [])

  return (
    <>
      <CreateAuthorModal onCreate={createAuthor} />
      <Row gutter={[16, 16]} style={{ padding: '0 .5rem' }}>
        {authors.map(author => (
          <Col span={6} key={author.id}>
            <AuthorListItem
              author={author}
              onDelete={deleteAuthor}
              onUpdate={updateAuthor}
            />
          </Col>
        ))}
      </Row>
    </>
  )
}
