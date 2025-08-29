import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Typography, Button, Tag, Card, Row, Col, Divider, Avatar, Space, Modal, message } from 'antd';
import { CalendarOutlined, EnvironmentOutlined, UserOutlined, DollarOutlined, ArrowLeftOutlined, ShareAltOutlined, EyeInvisibleOutlined, FacebookOutlined, TwitterOutlined, LinkedinOutlined, InstagramOutlined, LinkOutlined, QrcodeOutlined } from '@ant-design/icons';
import { DETAIL_VIEW_MODE, EventsDto } from '@/types';
import eventdata from '../seed/event.json';

const { Title, Text, Paragraph } = Typography;

const EventDetails = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [ticketPrice] = useState(() => Math.floor(Math.random() * 100) + 20);

  useEffect(() => {
    const fetchEvent = () => {
      const foundEvent = eventdata.find(e => e.id.toString() === eventId);
      setEvent(foundEvent);
      setLoading(false);
    };
    fetchEvent();
  }, [eventId]);

  if (loading) return <div>Loading...</div>;
  if (!event) return <div>Event not found</div>;

  const eventDate = new Date(event.schedule.start_time);
  const eventEndDate = new Date(event.schedule.end_time);
  const now = new Date();
  const price = event.ticketing.enabled ? `$${ticketPrice}` : 'Free';
  
  const getEventStatus = () => {
    if (event.status === 'cancelled') return { text: 'Cancelled', color: 'red' };
    if (event.status === 'draft') return { text: 'Draft', color: 'orange' };
    if (eventEndDate < now) return { text: 'Completed', color: 'default' };
    if (eventDate > now) return { text: 'Upcoming', color: 'green' };
    return { text: 'Live', color: 'blue' };
  };

  const status = getEventStatus();

  // Check access control
  const hasAccess = () => {
    if (event.access_control.view_details === DETAIL_VIEW_MODE.BEFORE) return true;
    if (event.access_control.view_details === DETAIL_VIEW_MODE.AFTER) return isRegistered;
    if (event.access_control.view_details === DETAIL_VIEW_MODE.CUSTOM && event.access_control.hideUntil) {
      return new Date() > new Date(event.access_control.hideUntil);
    }
    return true;
  };

  const canViewDetails = hasAccess();

  const handleRegister = () => {
    setIsRegistered(true);
    message.success('Successfully registered for the event!');
  };

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`,
    twitter: `https://twitter.com/intent/tweet?url=${window.location.href}&text=${event.title}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`,
    instagram: `https://www.instagram.com/` // Instagram doesn't support direct sharing
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    message.success('Link copied to clipboard!');
  };

  const renderBlurredSection = (content: React.ReactNode) => (
    <div style={{ 
      filter: canViewDetails ? 'none' : 'blur(4px)', 
      pointerEvents: canViewDetails ? 'auto' : 'none',
      position: 'relative'
    }}>
      {content}
      {!canViewDetails && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '16px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <EyeInvisibleOutlined style={{ fontSize: '24px', marginBottom: '8px' }} />
          <div>Register to view details</div>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Back Button */}
        <Link to="/events">
          <Button icon={<ArrowLeftOutlined />} style={{ marginBottom: '24px' }}>
            Back to Events
          </Button>
        </Link>

        {/* Event Header */}
        <Card style={{ marginBottom: '24px' }}>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              {event.avatar ? (
                <img src={event.avatar} alt={event.title} style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '8px' }} />
              ) : (
                <div style={{ width: '100%', height: '300px', background: 'linear-gradient(45deg, #1890ff, #722ed1)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
                  <Text style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', textAlign: 'center' }}>
                    {event.title}
                  </Text>
                </div>
              )}
            </Col>
            <Col xs={24} md={16}>
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                    <Tag color={status.color}>{status.text}</Tag>
                    <Tag color="blue">{event.category}</Tag>
                    <Tag color={event.visibility === 'public' ? 'green' : 'orange'}>
                      {event.visibility}
                    </Tag>
                  </div>
                  
                  <Title level={1} style={{ marginBottom: '16px' }}>{event.title}</Title>
                  <Paragraph style={{ fontSize: '16px', marginBottom: '24px' }}>
                    {event.description}
                  </Paragraph>

                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CalendarOutlined style={{ color: '#1890ff' }} />
                        <div>
                          <Text strong>Date & Time</Text>
                          <br />
                          <Text>{eventDate.toLocaleDateString()} - {eventEndDate.toLocaleDateString()}</Text>
                        </div>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <EnvironmentOutlined style={{ color: '#1890ff' }} />
                        <div>
                          <Text strong>Location</Text>
                          <br />
                          <Text>
                            {event.hosting.format === 'virtual' ? 'Virtual Event' : 
                             event.hosting.format === 'hybrid' ? 'Hybrid Event' :
                             `${event.hosting.address.vanue}, ${event.hosting.address.city}`}
                          </Text>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginTop: '24px' }}>
                  <div>
                    <Text style={{ fontSize: '32px', fontWeight: 'bold', color: '#1890ff' }}>{price}</Text>
                  </div>
                  <Button 
                    type="primary" 
                    size="large"
                    onClick={handleRegister}
                    disabled={status.text === 'Cancelled' || isRegistered}
                    style={{ minWidth: '120px' }}
                  >
                    {isRegistered ? 'Registered' : status.text === 'Cancelled' ? 'Cancelled' : 'Register Now'}
                  </Button>
                  <Button 
                    icon={<ShareAltOutlined />} 
                    onClick={() => setShareModalVisible(true)}
                  >
                    Share
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Card>

        <Row gutter={[24, 24]}>
          {/* Event Details */}
          <Col xs={24} md={16}>
            {renderBlurredSection(
              <Card title="Event Details" style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <Text strong>Schedule Mode:</Text>
                    <br />
                    <Text>{event.schedule.mode}</Text>
                  </div>
                  
                  <div>
                    <Text strong>Registration Period:</Text>
                    <br />
                    <Text>
                      {new Date(event.schedule.registration_start_time).toLocaleDateString()} - {new Date(event.schedule.registration_end_time).toLocaleDateString()}
                    </Text>
                  </div>

                  <div>
                    <Text strong>Capacity:</Text>
                    <br />
                    <Text>{event.ticketing.capacity} attendees</Text>
                  </div>

                  {event.hosting.address.instruction && (
                    <div>
                      <Text strong>Instructions:</Text>
                      <br />
                      <Text>{event.hosting.address.instruction}</Text>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {renderBlurredSection(
              <Card title="Cancellation Policy" style={{ marginBottom: '24px' }}>
                <div>
                  <Text strong>Refund Policy:</Text>
                  <br />
                  <Text>{event.cancellation_policy.allowed ? 'Refunds available' : 'No refunds'}</Text>
                  {event.cancellation_policy.refund_percentage && (
                    <>
                      <br />
                      <Text>Refund: {event.cancellation_policy.refund_percentage}%</Text>
                    </>
                  )}
                </div>
              </Card>
            )}

            {event.terms_and_conditions.length > 0 && renderBlurredSection(
              <Card title="Terms & Conditions">
                <ul>
                  {event.terms_and_conditions.map((term, index) => (
                    <li key={index}>{term}</li>
                  ))}
                </ul>
              </Card>
            )}
          </Col>

          {/* Sidebar */}
          <Col xs={24} md={8}>
            <Card title="Event Tags" style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {event.tags.map((tag: string) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
            </Card>

            {event.sponsors && event.sponsors.length > 0 && (
              <Card title="Sponsors" style={{ marginBottom: '24px' }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  {event.sponsors.map((sponsor: any, index: number) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Avatar src={sponsor.image} size="large">
                        {sponsor.name.charAt(0)}
                      </Avatar>
                      <Text strong>{sponsor.name}</Text>
                    </div>
                  ))}
                </Space>
              </Card>
            )}

            {/* QR Code Section */}
            <Card title="Get Your Ticket">
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{
                  width: '150px',
                  height: '150px',
                  margin: '0 auto 16px',
                  background: 'linear-gradient(45deg, #f0f0f0, #d9d9d9)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px',
                  filter: 'blur(2px)',
                  position: 'relative'
                }}>
                  <QrcodeOutlined style={{ fontSize: '60px', color: '#666' }} />
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    whiteSpace: 'nowrap'
                  }}>
                    Register to unlock
                  </div>
                </div>
                <Text strong>Register and get your ticket</Text>
                <br />
                <Text type="secondary">Scan QR code for quick access</Text>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Share Modal */}
        <Modal
          title="Share Event"
          open={shareModalVisible}
          onCancel={() => setShareModalVisible(false)}
          footer={null}
        >
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', padding: '20px 0' }}>
            <Button 
              shape="circle"
              size="large"
              icon={<FacebookOutlined />}
              onClick={() => window.open(shareLinks.facebook, '_blank')}
              style={{ 
                backgroundColor: '#1877f2', 
                borderColor: '#1877f2', 
                color: 'white',
                width: '50px',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            />
            <Button 
              shape="circle"
              size="large"
              icon={<TwitterOutlined />}
              onClick={() => window.open(shareLinks.twitter, '_blank')}
              style={{ 
                backgroundColor: '#1da1f2', 
                borderColor: '#1da1f2', 
                color: 'white',
                width: '50px',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            />
            <Button 
              shape="circle"
              size="large"
              icon={<LinkedinOutlined />}
              onClick={() => window.open(shareLinks.linkedin, '_blank')}
              style={{ 
                backgroundColor: '#0077b5', 
                borderColor: '#0077b5', 
                color: 'white',
                width: '50px',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            />
            <Button 
              shape="circle"
              size="large"
              icon={<InstagramOutlined />}
              onClick={() => window.open(shareLinks.instagram, '_blank')}
              style={{ 
                backgroundColor: '#e4405f', 
                borderColor: '#e4405f', 
                color: 'white',
                width: '50px',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            />
            <Button 
              shape="circle"
              size="large"
              icon={<LinkOutlined />}
              onClick={copyLink}
              style={{
                width: '50px',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            />
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default EventDetails;