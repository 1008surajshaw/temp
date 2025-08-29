import { useState, useEffect } from 'react';
import { Typography, Skeleton, Card, Row, Col, Empty, Button, Pagination } from 'antd'; 
import { AppstoreOutlined, BarsOutlined } from '@ant-design/icons';
import EventGridCard from './EventGridCard';
import EventListRow from './EventListRow';
import { getAllEvents } from '../../actions/EventAction';
import useSetQueryParams from '@/hooks/useSetQueryParams';

const { Text } = Typography;

interface Event {
  id: number;
  title: string;
  slug: string;
  [key: string]: any;
}

const EventsList = ({ searchParams }: { searchParams: any }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGridView, setIsGridView] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const setQueryParams = useSetQueryParams();

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const result = await getAllEvents(searchParams);
        setEvents(result.data || []);
        setTotal(result.total || 0);
        setTotalPages(result.totalPages || 0);
      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents([]);
        setTotal(0);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [searchParams]);

  const handlePageChange = (page: number) => {
    setQueryParams({
      ...searchParams,
      page
    });
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <Text type="secondary">
          {loading ? 'Loading events...' : `${total} events found, showing ${events.length}`}
        </Text>
        
        <Button.Group>
          <Button 
            icon={<AppstoreOutlined />} 
            type={isGridView ? 'primary' : 'default'}
            onClick={() => setIsGridView(true)}
          />
          <Button 
            icon={<BarsOutlined />} 
            type={!isGridView ? 'primary' : 'default'}
            onClick={() => setIsGridView(false)}
          />
        </Button.Group>
      </div>

      {/* Events Display */}
      {loading ? (
        <Row gutter={[16, 16]}>
          {Array.from({ length: 4 }).map((_, index) => (
            <Col xs={24} sm={12} lg={8} key={index}>
              <Card style={{ height: '450px' }}>
                <Skeleton.Image style={{ width: '100%', height: '180px', marginBottom: '16px' }} active />
                <Skeleton active paragraph={{ rows: 3 }} />
              </Card>
            </Col>
          ))}
        </Row>
      ) : events.length === 0 ? (
        <Empty description="No events found" />
      ) : isGridView ? (
        <>
          <Row gutter={[16, 16]}>
            {events.map(event => (
              <Col xs={24} sm={12} lg={8} key={event.id || event.slug}>
                <EventGridCard event={event} />
              </Col>
            ))}
          </Row>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
              <Pagination
                current={searchParams.page || 1}
                total={total}
                pageSize={searchParams.limit || 4}
                onChange={handlePageChange}
                showSizeChanger={false}
                showQuickJumper={false}
                showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} events`}
              />
            </div>
          )}
        </>
      ) : (
        <>
          <div>
            {events.map(event => (
              <div key={event.id || event.slug}>
                <EventListRow event={event} />
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
              <Pagination
                current={searchParams.page || 1}
                total={total}
                pageSize={searchParams.limit || 4}
                onChange={handlePageChange}
                showSizeChanger={false}
                showQuickJumper={false}
                showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} events`}
              />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default EventsList;