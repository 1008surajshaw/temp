import { Routes, Route } from 'react-router-dom'
import { AppLayout } from './components/app-layout'
import NotMatch from './pages/NotMatch'
import Creation from './pages/Creation'
import Events from './pages/Events'
import EventDetails from './pages/EventDetails'
import HostDashboard from './pages/HostDashboard'

export default function Router() {
    return (
        <Routes>
            <Route element={<AppLayout />}>
                <Route path="" element={<Creation/>}/>
                <Route path='/events' element={<Events/>}/>
                <Route path='/event/:eventId' element={<EventDetails/>}/>
                <Route path='/host-dashboard' element={<HostDashboard/>}/>
                <Route path="*" element={<NotMatch />} />
            </Route>
        </Routes>
    )
}