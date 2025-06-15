import { Inter } from "next/font/google"
import "./globals.css"
import Header from "./components/Header"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Modern Auth App",
  description: "A modern authentication application built with Next.js",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  )
}
