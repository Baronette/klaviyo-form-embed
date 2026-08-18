"use client"

import { useEffect, useState } from "react"
import Script from "next/script"
import { Loader2 } from "lucide-react"

// Declare klaviyo as a global variable for TypeScript
declare global {
  interface Window {
    klaviyo: any
  }
}

export default function KlaviyoFormPage() {
  const [storeInfo, setStoreInfo] = useState({
    storeId: "", // Default fallback
  })

  // Get URL parameters once on mount
  useEffect(() => {
    // Only run on client side
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search)
      const storeId = urlParams.get("store") || ""

      setStoreInfo({ storeId })

      // Add a class to the body to help Klaviyo detect the form
      document.body.classList.add("klaviyo-form-page")

      // Event handler for Klaviyo form submissions
      const handleKlaviyoForms = (e: any) => {
        if (e.detail.type === "submit" && e.detail.formId === "WUKMT9") {
          // Check if klaviyo is available before using it
          if (window.klaviyo) {
            console.log(`Identifying user for store: ${storeId}`)
            window.klaviyo.identify({
              kiosk_store_name: storeId
            })
          }
        }
      }

      // Add Klaviyo form submission listener
      window.addEventListener("klaviyoForms", handleKlaviyoForms)

      // Clean up function
      return () => {
        document.body.classList.remove("klaviyo-form-page")
        window.removeEventListener("klaviyoForms", handleKlaviyoForms)
      }
    }
  }, []) // Empty dependency array - runs only once

  return (
    <main className="min-h-screen flex items-start justify-center ">
      {/* Klaviyo Form Container */}
      <div className="w-full max-w-2xl mt-20 p-12">
        <div className="klaviyo-form-WUKMT9 transform origin-top mt-8"></div>

        {/* Loading indicator that disappears when Klaviyo loads */}
        <div id="form-loading" className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto " />
          <p className="text-sm text-muted-foreground">Loading form...</p>
          {storeInfo.storeId !== "Kennedy" && (
            <p className="text-xs text-muted-foreground mt-2">
              Store: ({storeInfo.storeId})
            </p>
          )}
        </div>
      </div>

      {/* Klaviyo Script */}
      <Script
        src="https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=XdS9DR"
        strategy="afterInteractive"
        async
        onLoad={() => {
          // Hide the loading indicator
          const loadingElement = document.getElementById("form-loading")
          if (loadingElement) {
            loadingElement.style.display = "none"
          }

          // Give Klaviyo time to initialize and process forms
          setTimeout(() => {
            // Trigger a window resize event which can help Klaviyo detect and render forms
            window.dispatchEvent(new Event("resize"))
          }, 1000)
        }}
      />
    </main>
  )
}
