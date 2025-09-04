import { ReactNode } from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-800">Owner Dashboard</h1>
        </header>
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}