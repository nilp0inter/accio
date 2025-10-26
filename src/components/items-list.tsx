"use client"

import { supabase } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import ObjectForm from "./object-form"
import AiAssistant from "./ai-assistant"

export default function ItemsList({ locationId }: { locationId: number | null }) {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingObject, setEditingObject] = useState<any | null>(null)
  const [showAiAssistant, setShowAiAssistant] = useState(false)

  const fetchItems = async () => {
    if (locationId) {
      setLoading(true)
      const { data, error } = await supabase
        .from("objects")
        .select("*")
        .eq("current_location_id", locationId)
        .eq("type", "item")

      if (error) {
        console.error("Error fetching items:", error)
      } else {
        setItems(data)
      }
      setLoading(false)
    } else {
      setItems([])
    }
  }

  useEffect(() => {
    fetchItems()
  }, [locationId])

  const handleSave = () => {
    setShowForm(false)
    setEditingObject(null)
    fetchItems()
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this item?")) {
      const { error } = await supabase.from("objects").delete().eq("id", id)
      if (error) console.error("Error deleting item:", error)
      else fetchItems()
    }
  }

  const handleAiResult = (result: any[]) => {
    // For now, we'll just log the result. In a real application,
    // we would likely pre-fill the form or a list of new items.
    console.log("AI Result:", result)
    setShowAiAssistant(false)
  }

  if (loading) {
    return <div>Loading items...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Items</h2>
        <div>
          <button
            onClick={() => setShowAiAssistant(!showAiAssistant)}
            className="px-4 py-2 mr-2 text-white bg-purple-500 rounded hover:bg-purple-600"
          >
            {showAiAssistant ? "Hide" : "Show"} AI Assistant
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            New Item
          </button>
        </div>
      </div>

      {showAiAssistant && (
        <AiAssistant type="items" onResult={handleAiResult} />
      )}

      {showForm && (
        <ObjectForm
          object={editingObject}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false)
            setEditingObject(null)
          }}
          currentLocationId={locationId}
        />
      )}

      {items.length > 0 ? (
        <ul>
          {items.map((item) => (
            <li key={item.id} className="flex justify-between items-center p-2 border-b">
              {item.name}
              <div>
                <button
                  onClick={() => {
                    setEditingObject(item)
                    setShowForm(true)
                  }}
                  className="px-2 py-1 mr-2 text-white bg-green-500 rounded hover:bg-green-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No items found in this location.</p>
      )}
    </div>
  )
}