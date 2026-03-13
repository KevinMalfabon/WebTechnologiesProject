import React, { useEffect, useState } from 'react'
import {
  Typography,
  Skeleton,
  Alert,
  Button,
  Input,
  Popconfirm,
  message,
  Modal,
  List,
} from 'antd'
import {
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  UserOutlined,
  MailOutlined,
  PictureOutlined,
} from '@ant-design/icons'
import { useNavigate, Link } from '@tanstack/react-router'
import axios from 'axios'

import { useClientDetailsProvider } from '../providers/useClientDetailsProvider'
import { useClientSalesProvider } from '../providers/useClientSalesProvider'
import type { UpdateClientModel } from '../ClientModel'
import { Route as booksRoute } from '../../routes/books'

import './ClientDetails.css'

const { Title, Text } = Typography

// ────────────────────────────────────────────────────
// Editable Card
// ────────────────────────────────────────────────────

interface EditableCardProps {
  label: string
  icon: React.ReactNode
  value: React.ReactNode
  spanClass: string
  rowClass?: string
  editContent?: React.ReactNode
  onSave?: () => void
  onCancel?: () => void
  isEditing?: boolean
  onStartEdit?: () => void
  editable?: boolean
  noPadding?: boolean
  minHeight?: number
  showEditButtons?: boolean
}

