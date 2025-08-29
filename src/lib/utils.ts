import { EventsDto } from "@/types"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getEventStatus = (event:EventsDto) => {
  const now = new Date()
  const eventStart = new Date(event.schedule.start_time)
  const eventEnd = new Date(event.schedule.end_time)
  
  if (event.status === 'cancelled') return { text: 'Cancelled', color: 'red' }
  if (event.status === 'draft') return { text: 'Draft', color: 'orange' }
  if (eventEnd < now) return { text: 'Completed', color: 'default' }
  if (eventStart > now) return { text: 'Upcoming', color: 'green' }
  return { text: 'Live', color: 'blue' }
}
