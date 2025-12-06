"use client"

import { useEffect, useRef, useState } from "react"
import { getSupabaseClient } from "@/lib/supabase/client"
import { Badge } from "@/components/ui/badge"
import { Database, CheckCircle2, XCircle } from "lucide-react"

export function DbConnectionChecker() {
  const [connectionStatus, setConnectionStatus] = useState<"checking" | "connected" | "disconnected">("checking")
  const hasLoggedRef = useRef(false)

  useEffect(() => {
    // Only check once
    if (hasLoggedRef.current) return
    hasLoggedRef.current = true

    async function checkConnection() {
      try {
        // Check if env vars are available
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
          console.log('🔵 [DB Status] Database connection check skipped - environment variables not configured')
          setConnectionStatus("disconnected")
          return
        }

        const supabase = getSupabaseClient()
        
        // Try a simple query to check connection
        const { data, error } = await supabase
          .from('properties')
          .select('id')
          .limit(1)

        if (error) {
          console.error('❌ [DB Status] Database connection failed:', error.message)
          setConnectionStatus("disconnected")
          return
        }

        // Connection successful
        console.log('✅ [DB Status] Database connected successfully')
        setConnectionStatus("connected")
      } catch (error: any) {
        // Check if it's the missing env vars error
        if (error.message?.includes('Missing Supabase environment variables')) {
          console.log('🔵 [DB Status] Database connection check skipped - environment variables not configured')
        } else {
          console.error('❌ [DB Status] Database connection error:', error.message)
        }
        setConnectionStatus("disconnected")
      }
    }

    checkConnection()
  }, [])

  if (connectionStatus === "checking") {
    return (
      <Badge variant="secondary" className="gap-2">
        <Database className="h-3 w-3 animate-pulse" />
        Checking...
      </Badge>
    )
  }

  if (connectionStatus === "connected") {
    return (
      <Badge variant="success" className="gap-2">
        <CheckCircle2 className="h-3 w-3" />
        DB Connected
      </Badge>
    )
  }

  return (
    <Badge variant="destructive" className="gap-2">
      <XCircle className="h-3 w-3" />
      DB Disconnected
    </Badge>
  )
}

