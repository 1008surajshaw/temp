import { Modal, Button, Typography, Divider, message } from "antd"
import { CheckCircleOutlined, CopyOutlined, ShareAltOutlined } from "@ant-design/icons"
import { useState, useEffect } from "react"

const { Title, Text } = Typography

interface SaveSuccessModalProps {
  visible: boolean
  onClose: () => void
  eventTitle: string
  eventStatus: string
}

export default function SaveSuccessModal({ visible, onClose, eventTitle, eventStatus }: SaveSuccessModalProps) {
  const [countdown, setCountdown] = useState(3)
  const [showSharing, setShowSharing] = useState(false)
  
  const eventUrl = `https://events.example.com/event/${eventTitle?.toLowerCase().replace(/\s+/g, '-')}`

  useEffect(() => {
    if (visible && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0) {
      setShowSharing(true)
    }
  }, [visible, countdown])

  const copyEventLink = () => {
    navigator.clipboard.writeText(eventUrl)
    message.success('Event link copied to clipboard!')
  }

  const shareOnSocial = (platform: string) => {
    const text = `Check out my event: ${eventTitle}`
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(eventUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(eventUrl)}`,
      instagram: `https://www.instagram.com/` // Instagram doesn't support direct sharing
    }
    
    if (platform === 'instagram') {
      message.info('Instagram link sharing not supported. Link copied to clipboard!')
      copyEventLink()
    } else {
      window.open(urls[platform as keyof typeof urls], '_blank', 'width=600,height=400')
    }
  }

  const handleClose = () => {
    setCountdown(3)
    setShowSharing(false)
    onClose()
  }

  return (
    <Modal
      open={visible}
      onCancel={handleClose}
      footer={null}
      centered
      width={500}
      className="save-success-modal"
    >
      <div className="text-center py-6">
        <div className="mb-6">
          <CheckCircleOutlined className="text-6xl text-green-500 mb-4" />
          <Title level={3} className="mb-2">
            {eventStatus === 'published' ? 'Event Published!' : 'Event Saved as Draft!'}
          </Title>
          <Text type="secondary" className="text-lg">
            "{eventTitle}" has been {eventStatus === 'published' ? 'published successfully' : 'saved to drafts'}
          </Text>
        </div>

        {!showSharing && countdown > 0 && (
          <div className="mb-6">
            <Text className="text-lg">
              Ready to share in {countdown} seconds...
            </Text>
          </div>
        )}

        {showSharing && eventStatus === 'published' && (
          <div>
            <Divider />
            
            <div className="mb-6">
              <Title level={4} className="mb-4">
                <ShareAltOutlined className="mr-2" />
                Share Your Event
              </Title>
              
              <div className="mb-4">
                <Text strong className="block mb-2">Event Link:</Text>
                <div className="flex gap-2">
                  <div className="flex-1 p-2 bg-gray-50 rounded border text-left">
                    <Text className="text-sm text-gray-600">{eventUrl}</Text>
                  </div>
                  <Button icon={<CopyOutlined />} onClick={copyEventLink}>
                    Copy
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  className="h-12"
                  style={{ backgroundColor: '#1DA1F2', borderColor: '#1DA1F2', color: 'white' }}
                  onClick={() => shareOnSocial('twitter')}
                >
                  Twitter
                </Button>
                
                <Button 
                  className="h-12"
                  style={{ backgroundColor: '#4267B2', borderColor: '#4267B2', color: 'white' }}
                  onClick={() => shareOnSocial('facebook')}
                >
                  Facebook
                </Button>
                
                <Button 
                  className="h-12"
                  style={{ backgroundColor: '#0077B5', borderColor: '#0077B5', color: 'white' }}
                  onClick={() => shareOnSocial('linkedin')}
                >
                  LinkedIn
                </Button>
                
                <Button 
                  className="h-12"
                  style={{ backgroundColor: '#E4405F', borderColor: '#E4405F', color: 'white' }}
                  onClick={() => shareOnSocial('instagram')}
                >
                  Instagram
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6">
          <Button type="primary" size="large" onClick={handleClose} className="px-8">
            {eventStatus === 'published' ? 'Done' : 'Continue Editing'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}