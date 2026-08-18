"use client"

import type React from "react"
import { useEffect } from "react"
import BottomNavigation from "./BottomNavigation"
import Header from "./Header"

interface RaffleFormViewProps {
  currentStore: string
  storeName: string
  onBackToHome: () => void
  onBarcodeScanned: (barcode: string) => void // Callback to handle barcode scanning
}

const RaffleFormView: React.FC<RaffleFormViewProps> = ({ currentStore, storeName, onBackToHome, onBarcodeScanned }) => {
  useEffect(() => {
    let barcodeBuffer = ""
    let lastScanTime = 0
    const BARCODE_TIMEOUT = 50 // ms between barcode characters

    const handleGlobalKeyPress = (e: KeyboardEvent) => {
      const currentTime = new Date().getTime()

      // Check if this is likely from a barcode scanner
      if (currentTime - lastScanTime > BARCODE_TIMEOUT) {
        barcodeBuffer = "" // Reset buffer if too much time has passed
      }

      lastScanTime = currentTime

      if (e.key === "Enter") {
        e.preventDefault()
        if (barcodeBuffer.trim()) {
          onBarcodeScanned(barcodeBuffer) // Pass the scanned barcode to the parent
          barcodeBuffer = "" // Clear buffer
        }
      } else if (e.key.length === 1) {
        barcodeBuffer += e.key // Append character to buffer
      }
    }

    window.addEventListener("keypress", handleGlobalKeyPress)

    return () => {
      window.removeEventListener("keypress", handleGlobalKeyPress)
    }
  }, [onBarcodeScanned])

  return (
    <div className="h-screen w-screen flex flex-col">
      {/* Header */}
      <Header storeName={storeName} storeId={currentStore} onBackToHome={onBackToHome} />

      <div className="flex-1 w-full relative">
        <iframe
          src={`https://v0-klaviyo-form-embed.vercel.app/?store=${encodeURIComponent(currentStore)}&storeName=${encodeURIComponent(storeName)}`}
          title="Raffle Entry Form"
          className="absolute inset-0 w-full h-full border-0"
          sandbox="allow-forms allow-scripts allow-same-origin"
        />
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  )
}

export default RaffleFormView
