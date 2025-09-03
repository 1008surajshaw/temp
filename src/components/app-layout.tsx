import { Outlet } from 'react-router'
import { AppHeader } from './app-header'

export function AppLayout() {
    return (
        <div className=" flex flex-col w-full ~bg-muted/50">
            <AppHeader />
            <div className="w-full max-w-full mx-auto  flex flex-grow flex-col">
                <div className='flex flex-grow flex-col'>
                    <Outlet />
                </div>
               
            </div>
        </div>
    )
}