import React, { useEffect, useState } from 'react'
import {
  Typography,
  Skeleton,
  Alert,
  Button,
  Input,
  InputNumber,
  Select,
  Popconfirm,
  Modal,
  List,
  DatePicker,
  Space,
  Row,
  Col,
  Grid,
  message,
} from 'antd'
import {
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  BookOutlined,
  CalendarOutlined,
  UserOutlined,
  FileTextOutlined,
  ShoppingCartOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import { useNavigate, Link } from '@tanstack/react-router'
import axios from 'axios'
import dayjs from 'dayjs'

import { useBookDetailsProvider } from '../../books/providers/useBookDetailsProvider'
import { useBookAuthorsProviders } from '../../books/providers/useBookAuthorsProviders'
import { useBookSalesProvider } from '../../books/providers/useBookSalesProvider'
import type { UpdateBookModel } from '../../books/BookModel'

import './BookDetails.css'

const { Title, Text } = Typography
const { TextArea } = Input
const { useBreakpoint } = Grid

// ────────────────────────────────────────────────────
// Editable Card
// ────────────────────────────────────────────────────

interface EditableCardProps {
  label: string
  icon: React.ReactNode
  value: React.ReactNode
  style?: React.CSSProperties
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
  style,
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
  const cardStyle: React.CSSProperties = {
    ...(minHeight ? { minHeight } : {}),
    ...style,
  }

  return (
    <div className="bento-card" style={cardStyle}>
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
// Client option type for Record Sale modal
// ────────────────────────────────────────────────────

type ClientOption = {
  id: string
  firstName: string
  lastName: string
}

// ────────────────────────────────────────────────────
// Main Component
// ────────────────────────────────────────────────────

interface BookDetailsProps {
  id?: string
}

export const BookDetails: React.FC<BookDetailsProps> = ({
  id,
}): React.ReactElement => {
  const {
    isLoading: loading,
    book,
    loadBook,
    updateBook,
  } = useBookDetailsProvider(id || '')
  const { authors, loadAuthors } = useBookAuthorsProviders()
  const {
    sales,
    isLoading: salesLoading,
    loadSales,
    createSale,
  } = useBookSalesProvider(id || '')
  const navigate = useNavigate()
  const screens = useBreakpoint()
  const isMobile = !screens.md

  const [isEditMode, setIsEditMode] = useState(false)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editYear, setEditYear] = useState<number | null>(null)
  const [editAuthorId, setEditAuthorId] = useState('')
  const [editCoverUrl, setEditCoverUrl] = useState('')
  const [editDescription, setEditDescription] = useState('')

  // Record Sale modal state
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false)
  const [saleClientId, setSaleClientId] = useState('')
  const [salePurchasedAt, setSalePurchasedAt] = useState('')
  const [clients, setClients] = useState<ClientOption[]>([])
  const [isLoadingClients, setIsLoadingClients] = useState(false)

  useEffect(() => {
    if (id) {
      loadBook()
      loadSales()
    }
  }, [id])

  useEffect(() => {
    loadAuthors()
  }, [])

  const loadClients = (): void => {
    setIsLoadingClients(true)
    axios
      .get('http://localhost:3000/clients?limit=100&offset=0&sort=lastName,ASC')
      .then(res => {
        setClients(res.data.data ?? [])
      })
      .catch(err => console.error(err))
      .finally(() => setIsLoadingClients(false))
  }

  const openSaleModal = (): void => {
    loadClients()
    setIsSaleModalOpen(true)
  }

  const closeSaleModal = (): void => {
    setSaleClientId('')
    setSalePurchasedAt('')
    setIsSaleModalOpen(false)
  }

  const handleCreateSale = (): void => {
    if (!id) return
    createSale({
      clientId: saleClientId,
      bookId: id,
      purchasedAt: salePurchasedAt,
    })
    closeSaleModal()
  }

  const canCreateSale =
    saleClientId.trim().length > 0 && salePurchasedAt.trim().length > 0

  const startEdit = (field: string): void => {
    if (!book) return
    setEditingField(field)
    switch (field) {
      case 'title':
        setEditTitle(book.title)
        break
      case 'year':
        setEditYear(book.yearPublished)
        break
      case 'author':
        setEditAuthorId(book.author?.id || '')
        break
      case 'coverUrl':
        setEditCoverUrl(book.coverUrl || '')
        break
      case 'description':
        setEditDescription(book.description || '')
        break
    }
  }

  const cancelEdit = (): void => {
    setEditingField(null)
  }

  const toggleEditMode = (): void => {
    if (isEditMode) {
      setEditingField(null)
    }
    setIsEditMode(!isEditMode)
  }

  const saveField = async (field: string): Promise<void> => {
    const updates: UpdateBookModel = {}
    switch (field) {
      case 'title':
        updates.title = editTitle
        break
      case 'year':
        updates.yearPublished = editYear || undefined
        break
      case 'author':
        updates.authorId = editAuthorId
        break
      case 'coverUrl':
        updates.coverUrl = editCoverUrl
        break
      case 'description':
        updates.description = editDescription
        break
    }
    await updateBook(updates)
    setEditingField(null)
  }

  const handleDelete = async (): Promise<void> => {
    try {
      await axios.delete(`http://localhost:3000/books/${id}`)
      message.success('Book deleted successfully')
      navigate({ to: '/books' })
    } catch (err) {
      console.error(err)
      message.error('Failed to delete book')
    }
  }

  // ── Loading ──
  if (loading && !book) {
    return (
      <div className="book-details-page">
        <div className="book-details-container">
          <Row gutter={[20, 20]} align="stretch">
            <Col xs={24} md={8}>
              <div
                className="bento-card"
                style={{ minHeight: 400, padding: 24 }}
              >
                <Skeleton.Image active style={{ width: '100%', height: 360 }} />
              </div>
            </Col>
            <Col xs={24} md={16}>
              <div
                className="bento-card"
                style={{ padding: 28, height: '100%' }}
              >
                <Skeleton active paragraph={{ rows: 5 }} />
              </div>
            </Col>
          </Row>
        </div>
      </div>
    )
  }

  // ── Not Found ──
  if (!book) {
    return (
      <div className="book-details-page">
        <div className="book-details-container">
          <Alert
            message="Book Not Found"
            description="We could not find the details for the requested book."
            type="warning"
            showIcon
            style={{ borderRadius: 16 }}
          />
        </div>
      </div>
    )
  }

  const authorName: string = book.author
    ? `${book.author.firstName} ${book.author.lastName}`
    : 'Unknown Author'

  return (
    <div className="book-details-page">
      <div className="book-details-container">
        {/* Back link */}
        <button
          className="book-details-back"
          onClick={() => navigate({ to: '/books' })}
        >
          ← Back to Library
        </button>

        {/* ═══════ MAIN INFO ROW: Cover | Title + Author + Year ═══════ */}
        <Row gutter={[20, 20]} align="stretch">
          {/* ── Left: Cover Image ── */}
          <Col
            xs={24}
            md={8}
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <EditableCard
              label="Cover"
              icon={<BookOutlined />}
              noPadding
              style={{ flex: 1 }}
              showEditButtons={isEditMode}
              isEditing={editingField === 'coverUrl'}
              onStartEdit={() => startEdit('coverUrl')}
              onSave={() => saveField('coverUrl')}
              onCancel={cancelEdit}
              editContent={
                <div style={{ marginTop: 4 }}>
                  <Input
                    value={editCoverUrl}
                    onChange={e => setEditCoverUrl(e.target.value)}
                    placeholder="https://example.com/cover.jpg"
                    style={{ borderRadius: 10 }}
                    size="large"
                  />
                  {editCoverUrl && (
                    <img
                      src={editCoverUrl}
                      alt="Preview"
                      className="bento-cover-preview"
                      onError={e => {
                        ;(e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  )}
                </div>
              }
              value={
                book.coverUrl ? (
                  <img
                    src={book.coverUrl}
                    alt={`${book.title} cover`}
                    className="bento-cover-img"
                  />
                ) : (
                  <div className="bento-cover-fallback">
                    <BookOutlined style={{ fontSize: 56, color: '#B0B0B8' }} />
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: '#B0B0B8',
                        letterSpacing: '0.3px',
                      }}
                    >
                      No Cover Available
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: '#C7C7CC',
                        marginTop: -4,
                      }}
                    >
                      Edit to add a cover image
                    </Text>
                  </div>
                )
              }
            />
          </Col>

          {/* ── Right: Title, Author, Published Year ── */}
          <Col xs={24} md={16}>
            <Space direction="vertical" size={20} style={{ width: '100%' }}>
              {/* Title */}
              <EditableCard
                label="Title"
                icon={<BookOutlined />}
                showEditButtons={isEditMode}
                isEditing={editingField === 'title'}
                onStartEdit={() => startEdit('title')}
                onSave={() => saveField('title')}
                onCancel={cancelEdit}
                editContent={
                  <Input
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    onPressEnter={() => saveField('title')}
                    style={{ borderRadius: 10, fontSize: 18 }}
                    size="large"
                    autoFocus
                  />
                }
                value={
                  <Title
                    level={3}
                    style={{
                      margin: 0,
                      fontSize: isMobile ? 22 : 28,
                      fontWeight: 700,
                      letterSpacing: '-0.6px',
                      color: '#1D1D1F',
                      lineHeight: 1.2,
                    }}
                  >
                    {book.title}
                  </Title>
                }
              />

              {/* Author */}
              <EditableCard
                label="Author"
                icon={<UserOutlined />}
                showEditButtons={isEditMode}
                isEditing={editingField === 'author'}
                onStartEdit={() => startEdit('author')}
                onSave={() => saveField('author')}
                onCancel={cancelEdit}
                editContent={
                  <Select
                    value={editAuthorId}
                    onChange={(val: string) => setEditAuthorId(val)}
                    style={{ width: '100%' }}
                    size="large"
                    showSearch
                    optionFilterProp="label"
                    options={authors.map(a => ({
                      value: a.id,
                      label: `${a.firstName} ${a.lastName}`,
                    }))}
                  />
                }
                value={<div className="bento-card-value">{authorName}</div>}
              />

              {/* Published Year */}
              <EditableCard
                label="Published"
                icon={<CalendarOutlined />}
                minHeight={80}
                showEditButtons={isEditMode}
                isEditing={editingField === 'year'}
                onStartEdit={() => startEdit('year')}
                onSave={() => saveField('year')}
                onCancel={cancelEdit}
                editContent={
                  <InputNumber
                    value={editYear}
                    onChange={val => setEditYear(val)}
                    min={1500}
                    max={2026}
                    style={{ width: '100%' }}
                    size="large"
                    onPressEnter={() => saveField('year')}
                  />
                }
                value={
                  <div
                    className="bento-card-value"
                    style={{ fontSize: 18, fontWeight: 600 }}
                  >
                    {book.yearPublished || '—'}
                  </div>
                }
              />
            </Space>
          </Col>
        </Row>

        {/* ═══════ DESCRIPTION ═══════ */}
        <Row gutter={[20, 20]} style={{ marginTop: 20 }}>
          <Col span={24}>
            <EditableCard
              label="Description"
              icon={<FileTextOutlined />}
              showEditButtons={isEditMode}
              isEditing={editingField === 'description'}
              onStartEdit={() => startEdit('description')}
              onSave={() => saveField('description')}
              onCancel={cancelEdit}
              editContent={
                <TextArea
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                  placeholder="Write a description for this book..."
                  rows={4}
                  style={{ borderRadius: 10 }}
                />
              }
              value={
                <div className="bento-card-description">
                  {book.description || (
                    <Text type="secondary" italic>
                      No description yet — click edit to add one
                    </Text>
                  )}
                </div>
              }
            />
          </Col>
        </Row>

        {/* ═══════ SALES LIST ═══════ */}
        <Row gutter={[20, 20]} style={{ marginTop: 20 }}>
          <Col span={24}>
            <div className="bento-card">
              <div className="bento-card-content">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 8,
                    marginBottom: 12,
                  }}
                >
                  <div className="bento-card-label">
                    <ShoppingCartOutlined />
                    Sales ({sales.length})
                  </div>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={openSaleModal}
                    size={isMobile ? 'large' : 'middle'}
                    style={{
                      borderRadius: 10,
                      fontWeight: 600,
                      background: '#007AFF',
                      ...(isMobile ? { width: '100%' } : {}),
                    }}
                  >
                    Record Sale
                  </Button>
                </div>

                {salesLoading ? (
                  <Skeleton active paragraph={{ rows: 3 }} />
                ) : sales.length === 0 ? (
                  <Text type="secondary" italic>
                    No sales recorded for this book yet.
                  </Text>
                ) : (
                  <List
                    dataSource={sales}
                    renderItem={sale => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={
                            <UserOutlined
                              style={{
                                fontSize: 20,
                                color: '#007AFF',
                                marginTop: 4,
                              }}
                            />
                          }
                          title={
                            sale.client ? (
                              <Link
                                to="/clients/$clientId"
                                params={{ clientId: sale.client.id }}
                              >
                                {sale.client.firstName} {sale.client.lastName}
                              </Link>
                            ) : (
                              'Unknown Client'
                            )
                          }
                          description={`Purchased on ${sale.purchasedAt}`}
                        />
                      </List.Item>
                    )}
                  />
                )}
              </div>
            </div>
          </Col>
        </Row>

        {/* ═══════ ACTION BAR ═══════ */}
        <div className="book-details-actions" style={{ marginTop: 20 }}>
          <Button
            type="primary"
            icon={isEditMode ? <CloseOutlined /> : <EditOutlined />}
            className="book-details-edit-all-btn"
            onClick={toggleEditMode}
          >
            {isEditMode ? 'Done Editing' : 'Edit Book'}
          </Button>
          <Popconfirm
            title="Delete this book"
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
              className="book-details-delete-btn"
            >
              Delete Book
            </Button>
          </Popconfirm>
        </div>

        {/* ── Record Sale Modal ── */}
        <Modal
          title="Record a Sale"
          open={isSaleModalOpen}
          onCancel={closeSaleModal}
          onOk={handleCreateSale}
          okButtonProps={{ disabled: !canCreateSale, size: 'large' }}
          cancelButtonProps={{ size: 'large' }}
          okText="Save"
          cancelText="Cancel"
          centered
          width={isMobile ? '92%' : 520}
        >
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Select
              placeholder="Select a client"
              value={saleClientId || undefined}
              onChange={value => setSaleClientId(value)}
              loading={isLoadingClients}
              style={{ width: '100%' }}
              size={isMobile ? 'large' : 'middle'}
              options={clients.map(client => ({
                value: client.id,
                label: `${client.firstName} ${client.lastName}`,
              }))}
              showSearch
              optionFilterProp="label"
            />

            <DatePicker
              placeholder="Select purchase date"
              style={{ width: '100%' }}
              size={isMobile ? 'large' : 'middle'}
              onChange={date => {
                setSalePurchasedAt(date ? dayjs(date).format('YYYY-MM-DD') : '')
              }}
            />
          </Space>
        </Modal>
      </div>
    </div>
  )
}
