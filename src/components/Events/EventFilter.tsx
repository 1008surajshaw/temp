import useSetQueryParams from "@/hooks/useSetQueryParams";
import { EVENT_FORMAT, EVENT_STATUS, EVENT_TYPE, EventQueryType } from "@/types"
import { Typography, Collapse, Checkbox } from 'antd';
import { useEffect, useState } from 'react';

const { Title } = Typography
const { Panel } = Collapse;

const EventFilter = ({ searchParams }: { searchParams?: EventQueryType }) => {
  const categories = ['Technology', 'Health & Wellness', 'Entrepreneurship', 'Art & Design', 'Entertainment'];
  const setQueryParams = useSetQueryParams();

  const [filters, setFilters] = useState({
    category: searchParams?.category || [],
    format: searchParams?.format || [],
    type: searchParams?.type || [],
    status: searchParams?.status || [],
    page: searchParams?.page || 1,
    limit: searchParams?.limit || 4
  });

  // Sync local state with URL params when they change
  useEffect(() => {
    setFilters({
      category: searchParams?.category || [],
      format: searchParams?.format || [],
      type: searchParams?.type || [],
      status: searchParams?.status || [],
      page: searchParams?.page || 1,
      limit: searchParams?.limit || 4
    });
  }, [searchParams]);

  const updateCategory = (value: string, checked: boolean) => {
    const newCategories = checked 
      ? [...filters.category, value]
      : filters.category.filter(item => item !== value);
    
    const newFilters = { ...filters, category: newCategories, page: 1 };
    setFilters(newFilters);
    setQueryParams(newFilters);
  };

  const updateFormat = (value: EVENT_FORMAT, checked: boolean) => {
    const newFormats = checked 
      ? [...filters.format, value]
      : filters.format.filter(item => item !== value);
    
    const newFilters = { ...filters, format: newFormats, page: 1 };
    setFilters(newFilters);
    setQueryParams(newFilters);
  };

  const updateType = (value: EVENT_TYPE, checked: boolean) => {
    const newTypes = checked 
      ? [...filters.type, value]
      : filters.type.filter(item => item !== value);
    
    const newFilters = { ...filters, type: newTypes, page: 1 };
    setFilters(newFilters);
    setQueryParams(newFilters);
  };

  const updateStatus = (value: EVENT_STATUS, checked: boolean) => {
    const newStatuses = checked 
      ? [...filters.status, value]
      : filters.status.filter(item => item !== value);
    
    const newFilters = { ...filters, status: newStatuses, page: 1 };
    setFilters(newFilters);
    setQueryParams(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      category: [],
      format: [],
      type: [],
      status: [],
      page: 1,
      limit: 4
    };
    setFilters(clearedFilters);
    setQueryParams(clearedFilters);
  };

  return (
    <aside 
      className="rounded-lg bg-white min-w-[290px] p-6"
      style={{ 
        position: 'sticky',
        top: '24px',
        height: 'fit-content',
        maxHeight: 'calc(100vh - 48px)',
        overflowY: 'auto'
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-xl">All Filters</h3>
        <button onClick={clearFilters} className="text-blue-500 text-sm">
          Clear All
        </button>
      </div>
      
      <div>
        <Collapse defaultActiveKey={['category', 'format', 'type', 'status']} ghost>
          
          <Panel header="Category" key="category">
            {categories.map((item, index) => (
              <div key={index} className="mb-2">
                <Checkbox
                  checked={filters.category.includes(item)}
                  onChange={(e) => updateCategory(item, e.target.checked)}
                >
                  {item}
                </Checkbox>
              </div>
            ))}
          </Panel>

          <Panel header="Format" key="format">
            {Object.values(EVENT_FORMAT).map((item, index) => (
              <div key={index} className="mb-2">
                <Checkbox
                  checked={filters.format.includes(item)}
                  onChange={(e) => updateFormat(item, e.target.checked)}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </Checkbox>
              </div>
            ))}
          </Panel>
          
          <Panel header="Type" key="type">
            {Object.values(EVENT_TYPE).map((item, index) => (
              <div key={index} className="mb-2">
                <Checkbox
                  checked={filters.type.includes(item)}
                  onChange={(e) => updateType(item, e.target.checked)}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </Checkbox>
              </div>
            ))}
          </Panel>

          <Panel header="Status" key="status">
            {Object.values(EVENT_STATUS).map((item, index) => (
              <div key={index} className="mb-2">
                <Checkbox
                  checked={filters.status.includes(item)}
                  onChange={(e) => updateStatus(item, e.target.checked)}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </Checkbox>
              </div>
            ))}
          </Panel>

        </Collapse>
      </div>
    </aside>
  )
}

export default EventFilter