function EditableCard({
  label,
  icon,
  value,
  spanClass,
  rowClass,
  editContent,
  onSave,
  onCancel,
  isEditing,
  onStartEdit,
  editable = true,
  noPadding = false,
  minHeight,
  showEditButtons = false,
}: EditableCardProps): React.ReactElement {
  return (
    <div
      className={`bento-card ${spanClass} ${rowClass || ''}`}
      style={minHeight ? { minHeight } : undefined}
    >
      {editable && showEditButtons && !isEditing && onStartEdit && (
        <button
          className="bento-edit-btn"
          onClick={onStartEdit}
          aria-label={`Edit ${label}`}
        >
          <EditOutlined />
        </button>
      )}

      {noPadding && !isEditing ? (
        value
      ) : (
        <div className="bento-card-content">
          <div className="bento-card-label">
            {icon}
            {label}
          </div>

          {isEditing ? (
            <div>
              {editContent}
              <div className="bento-edit-actions">
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  onClick={onSave}
                  style={{
                    borderRadius: 10,
                    height: 36,
                    fontWeight: 600,
                    background: '#007AFF',
                  }}
                >
                  Save
                </Button>
                <Button
                  icon={<CloseOutlined />}
                  onClick={onCancel}
                  style={{ borderRadius: 10, height: 36 }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            value
          )}
        </div>
      )}
    </div>
  )
}

// ────────────────────────────────────────────────────
// Main Component
// ────────────────────────────────────────────────────

interface ClientDetailsProps {
  id: string
}

export const ClientDetails = ({ id }: ClientDetailsProps) => {
  const {
    isLoading: loading,
    client,
    loadClient,
  } = useClientDetailsProvider(id)
  const { sales, loadSales } = useClientSalesProvider(id)
  const navigate = useNavigate()

  const [isEditMode, setIsEditMode] = useState(false)
  const [editingField, setEditingField] = useState<string | null>(null)

  const [editFirstName, setEditFirstName] = useState('')
  const [editLastName, setEditLastName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editPicture, setEditPicture] = useState('')

  const [isPurchasedModalOpen, setIsPurchasedModalOpen] = useState(false)

  useEffect(() => {
    if (id) {
      loadClient()
    }
  }, [id])

  // Simple provider update implementation as the current provider lacks one
  const updateClientData = async (updates: UpdateClientModel) => {
    try {
      await axios.patch(`http://localhost:3000/clients/${id}`, updates)
      await loadClient()
      message.success('Client updated successfully')
    } catch (err) {
      console.error(err)
      message.error('Failed to update client')
    }
  }

  const startEdit = (field: string) => {
    if (!client) return
    setEditingField(field)
    switch (field) {
      case 'name':
        setEditFirstName(client.firstName)
        setEditLastName(client.lastName)
        break
      case 'email':
        setEditEmail(client.email || '')
        break
      case 'picture':
        setEditPicture(client.picture || '')
        break
    }
  }

  const cancelEdit = () => {
    setEditingField(null)
  }

  const toggleEditMode = () => {
    if (isEditMode) {
      setEditingField(null)
    }
    setIsEditMode(!isEditMode)
  }

  const saveField = async (field: string) => {
    const updates: UpdateClientModel = {}
    switch (field) {
      case 'name':
        updates.firstName = editFirstName.trim()
        updates.lastName = editLastName.trim()
        break
      case 'email':
        updates.email = editEmail.trim().length ? editEmail.trim() : undefined
        break
      case 'picture':
        updates.picture = editPicture.trim().length ? editPicture.trim() : ''
        break
    }
    await updateClientData(updates)
    setEditingField(null)
  }

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/clients/${id}`)
      message.success('Client deleted successfully')
      navigate({ to: '/clients' })
    } catch (err) {
      console.error(err)
      message.error('Failed to delete client')
    }
  }

  // ── Loading ──
  if (loading && !client) {
    return (
      <div className="client-details-page">
        <div className="client-details-container">
          <div className="client-details-grid">
            <div
              className="bento-card span-4"
              style={{ minHeight: 400, padding: 24 }}
            >
              <Skeleton.Avatar
                active
                shape="circle"
                style={{ width: 120, height: 120, margin: '80px auto' }}
              />
            </div>
            <div className="bento-card span-8" style={{ padding: 28 }}>
              <Skeleton active paragraph={{ rows: 4 }} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Not Found ──
  if (!client) {
    return (
      <div className="client-details-page">
        <div className="client-details-container">
          <Alert
            message="Client Not Found"
            description="We could not find the details for the requested client."
            type="warning"
            showIcon
            style={{ borderRadius: 16 }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="client-details-page">
      <div className="client-details-container">
        {/* Back link */}
        <button
          className="client-details-back"
          onClick={() => navigate({ to: '/clients' })}
        >
          ← Back to Clients List
        </button>

        {/* ═══════ BENTO GRID ═══════ */}
        <div className="client-details-grid">
          {/* ── Picture Area Card ── */}
          <EditableCard
            label="Picture"
            icon={<PictureOutlined />}
            spanClass="span-4"
            rowClass="row-1-3"
            noPadding
            minHeight={340}
            showEditButtons={isEditMode}
            isEditing={editingField === 'picture'}
            onStartEdit={() => startEdit('picture')}
            onSave={() => saveField('picture')}
            onCancel={cancelEdit}
            editContent={
              <div style={{ marginTop: 4, padding: 12 }}>
                <Input
                  value={editPicture}
                  onChange={e => setEditPicture(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  style={{ borderRadius: 10 }}
                  size="large"
                />
                {editPicture && (
                  <img
                    src={editPicture}
                    alt="Preview"
                    className="bento-cover-preview"
                    style={{
                      borderRadius: '50%',
                      width: 120,
                      height: 120,
                      margin: '20px auto',
                      display: 'block',
                    }}
                    onError={e => {
                      ;(e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                )}
              </div>
            }
            value={
              client.picture ? (
                <img
                  src={client.picture}
                  alt={`${client.firstName}`}
                  className="bento-cover-img"
                  style={{ borderRadius: '0' }}
                />
              ) : (
                <div className="bento-avatar-fallback">
                  <UserOutlined style={{ fontSize: 72, color: '#B0B0B8' }} />
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: '#B0B0B8',
                      letterSpacing: '0.3px',
                    }}
                  >
                    No Image
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: '#C7C7CC',
                      marginTop: -4,
                    }}
                  >
                    Edit to add picture URL
                  </Text>
                </div>
              )
            }
          />

          {/* ── Name Card ── */}
          <EditableCard
            label="Client Details"
            icon={<UserOutlined />}
            spanClass="span-8"
            showEditButtons={isEditMode}
            isEditing={editingField === 'name'}
            onStartEdit={() => startEdit('name')}
            onSave={() => saveField('name')}
            onCancel={cancelEdit}
            editContent={
              <div style={{ display: 'flex', gap: '10px' }}>
                <Input
                  value={editFirstName}
                  onChange={e => setEditFirstName(e.target.value)}
                  onPressEnter={() => saveField('name')}
                  style={{ borderRadius: 10, fontSize: 18 }}
                  size="large"
                  placeholder="First Name"
                  autoFocus
                />
                <Input
                  value={editLastName}
                  onChange={e => setEditLastName(e.target.value)}
                  onPressEnter={() => saveField('name')}
                  style={{ borderRadius: 10, fontSize: 18 }}
                  size="large"
                  placeholder="Last Name"
                />
              </div>
            }
            value={
              <Title
                level={3}
                style={{
                  margin: 0,
                  fontSize: 28,
                  fontWeight: 700,
                  letterSpacing: '-0.6px',
                  color: '#1D1D1F',
                  lineHeight: 1.2,
                }}
              >
                {client.firstName} {client.lastName}
              </Title>
            }
          />

          {/* ── Email Card ── */}
          <EditableCard
            label="Contact via Email"
            icon={<MailOutlined />}
            spanClass="span-8"
            showEditButtons={isEditMode}
            isEditing={editingField === 'email'}
            onStartEdit={() => startEdit('email')}
            onSave={() => saveField('email')}
            onCancel={cancelEdit}
            editContent={
              <Input
                value={editEmail}
                onChange={val => setEditEmail(val.target.value)}
                style={{ width: '100%', borderRadius: 10, fontSize: 16 }}
                size="large"
                placeholder="example@email.com"
                onPressEnter={() => saveField('email')}
              />
            }
            value={
              <div
                className="bento-card-value"
                style={{ fontWeight: 400, color: '#3A3A3C' }}
              >
                {client.email || (
                  <span
                    style={{
                      color: '#C7C7CC',
                      fontStyle: 'italic',
                      fontSize: '18px',
                    }}
                  >
                    Not provided
                  </span>
                )}
              </div>
            }
          />

          {/* ── Action Bar ── */}
          <div className="client-details-actions">
            <Button
              size="large"
              style={{
                borderRadius: 14,
                height: 44,
                padding: '0 24px',
                fontWeight: 600,
                color: '#1d1d1f',
                border: '1px solid #d9d9d9',
                boxShadow: '0 2px 0 rgba(0, 0, 0, 0.02)',
              }}
              onClick={() => {
                loadSales()
                setIsPurchasedModalOpen(true)
              }}
            >
              View Purchased Books
            </Button>

            <Button
              type="primary"
              icon={isEditMode ? <CloseOutlined /> : <EditOutlined />}
              className="client-details-edit-all-btn"
              onClick={toggleEditMode}
            >
              {isEditMode ? 'Done Editing' : 'Edit Client'}
            </Button>
            <Popconfirm
              title="Delete this client"
              description="Are you sure? This action cannot be undone."
              onConfirm={handleDelete}
              okText="Yes, delete"
              cancelText="Cancel"
              okButtonProps={{ danger: true, style: { borderRadius: 8 } }}
              cancelButtonProps={{ style: { borderRadius: 8 } }}
            >
              <Button
                danger
                icon={<DeleteOutlined />}
                className="client-details-delete-btn"
              >
                Delete
              </Button>
            </Popconfirm>
          </div>
        </div>
      </div>

      {/* ── Purchased Books Modal ── */}
      <Modal
        title={<b>{client.firstName}'s Purchase History</b>}
        open={isPurchasedModalOpen}
        onCancel={() => setIsPurchasedModalOpen(false)}
        footer={null}
        style={{ borderRadius: 16 }}
      >
        <List
          itemLayout="horizontal"
          dataSource={sales}
          style={{ marginTop: 16 }}
          renderItem={sale => (
            <List.Item>
              <List.Item.Meta
                title={
                  <Link
                    to={booksRoute.to + '/$bookId'}
                    params={{ bookId: sale.bookId }}
                    onClick={() => setIsPurchasedModalOpen(false)}
                  >
                    {sale.book?.title}
                  </Link>
                }
                description={
                  <div>
                    <div>
                      By: {sale.book?.author?.firstName}{' '}
                      {sale.book?.author?.lastName}
                    </div>
                    <div>
                      Purchased on:{' '}
                      {new Date(sale.purchasedAt).toLocaleDateString()}
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Modal>
    </div>
  )
}
