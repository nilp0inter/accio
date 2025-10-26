import Sidebar from "@/components/sidebar"
import { LocationProvider } from "@/context/location-context"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LocationProvider>
      <div className="flex h-screen bg-gray-100">
        <div className="w-64 bg-white border-r">
          <Sidebar />
        </div>
        <div className="flex-1 p-8">
          {children}
        </div>
      </div>
    </LocationProvider>
  )
}