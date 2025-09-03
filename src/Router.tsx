import { Routes, Route } from 'react-router-dom'
import NotMatch from './pages/NotMatch'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Features from './pages/Features'
import Plans from './pages/Plans'
import DashboardLayout from './components/DashboardLayout'
import ProtectedRoute from './components/ProtectedRoute'

export default function Router() {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            <Route element={
                <ProtectedRoute>
                    <DashboardLayout />
                </ProtectedRoute>
            }>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/users" element={<Users />} />
                <Route path="/features" element={<Features />} />
                <Route path="/plans" element={<Plans />} />
            </Route>
            
            <Route path="*" element={<NotMatch />} />
        </Routes>
    )
}