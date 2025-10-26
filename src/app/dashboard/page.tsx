"use client"

import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useLocation } from "@/context/location-context"
import ItemsList from "@/components/items-list"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const { selectedLocation } = useLocation()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
      } else {
        router.push("/")
      }
    }
    getUser()
  }, [router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Welcome, {user.email}</h1>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
        >
          Sign out
        </button>
      </div>
      <ItemsList locationId={selectedLocation} />
    </div>
  )
}