'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { AuthProvider } from '../../contexts/AuthContext';

export default function AdminLayout({ children }) {
    return (
        <AuthProvider>
            <ProtectedContent>{children}</ProtectedContent>
        </AuthProvider>
    );
}

function ProtectedContent({ children }) {
    const { currentUser } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Redirect from /admin root to the appropriate page
        if (pathname === '/admin') {
            if (currentUser) {
                router.push('/admin/dashboard');
            } else {
                router.push('/admin/login');
            }
            return;
        }

        // Allow access to login page even when not authenticated
        if (!currentUser && pathname !== '/admin/login') {
            router.push('/admin/login');
        }
    }, [currentUser, router, pathname]);

    // If user is on login page and already authenticated, redirect to dashboard
    useEffect(() => {
        if (currentUser && pathname === '/admin/login') {
            router.push('/admin/dashboard');
        }
    }, [currentUser, router, pathname]);

    // Only render children if on login page or authenticated
    if (pathname === '/admin/login' || currentUser || pathname === '/admin') {
        return <>{children}</>;
    }

    // Show loading state while checking auth
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <p className="text-gray-500">Loading...</p>
            </div>
        </div>
    );
}