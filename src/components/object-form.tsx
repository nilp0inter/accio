"use client"

import { supabase } from "@/lib/supabase/client"
import { useEffect, useState } from "react"

export default function ObjectForm({ object, onSave, onCancel, currentLocationId: initialCurrentLocationId }: { object?: any, onSave: () => void, onCancel: () => void, currentLocationId?: number | null }) {
  const [name, setName] = useState(object?.name || "")
  const [description, setDescription] = useState(object?.description || "")
  const [type, setType] = useState(object?.type || "item")
  const [currentLocationId, setCurrentLocationId] = useState(object?.current_location_id || initialCurrentLocationId || null)
  const [assignedLocationId, setAssignedLocationId] = useState(object?.assigned_location_id || null)
  const [locations, setLocations] = useState<any[]>([])

  useEffect(() => {
    const fetchLocations = async () => {
      const { data, error } = await supabase
        .from("objects")
        .select("id, name")
        .not("type", "eq", "item")

      if (error) {
        console.error("Error fetching locations:", error)
      } else {
        setLocations(data)
      }
    }
    fetchLocations()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const objectData = {
      name,
      description,
      type,
      current_location_id: currentLocationId,
      assigned_location_id: assignedLocationId,
    }

    if (object) {
      const { error } = await supabase
        .from("objects")
        .update(objectData)
        .eq("id", object.id)
      if (error) console.error("Error updating object:", error)
    } else {
      const { data: { user } } = await supabase.auth.getUser()
      const { error } = await supabase
        .from("objects")
        .insert({ ...objectData, user_id: user?.id })
      if (error) console.error("Error creating object:", error)
    }
    onSave()
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">{object ? "Edit" : "Create"} Object</h2>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        >
          <option value="site">Site</option>
          <option value="area">Area</option>
          <option value="container">Container</option>
          <option value="item">Item</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Current Location</label>
        <select
          value={currentLocationId}
          onChange={(e) => setCurrentLocationId(parseInt(e.target.value))}
          className="w-full px-3 py-2 border rounded"
        >
          <option value="">None</option>
          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Assigned Location</label>
        <select
          value={assignedLocationId}
          onChange={(e) => setAssignedLocationId(parseInt(e.target.value))}
          className="w-full px-3 py-2 border rounded"
        >
          <option value="">None</option>
          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 mr-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Save
        </button>
      </div>
    </form>
  )
}