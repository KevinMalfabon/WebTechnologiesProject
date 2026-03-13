import { useState } from 'react'
import type { CreateAuthorModel } from '../AuthorModel'
import { Button, Input, Modal, Space } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

const { TextArea } = Input

interface CreateAuthorModalProps {
  onCreate: (author: CreateAuthorModel) => void
}

export function CreateAuthorModal({ onCreate }: CreateAuthorModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [info, setInfo] = useState('')

  const onClose = () => {
    setFirstName('')
    setLastName('')
    setInfo('')
    setIsOpen(false)
  }

  const handleCreate = () => {
    if (!firstName.trim() || !lastName.trim() || !info.trim()) {
      return
    }

    onCreate({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      info: info.trim(),
    })

    onClose()
  }

  return (
    <>
      <Button
        icon={<PlusOutlined />}
        type="primary"
        size="large"
        shape="round"
        style={{
          color: '#fdfaf5',
          backgroundColor: '#8c5e3c',
          borderColor: '#8c5e3c',
          fontWeight: 'bold',
        }}
        onClick={() => setIsOpen(true)}
      >
        Create Author
      </Button>

      <Modal
        open={isOpen}
        onCancel={onClose}
        onOk={handleCreate}
        title="Create Author"
        okButtonProps={{
          disabled:
          !firstName.trim() || !lastName.trim() || !info.trim(),
        }}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
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

          <TextArea
            placeholder="Info"
            value={info}
            onChange={e => setInfo(e.target.value)}
            rows={4}
          />
        </Space>
      </Modal>
    </>
  )
}