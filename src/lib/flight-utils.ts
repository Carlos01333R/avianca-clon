import type { Flight } from "@/types/flight"

export function generateRandomFlights(
origin: string, destination: string, date: string, passengers: number, count: number, seed: number,
): Flight[] {
  const originCode = origin.match(/$$([^)]+)$$/)?.[1] || "BOG"
  const destinationCode = destination.match(/$$([^)]+)$$/)?.[1] || "MDE"

  return Array.from({ length: count })
    .map((_, index) => {
      // Generar hora de salida aleatoria entre 5:00 y 22:00
      const departureHour = Math.floor(Math.random() * 17) + 5
      const departureMinute = Math.floor(Math.random() * 12) * 5

      // Duración aleatoria entre 45 minutos y 3 horas
      const durationMinutes = Math.floor(Math.random() * 135) + 45
      const durationHours = Math.floor(durationMinutes / 60)
      const remainingMinutes = durationMinutes % 60

      // Calcular hora de llegada
      let arrivalHour = departureHour + durationHours
      let arrivalMinute = departureMinute + remainingMinutes

      if (arrivalMinute >= 60) {
        arrivalHour += 1
        arrivalMinute -= 60
      }

      if (arrivalHour >= 24) {
        arrivalHour -= 24
      }

      // Precio base entre 200,000 y 800,000 COP
      const basePrice = Math.floor(Math.random() * 600000) + 200000

      // Ajustar precio según parámetros
      // Más pasajeros = ligero descuento por pasajero
      const passengerDiscount = passengers > 1 ? 0.05 : 0
      // Vuelos más largos son más caros
      const durationFactor = 1 + (durationMinutes / 180) * 0.5

      const finalPrice = Math.round(basePrice * durationFactor * (1 - passengerDiscount))

      // 80% de probabilidad de que sea un vuelo directo
      const isDirect = Math.random() < 0.8

      return {
        id: `FL-${index + 1000}`,
        departureTime: `${departureHour.toString().padStart(2, "0")}:${departureMinute.toString().padStart(2, "0")}`,
        arrivalTime: `${arrivalHour.toString().padStart(2, "0")}:${arrivalMinute.toString().padStart(2, "0")}`,
        duration: `${durationHours}h ${remainingMinutes > 0 ? remainingMinutes + "m" : ""}`,
        origin: originCode,
        destination: destinationCode,
        price: finalPrice,
        direct: isDirect,
      }
    })
    .sort((a, b) => {
      // Ordenar por hora de salida
      const timeA = Number.parseInt(a.departureTime.replace(":", ""))
      const timeB = Number.parseInt(b.departureTime.replace(":", ""))
      return timeA - timeB
    })
}
