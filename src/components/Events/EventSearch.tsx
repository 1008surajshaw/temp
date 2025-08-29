import useSetQueryParams from '@/hooks/useSetQueryParams';
import { EventQueryType } from '@/types'
import { Input, Select, Button } from 'antd';
import { AppstoreOutlined, BarsOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react'

const { Search } = Input;
const { Option } = Select;

const EventSearch = ({ searchParams }: { searchParams?: EventQueryType }) => {
  const setQueryParams = useSetQueryParams();
   
  const [filters, setFilters] = useState({
    search: searchParams?.search || '',
    sortby: searchParams?.sortby || 'date_desc',
    viewMode: 'grid',
    page: searchParams?.page || 1,
    limit: searchParams?.limit || 4
  });

  // Sync local state with URL params when they change
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      search: searchParams?.search || '',
      sortby: searchParams?.sortby || 'date_desc',
      page: searchParams?.page || 1,
      limit: searchParams?.limit || 4
    }));
  }, [searchParams]);

  const updateSearch = (value: string) => {
    const newFilters = { ...filters, search: value, page: 1 };
    setFilters(newFilters);
    setQueryParams({
      search: newFilters.search,
      sortby: newFilters.sortby,
      page: newFilters.page,
      limit: newFilters.limit
    });
  };

  const updateSort = (value: 'date_asc' | 'date_desc') => {
    const newFilters = { ...filters, sortby: value, page: 1 };
    setFilters(newFilters);
    setQueryParams({
      search: newFilters.search,
      sortby: newFilters.sortby,
      page: newFilters.page,
      limit: newFilters.limit
    });
  };

  const setViewMode = (mode: string) => {
    setFilters({ ...filters, viewMode: mode });
  };

  return (
    <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <div style={{ flex: 1, maxWidth: '400px' }}>
          <Search
            placeholder="Search events, cities, tags..."
            allowClear
            size="large"
            value={filters.search}
            onChange={(e) => updateSearch(e.target.value)}
          />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Select
            value={filters.sortby}
            onChange={updateSort}
            style={{ width: '120px' }}
          >
            <Option value="date_desc">Latest</Option>
            <Option value="date_asc">Oldest</Option>
          </Select>
          
          <Button.Group>
            <Button 
              icon={<AppstoreOutlined />} 
              type={filters.viewMode === 'grid' ? 'primary' : 'default'}
              onClick={() => setViewMode('grid')}
            />
            <Button 
              icon={<BarsOutlined />} 
              type={filters.viewMode === 'list' ? 'primary' : 'default'}
              onClick={() => setViewMode('list')}
            />
          </Button.Group>
        </div>
      </div>
    </div>
  )
}

export default EventSearch