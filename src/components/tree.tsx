"use client"

import { supabase } from "@/lib/supabase/client"
import { useState } from "react"
import { useLocation } from "@/context/location-context"
import { getObjectTypeEmoji } from "@/utils/emojis"

export default function Tree({ nodes }: { nodes: any[] }) {
  return (
    <ul>
      {nodes.map((node) => (
        <TreeNode key={node.id} node={node} />
      ))}
    </ul>
  )
}

function TreeNode({ node }: { node: any }) {
  const [isOpen, setIsOpen] = useState(false)
  const [children, setChildren] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const { setSelectedLocation, setSelectedLocationPath } = useLocation()

  const handleToggle = async () => {
    setSelectedLocation(node.id, node.type)

    const { data: pathData } = await supabase
      .rpc("join_current_location", { start_id: node.id })

    if (pathData) {
      setSelectedLocationPath(pathData)
    }
    
    if (!isOpen) {
      setLoading(true)
      const { data, error } = await supabase
        .from("objects")
        .select("*")
        .eq("current_location_id", node.id)
        .not("type", "eq", "item")

      if (error) {
        console.error("Error fetching children:", error)
      } else {
        setChildren(data)
      }
      setLoading(false)
    }
    setIsOpen(!isOpen)
  }

  return (
    <li className="ml-4">
      <div onClick={handleToggle} className="cursor-pointer">
        {node.type !== "item" && (isOpen ? "[-]" : "[+]")}{" "}
        {getObjectTypeEmoji(node.type)} {node.name}
      </div>
      {isOpen && (
        <>
          {loading && <div>Loading...</div>}
          {children.length > 0 && <Tree nodes={children} />}
        </>
      )}
    </li>
  )
}