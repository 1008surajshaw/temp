import { Link } from 'react-router-dom'
import { Button } from 'antd'
import { DashboardOutlined, CalendarOutlined, PlusOutlined } from '@ant-design/icons'

export function AppHeader() {

    return (
        <header className="bg-background sticky top-0 z-50 border-b">
            <div className="w-full ~max-w-7xl mx-auto flex items-center gap-2 h-14 px-4 md:px-8 justify-between">
                <div className='flex items-center gap-4'>
                    <Link to="/">
                        <Button icon={<PlusOutlined />}>Create Event</Button>
                    </Link>
                    <Link to="/events">
                        <Button icon={<CalendarOutlined />}>Events</Button>
                    </Link>
                    <Link to="/host-dashboard">
                        <Button icon={<DashboardOutlined />}>Dashboard</Button>
                    </Link>
                </div>

               
            </div>
        </header >
    )
}