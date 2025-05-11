"use client"

import { useEffect, useState } from "react"
import { Button, Form, Modal, Spinner } from "react-bootstrap"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { updateSector } from "features/sector/communeSlice"
import { updateSectorSchema } from "features/sector/communeValidation"
import type { UpdateSectorType } from "features/sector/communeType"
import { FaRegEdit } from "react-icons/fa"
import { toast } from "react-toastify"
import { fetchCitiesByTerritory } from "features/ville/citySlice"

const UpdateCommune = ({ sector }: { sector: UpdateSectorType }) => {
  const [show, setShow] = useState(false)
  const dispatch = useAppDispatch()
  const { updateStatus } = useAppSelector((state) => state.sectors)
  const { cities } = useAppSelector((state) => state.Villes)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateSectorType>({
    resolver: zodResolver(updateSectorSchema),
    defaultValues: {
      id: sector.id || "",
      name: sector.name || "",
      city: sector.city || "",
    },
  })

  useEffect(() => {
    reset({
      id: sector.id || "",
      name: sector.name || "",
      city: sector.city || "",
    })
  }, [sector, reset])

  useEffect(() => {
    if (sector.city) {
      dispatch(fetchCitiesByTerritory({ id: sector.id }))
    }
  }, [dispatch, sector.city, sector.id])

  const handleShow = () => {
    reset({ id: sector.id, name: sector.name, city: sector.city })
    setShow(true)
  }

  const handleClose = () => {
    setShow(false)
  }

  const onSubmit = async (data: UpdateSectorType) => {
    try {
      await dispatch(updateSector(data)).unwrap()
      toast.success("Commune mise à jour avec succès")
      handleClose()
    } catch (err) {
      toast.error("Échec de la mise à jour")
    }
  }

  return (
    <>
      <Button variant="warning" size="sm" onClick={handleShow}>
        <FaRegEdit />
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Modifier la commune</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nom de la commune</Form.Label>
              <Form.Control {...register("name")} className={errors.name ? "is-invalid" : ""} />
              {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Ville</Form.Label>
              <Form.Select {...register("city")} className={errors.city ? "is-invalid" : ""}>
                <option value="">-- Sélectionnez une ville --</option>
                {cities.map((city) => (
                  <option key={city.id || ""} value={city.id || ""}>
                    {city.name || ""}
                  </option>
                ))}
              </Form.Select>
              {errors.city && <div className="invalid-feedback">{errors.city.message}</div>}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Annuler
            </Button>
            <Button variant="primary" type="submit" disabled={updateStatus === "loading"}>
              {updateStatus === "loading" ? <Spinner size="sm" /> : "Enregistrer"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}

export default UpdateCommune
