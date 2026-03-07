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
} from '@ant-design/icons'
import { useNavigate } from '@tanstack/react-router'
import axios from 'axios'

import { useBookDetailsProvider } from '../../books/providers/useBookDetailsProvider'
import { useBookAuthorsProviders } from '../../books/providers/useBookAuthorsProviders'
import type { UpdateBookModel } from '../../books/BookModel'

import './BookDetails.css'

const { Title, Text } = Typography
const { TextArea } = Input

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
  const navigate = useNavigate()

  const [isEditMode, setIsEditMode] = useState(false)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editYear, setEditYear] = useState<number | null>(null)
  const [editAuthorId, setEditAuthorId] = useState('')
  const [editCoverUrl, setEditCoverUrl] = useState('')
  const [editDescription, setEditDescription] = useState('')

  useEffect(() => {
    if (id) {
      loadBook()
    }
  }, [id])

  useEffect(() => {
    loadAuthors()
  }, [])

  const startEdit = (field: string) => {
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

  const handleDelete = async () => {
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
          <div className="book-details-grid">
            <div
              className="bento-card span-5"
              style={{ minHeight: 400, padding: 24 }}
            >
              <Skeleton.Image active style={{ width: '100%', height: 360 }} />
            </div>
            <div className="bento-card span-7" style={{ padding: 28 }}>
              <Skeleton active paragraph={{ rows: 5 }} />
            </div>
          </div>
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

        {/* ═══════ BENTO GRID ═══════ */}
        <div className="book-details-grid">
          {/* ── Cover Image Card ── */}
          <EditableCard
            label="Cover"
            icon={<BookOutlined />}
            spanClass="span-5"
            rowClass="row-1-3"
            noPadding
            minHeight={420}
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

          {/* ── Title Card ── */}
          <EditableCard
            label="Title"
            icon={<BookOutlined />}
            spanClass="span-7"
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
                  fontSize: 28,
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

          {/* ── Author Card ── */}
          <EditableCard
            label="Author"
            icon={<UserOutlined />}
            spanClass="span-7"
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

          {/* ── Year Card ── */}
          <EditableCard
            label="Published"
            icon={<CalendarOutlined />}
            spanClass="span-12"
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
              <div className="bento-card-metric">
                {book.yearPublished || '—'}
              </div>
            }
          />

          {/* ── Description Card ── */}
          <EditableCard
            label="Description"
            icon={<FileTextOutlined />}
            spanClass="span-12"
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

          {/* ── Action Bar ── */}
          <div className="book-details-actions">
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
        </div>
      </div>
    </div>
  )
}
