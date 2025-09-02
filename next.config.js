/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
})

const nextConfig = {
  serverExternalPackages: ['@supabase/supabase-js'],
  images: {
    domains: ['amarmxbvuzxakjzvntzv.supabase.co']
  },
  outputFileTracingRoot: __dirname
}

module.exports = withPWA(nextConfig)
