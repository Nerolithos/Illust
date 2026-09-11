import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {title:'LITHOS — 插画作品集',description:'Lithos 的个人插画作品集。关于喜欢的角色，也关于那些不想忘记的瞬间。',icons:{icon:'/images/favicon-256.webp'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="zh-CN"><body>{children}</body></html>}
