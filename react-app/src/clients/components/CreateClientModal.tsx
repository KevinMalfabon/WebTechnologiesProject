import { useState } from 'react'
import type { CreateClientModel } from '../ClientModel'
import { Button, Input, Modal, Space } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

interface CreateClientModalProps {
  onCreate: (client: CreateClientModel) => void
}

export function CreateClientModal({ onCreate }: CreateClientModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [picture, setPicture] = useState('')

  const onClose = () => {
    setFirstName('')
    setLastName('')
    setEmail('')
    setPicture('')
    setIsOpen(false)
  }

  const canCreate = firstName.trim().length > 0 && lastName.trim().length > 0

  return (
    <>
      <Button
        icon={<PlusOutlined />}
        type="primary"
        onClick={() => setIsOpen(true)}
      >
        Create Client
      </Button>

      <Modal
        open={isOpen}
        onCancel={onClose}
        onOk={() => {
          onCreate({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim().length ? email.trim() : undefined,
            picture: picture.trim().length ? picture.trim() : undefined,
          })
          onClose()
        }}
        okButtonProps={{ disabled: !canCreate }}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Input
            placeholder="First name"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
          />
          <Input
            placeholder="Last name"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
          />
          <Input
            placeholder="Email (optional)"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <Input
            placeholder="Picture URL (optional)"
            value={picture}
            onChange={e => setPicture(e.target.value)}
          />
        </Space>
      </Modal>
    </>
  )
}
