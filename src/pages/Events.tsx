import { Typography } from "antd"
import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import EventFilter from "@/components/Events/EventFilter"
import EventsList from "@/components/Events/EventsList"
import EventSearch from "@/components/Events/EventSearch"
import { EventQueryType } from "@/types"

const { Title, Text } = Typography

const Events = () => {
  const [searchParams] = useSearchParams()
  
  // Convert URLSearchParams to EventQueryType
  const currentParams: EventQueryType = {
    search: searchParams.get('search') || '',
    category: searchParams.getAll('category'),
    format: searchParams.getAll('format') as any[],
    type: searchParams.getAll('type') as any[],
    status: searchParams.getAll('status') as any[],
    sortby: (searchParams.get('sortby') as any) || 'date_desc',
    page: parseInt(searchParams.get('page') || '1'),
    limit: parseInt(searchParams.get('limit') || '4')
  }
  
  useEffect(() => {
    console.log('Current search params:', currentParams)
  }, [searchParams])

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <Title level={1} style={{ marginBottom: '8px' }}>Explore Events</Title>
          <Text type="secondary" style={{ fontSize: '18px' }}>
            Discover amazing events happening around you
          </Text>
        </div>

        <div style={{ display: 'flex', gap: '24px' }}>
          {/* Left Sidebar - Filters */}
          <EventFilter searchParams={currentParams}/>

          {/* Main Content */}
          <div style={{ flex: 1 }}>
            <EventSearch searchParams={currentParams}/>
            <EventsList searchParams={currentParams}/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Events