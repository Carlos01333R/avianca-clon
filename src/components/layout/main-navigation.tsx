"use client"

import { useState } from "react"
import Link from "next/link"
import { SiteLogo } from "@/components/ui/site-logo"
import { Menu, X, User, Globe, Phone, LogOut } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export function MainNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()

  return (
    <header className="bg-white shadow-sm">
      {/* Top Bar */}
      <div className="bg-gray-100 py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4 text-sm">
              <a href="#" className="flex items-center text-gray-600 hover:text-gray-900">
                <Phone className="w-4 h-4 mr-1" />
                <span>Atención al cliente</span>
              </a>
              <a href="#" className="flex items-center text-gray-600 hover:text-gray-900">
                <Globe className="w-4 h-4 mr-1" />
                <span>ES</span>
              </a>
            </div>
            <div>
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    className="flex items-center text-gray-600 hover:text-gray-900 text-sm"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  >
                    <User className="w-4 h-4 mr-1" />
                    <span>{user?.name}</span>
                  </button>
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      <Link
                        href="/mis-viajes"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Mis viajes
                      </Link>
                      <Link
                        href="/perfil"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Mi perfil
                      </Link>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          logout()
                          setIsUserMenuOpen(false)
                        }}
                      >
                        <div className="flex items-center">
                          <LogOut className="w-4 h-4 mr-2" />
                          Cerrar sesión
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/login" className="flex items-center text-gray-600 hover:text-gray-900 text-sm">
                  <User className="w-4 h-4 mr-1" />
                  <span>Iniciar sesión</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <SiteLogo className="h-8" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavItem href="/" label="Vuelos" />
            <NavItem href="https://sp.booking.com/dealspage.html?aid=2434507&label=hotels_shortcut" label="Hoteles" />
            
            <NavItem href="/check-in" label="Check-in" />
            <NavItem href="/estado-vuelo" label="Estado del vuelo" />
            <NavItem href="/mis-viajes" label="Mis viajes" />
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              <MobileNavItem href="/" label="Vuelos" />
              <MobileNavItem href="#" label="Hoteles" />
              <MobileNavItem href="#" label="Paquetes" />
              <MobileNavItem href="/check-in" label="Check-in" />
              <MobileNavItem href="/estado-vuelo" label="Estado del vuelo" />
              <MobileNavItem href="/mis-viajes" label="Mis viajes" />
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

function NavItem({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="text-gray-600 hover:text-gray-900 font-medium">
      {label}
    </Link>
  )
}

function MobileNavItem({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="text-gray-600 hover:text-gray-900 font-medium py-2 border-b border-gray-100">
      {label}
    </Link>
  )
}
