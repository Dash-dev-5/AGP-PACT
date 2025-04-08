import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AiOutlineFolderView } from 'react-icons/ai';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Form, Modal, Pagination, Row, Spinner, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { toast } from 'react-toastify';
import { createSpeciesAsync, fetchSpeciesAsync } from 'features/species/speciesSlice';
import { CreateSpeciesSchema } from 'features/species/SpeciesTypes';
import { fetchUnitsAsync } from 'features/units/unitsSlice';
import { fetchAssetTypesAsync } from 'features/asset-type/assetTypeSlice';
import UpdateSpecies from './UpdateSpecies';
import DeleteSpecies from './DeleteSpecies';
import { Link } from 'react-router-dom';

export default function Species() {
  const [show, setShow] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const dispatch = useAppDispatch();
  const { speciesList, status, error, createStatus } = useAppSelector((state) => state.species);
  const { units } = useAppSelector((state) => state.units);
  const { assetTypes } = useAppSelector((state) => state.assetType);

  const createSpeciesForm = useForm<z.infer<typeof CreateSpeciesSchema>>({
    resolver: zodResolver(CreateSpeciesSchema)
  });

  React.useEffect(() => {
    dispatch(fetchSpeciesAsync());
    dispatch(fetchUnitsAsync());
    dispatch(fetchAssetTypesAsync());
  }, [dispatch]);

  const handleClose = () => {
    setShow(false);
    createSpeciesForm.reset();
  };
  const handleShow = () => setShow(true);

  // Pagination logic
  const totalPages = Math.ceil(speciesList.length / itemsPerPage);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSpeciesList = speciesList.slice(startIndex, endIndex);

  const onCreateSpecies = async (data: z.infer<typeof CreateSpeciesSchema>) => {
    try {
      await dispatch(createSpeciesAsync(data)).unwrap();
      toast.success('Espèce ajoutée avec succès !', {
        autoClose: 2000
      });
      handleClose();
    } catch (error) {
      toast.error(String(error), {
        autoClose: 4000
      });
    }
  };

  return (
    <>
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold">Liste des espèces </h3>
          <Button variant="primary" onClick={handleShow} className="shadow-sm">
            Ajouter une espèce
          </Button>
        </div>
        <div>
          <Table striped bordered hover responsive className="shadow-sm">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Nom</th>
                <th>Type d'actif</th>
                <th>Unité de mesure</th>
                <th>Total tronçons</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {status === 'loading' && (
                <tr>
                  <td colSpan={6} className="text-center">
                    <Spinner animation="border" size="sm" className="text-primary" />
                  </td>
                </tr>
              )}
              {status === 'failed' && (
                <tr>
                  <td colSpan={6} className="text-center text-danger">
                    {error}
                  </td>
                </tr>
              )}
              {status === 'succeeded' &&
                speciesList.length > 0 &&
                currentSpeciesList.map((species, index) => (
                  <tr key={species.id}>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>{species.name}</td>
                    <td>{species.typeName}</td>
                    <td className="text-center">{species.name !== 'Autres' ? species.unitName : '-'}</td>
                    <td style={{ width: '1%' }} className="text-center">
                      {species.prices.length}
                    </td>

                    <td style={{ width: '1%' }}>
                      <div className="d-flex gap-2 align-items-center justify-content-center">
                        <Link to={species.id} className="text-black">
                          <AiOutlineFolderView size={30} />
                        </Link>

                        <UpdateSpecies species={species} />
                        <DeleteSpecies id={species.id} name={species.name} />
                      </div>
                    </td>
                  </tr>
                ))}
              {status === 'succeeded' && speciesList.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center">
                    Aucune espèce trouvée
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
          <div className="d-flex justify-content-end">
            <Pagination>
              {Array.from({ length: totalPages }, (_, index) => (
                <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => handlePageChange(index + 1)}>
                  {index + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </div>
        </div>
      </div>

      {show && (
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Créer une Espèce {createStatus === 'loading' && <Spinner size="sm" className="ms-2" />}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={createSpeciesForm.handleSubmit(onCreateSpecies)}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Nom</Form.Label>
                <Form.Control
                  id="name"
                  className={`form-control shadow-sm ${createSpeciesForm.formState.errors.name ? 'is-invalid' : ''}`}
                  {...createSpeciesForm.register('name')}
                />
                {createSpeciesForm.formState.errors.name && (
                  <div className="invalid-feedback">{createSpeciesForm.formState.errors.name.message}</div>
                )}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Type d'actif</Form.Label>
                <Form.Select
                  className={`shadow-sm ${createSpeciesForm.formState.errors.type ? 'is-invalid' : ''}`}
                  {...createSpeciesForm.register('type')}
                >
                  <option value="">Sélectionnez un type d'actif</option>
                  {assetTypes.map((type, index) => (
                    <option key={index} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </Form.Select>
                {createSpeciesForm.formState.errors.type && (
                  <div className="invalid-feedback">{createSpeciesForm.formState.errors.type.message}</div>
                )}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Unité de mesure</Form.Label>
                <Form.Select
                  className={`shadow-sm ${createSpeciesForm.formState.errors.unit ? 'is-invalid' : ''}`}
                  {...createSpeciesForm.register('unit')}
                >
                  <option value="">Sélectionnez une unité de mesure</option>
                  {units.map((unit, index) => (
                    <option key={index} value={unit.id}>
                      {unit.name}
                    </option>
                  ))}
                </Form.Select>
                {createSpeciesForm.formState.errors.unit && (
                  <div className="invalid-feedback">{createSpeciesForm.formState.errors.unit.message}</div>
                )}
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100 shadow-sm">
                Enregistrer
              </Button>
            </form>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
}
