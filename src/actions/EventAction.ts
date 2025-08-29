import eventdata from "../seed/event.json"

export const getAllEvents = async (filters = {}) => {
  try {
    
    const {
      //@ts-ignore
      search = '',
      //@ts-ignore
      category = [],
      //@ts-ignore
      format = [],
      //@ts-ignore
      type = [],
      //@ts-ignore
      status = [],
      //@ts-ignore
      sortby = 'date_desc',
      //@ts-ignore
      page = 1,
      //@ts-ignore
      limit = 4
    } = filters

    let filteredEvents = [...eventdata]

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase()
      filteredEvents = filteredEvents.filter(event =>
        event.title.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower) ||
        event.category.toLowerCase().includes(searchLower) ||
        event.hosting.address.city.toLowerCase().includes(searchLower) ||
        event.tags.some(tag => tag.toLowerCase().includes(searchLower))
      )
    }

    // Category filter (multiple)
    if (category.length > 0) {
      filteredEvents = filteredEvents.filter(event =>
        category.includes(event.category)
      )
    }

    // Format filter (multiple)
    if (format.length > 0) {
      filteredEvents = filteredEvents.filter(event =>
        format.includes(event.hosting.format)
      )
    }

    // Type filter (free/paid)
    if (type.length > 0) {
      filteredEvents = filteredEvents.filter(event => {
        if (type.includes('free')) return !event.ticketing.enabled
        if (type.includes('paid')) return event.ticketing.enabled
        return true
      })
    }

    // Status filter (multiple)
    if (status.length > 0) {
      const now = new Date()
      filteredEvents = filteredEvents.filter(event => {
        const eventStart = new Date(event.schedule.start_time)
        const eventEnd = new Date(event.schedule.end_time)
        
        if (status.includes('upcoming') && eventStart > now) return true
        if (status.includes('completed') && eventEnd < now) return true
        if (status.includes('published') && event.status === 'published') return true
        if (status.includes('draft') && event.status === 'draft') return true
        if (status.includes('cancelled') && event.status === 'cancelled') return true
        
        return false
      })
    }

    // Sort events
    filteredEvents.sort((a, b) => {
      const dateA = new Date(a.createdat || a.schedule.start_time)
      const dateB = new Date(b.createdat || b.schedule.start_time)
      
      return sortby === 'date_desc' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime()
    })

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedEvents = filteredEvents.slice(startIndex, endIndex)

    return {
      data: paginatedEvents,
      total: filteredEvents.length,
      page,
      limit,
      totalPages: Math.ceil(filteredEvents.length / limit)
    }
  } catch (error) {
    console.error('Error fetching events:', error)
    return { data: [], total: 0, page: 1, limit: 4, totalPages: 0 }
  }
}

export const getEventFilters = async () => {
  try {
    const categories = [...new Set(eventdata.map(event => event.category))]
    const formats = ['physical', 'virtual', 'hybrid']
    const statuses = ['upcoming', 'completed', 'published', 'draft', 'cancelled']
    
    return {
      categories,
      formats,
      statuses
    }
  } catch (error) {
    console.error('Error fetching filters:', error)
    return { categories: [], formats: [], statuses: [] }
  }
}