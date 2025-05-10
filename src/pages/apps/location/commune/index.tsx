import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Modal, Row, Spinner, Table, Form } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { toast } from 'react-toastify';
import { zodResolver } from '@hookform/resolvers/zod';
import { createSectorSchema } from 'features/sector/communeValidation';
import { createSector, fetchSectors } from 'features/sector/communeSlice';
import { fetchCitiesByTerritory } from 'features/ville/citySlice';
import { fetchProvinces } from 'features/province/provinceSlice';
import { CreateSector } from 'features/sector/communeType';
import DeleteCommune from './DeleteCommune';
import UpdateCommune from './UpdateCommune';
import { useNavigate } from 'react-router-dom';

export default function Commune() {
  const [show, setShow] = useState(false);
  const [provinceId, setProvinceId] = useState('');
  const [idCity, setIdCity] = useState('');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { provinces } = useAppSelector((state) => state.province);
  const { cities } = useAppSelector((state) => state.Villes);
  const { sectors, error, status } = useAppSelector((state) => state.sectors);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<CreateSector>({
    resolver: zodResolver(createSectorSchema),
    defaultValues: {
      name: '',
      city: ''
    }
  });

  useEffect(() => {
    dispatch(fetchProvinces());
  }, [dispatch]);

  useEffect(() => {
    if (provinceId) {
      dispatch(fetchCitiesByTerritory({ id: provinceId }));
      setIdCity(''); // Réinitialiser ville à vide
    }
  }, [provinceId, dispatch]);

  useEffect(() => {
    if (idCity) {
      dispatch(fetchSectors({ id: idCity }));
    }
  }, [idCity, dispatch]);

  const onSubmit = async (data: CreateSector) => {
    const toastId = toast.loading('Veuillez patienter...');
    try {
      await dispatch(createSector(data)).unwrap();
      toast.update(toastId, {
        render: 'Commune ajoutée avec succès',
        type: 'success',
        isLoading: false,
        autoClose: 2000
      });
      handleClose();
    } catch (error) {
      toast.update(toastId, {
        render: String(error),
        type: 'error',
        isLoading: false,
        autoClose: 3000
      });
    }
  };

  const handleClose = () => {
    setShow(false);
    reset();
  };

  const handleShow = () => setShow(true);

  return (
    <>
      <div className="row">
        <div className="d-flex justify-content-between mb-3">
          <span className="fs-4">Liste des communes</span>
          <Button variant="primary" onClick={handleShow}>
            Ajouter une commune
          </Button>
        </div>

        {/* Province puis ville */}
        <Form.Group className="mb-3">
          <Form.Label>Choisir une province</Form.Label>
          <Form.Select value={provinceId} onChange={(e) => setProvinceId(e.target.value)}>
            <option value="">-- Sélectionnez une province --</option>
            {provinces.map((province) => (
              <option key={province.id} value={province.id}>
                {province.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Choisir une ville</Form.Label>
          <Form.Select
            value={idCity}
            onChange={(e) => setIdCity(e.target.value)}
            disabled={!provinceId}
          >
            <option value="">-- Sélectionnez une ville --</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
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
              {status === 'loading' && (
                <tr>
                  <td colSpan={4} className="text-center">
                    <Spinner animation="border" size="sm" />
                  </td>
                </tr>
              )}
              {status === 'failed' && (
                <tr>
                  <td colSpan={4} className="text-center text-danger">
                    {error}
                  </td>
                </tr>
              )}
              {status === 'succeeded' && sectors.length > 0 &&
                sectors.map((sector, index) => (
                  <React.Fragment key={sector.id}>
                    <tr>
                      <td>{index + 1}</td>
                      <td>{sector.name}</td>
                      <td>{sector.villages?.length || 0}</td>
                      <td>
                        <div className="d-flex gap-2 justify-content-center">
                          <Button
                            disabled={!sector.villages?.length}
                            onClick={() => navigate(sector.id)}
                          >
                            Villages
                          </Button>
                          <UpdateCommune sector={sector} />
                          <DeleteCommune id={sector.id} name={sector.name} />
                        </div>
                      </td>
                    </tr>
                    {sector.villages?.map((village) => (
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
                ))
              }
              {status === 'succeeded' && sectors.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center">
                    Aucune commune trouvée
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Row>
      </div>

      {/* Modal d'ajout */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter une commune</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group mb-3">
              <label htmlFor="name">Nom</label>
              <input
                id="name"
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                {...register('name')}
              />
              {errors.name && <small className="text-danger">{errors.name.message}</small>}
            </div>

            <div className="form-group mb-3">
              <label htmlFor="city">Ville</label>
              <Form.Select
                id="city"
                {...register('city', { required: 'La ville est obligatoire' })}
                disabled={!provinceId}
              >
                <option value="">-- Sélectionnez une ville --</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </Form.Select>
              {errors.city && <small className="text-danger">{errors.city.message}</small>}
            </div>

            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}
