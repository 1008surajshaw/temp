import { Card, Typography, Tag, Button } from 'antd';
import { CalendarOutlined, EnvironmentOutlined, UserOutlined, DollarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const EventListRow = ({ event }: { event: any }) => {
  const navigate = useNavigate();
  const eventDate = new Date(event.schedule.start_time);
  const ticketsRemaining = Math.max(0, event.ticketing.capacity - Math.floor(Math.random() * event.ticketing.capacity * 0.8));
  const price = event.ticketing.enabled ? `$${Math.floor(Math.random() * 100) + 20}` : 'Free';
  
  const getEventStatus = () => {
    const now = new Date();
    const eventStart = new Date(event.schedule.start_time);
    const eventEnd = new Date(event.schedule.end_time);
    
    if (event.status === 'cancelled') return { text: 'Cancelled', color: 'red' };
    if (event.status === 'draft') return { text: 'Draft', color: 'orange' };
    if (eventEnd < now) return { text: 'Completed', color: 'default' };
    if (eventStart > now) return { text: 'Upcoming', color: 'green' };
    return { text: 'Live', color: 'blue' };
  };

  const status = getEventStatus();

  const handleCardClick = () => {
    navigate(`/event/${event.id}`);
  };

  const handleRegisterClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/event/${event.id}`);
  };

  return (
    <Card 
      style={{ width: '100%', marginBottom: '16px', cursor: 'pointer' }} 
      hoverable
      onClick={handleCardClick}
    >
      <div style={{ display: 'flex', gap: '16px' }}>
        <div style={{ flexShrink: 0 }}>
          {event.avatar ? (
            <img alt={event.title} src={event.avatar} style={{ width: '120px', height: '90px', objectFit: 'cover', borderRadius: '8px' }} />
          ) : (
            <div style={{ width: '120px', height: '90px', background: 'linear-gradient(45deg, #1890ff, #722ed1)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
              <Text style={{ color: 'white', fontSize: '12px', fontWeight: 'bold', textAlign: 'center', padding: '8px' }}>
                {event.title.slice(0, 15)}
              </Text>
            </div>
          )}
        </div>
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <Title level={4} style={{ marginBottom: '8px' }}>{event.title}</Title>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <Tag color={status.color}>{status.text}</Tag>
              <Tag color="blue">{event.category}</Tag>
              <Tag color={event.visibility === 'public' ? 'green' : 'orange'}>
                {event.visibility}
              </Tag>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CalendarOutlined style={{ color: '#1890ff' }} />
              <Text style={{ fontSize: '15px' }}>{eventDate.toLocaleDateString()}</Text>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <EnvironmentOutlined style={{ color: '#1890ff' }} />
              <Text style={{ fontSize: '15px' }}>
                {event.hosting.format === 'virtual' ? 'Virtual' : 
                 event.hosting.format === 'hybrid' ? 'Hybrid' :
                 `${event.hosting.address.city}, ${event.hosting.address.country}`}
              </Text>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserOutlined style={{ color: '#1890ff' }} />
              <Text style={{ fontSize: '15px' }}>{ticketsRemaining > 0 ? `${ticketsRemaining} spots left` : 'Fully booked'}</Text>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <DollarOutlined style={{ color: '#1890ff' }} />
              <Text style={{ fontSize: '16px', fontWeight: 'bold' }}>{price}</Text>
            </div>
          </div>

          {event.tags && event.tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {event.tags.slice(0, 5).map((tag: string) => (
                <Tag key={tag} >{tag}</Tag>
              ))}
              {event.tags.length > 5 && (
                <Tag >+{event.tags.length - 5}</Tag>
              )}
            </div>
          )}
        </div>

        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <Text style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>{price}</Text>
          <Button 
            type="primary" 
            size="large"
            style={{ fontWeight: 'bold', fontSize: '16px' }}
            disabled={status.text === 'Cancelled' || ticketsRemaining === 0}
            onClick={handleRegisterClick}
          >
            {status.text === 'Cancelled' ? 'Cancelled' : 
             ticketsRemaining === 0 ? 'Sold Out' : 
             'Register'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default EventListRow;