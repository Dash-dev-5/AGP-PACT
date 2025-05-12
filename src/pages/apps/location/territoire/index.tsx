"use client"

import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Button, Modal, Row, Spinner, Table, Form } from "react-bootstrap"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { toast } from "react-toastify"
import { zodResolver } from "@hookform/resolvers/zod"
import { createTerritorySchema } from "features/territoire/territoryValidation"
import { addTerritory, fetchTerritories } from "features/territoire/territorySlice"
import { fetchProvinces } from "features/province/provinceSlice"
import type { CreateTerritory } from "features/territoire/territoryType"
import DeleteTerritoire from "./DeleteTerritoire"
import UpdateTerritoire from "./UpdateTerritoire"
import { useNavigate } from "react-router-dom"

export default function Territoire() {
  const [show, setShow] = useState(false)
  const [idProvince, setIdProvince] = useState("")
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { provinces } = useAppSelector((state) => state.province)
  const { territories, error, status } = useAppSelector((state) => state.territory)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateTerritory>({
    resolver: zodResolver(createTerritorySchema),
    defaultValues: {
      name: "",
      province: "",
    },
  })

  const provinceInModal = watch("province")

  useEffect(() => {
    dispatch(fetchProvinces())
  }, [dispatch])

  useEffect(() => {
    if (idProvince) {
      dispatch(fetchTerritories({ id: idProvince }))
    }
  }, [dispatch, idProvince])

  const onSubmit = async (data: CreateTerritory) => {
    const toastId = toast.loading("Veuillez patienter...")

    try {
      await dispatch(addTerritory(data)).unwrap()
      toast.update(toastId, {
        render: "Territoire ajouté avec succès",
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
          <span className="fs-4">Liste des territoires</span>
          <Button variant="primary" onClick={handleShow}>
            Ajouter un territoire
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
          <Table striped bordered hover responsive className="table-sm">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Nom</th>
                <th>Nombre de villages</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {status === "loading" && (
                <tr>
                  <td colSpan={4} className="text-center">
                    <Spinner animation="border" size="sm" />
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
                territories.length > 0 &&
                territories.map((territory, index) => (
                  <React.Fragment key={territory.id}>
                    <tr>
                      <td>{index + 1}</td>
                      <td>{territory.name}</td>
                      <td>{territory.villages?.length || 0}</td>
                      <td>
                        <div className="d-flex gap-2 justify-content-center">
                          <Button disabled={!territory.villages?.length} onClick={() => navigate(territory.id)}>
                            Villages
                          </Button>
                          <UpdateTerritoire territory={territory} />
                          <DeleteTerritoire id={territory.id} name={territory.name || ""} />
                        </div>
                      </td>
                    </tr>
                    {territory.villages?.map((village) => (
                      <tr key={village.id} className="bg-light">
                        <td></td>
                        <td colSpan={2}>
                          <div>
                            <strong>Village :</strong> {village.name} — {village.projectSiteName}
                          </div>
                          <div className="text-muted small">
                            Réf: {village.referenceNumber} | Comité: {village.committeeName}
                          </div>
                        </td>
                        <td></td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              {status === "succeeded" && territories.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center">
                    Aucun territoire trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Row>
      </div>

      {/* Modal pour ajouter un territoire */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un territoire</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group mb-3">
              <label htmlFor="name">Nom</label>
              <input id="name" className={`form-control ${errors.name ? "is-invalid" : ""}`} {...register("name")} />
              {errors.name && <small className="text-danger">{errors.name.message}</small>}
            </div>

            <div className="form-group mb-3">
              <label htmlFor="province">Province</label>
              <Form.Select id="province" {...register("province")} defaultValue="">
                <option value="">-- Sélectionnez une province --</option>
                {provinces.map((province) => (
                  <option key={province.id} value={province.id || ""}>
                    {province.name}
                  </option>
                ))}
              </Form.Select>
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
