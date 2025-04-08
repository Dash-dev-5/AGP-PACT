import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Form, Modal, Pagination, Row, Spinner, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { toast } from 'react-toastify';
import { createSpeciesPriceAsync, fetchOneSpeciesAsync } from 'features/species/speciesSlice';
import { CreateSpeciesPriceSchema } from 'features/species/SpeciesTypes';
import { IoMdArrowRoundBack } from 'react-icons/io';

import UpdateSpeciesPrice from './UpdateSpeciesPrice';
import DeleteSpeciesPrice from './DeleteSpeciesPrice';
import { fetchProjectSitesAsync } from 'features/project-site/projectSiteSlice';
import { Link, useParams } from 'react-router-dom';

export default function SpeciesPrice() {
  const [show, setShow] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const { priceId } = useParams();
  const dispatch = useAppDispatch();
  const { fetchOneStatus, oneSpecies, createPriceStatus } = useAppSelector((state) => state.species);
  const { projectSites } = useAppSelector((state) => state.projectSite);

  const OmittedCreateSpeciesPriceSchema = CreateSpeciesPriceSchema.omit({ species: true });

  const createSpeciesPriceForm = useForm<z.infer<typeof OmittedCreateSpeciesPriceSchema>>({
    resolver: zodResolver(OmittedCreateSpeciesPriceSchema)
  });

  React.useEffect(() => {
    if (priceId) {
      dispatch(fetchOneSpeciesAsync(priceId));
    }
  }, [dispatch, priceId]);

  React.useEffect(() => {
    dispatch(fetchProjectSitesAsync());
  }, [dispatch]);

  const handleClose = () => {
    setShow(false);
    createSpeciesPriceForm.reset();
  };
  const handleShow = () => setShow(true);

  // Pagination logic
  const totalPages = Math.ceil((oneSpecies?.prices?.length ?? 0) / itemsPerPage);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSpeciesPrice = oneSpecies?.prices.slice(startIndex, endIndex);

  const onCreateSpeciesPrices = async (data: z.infer<typeof OmittedCreateSpeciesPriceSchema>) => {
    try {
      if (!oneSpecies) {
        throw new Error("L'élément n'est plus disponible");
      }
      const newData = { ...data, species: oneSpecies.id };

      await dispatch(createSpeciesPriceAsync(newData)).unwrap();

      toast.success('Prix ajouté avec succès !', { autoClose: 2000 });
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
        <div className="mb-3">
          <Link to=".." className="text-decoration-none fw-semibold">
            <IoMdArrowRoundBack /> Retour
          </Link>
        </div>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold">
            Liste des prix pour l'espèce : <span className="text-primary">{oneSpecies?.name}</span>
          </h3>
          <Button variant="primary" onClick={handleShow} className="shadow-sm">
            Ajouter un prix
          </Button>
        </div>
        <Row className="p-0 m-0">
          <Table striped bordered hover responsive className="shadow-sm">
            <thead className="bg-dark text-white">
              <tr>
                <th>#</th>
                <th>Tronçon</th>
                <th>Espèce</th>
                <th>Prix</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {fetchOneStatus === 'loading' && (
                <tr>
                  <td colSpan={5} className="text-center">
                    <Spinner animation="border" size="sm" className="text-primary" />
                  </td>
                </tr>
              )}
              {fetchOneStatus === 'failed' && (
                <tr>
                  <td colSpan={5} className="text-center text-danger">
                    Une erreur s'est produite lors du chargement des données.
                  </td>
                </tr>
              )}
              {fetchOneStatus === 'succeeded' &&
                currentSpeciesPrice &&
                currentSpeciesPrice.length > 0 &&
                currentSpeciesPrice.map((speciePrices, index) => (
                  <tr key={speciePrices.id}>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>{speciePrices.projectSiteName}</td>
                    <td>{speciePrices.speciesName}</td>
                    <td>{speciePrices.price}</td>

                    <td style={{ width: '1%' }}>
                      <div className="d-flex gap-2 align-items-center justify-content-center">
                        <UpdateSpeciesPrice speciePrices={speciePrices} />
                        <DeleteSpeciesPrice id={speciePrices.id} name={speciePrices.projectSiteName} />
                      </div>
                    </td>
                  </tr>
                ))}
              {fetchOneStatus === 'succeeded' && (currentSpeciesPrice ?? []).length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center">
                    Aucun prix trouvé
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
        </Row>
      </div>

      {show && (
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Ajouter un prix {createPriceStatus === 'loading' && <Spinner size="sm" className="ms-2" />}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={createSpeciesPriceForm.handleSubmit(onCreateSpeciesPrices)}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Tronçons</Form.Label>
                <Form.Select
                  className={`shadow-sm ${createSpeciesPriceForm.formState.errors.projectSite ? 'is-invalid' : ''}`}
                  {...createSpeciesPriceForm.register('projectSite')}
                >
                  <option value="">Sélectionnez un tronçon</option>
                  {projectSites.map((site, index) => (
                    <option key={index} value={site.id}>
                      {site.name}
                    </option>
                  ))}
                </Form.Select>
                {createSpeciesPriceForm.formState.errors.projectSite && (
                  <div className="invalid-feedback">{createSpeciesPriceForm.formState.errors.projectSite.message}</div>
                )}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Prix</Form.Label>
                <Form.Control
                  className={`shadow-sm ${createSpeciesPriceForm.formState.errors.price ? 'is-invalid' : ''}`}
                  {...createSpeciesPriceForm.register('price', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                />
                {createSpeciesPriceForm.formState.errors.price && (
                  <div className="invalid-feedback">{createSpeciesPriceForm.formState.errors.price.message}</div>
                )}
              </Form.Group>
              <Button variant="primary" type="submit" className="shadow-sm w-100">
                Enregistrer
              </Button>
            </form>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
}
