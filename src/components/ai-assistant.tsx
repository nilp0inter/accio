"use client"

import { useState } from "react"

export default function AiAssistant({ type, onResult }: { type: "items" | "containers", onResult: (result: any[]) => void }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLoading(true)
      setError(null)

      // In a real application, we would upload the file and then
      // call our AI service. For now, we'll just call our mock
      // edge function directly.
      try {
        const response = await fetch("/api/ai-mock", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ type }),
        })
        const result = await response.json()
        onResult(result)
      } catch (err) {
        setError("An error occurred while fetching the AI result.")
      }

      setLoading(false)
    }
  }

  return (
    <div className="p-4 bg-gray-100 rounded">
      <h3 className="text-lg font-bold mb-2">AI Assistant</h3>
      <p className="text-sm mb-4">
        {type === "items"
          ? "Upload a photo of the items inside a location to automatically add them to your inventory."
          : "Upload a photo of a container to automatically divide it into sub-containers."}
      </p>
      <input type="file" onChange={handleFileUpload} accept="image/*" />
      {loading && <p>Analyzing image...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  )
}