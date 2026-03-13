import { useState } from 'react'
import type { AuthorModel, UpdateAuthorModel } from '../AuthorModel'
import { Button, Card, Input } from 'antd'
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
    <Card
      style={{
        height: '200px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        border: '2px solid #d9d9d9',
      }}
      actions={[
        isEditing ? (
          <Button
            type="primary"
            onClick={onValidateEdit}
            disabled={!firstName.trim() || !lastName.trim() || !info.trim()}
          >
            <CheckOutlined />
          </Button>
        ) : (
          <Button
            type="primary"
            onClick={() => setIsEditing(true)}
            style={{
              color: '#fdfaf5',
              backgroundColor: '#8c5e3c',
              borderColor: '#8c5e3c',
            }}
          >
            <EditOutlined />
          </Button>
        ),
        isEditing ? (
          <Button onClick={onCancelEdit}>
            <CloseOutlined />
          </Button>
        ) : (
          <Button type="default" danger onClick={() => onDelete(author.id)}>
            <DeleteOutlined />
          </Button>
        ),
      ]}
    >
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
          style={{ color: 'inherit', textDecoration: 'none' }}
        >
          <Card.Meta
            title={`${author.firstName} ${author.lastName}`}
            description={
              <>
                <div>{author.info}</div>
                {author.bookCount !== undefined && (
                  <div>Books written: {author.bookCount}</div>
                )}
              </>
            }
          />
        </Link>
      )}
    </Card>
  )
}