"use client"

import * as React from "react"
import { useLoadScript, GoogleMap, Marker } from "@react-google-maps/api"
import { MapPin, Loader2, Navigation } from "lucide-react"

import { Button } from "@repo/ui"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const LIBRARIES: ("places" | "geometry" | "drawing" | "visualization")[] = ["places"]

export interface LocationData {
  coordinates: [number, number]; // [lng, lat]
  address?: string;
  village?: string;
  district?: string;
  state?: string;
  country?: string;
}

export interface LocationPickerProps {
  value: LocationData;
  onChange: (location: LocationData) => void;
  className?: string;
}

const DEFAULT_CENTER = { lat: 20.5937, lng: 78.9629 } // Center of India

export function LocationPicker({ value, onChange, className }: LocationPickerProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: LIBRARIES,
  })

  const [isLocating, setIsLocating] = React.useState(false)
  
  const mapCenter = React.useMemo(() => {
    if (value.coordinates[0] !== 0 || value.coordinates[1] !== 0) {
      return { lat: value.coordinates[1], lng: value.coordinates[0] }
    }
    return DEFAULT_CENTER
  }, [value.coordinates])

  const performReverseGeocode = React.useCallback((lat: number, lng: number) => {
    if (!window.google) return

    const geocoder = new window.google.maps.Geocoder()
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const addressComponents = results[0].address_components
        
        let village = ""
        let district = ""
        let state = ""
        let country = ""

        // Map Google's address components to our fields
        addressComponents.forEach(comp => {
          const types = comp.types
          if (types.includes("sublocality") || types.includes("locality")) {
            village = comp.long_name
          }
          if (types.includes("administrative_area_level_2") || types.includes("administrative_area_level_3")) {
            district = comp.long_name
          }
          if (types.includes("administrative_area_level_1")) {
            state = comp.long_name
          }
          if (types.includes("country")) {
            country = comp.long_name
          }
        })

        onChange({
          coordinates: [lng, lat],
          address: results[0].formatted_address,
          village,
          district,
          state,
          country
        })
      }
    })
  }, [onChange])

  const handleAutoDetect = () => {
    setIsLocating(true)
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          performReverseGeocode(lat, lng)
          setIsLocating(false)
        },
        (error) => {
          console.error("Geolocation error:", error)
          setIsLocating(false)
          alert("Failed to get location. Please click on the map manually.")
        },
        { enableHighAccuracy: true }
      )
    } else {
      setIsLocating(false)
      alert("Geolocation is not supported by your browser.")
    }
  }

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat()
      const lng = e.latLng.lng()
      performReverseGeocode(lat, lng)
    }
  }

  const handleMarkerDragEnd = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat()
      const lng = e.latLng.lng()
      performReverseGeocode(lat, lng)
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <Label required className="text-lg">Location Details</Label>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={handleAutoDetect}
          disabled={isLocating}
          className="gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
        >
          {isLocating ? <Loader2 className="size-4 animate-spin" /> : <Navigation className="size-4" />}
          Auto-detect Location
        </Button>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2 lg:col-span-4">
          <Label>Full Address</Label>
          <Input 
            value={value.address || ""} 
            onChange={(e) => onChange({ ...value, address: e.target.value })} 
            placeholder="Complete address (auto-filled)" 
          />
        </div>
        <div className="space-y-2">
          <Label>Village/Locality</Label>
          <Input 
            value={value.village || ""} 
            onChange={(e) => onChange({ ...value, village: e.target.value })} 
            placeholder="Village or City" 
          />
        </div>
        <div className="space-y-2">
          <Label>District</Label>
          <Input 
            value={value.district || ""} 
            onChange={(e) => onChange({ ...value, district: e.target.value })} 
            placeholder="District" 
          />
        </div>
        <div className="space-y-2">
          <Label>State</Label>
          <Input 
            value={value.state || ""} 
            onChange={(e) => onChange({ ...value, state: e.target.value })} 
            placeholder="State" 
          />
        </div>
        <div className="space-y-2">
          <Label>Country</Label>
          <Input 
            value={value.country || ""} 
            onChange={(e) => onChange({ ...value, country: e.target.value })} 
            placeholder="Country" 
          />
        </div>
      </div>

      {/* Map */}
      <div className="w-full h-72 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 relative">
        {loadError ? (
          <div className="flex h-full items-center justify-center text-red-500 p-4 text-center">
            Error loading Google Maps. Please check your API key.
          </div>
        ) : !isLoaded ? (
          <div className="flex h-full items-center justify-center text-zinc-500">
            <Loader2 className="size-6 animate-spin mr-2" /> Loading Map...
          </div>
        ) : (
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={mapCenter}
            zoom={value.coordinates[0] !== 0 ? 15 : 4}
            onClick={handleMapClick}
            options={{
              disableDefaultUI: true,
              zoomControl: true,
            }}
          >
            {value.coordinates[0] !== 0 && (
              <Marker 
                position={{ lat: value.coordinates[1], lng: value.coordinates[0] }} 
                draggable={true}
                onDragEnd={handleMarkerDragEnd}
                animation={window.google.maps.Animation.DROP}
              />
            )}
          </GoogleMap>
        )}
        
        {value.coordinates[0] === 0 && !isLocating && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-black/5 backdrop-blur-[1px]">
            <div className="bg-white dark:bg-zinc-900 shadow-lg rounded-full px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
              <MapPin className="size-4 text-blue-500" /> Click on the map or use Auto-detect
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
