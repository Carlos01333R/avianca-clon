"use client"

import { useState, useEffect, useRef } from "react"
import type { Location } from "@/types/flight"

interface LocationDropdownProps {
  locations: Location[]
  onSelect: (location: Location) => void
  excludeCode?: string
  label: string
  isOpen: boolean
  onClose: () => void
}

export function LocationDropdown({ locations, onSelect, excludeCode, label, isOpen, onClose }: LocationDropdownProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  const filteredLocations = locations
    .filter((loc) => loc.code !== excludeCode)
    .filter(
      (loc) =>
        loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loc.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (loc.country && loc.country.toLowerCase().includes(searchTerm.toLowerCase())),
    )

  if (!isOpen) return null

  return (
    <div
      ref={dropdownRef}
      className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto"
    >
      <div className="p-2 sticky top-0 bg-white z-10 border-b">
        <input
          ref={inputRef}
          type="text"
          className="w-full p-2 border border-gray-200 rounded focus:border-gray-300 outline-none"
          placeholder={`Buscar ciudad o aeropuerto`}
          value={searchTerm}
          required
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="mt-2 flex space-x-2">
          <button
            className={`px-3 py-1 rounded-full text-xs font-medium ${searchTerm === "" ? "bg-red-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            onClick={() => setSearchTerm("")}
          >
            Todos
          </button>
          <button
            className={`px-3 py-1 rounded-full text-xs font-medium ${searchTerm === "colombia" ? "bg-red-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            onClick={() => setSearchTerm("colombia")}
          >
            Colombia
          </button>
          <button
            className={`px-3 py-1 rounded-full text-xs font-medium ${searchTerm === "internacional" ? "bg-red-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            onClick={() => setSearchTerm("internacional")}
          >
            Internacional
          </button>
        </div>
      </div>

      <div className="p-2">
        <div className="text-xs font-medium text-gray-500 mb-2 px-2">
          {filteredLocations.length} destinos encontrados
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          {filteredLocations.length > 0 ? (
            filteredLocations.map((loc) => (
              <div
                key={loc.code}
                className="p-2 hover:bg-gray-100 cursor-pointer rounded flex justify-between items-center"
                onClick={() => {
                  onSelect(loc)
                  onClose()
                }}
              >
                <div>
                  <div className="font-medium">{loc.name}</div>
                  <div className="text-xs text-gray-500">{loc.country}</div>
                </div>
                <div className="text-sm font-bold text-gray-500">{loc.code}</div>
              </div>
            ))
          ) : (
            <div className="p-2 text-gray-500 text-sm col-span-2 text-center">No se encontraron resultados</div>
          )}
        </div>
      </div>
    </div>
  )
}
