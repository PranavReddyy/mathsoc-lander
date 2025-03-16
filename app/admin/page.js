'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminRedirectPage() {
    const { currentUser } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Redirect based on auth state
        if (currentUser) {
            router.push('/admin/dashboard');
        } else {
            router.push('/admin/login');
        }
    }, [currentUser, router]);

    // Show a loading screen while redirecting
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <p className="text-gray-500">Redirecting...</p>
            </div>
        </div>
    );
}