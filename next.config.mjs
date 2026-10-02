/** @type {import('next').NextConfig} */
const nextConfig = {
    // Minimal config
    
    // Production optimizations
    compiler: {
        // Remove console logs in production (optional, but helps with clean builds)
        // removeConsole: process.env.NODE_ENV === 'production',
    },
    
    // Note: Next.js automatically performs dead-code elimination in production builds.
    // The USE_MOCK_DATA flag (tied to NODE_ENV === 'development') will be compiled out
    // in production, ensuring mock data paths are not included in the bundle.
};

export default nextConfig;
