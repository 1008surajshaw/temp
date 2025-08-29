import { Modal, Button, Typography } from "antd"
import { ExclamationCircleOutlined } from "@ant-design/icons"

const { Title, Text } = Typography

interface PublishConfirmModalProps {
  visible: boolean
  onConfirm: () => void
  onCancel: () => void
  eventTitle: string
}

export default function PublishConfirmModal({ visible, onConfirm, onCancel, eventTitle }: PublishConfirmModalProps) {
  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      centered
      width={400}
    >
      <div className="text-center py-4">
        <ExclamationCircleOutlined className="text-5xl text-orange-500 mb-4" />
        
        <Title level={4} className="mb-3">
          Are you sure to publish event?
        </Title>
        
        <Text type="secondary" className="block mb-6">
          "{eventTitle}" will be published and visible to everyone. You can still edit it later.
        </Text>
        
        <div className="flex gap-3 justify-center">
          <Button size="large" onClick={onCancel}>
            Draft
          </Button>
          <Button type="primary" size="large" onClick={onConfirm}>
            Publish
          </Button>
        </div>
      </div>
    </Modal>
  )
}