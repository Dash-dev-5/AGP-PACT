"use client"

import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Button, Modal, Row, Spinner, Table, Form } from "react-bootstrap"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { toast } from "react-toastify"
import { zodResolver } from "@hookform/resolvers/zod"
import DeleteVille from "./DeleteVille"
import { useNavigate } from "react-router-dom"

import { createCitySchema } from "features/ville/cityValidation"
import { fetchCitiesByTerritory, addCity } from "features/ville/citySlice"
import { fetchProvinces } from "features/province/provinceSlice"
import type { CreateCity } from "features/ville/villeType"
import UpdateVille from "./UpdateVille"

export default function Ville() {
  const [show, setShow] = useState(false)
  const [idProvince, setIdProvince] = useState("")
  const [idProvinceForAdd, setIdProvinceForAdd] = useState("")
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { provinces } = useAppSelector((state) => state.province)
  const { cities, error, status } = useAppSelector((state) => state.Villes)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateCity>({
    resolver: zodResolver(createCitySchema),
  })

  useEffect(() => {
    dispatch(fetchProvinces())
  }, [dispatch])

  useEffect(() => {
    if (idProvince) {
      dispatch(fetchCitiesByTerritory({ id: idProvince }))
    }
  }, [dispatch, idProvince])

  const onSubmit = async (data: CreateCity) => {
    console.log("1111", data)

    const cityData = { ...data }

    console.log("cityData", cityData)
    const toastId = toast.loading("Veuillez patienter...")
    try {
      await dispatch(addCity(cityData)).unwrap()
      toast.update(toastId, {
        render: "Ville ajoutée avec succès",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      })
      handleClose()
    } catch (error) {
      toast.update(toastId, {
        render: String(error),
        type: "error",
        isLoading: false,
        autoClose: 3000,
      })
    }
  }

  const handleClose = () => {
    setShow(false)
    reset()
  }

  const handleShow = () => setShow(true)

  return (
    <>
      <div className="row">
        <div className="d-flex justify-content-between mb-3">
          <div>
            <span className="fs-4">Liste des villes</span>
          </div>
          <Button variant="primary" onClick={handleShow}>
            Ajouter une ville
          </Button>
        </div>

        <Form.Group className="mb-3">
          <Form.Label>Choisir une province</Form.Label>
          <Form.Select value={idProvince} onChange={(e) => setIdProvince(e.target.value)}>
            <option value="">-- Sélectionnez une province --</option>
            {provinces.map((province) => (
              <option key={province.id} value={province.id}>
                {province.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Row>
          <div>
            <Table striped bordered hover responsive className="table-sm">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Nom</th>
                  <th>Nombre de quartiers</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {status === "loading" && (
                  <tr>
                    <td colSpan={4} className="text-center">
                      <Spinner animation="border" size="sm" className="text-primary" />
                    </td>
                  </tr>
                )}
                {status === "failed" && (
                  <tr>
                    <td colSpan={4} className="text-center text-danger">
                      {error}
                    </td>
                  </tr>
                )}
                {status === "succeeded" &&
                  cities.length > 0 &&
                  cities.map((city, index) => (
                    <React.Fragment key={city.id}>
                      <tr>
                        <td>{index + 1}</td>
                        <td>{city.name}</td>
                        <td>
                          {(city as any).sectors?.reduce(
                            (total: number, sector: any) => total + (sector.villages?.length || 0),
                            0,
                          ) || 0}
                        </td>
                        <td>
                          <div className="d-flex gap-2 justify-content-center">
                            <Button disabled={!(city as any).sectors?.length} onClick={() => navigate(city.id || "")}>
                              Secteurs
                            </Button>
                            <UpdateVille ville={city} />
                            <DeleteVille id={city.id || ""} name={city.name || ""} />
                          </div>
                        </td>
                      </tr>
                      {(city as any).sectors?.map((sector: any) => (
                        <React.Fragment key={sector.id}>
                          <tr className="bg-light">
                            <td></td>
                            <td colSpan={2}>
                              <div>
                                <strong>Secteur :</strong> {sector.name}
                              </div>
                              <div className="text-muted small">Réf: {sector.referenceNumber}</div>
                              <div>
                                <strong>Villages :</strong>
                                <ul>
                                  {sector.villages?.map((village: any) => (
                                    <li key={village.id}>
                                      <div>
                                        <strong>Nom :</strong> {village.name} — {village.projectSiteName}
                                      </div>
                                      <div className="text-muted small">
                                        Comité: {village.committeeName} | Réf: {village.referenceNumber}
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </td>
                            <td></td>
                          </tr>
                        </React.Fragment>
                      ))}
                    </React.Fragment>
                  ))}
                {status === "succeeded" && cities.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center">
                      Aucune ville trouvée
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Row>
      </div>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter une ville</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group mb-3">
              <label htmlFor="name">Nom</label>
              <input
                id="name"
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                {...register("name", { required: "Le nom est obligatoire" })}
              />
              {errors.name && <small className="text-danger">{errors.name.message}</small>}
            </div>

            {/* Sélection de la province dans le modal */}
            <div className="form-group mb-3">
              <label htmlFor="province">Province</label>
              <Form.Select
                id="province"
                {...register("province", { required: "La province est obligatoire" })} // Utilisation de register de react-hook-form
                defaultValue={idProvinceForAdd} // Utilisation de defaultValue pour initialiser la valeur si nécessaire
              >
                <option value="">-- Sélectionnez une province --</option>
                {provinces.map((province) => (
                  <option key={province.id} value={province.id}>
                    {province.name}
                  </option>
                ))}
              </Form.Select>
              {errors.province && <small className="text-danger">{errors.province.message}</small>}

              {errors.province && <small className="text-danger">{errors.province.message}</small>}
            </div>

            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </>
  )
}
