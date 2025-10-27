"use client"

import { supabase } from "@/lib/supabase/client"
import { useEffect, useState, useCallback } from "react"
import ObjectForm from "./object-form"
import AiAssistant from "./ai-assistant"

export default function ObjectsList({ locationId, locationType }: { locationId: number | null, locationType?: string }) {
  const [objects, setObjects] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingObject, setEditingObject] = useState<any | null>(null)
  const [showAiAssistant, setShowAiAssistant] = useState(false)
  const [aiType, setAiType] = useState<"items" | "containers">("items")
  const [formType, setFormType] = useState<"item" | "container" | "area" | "site">("item")
  const [belongsToPaths, setBelongsToPaths] = useState<Record<number, string>>({})

  const fetchObjects = useCallback(async () => {
    if (locationId) {
      setLoading(true)
      const { data, error } = await supabase
        .from("objects")
        .select("*")
        .eq("current_location_id", locationId)

      if (error) {
        console.error("Error fetching objects:", error)
      } else {
        setObjects(data)
      }
      setLoading(false)
    } else {
      setObjects([])
    }
  }, [locationId])

  useEffect(() => {
    fetchObjects()
  }, [locationId])

  const handleSave = () => {
    setShowForm(false)
    setEditingObject(null)
    fetchObjects()
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this object?")) {
      const { error } = await supabase.from("objects").delete().eq("id", id)
      if (error) console.error("Error deleting object:", error)
      else fetchObjects()
    }
  }

  const handleAiResult = (result: any[]) => {
    // For now, we'll just log the result. In a real application,
    // we would likely pre-fill the form or a list of new items.
    console.log("AI Result:", result)
    setShowAiAssistant(false)
  }

  if (loading) {
    return <div>Loading objects...</div>
  }

  const getButtons = () => {
    const buttons = []
    if (locationType === "site" || locationType === "area") {
      buttons.push(
        <button
          key="divide"
          onClick={() => {
            setFormType("area")
            setShowForm(true)
          }}
          className="px-4 py-2 mr-2 text-white bg-orange-500 rounded hover:bg-orange-600"
        >
          Divide this {locationType}
        </button>
      )
      buttons.push(
        <button
          key="add-container"
          onClick={() => {
            setFormType("container")
            setShowForm(true)
          }}
          className="px-4 py-2 mr-2 text-white bg-green-500 rounded hover:bg-green-600"
        >
          Add new container
        </button>
      )
    }
    if (locationType === "container") {
      buttons.push(
        <button
          key="divide-container"
          onClick={() => {
            setFormType("container")
            setShowForm(true)
          }}
          className="px-4 py-2 mr-2 text-white bg-orange-500 rounded hover:bg-orange-600"
        >
          Divide this container
        </button>
      )
    }
    buttons.push(
      <button
        key="add-item"
        onClick={() => {
          setFormType("item")
          setShowForm(true)
        }}
        className="px-4 py-2 mr-2 text-white bg-blue-500 rounded hover:bg-blue-600"
      >
        Add new item
      </button>
    )
    buttons.push(
      <button
        key="ai-items"
        onClick={() => {
          setAiType("items")
          setShowAiAssistant(!showAiAssistant)
        }}
        className="px-4 py-2 text-white bg-purple-500 rounded hover:bg-purple-600"
      >
        {showAiAssistant ? "Hide" : "Add items with a photo"}
      </button>
    )
    if (locationType === "container") {
      buttons.push(
        <button
          key="ai-containers"
          onClick={() => {
            setAiType("containers")
            setShowAiAssistant(!showAiAssistant)
          }}
          className="px-4 py-2 ml-2 text-white bg-indigo-500 rounded hover:bg-indigo-600"
        >
          {showAiAssistant ? "Hide" : "Divide with photo"}
        </button>
      )
    }
    return buttons
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Objects</h2>
        <div>
          {getButtons()}
        </div>
      </div>

      {showAiAssistant && (
        <AiAssistant type={aiType} onResult={handleAiResult} />
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
          formType={formType}
        />
      )}

      {objects.length > 0 ? (
        <ul>
          {objects.map((object) => (
            <li key={object.id} className="p-2 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <strong>{object.name}</strong> ({object.type})
                  {belongsToPaths[object.id] && (
                    <div className="text-sm text-gray-600">
                      Belongs to: {belongsToPaths[object.id]}
                    </div>
                  )}
                </div>
                <div>
                  <button
                    onClick={() => {
                      setEditingObject(object)
                      setShowForm(true)
                    }}
                    className="px-2 py-1 mr-2 text-white bg-green-500 rounded hover:bg-green-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(object.id)}
                    className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No objects found in this location.</p>
      )}
    </div>
  )
}