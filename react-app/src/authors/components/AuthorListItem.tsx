import { useState } from 'react'
import type { AuthorModel, UpdateAuthorModel } from '../AuthorModel'
import { Button, Col, Input, Row } from 'antd'
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons'
import { Link } from '@tanstack/react-router'

interface AuthorListItemProps {
  author: AuthorModel
  onDelete: (id: string) => void
  onUpdate: (id: string, input: UpdateAuthorModel) => void
}

export function AuthorListItem({
  author,
  onDelete,
  onUpdate,
}: AuthorListItemProps) {
  const [firstName, setFirstName] = useState(author.firstName)
  const [lastName, setLastName] = useState(author.lastName)
  const [info, setInfo] = useState(author.info)
  const [isEditing, setIsEditing] = useState(false)

  const onCancelEdit = () => {
    setIsEditing(false)
    setFirstName(author.firstName)
    setLastName(author.lastName)
    setInfo(author.info)
  }

  const onValidateEdit = () => {
    onUpdate(author.id, {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      info: info.trim(),
    })
    setIsEditing(false)
  }

  return (
    <Row
      style={{
        width: '100%',
        borderRadius: '10px',
        backgroundColor: '#EEEEEE',
        margin: '1rem 0',
        padding: '.75rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Col span={16}>
        {isEditing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
            <Input
              placeholder="First Name"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
            />
            <Input
              placeholder="Last Name"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
            />
            <Input
              placeholder="Info"
              value={info}
              onChange={e => setInfo(e.target.value)}
            />
          </div>
        ) : (
          <Link
            to="/authors/$authorId"
            params={{ authorId: author.id }}
            style={{
              textAlign: 'left',
              color: 'inherit',
            }}
          >
            <div>
              <span style={{ fontWeight: 'bold' }}>
                {author.firstName} {author.lastName}
              </span>
            </div>
            <div>{author.info}</div>
            {author.bookCount !== undefined && (
              <div>Books written: {author.bookCount}</div>
            )}
          </Link>
        )}
      </Col>

      <Col
        span={8}
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '.25rem',
        }}
      >
        {isEditing ? (
          <>
            <Button
              type="primary"
              onClick={onValidateEdit}
              disabled={
                !firstName.trim() || !lastName.trim() || !info.trim()
              }
            >
              <CheckOutlined />
            </Button>
            <Button onClick={onCancelEdit}>
              <CloseOutlined />
            </Button>
          </>
        ) : (
          <Button type="primary" onClick={() => setIsEditing(true)}>
            <EditOutlined />
          </Button>
        )}

        <Button type="primary" danger onClick={() => onDelete(author.id)}>
          <DeleteOutlined />
        </Button>
      </Col>
    </Row>
  )
}