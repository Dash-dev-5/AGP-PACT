"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { TextField, Select, FormControl, InputLabel, MenuItem, type SelectChangeEvent } from "@mui/material"

// Define a more specific type for formData that can be extended
export interface FormData {
  address?: string
  cityId?: string
  sectorId?: string
  villageId?: string
  commune?: string
  quartier?: string
  [key: string]: any // Allow other properties
}

// Make the component generic to accept different form data types
export interface Form4AddressProps<T extends FormData = FormData> {
  formData: T
  setFormData?: (data: T) => void
  // Add these properties to match the components that use Form4Address
  prevStep?: () => any
  saveStepData?: (data: Partial<T>) => any
}

// Define types for city, sector, and village
interface City {
  id: string
  name: string
  slug?: string
  referenceNumber?: string
  sectors?: any[]
  [key: string]: any
}

interface Sector {
  id: string
  name: string
  [key: string]: any
}

interface Village {
  id: string
  name: string
  [key: string]: any
}

function Form4Address<T extends FormData>({ formData, setFormData, prevStep, saveStepData }: Form4AddressProps<T>) {
  const [cities, setCities] = useState<City[]>([])
  const [sectors, setSectors] = useState<Sector[]>([])
  const [villages, setVillages] = useState<Village[]>([])
  const [selectedCity, setSelectedCity] = useState<string>("")
  const [selectedSector, setSelectedSector] = useState<string>("")

  useEffect(() => {
    // Fetch cities from API (replace with your actual API endpoint)
    const fetchCities = async () => {
      try {
        const response = await fetch("/api/cities") // Example API endpoint
        const data = await response.json()
        setCities(data)
      } catch (error) {
        console.error("Error fetching cities:", error)
      }
    }

    fetchCities()
  }, [])

  useEffect(() => {
    // Fetch sectors based on selected city
    const fetchSectors = async () => {
      if (selectedCity) {
        try {
          const response = await fetch(`/api/cities/${selectedCity}/sectors`) // Example API endpoint
          const data = await response.json()
          setSectors(data)
        } catch (error) {
          console.error("Error fetching sectors:", error)
        }
      } else {
        setSectors([])
      }
    }

    fetchSectors()
  }, [selectedCity])

  useEffect(() => {
    // Fetch villages based on selected sector
    const fetchVillages = async () => {
      if (selectedSector) {
        try {
          const response = await fetch(`/api/sectors/${selectedSector}/villages`) // Example API endpoint
          const data = await response.json()
          setVillages(data)
        } catch (error) {
          console.error("Error fetching villages:", error)
        }
      } else {
        setVillages([])
      }
    }

    fetchVillages()
  }, [selectedSector])

  // Update form data using the appropriate method
  const updateFormData = (updates: Partial<T>) => {
    if (saveStepData) {
      saveStepData({ ...formData, ...updates })
    } else if (setFormData) {
      setFormData({ ...formData, ...updates })
    }
  }

  // Handle text field changes
  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateFormData({ [event.target.name]: event.target.value } as Partial<T>)
  }

  // Handle select changes
  const handleCityChange = (event: SelectChangeEvent<string>) => {
    const cityId = event.target.value
    setSelectedCity(cityId)
    updateFormData({ cityId } as Partial<T>)
    setSelectedSector("")
    setVillages([])
  }

  const handleSectorChange = (event: SelectChangeEvent<string>) => {
    const sectorId = event.target.value
    setSelectedSector(sectorId)
    updateFormData({ sectorId } as Partial<T>)
  }

  const handleVillageChange = (event: SelectChangeEvent<string>) => {
    updateFormData({ villageId: event.target.value } as Partial<T>)
  }

  return (
    <>
      <TextField
        label="Address"
        name="address"
        value={formData.address || ""}
        onChange={handleTextChange}
        fullWidth
        margin="normal"
      />

      <FormControl fullWidth margin="normal">
        <InputLabel id="city-label">City</InputLabel>
        <Select
          labelId="city-label"
          id="city"
          name="cityId"
          value={formData.cityId || ""}
          label="City"
          onChange={handleCityChange}
        >
          <MenuItem value="">Select a city</MenuItem>
          {cities.map((city) => (
            <MenuItem key={city.id} value={city.id}>
              {city.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel id="sector-label">Sector</InputLabel>
        <Select
          labelId="sector-label"
          id="sector"
          name="sectorId"
          value={formData.sectorId || ""}
          label="Sector"
          onChange={handleSectorChange}
          disabled={!selectedCity}
        >
          <MenuItem value="">Select a sector</MenuItem>
          {sectors.map((sector) => (
            <MenuItem key={sector.id} value={sector.id}>
              {sector.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel id="village-label">Village</InputLabel>
        <Select
          labelId="village-label"
          id="village"
          name="villageId"
          value={formData.villageId || ""}
          label="Village"
          onChange={handleVillageChange}
          disabled={!selectedSector}
        >
          <MenuItem value="">Select a village</MenuItem>
          {villages.map((village) => (
            <MenuItem key={village.id} value={village.id}>
              {village.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Commune"
        name="commune"
        value={formData.commune || ""}
        onChange={handleTextChange}
        fullWidth
        margin="normal"
      />

      <TextField
        label="Quartier"
        name="quartier"
        value={formData.quartier || ""}
        onChange={handleTextChange}
        fullWidth
        margin="normal"
      />
    </>
  )
}

export default Form4Address
