import { BrowserRouter as AppRouter  } from 'react-router'
import { ThemeProvider } from './contexts/ThemeContext'
import Router from './Router'


export default function App() {
    return (
        <ThemeProvider>
            <AppRouter>
                <Router />
            </AppRouter>
        </ThemeProvider>
    )
}
