/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: [
            'firebasestorage.googleapis.com',
            'drive.google.com',
            'lh3.googleusercontent.com' // This domain is also used by Google Drive for thumbnail links
        ],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'drive.google.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                pathname: '/**',
            }
        ]
    },
}

export default nextConfig;