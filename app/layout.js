import { Inter } from "next/font/google"
import "./globals.css"
import Header from "./components/Header"
import { Toaster } from "sonner"
import { UserProvider } from "./context/UserContext"
import Footer from "./components/Footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Epilepsy Management System",
  description: "A comprehensive system for managing epilepsy patients and their data"
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          <Header />
          <main className="min-h-screen">
          {children}
          <Footer />
          </main>
          <Toaster richColors position="top-center" />
        </UserProvider>
      </body>
    </html>
  )
}
