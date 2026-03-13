import { useState } from 'react'
import type { ClientModel, UpdateClientModel } from '../ClientModel'
import { Button, Col, Row, Modal, Input, Avatar } from 'antd'
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  UserOutlined,
  BookOutlined,
} from '@ant-design/icons'
import { useNavigate } from '@tanstack/react-router'

interface ClientListItemProps {
  client: ClientModel
  onDelete: (id: string) => void
  onUpdate: (id: string, input: UpdateClientModel) => void
}

export function ClientListItem({
  client,
  onDelete,
  onUpdate,
}: ClientListItemProps) {
  const [firstName, setFirstName] = useState(client.firstName)
  const [lastName, setLastName] = useState(client.lastName)
  const [email, setEmail] = useState(client.email ?? '')
  const [picture, setPicture] = useState(client.picture ?? '')
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  
  const navigate = useNavigate()

  const onCancelEdit = () => {
    setIsEditing(false)
    setFirstName(client.firstName)
    setLastName(client.lastName)
    setEmail(client.email ?? '')
    setPicture(client.picture ?? '')
  }

  const onValidateEdit = () => {
    onUpdate(client.id, {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().length ? email.trim() : undefined,
      picture: picture.trim().length ? picture.trim() : '',
    })
    setIsEditing(false)
  }

  const canSave = firstName.trim().length > 0 && lastName.trim().length > 0

  return (
    <>
      <Row
        style={{
          width: '100%',
          alignItems: 'center',
          borderRadius: '8px',
          backgroundColor: '#fff',
          border: '1px solid #f0f0f0',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
          margin: '1rem 0',
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          transition: 'box-shadow 0.3s',
          cursor: isEditing ? 'default' : 'pointer',
        }}
        onClick={() => {
          if (!isEditing) {
            navigate({ to: '/clients/$clientId', params: { clientId: client.id } })
          }
        }}
        onMouseEnter={e => {
          e.currentTarget.style.boxShadow = '0 4px 12px 0 rgba(0, 0, 0, 0.05)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.03)'
        }}
      >
        <Col
          span={7}
          style={{ margin: 'auto 0', display: 'flex', alignItems: 'center' }}
        >
          {isEditing ? (
            <div style={{ marginRight: '1rem' }} />
          ) : (
            <div style={{ marginRight: '1rem' }}>
              {client.picture ? (
                <Avatar src={client.picture} />
              ) : (
                <Avatar icon={<UserOutlined />} />
              )}
            </div>
          )}
          {isEditing ? (
            <div style={{ display: 'flex', gap: '.5rem', flex: 1 }}>
              <Input
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                placeholder="First"
              />
              <Input
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                placeholder="Last"
              />
            </div>
          ) : (
            <div
              style={{
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ fontWeight: '500', color: '#1f1f1f' }}>
                {client.firstName} {client.lastName}
              </span>
            </div>
          )}
        </Col>

        <Col span={5} style={{ margin: 'auto 0', textAlign: 'left' }}>
          {isEditing ? (
            <Input
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              style={{ width: '100%' }}
            />
          ) : (
            <span style={{ color: '#595959' }}>{client.email ?? '—'}</span>
          )}
        </Col>

        {isEditing && (
          <Col span={5} style={{ margin: 'auto 0', textAlign: 'left' }}>
            <Input
              value={picture}
              onChange={e => setPicture(e.target.value)}
              placeholder="Picture URL"
              style={{ width: '100%' }}
            />
          </Col>
        )}

        {!isEditing && (
          <Col
            span={5}
            style={{
              margin: 'auto 0',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <BookOutlined style={{ marginRight: '0.5rem', color: '#8c8c8c' }} />
            <span style={{ color: '#595959', fontSize: '0.9em' }}>
              {client.purchasedBooksCount ?? 0}{' '}
              {client.purchasedBooksCount === 1 ? 'book' : 'books'}
            </span>
          </Col>
        )}

        <Col
          span={4}
          style={{
            alignItems: 'right',
            display: 'flex',
            gap: '.25rem',
            margin: 'auto 0',
            justifyContent: 'flex-end',
          }}
        >
          {isEditing ? (
            <>
              <Button
                type="primary"
                onClick={onValidateEdit}
                disabled={!canSave}
              >
                <CheckOutlined />
              </Button>
              <Button onClick={onCancelEdit}>
                <CloseOutlined />
              </Button>
            </>
          ) : (
            <Button 
              type="primary" 
              onClick={(e) => {
                e.stopPropagation()
                setIsEditing(true)
              }}
            >
              <EditOutlined />
            </Button>
          )}

          <Button
            type="primary"
            danger
            onClick={(e) => {
              e.stopPropagation()
              setIsDeleteModalOpen(true)
            }}
          >
            <DeleteOutlined />
          </Button>
        </Col>
      </Row>

      <Modal
        title="Delete this client?"
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Delete"
        okButtonProps={{ danger: true }}
        cancelText="Cancel"
        onOk={() => {
          onDelete(client.id)
          setIsDeleteModalOpen(false)
        }}
      >
        <p>
          You are about to delete{' '}
          <b>
            {client.firstName} {client.lastName}
          </b>
          .
          <br />
          This action cannot be undone.
        </p>
      </Modal>
    </>
  )
}
