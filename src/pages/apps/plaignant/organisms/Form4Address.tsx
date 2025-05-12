"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { TextField, Select, FormControl, InputLabel } from "@mui/material"

// Define a more specific type for formData
interface FormData {
  address?: string
  cityId?: string
  sectorId?: string
  villageId?: string
  commune?: string
  quartier?: string
  [key: string]: any // Allow other properties
}

interface Form4AddressProps {
  formData: FormData
  setFormData: (data: FormData) => void
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

const Form4Address: React.FC<Form4AddressProps> = ({ formData, setFormData }) => {
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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value })
  }

  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(event.target.value)
    setFormData({ ...formData, cityId: event.target.value })
    setSelectedSector("")
    setVillages([])
  }

  const handleSectorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSector(event.target.value)
    setFormData({ ...formData, sectorId: event.target.value })
  }

  return (
    <>
      <TextField
        label="Address"
        name="address"
        value={formData.address || ""}
        onChange={handleChange}
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
          native
        >
          <option value="">Select a city</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
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
          native
        >
          <option value="">Select a sector</option>
          {sectors.map((sector) => (
            <option key={sector.id} value={sector.id}>
              {sector.name}
            </option>
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
          onChange={handleChange}
          disabled={!selectedSector}
          native
        >
          <option value="">Select a village</option>
          {villages.map((village) => (
            <option key={village.id} value={village.id}>
              {village.name}
            </option>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Commune"
        name="commune"
        value={formData.commune || ""}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />

      <TextField
        label="Quartier"
        name="quartier"
        value={formData.quartier || ""}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
    </>
  )
}

export default Form4Address
