
import type { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    ShoppingBag,
    Truck,
    Store,
    LogOut,
    Menu,
    X,
    Package
} from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';

interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
    const { signOut, user } = useAuth();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Navigation Items
    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Ciclos de Compra', path: '/cycles', icon: ShoppingBag },
        { name: 'Meus Fornecedores', path: '/suppliers', icon: Truck },
        { name: 'Minhas Lojas', path: '/stores', icon: Store },
        { name: 'Produtos', path: '/products', icon: Package },
    ];

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={clsx(
                "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-800 border-r border-gray-700 transition-transform duration-200 ease-in-out lg:translate-x-0",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="h-full flex flex-col">
                    {/* Logo */}
                    <div className="h-16 flex items-center px-6 border-b border-gray-700">
                        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            AGE26
                        </h1>
                        <button
                            className="ml-auto lg:hidden text-gray-400"
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* User Info */}
                    <div className="p-4 border-b border-gray-700 bg-gray-800/50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold">
                                {user?.name?.[0] || 'U'}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-medium truncate">{user?.name}</p>
                                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={clsx(
                                        "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                                        isActive
                                            ? "bg-blue-600/20 text-blue-400 border border-blue-600/20"
                                            : "text-gray-400 hover:bg-gray-700 hover:text-white"
                                    )}
                                >
                                    <Icon size={20} />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logout */}
                    <div className="p-4 border-t border-gray-700">
                        <button
                            onClick={signOut}
                            className="flex items-center gap-3 w-full px-3 py-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                            <LogOut size={20} />
                            <span className="font-medium">Sair</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile Header */}
                <header className="h-16 lg:hidden flex items-center px-4 bg-gray-800 border-b border-gray-700">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="text-gray-400 hover:text-white"
                    >
                        <Menu size={24} />
                    </button>
                    <span className="ml-4 font-bold text-lg">AGE26</span>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
