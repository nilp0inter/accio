import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const { type } = await req.json()

  if (type === "items") {
    const mockItems = [
      { name: "Laptop", description: "A powerful laptop" },
      { name: "Book", description: "A captivating novel" },
      { name: "Mug", description: "A ceramic mug" },
    ]
    return new Response(JSON.stringify(mockItems), {
      headers: { "Content-Type": "application/json" },
    })
  }

  if (type === "containers") {
    const mockContainers = [
      { name: "Top Shelf", description: "" },
      { name: "Middle Shelf", description: "" },
      { name: "Bottom Shelf", description: "" },
    ]
    return new Response(JSON.stringify(mockContainers), {
      headers: { "Content-Type": "application/json" },
    })
  }

  return new Response("Invalid type", { status: 400 })
})