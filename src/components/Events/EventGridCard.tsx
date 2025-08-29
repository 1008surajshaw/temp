import { Card, Typography, Tag, Button } from 'antd';
import { CalendarOutlined, EnvironmentOutlined, UserOutlined, DollarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const EventGridCard = ({ event }: { event: any }) => {
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
      hoverable
      onClick={handleCardClick}
      style={{ 
        height: '450px', 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden',
        cursor: 'pointer'
      }}
      bodyStyle={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        padding: '16px',
        overflow: 'hidden'
      }}
      cover={
        event.avatar ? (
          <img alt={event.title} src={event.avatar} style={{ height: '180px', objectFit: 'cover' }} />
        ) : (
          <div style={{ height: '180px', background: 'linear-gradient(45deg, #1890ff, #722ed1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: 'white', fontSize: '14px', fontWeight: 'bold', textAlign: 'center', padding: '0 12px', lineHeight: '1.2' }}>
              {event.title.length > 30 ? event.title.slice(0, 30) + '...' : event.title}
            </Text>
          </div>
        )
      }
      actions={[
        <Button 
          type="primary" 
          size="small"
          style={{ fontWeight: 'bold', fontSize: '14px' }}
          disabled={status.text === 'Cancelled' || ticketsRemaining === 0}
          key="register"
          onClick={handleRegisterClick}
        >
          {status.text === 'Cancelled' ? 'Cancelled' : 
           ticketsRemaining === 0 ? 'Sold Out' : 
           `Register ${price}`}
        </Button>
      ]}
    >
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', overflow: 'hidden' }}>
        <div>
          <Title level={5} style={{ 
            marginBottom: '6px', 
            lineHeight: '1.2',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {event.title}
          </Title>
          <div style={{ display: 'flex', gap: '4px', marginBottom: '6px', flexWrap: 'wrap' }}>
            <Tag color={status.color} >{status.text}</Tag>
            <Tag color="blue" >{event.category}</Tag>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CalendarOutlined style={{ color: '#1890ff', fontSize: '12px' }} />
            <Text style={{ fontSize: '12px' }}>{eventDate.toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric'
            })}</Text>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <EnvironmentOutlined style={{ color: '#1890ff', fontSize: '12px' }} />
            <Text style={{ fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {event.hosting.format === 'virtual' ? 'Virtual' : 
               event.hosting.format === 'hybrid' ? 'Hybrid' :
               `${event.hosting.address.city}`}
            </Text>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <UserOutlined style={{ color: '#1890ff', fontSize: '12px' }} />
            <Text style={{ fontSize: '12px' }}>
              {ticketsRemaining > 0 ? `${ticketsRemaining} spots` : 'Sold out'}
            </Text>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <DollarOutlined style={{ color: '#1890ff', fontSize: '12px' }} />
            <Text style={{ fontSize: '16px', fontWeight: 'bold', color: '#1890ff' }}>{price}</Text>
          </div>
        </div>

        {event.tags && event.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px', marginTop: 'auto' }}>
            {event.tags.slice(0, 2).map((tag: string) => (
              <Tag key={tag}  style={{ fontSize: '10px', margin: '1px' }}>{tag}</Tag>
            ))}
            {event.tags.length > 2 && (
              <Tag  style={{ fontSize: '10px', margin: '1px' }}>+{event.tags.length - 2}</Tag>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default EventGridCard;