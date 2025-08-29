import { useState, useEffect } from 'react';
import { Layout, Menu, Card, Row, Col, Statistic, Table, Button, Tag, Space, Modal, message, Avatar, Typography, Select, Input, Tabs, Progress, Tooltip, Badge } from 'antd';
import { DashboardOutlined, CalendarOutlined, UserOutlined, SettingOutlined, PlusOutlined, EditOutlined, EyeOutlined, CheckOutlined, CloseOutlined, SearchOutlined, TeamOutlined, TrophyOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import eventdata from '../seed/event.json';
import usersdata from '../seed/users.json';
import rsvpdata from '../seed/rsvp-data.json';

const { Sider, Content } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

// Mock current user - in real app this would come from auth context
const CURRENT_USER_ID = 'usr_016';

interface RSVPData {
  id: string;
  eventId: number;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  status: 'pending' | 'approved' | 'rejected';
  registeredAt: string;
}

const HostDashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState('overview');
  const [userEvents, setUserEvents] = useState<any[]>([]);
  const [rsvpData, setRsvpData] = useState<RSVPData[]>([]);
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [selectedEventForInvite, setSelectedEventForInvite] = useState<any>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    // Filter events where current user is creator or host
    const filteredEvents = eventdata.filter(event => 
      event.creator === CURRENT_USER_ID || event.host === CURRENT_USER_ID
    );
    setUserEvents(filteredEvents);

    // Use mock RSVP data from JSON file
    setRsvpData(rsvpdata as RSVPData[]);
  }, []);

  const getEventStats = () => {
    const total = userEvents.length;
    const published = userEvents.filter(e => e.status === 'published').length;
    const draft = userEvents.filter(e => e.status === 'draft').length;
    const cancelled = userEvents.filter(e => e.status === 'cancelled').length;
    const completed = userEvents.filter(e => e.status === 'completed').length;
    
    return { total, published, draft, cancelled, completed };
  };

  const getRSVPStats = () => {
    const total = rsvpData.length;
    const pending = rsvpData.filter(r => r.status === 'pending').length;
    const approved = rsvpData.filter(r => r.status === 'approved').length;
    const rejected = rsvpData.filter(r => r.status === 'rejected').length;
    
    return { total, pending, approved, rejected };
  };

  const handleRSVPAction = (rsvpId: string, action: 'approve' | 'reject') => {
    setRsvpData(prev => prev.map(rsvp => 
      rsvp.id === rsvpId 
        ? { ...rsvp, status: action === 'approve' ? 'approved' : 'rejected' }
        : rsvp
    ));
    message.success(`RSVP ${action}d successfully`);
  };

  const handleInvite = () => {
    if (!inviteEmail || !selectedEventForInvite) return;
    
    message.success(`Invitation sent to ${inviteEmail} for ${selectedEventForInvite.title}`);
    setInviteEmail('');
    setInviteModalVisible(false);
    setSelectedEventForInvite(null);
  };

  const getFilteredAndSortedEvents = () => {
    let filtered = userEvents;
    
    if (statusFilter !== 'all') {
      filtered = userEvents.filter(event => event.status === statusFilter);
    }
    
    return filtered.sort((a, b) => {
      const dateA = new Date(a.createdat).getTime();
      const dateB = new Date(b.createdat).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
  };

  const eventColumns = [
    {
      title: 'Event',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {record.avatar ? (
            <Avatar src={record.avatar} size="large" />
          ) : (
            <Avatar size="large" style={{ backgroundColor: '#1890ff' }}>
              {text.charAt(0)}
            </Avatar>
          )}
          <div>
            <Text strong>{text}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>{record.category}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: '11px' }}>
              {record.hosting.format === 'virtual' ? '🌐 Virtual' : 
               record.hosting.format === 'hybrid' ? '🔄 Hybrid' : '📍 Physical'}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors = {
          published: 'green',
          draft: 'orange',
          cancelled: 'red',
          completed: 'blue'
        };
        return <Tag color={colors[status as keyof typeof colors]}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Date & Time',
      dataIndex: 'schedule',
      key: 'date',
      render: (schedule: any) => (
        <div>
          <Text>{new Date(schedule.start_time).toLocaleDateString()}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {new Date(schedule.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </div>
      ),
    },
    {
      title: 'Attendance',
      key: 'attendance',
      render: (record: any) => {
        const eventRSVPs = rsvpData.filter(r => r.eventId === record.id);
        const approved = eventRSVPs.filter(r => r.status === 'approved').length;
        const capacity = record.ticketing.capacity || 100;
        const percentage = capacity > 0 ? (approved / capacity) * 100 : 0;
        
        return (
          <div style={{ minWidth: '120px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <Text style={{ fontSize: '12px' }}>{approved}/{capacity}</Text>
              <Text style={{ fontSize: '12px' }}>{Math.round(percentage)}%</Text>
            </div>
            <Progress percent={percentage} size="small" showInfo={false} />
          </div>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: any) => (
        <Space>
          <Tooltip title="View Event">
            <Link to={`/event/${record.id}`}>
              <Button icon={<EyeOutlined />} size="small" />
            </Link>
          </Tooltip>
          <Tooltip title="Edit Event">
            <Button icon={<EditOutlined />} size="small" />
          </Tooltip>
          <Tooltip title="Invite People">
            <Button 
              icon={<UserOutlined />} 
              size="small"
              onClick={() => {
                setSelectedEventForInvite(record);
                setInviteModalVisible(true);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const rsvpColumns = [
    {
      title: 'User',
      key: 'user',
      render: (record: RSVPData) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Avatar src={record.userAvatar} size="small">
            {record.userName.charAt(0)}
          </Avatar>
          <div>
            <Text strong>{record.userName}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>{record.userEmail}</Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Event',
      key: 'event',
      render: (record: RSVPData) => {
        const event = userEvents.find(e => e.id === record.eventId);
        return event ? event.title : 'Unknown Event';
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors = {
          pending: 'orange',
          approved: 'green',
          rejected: 'red'
        };
        return <Tag color={colors[status as keyof typeof colors]}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Registered',
      dataIndex: 'registeredAt',
      key: 'registeredAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: RSVPData) => (
        record.status === 'pending' ? (
          <Space>
            <Button 
              icon={<CheckOutlined />} 
              size="small" 
              type="primary"
              onClick={() => handleRSVPAction(record.id, 'approve')}
            >
              Approve
            </Button>
            <Button 
              icon={<CloseOutlined />} 
              size="small" 
              danger
              onClick={() => handleRSVPAction(record.id, 'reject')}
            >
              Reject
            </Button>
          </Space>
        ) : null
      ),
    },
  ];

  const renderOverview = () => {
    const eventStats = getEventStats();
    const rsvpStats = getRSVPStats();
    const totalAttendees = rsvpData.filter(r => r.status === 'approved').length;
    const upcomingEvents = userEvents.filter(e => new Date(e.schedule.start_time) > new Date()).length;

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <Title level={2} style={{ margin: 0 }}>Dashboard Overview</Title>
          <Text type="secondary">Welcome back! Here's what's happening with your events.</Text>
        </div>
        
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable>
              <Statistic 
                title="Total Events" 
                value={eventStats.total} 
                prefix={<CalendarOutlined style={{ color: '#1890ff' }} />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable>
              <Statistic 
                title="Published Events" 
                value={eventStats.published} 
                prefix={<TrophyOutlined style={{ color: '#52c41a' }} />}
                valueStyle={{ color: '#52c41a' }} 
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable>
              <Statistic 
                title="Total Attendees" 
                value={totalAttendees} 
                prefix={<TeamOutlined style={{ color: '#722ed1' }} />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable>
              <Statistic 
                title="Upcoming Events" 
                value={upcomingEvents} 
                prefix={<ClockCircleOutlined style={{ color: '#fa8c16' }} />}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic title="Draft Events" value={eventStats.draft} valueStyle={{ color: '#faad14' }} />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic title="Completed Events" value={eventStats.completed} valueStyle={{ color: '#1890ff' }} />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic title="Pending RSVPs" value={rsvpStats.pending} valueStyle={{ color: '#fa541c' }} />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card 
              title="Recent Events" 
              extra={<Link to="/events"><Button type="link">View All</Button></Link>}
              style={{ height: '400px' }}
            >
              <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                {userEvents.slice(0, 5).map(event => {
                  const eventRSVPs = rsvpData.filter(r => r.eventId === event.id && r.status === 'approved').length;
                  return (
                    <div key={event.id} style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                          <Text strong>{event.title}</Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {new Date(event.schedule.start_time).toLocaleDateString()} • {eventRSVPs} attendees
                          </Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: '11px' }}>
                            {event.hosting.format === 'virtual' ? '🌐 Virtual' : 
                             event.hosting.format === 'hybrid' ? '🔄 Hybrid' : '📍 Physical'}
                          </Text>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                          <Tag color={event.status === 'published' ? 'green' : event.status === 'draft' ? 'orange' : event.status === 'cancelled' ? 'red' : 'blue'}>
                            {event.status.toUpperCase()}
                          </Tag>
                          <Link to={`/event/${event.id}`}>
                            <Button size="small" type="link">View</Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </Col>
          
          <Col xs={24} lg={12}>
            <Card 
              title={(
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>Pending RSVPs</span>
                  <Badge count={rsvpStats.pending} style={{ backgroundColor: '#fa541c' }} />
                </div>
              )}
              style={{ height: '400px' }}
            >
              <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                {rsvpData.filter(r => r.status === 'pending').slice(0, 5).map(rsvp => (
                  <div key={rsvp.id} style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                        <Avatar src={rsvp.userAvatar} size="small">
                          {rsvp.userName.charAt(0)}
                        </Avatar>
                        <div>
                          <Text strong style={{ fontSize: '14px' }}>{rsvp.userName}</Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {userEvents.find(e => e.id === rsvp.eventId)?.title}
                          </Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: '11px' }}>
                            {new Date(rsvp.registeredAt).toLocaleDateString()}
                          </Text>
                        </div>
                      </div>
                      <Space>
                        <Tooltip title="Approve">
                          <Button 
                            size="small" 
                            type="primary"
                            icon={<CheckOutlined />}
                            onClick={() => handleRSVPAction(rsvp.id, 'approve')}
                          />
                        </Tooltip>
                        <Tooltip title="Reject">
                          <Button 
                            size="small" 
                            danger
                            icon={<CloseOutlined />}
                            onClick={() => handleRSVPAction(rsvp.id, 'reject')}
                          />
                        </Tooltip>
                      </Space>
                    </div>
                  </div>
                ))}
                {rsvpData.filter(r => r.status === 'pending').length === 0 && (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                    <UserOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                    <br />
                    <Text type="secondary">No pending RSVPs</Text>
                  </div>
                )}
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    );
  };

  const renderEvents = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <Title level={2}>My Events</Title>
        <Link to="/">
          <Button type="primary" icon={<PlusOutlined />}>Create Event</Button>
        </Link>
      </div>
      
      <div style={{ marginBottom: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          style={{ width: 120 }}
        >
          <Select.Option value="all">All Status</Select.Option>
          <Select.Option value="published">Published</Select.Option>
          <Select.Option value="draft">Draft</Select.Option>
          <Select.Option value="cancelled">Cancelled</Select.Option>
          <Select.Option value="completed">Completed</Select.Option>
        </Select>
        
        <Select
          value={sortOrder}
          onChange={setSortOrder}
          style={{ width: 120 }}
        >
          <Select.Option value="desc">Newest First</Select.Option>
          <Select.Option value="asc">Oldest First</Select.Option>
        </Select>
      </div>

      <Table
        columns={eventColumns}
        dataSource={getFilteredAndSortedEvents()}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );

  const renderRSVPs = () => (
    <div>
      <Title level={2}>RSVP Management</Title>
      <Table
        columns={rsvpColumns}
        dataSource={rsvpData}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );

  const renderContent = () => {
    switch (selectedMenu) {
      case 'overview':
        return renderOverview();
      case 'events':
        return renderEvents();
      case 'rsvps':
        return renderRSVPs();
      default:
        return renderOverview();
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Sider width={280} theme="light" style={{ borderRight: '1px solid #e8e8e8', boxShadow: '2px 0 8px rgba(0,0,0,0.1)' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e8e8e8', background: 'linear-gradient(135deg, #1890ff, #722ed1)' }}>
          <Title level={4} style={{ margin: 0, color: 'white' }}>🎯 Host Dashboard</Title>
          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>Manage your events</Text>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedMenu]}
          onClick={({ key }) => setSelectedMenu(key)}
          style={{ border: 'none', padding: '8px 0' }}
        >
          <Menu.Item key="overview" icon={<DashboardOutlined />} style={{ margin: '4px 8px', borderRadius: '8px' }}>
            Overview
          </Menu.Item>
          <Menu.Item key="events" icon={<CalendarOutlined />} style={{ margin: '4px 8px', borderRadius: '8px' }}>
            My Events ({userEvents.length})
          </Menu.Item>
          <Menu.Item key="rsvps" icon={<UserOutlined />} style={{ margin: '4px 8px', borderRadius: '8px' }}>
            RSVP Management
            {rsvpData.filter(r => r.status === 'pending').length > 0 && (
              <Badge count={rsvpData.filter(r => r.status === 'pending').length} size="small" style={{ marginLeft: '8px' }} />
            )}
          </Menu.Item>
        </Menu>
        
        <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px' }}>
          <Card size="small" style={{ textAlign: 'center' }}>
            <Text type="secondary" style={{ fontSize: '12px' }}>Quick Actions</Text>
            <br />
            <Space direction="vertical" style={{ width: '100%', marginTop: '8px' }}>
              <Link to="/" style={{ width: '100%' }}>
                <Button type="primary" icon={<PlusOutlined />} size="small" block>
                  Create Event
                </Button>
              </Link>
              <Link to="/events" style={{ width: '100%' }}>
                <Button icon={<CalendarOutlined />} size="small" block>
                  Browse Events
                </Button>
              </Link>
            </Space>
          </Card>
        </div>
      </Sider>
      
      <Layout>
        <Content style={{ padding: '32px', background: '#f5f5f5', minHeight: '100vh' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            {renderContent()}
          </div>
        </Content>
      </Layout>

      {/* Invite Modal */}
      <Modal
        title={(
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserOutlined style={{ color: '#1890ff' }} />
            <span>Invite to {selectedEventForInvite?.title}</span>
          </div>
        )}
        open={inviteModalVisible}
        onOk={handleInvite}
        onCancel={() => {
          setInviteModalVisible(false);
          setInviteEmail('');
          setSelectedEventForInvite(null);
        }}
        okText="Send Invite"
        okButtonProps={{ disabled: !inviteEmail }}
        width={500}
      >
        <div style={{ padding: '16px 0' }}>
          <div style={{ marginBottom: '16px' }}>
            <Text>Send invitation email to join this event:</Text>
          </div>
          <Input
            placeholder="Enter email address (e.g., user@example.com)"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            type="email"
            size="large"
            prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
          />
          {selectedEventForInvite && (
            <div style={{ marginTop: '16px', padding: '12px', background: '#f6f6f6', borderRadius: '6px' }}>
              <Text strong>Event Details:</Text>
              <br />
              <Text type="secondary">{selectedEventForInvite.description}</Text>
              <br />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                📅 {new Date(selectedEventForInvite.schedule.start_time).toLocaleDateString()}
              </Text>
            </div>
          )}
        </div>
      </Modal>
    </Layout>
  );
};

export default HostDashboard;