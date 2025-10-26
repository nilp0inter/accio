"use client"

import { supabase } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import Tree from "@/components/tree"

export default function Sidebar() {
  const [sites, setSites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSites = async () => {
      const { data, error } = await supabase
        .from("objects")
        .select("*")
        .eq("type", "site")

      if (error) {
        console.error("Error fetching sites:", error)
      } else {
        setSites(data)
      }
      setLoading(false)
    }
    fetchSites()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold">Sites</h2>
      <Tree nodes={sites} />
    </div>
  )
}