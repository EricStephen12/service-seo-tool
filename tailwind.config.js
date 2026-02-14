/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                'semrush-orange': '#FF642D',
                'fashion-navy': '#0A1128',
                'fashion-black': '#000000',
                'fashion-off-black': '#111111',
                'fashion-gray': '#888888',
                'fashion-light': '#F5F5F7',
                'fashion-white': '#FFFFFF',
            },
            fontFamily: {
                serif: ['var(--font-serif)', 'serif'],
                sans: ['var(--font-sans)', 'sans-serif'],
            },
            animation: {
                reveal: 'reveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'scale-down': 'scale-down 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            },
            keyframes: {
                reveal: {
                    '0%': { opacity: '0', transform: 'translateY(40px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'scale-down': {
                    '0%': { transform: 'scale(1.1)' },
                    '100%': { transform: 'scale(1)' },
                },
            },
        },
    },
    plugins: [],
}
