"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ArrowLeft, ChevronDown, Plane } from "lucide-react"
import FlightCard from "@/components/flight/flight-card"
import { SiteLogo } from "@/components/ui/site-logo"
import { generateRandomFlights } from "@/lib/flight-utils"
import type { Flight } from "@/types/flight"

export default function ResultadosPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [flights, setFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(true)

  const origin = searchParams.get("origin") || ""
  const destination = searchParams.get("destination") || ""
  const departureDate = searchParams.get("departureDate") || ""
  const returnDate = searchParams.get("returnDate") || ""
  const passengers = Number.parseInt(searchParams.get("passengers") || "1")
  const tripType = searchParams.get("tripType") || "roundTrip"

  useEffect(() => {
    const originCode = origin.match(/$$([^)]+)$$/)?.[1] || "BOG"
    const destinationCode = destination.match(/$$([^)]+)$$/)?.[1] || "MDE"

    if (!origin || !destination || typeof window === "undefined") {
      router.push("/")
      return
    }

    // Generar vuelos aleatorios
    setLoading(true)

    // Usar un ID determinista para la misma búsqueda
    const searchId = `${origin}-${destination}-${departureDate}-${passengers}`
    const seed = hashCode(searchId)

    setTimeout(() => {
      const generatedFlights = generateRandomFlights(origin, destination, departureDate, passengers, 5, seed)
      setFlights(generatedFlights)
      setLoading(false)
    }, 1500)
  }, [origin, destination, departureDate, passengers, router])

  // Función para generar un hash determinista
  function hashCode(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 4) - hash + char
      hash = hash & hash // Convesert to 32bit integer
    }
    return Math.abs(hash)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ""

    // Extraer año, mes y día directamente del string para evitar problemas de zona horaria
    const [year, month, day] = dateString.split("-").map((num) => Number.parseInt(num, 10))

    // Crear una fecha con la hora establecida a mediodía para evitar problemas de zona horaria
    const date = new Date(year, month - 1, day, 12, 0, 0)

    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  return (
    <main className="min-h-screen bg-gray-50">
     

      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-xl font-bold mb-2">
                Vuelos de {origin} a {destination}
              </h1>
              <p className="text-gray-600">
                {formatDate(departureDate)}
                {tripType === "roundTrip" && returnDate && ` - ${formatDate(returnDate)}`}
                {` • ${passengers} ${passengers === 1 ? "pasajero" : "pasajeros"}`}
              </p>
            </div>
            <button className="mt-4 md:mt-0 flex items-center text-red-600 font-medium">
              <span>Modificar búsqueda</span>
              <ChevronDown className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="animate-pulse flex flex-col items-center">
              <Plane className="w-12 h-12 text-red-500 mb-4" />
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {flights.map((flight) => (
              <FlightCard key={flight.id} flight={flight} passengers={passengers} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
