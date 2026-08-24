import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Trustworthy AutoML Inspector', description: 'No-code tabular ML that tells you when not to trust the model.' };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
