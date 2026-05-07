/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permite import dinâmico do GSAP sem erros de SSR
  transpilePackages: ['gsap'],
}

export default nextConfig
