import { useState } from 'react'
import type { ClientModel, UpdateClientModel } from '../ClientModel'
import { Button, Col, Row, Modal } from 'antd'
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Link } from '@tanstack/react-router'

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
  const [isEditing, setIsEditing] = useState(false)

  // ✅ NEW: state for delete confirm modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const onCancelEdit = () => {
    setIsEditing(false)
    setFirstName(client.firstName)
    setLastName(client.lastName)
    setEmail(client.email ?? '')
  }

  const onValidateEdit = () => {
    onUpdate(client.id, {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().length ? email.trim() : undefined,
    })
    setIsEditing(false)
  }

  const canSave = firstName.trim().length > 0 && lastName.trim().length > 0

  return (
    <>
      <Row
        style={{
          width: '100%',
          height: '60px',
          borderRadius: '10px',
          backgroundColor: '#EEEEEE',
          margin: '1rem 0',
          padding: '.25rem .5rem',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Col span={10} style={{ margin: 'auto 0' }}>
          {isEditing ? (
            <div style={{ display: 'flex', gap: '.5rem' }}>
              <input
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                placeholder="First"
              />
              <input
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                placeholder="Last"
              />
            </div>
          ) : (
            <Link
              to={`/clients/$clientId`}
              params={{ clientId: client.id }}
              style={{ margin: 'auto 0', textAlign: 'left' }}
            >
              <UserOutlined style={{ marginRight: '.5rem' }} />
              <span style={{ fontWeight: 'bold' }}>
                {client.firstName} {client.lastName}
              </span>
            </Link>
          )}
        </Col>

        <Col span={10} style={{ margin: 'auto 0', textAlign: 'left' }}>
          {isEditing ? (
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              style={{ width: '100%' }}
            />
          ) : (
            <span style={{ color: '#666' }}>{client.email ?? '—'}</span>
          )}
        </Col>

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
            <Button type="primary" onClick={() => setIsEditing(true)}>
              <EditOutlined />
            </Button>
          )}

          {/* ✅ CHANGED: open modal instead of deleting directly */}
          <Button
            type="primary"
            danger
            onClick={() => setIsDeleteModalOpen(true)}
          >
            <DeleteOutlined />
          </Button>
        </Col>
      </Row>

      {/* ✅ NEW: Confirmation modal */}
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
