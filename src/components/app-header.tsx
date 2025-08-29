import { ModeToggle } from './mode-toggle'

export function AppHeader() {

    return (
        <header className="bg-background sticky top-0 z-50 border-b">
            <div className="w-full ~max-w-7xl mx-auto flex items-center gap-2 h-14 px-4 md:px-8 justify-between">
                {/* <div className=''>
                    <Link to="/">
                        <AppLogo />
                    </Link>
                </div> */}

                <div className=''>
                    <ModeToggle/>
                </div>
            </div>
        </header >
    )
}