"use client"
import "./globals.css"
import { Poppins } from "next/font/google"
import { Josefin_Sans } from "next/font/google"
import { ThemeProvider } from "./utils/theme-provider"
import { Toaster } from "react-hot-toast"
import { SessionProvider } from "next-auth/react"
import React, { useEffect } from "react"
import { useLoadUserQuery } from "@/redux/features/api/apiSlice"
import Loader from "./components/Loader/Loader"
import { io } from "socket.io-client"
import { Providers } from "./Provider"
const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || ""
const socketId = io(ENDPOINT, { transports: ["websocket"] })

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Poppins"
})

const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Josefin"
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${poppins.variable} ${josefin.variable} !bg-red bg-no-repeat dark:bg-gradient-to-b dark:from-blue-900 dark:to-black duration-300`}
      >
        <Providers>
          <SessionProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <Custom>
                <div>{children}</div>
              </Custom>
              <Toaster position="top-center" reverseOrder={false} />
            </ThemeProvider>
          </SessionProvider>
        </Providers>
      </body>
    </html>
  )
}

const Custom = ({ children }) => {
  const { isLoading } = useLoadUserQuery({})

  useEffect(() => {
    socketId.on("connection", () => {})
  }, [])

  return <div>{isLoading ? <Loader /> : <div>{children} </div>}</div>
}
