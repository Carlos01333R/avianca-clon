import Image from "next/image"

interface SiteLogoProps {
  className?: string
}

export function SiteLogo({ className = "" }: SiteLogoProps) {
  return (
    <Image
      src="/logo.jpg"
      alt="Logo"
      width={120}   
      height={36}
    />
  )
}
