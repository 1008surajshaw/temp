export enum EVENT_FORMAT {
    VIRTUAL = "virtual",
    PHYSICAL = "physical",
    HYBRID = "hybrid",
  }
  
  export enum SCHEDULE_MODE {
    SINGLE = "single",
    MULTI = "multi_day",
    RECURRING = "recurring",
  }
  
  export enum DETAIL_VIEW_MODE {
    BEFORE = "before_registration",
    AFTER = "after_registration",
    CUSTOM = "custom",
  }
  
  export enum RECURRENCE_PATTERN {
    DAILY = "daily",
    WEEKLY = "weekly",
    MONTHLY = "monthly",
  }
  
  export enum EVENT_TYPE {
    FREE = "free",
    PAID = "paid",
    TIERED = "tiered",
  }
  
  export enum REFUND_STRATEGY {
    FULL = "full_refund",
    PARTIAL = "partial_refund",
    TIERED = "tiered_refund",
    NONE = "no_refund",
  }
  
  export enum EVENT_STATUS {
    DRAFT = "draft",
    PUBLISHED = "published",
    CANCELLED = "cancelled",
    COMPLETED = "completed",
    ARCHIVED = "archived",
  }
  
  export enum EVENT_VISIBILITY {
    PUBLIC = "public",
    PRIVATE = "private",
  }
  
  // ---------------------- TYPES ----------------------
  export type Address = {
    street: string
    city: string
    state: string
    postal_code: string
    country: string
  }
  
  export type EventsDto = {
    title: string
    description: string
    slug: string
    avatar: string
    category: string
    images: string[]
    tags: string[]
    status: EVENT_STATUS
    billing_info?: Address
  
    creator: string 
    host: string
    property: string
  
    schedule: {
      mode: SCHEDULE_MODE
      start_time: Date
      end_time: Date
      registration_start_time: Date
      registration_end_time: Date
      timezone: string
      recurrence: {
        pattern: RECURRENCE_PATTERN
        interval: number
        endDate?: Date
        current_occurences: number
        max_occurences: number
      }
    }
  
    visibility: EVENT_VISIBILITY
    ticketing: {
      enabled: boolean
      capacity: number
    }
  
    hosting: {
      format: EVENT_FORMAT
      address: Address & {
        vanue: string
        maps_link: string
        nearby_landmark?: string
        instruction?: string
        coordinates?: {
          lat: number
          lng: number
        }
      }
      virtual_links: Record<string, string>
    }
  
    access_control: {
      require_rsvp: boolean
      view_details: DETAIL_VIEW_MODE
      hideUntil?: Date
    }

  
    cancellation_policy: {
      allowed: boolean
      refund_strategy: REFUND_STRATEGY
      refund_percentage?: number
      tiered_refunds: {
        before_date: Date
        percentage: number
      }[]
    }
  
    terms_and_conditions: string[]
    sponsors?: {
      name: string
      image?: string
    }[]
  }
  
  export type EventQueryType = {
    category?: string[];
    format?: EVENT_FORMAT[];
    type?: EVENT_TYPE[];
    status?: EVENT_STATUS[];
    search?: string;
    sortby?: 'date_asc' | 'date_desc';
    limit?: number;
    page?: number;
  };