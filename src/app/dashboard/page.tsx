"use client"

import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useLocation } from "@/context/location-context"
import ObjectsList from "@/components/objects-list"
import ObjectForm from "@/components/object-form"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const { selectedLocation, selectedLocationPath, selectedLocationType } = useLocation()
  const [showSiteForm, setShowSiteForm] = useState(false)

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

  const handleSaveSite = () => {
    setShowSiteForm(false)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">
          {selectedLocation && selectedLocationPath
            ? selectedLocationPath
            : `Welcome, ${user.email}`}
        </h1>
        <div>
          {!selectedLocation && (
            <button
              onClick={() => setShowSiteForm(true)}
              className="px-4 py-2 mr-2 text-white bg-green-500 rounded hover:bg-green-600"
            >
              Add new Site
            </button>
          )}
          <button
            onClick={handleSignOut}
            className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
          >
            Sign out
          </button>
        </div>
      </div>
      {showSiteForm && (
        <ObjectForm
          onSave={handleSaveSite}
          onCancel={() => setShowSiteForm(false)}
          formType="site"
        />
      )}
      <ObjectsList locationId={selectedLocation} locationType={selectedLocationType || undefined} />
    </div>
  )
}