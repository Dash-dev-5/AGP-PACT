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
import { CreateVulnerabiliteSchema } from 'features/species/SpeciesTypes';
import { fetchUnitsAsync } from 'features/units/unitsSlice';
import { fetchAssetTypesAsync } from 'features/asset-type/assetTypeSlice';
import UpdateSpecies from './UpdateVulnerabilite';
import DeleteSpecies from './DeleteVulnerabilite';
import { Link } from 'react-router-dom';
import useAuth from 'hooks/useAuth';

interface Vulnerabilite {
  id: string;
  referenceNumber: string;
  name: string;
}

export default function Vulnerabilite() {
  const [show, setShow] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const dispatch = useAppDispatch();
  const { speciesList, status, error, createStatus } = useAppSelector((state) => state.species);
  const { units } = useAppSelector((state) => state.units);
  const { assetTypes } = useAppSelector((state) => state.assetType);

  const [vulnerabilites, setVulnerabilites] = useState<Vulnerabilite[]>([]);
  const { user } = useAuth();
  const createVulnerabiliteForm = useForm<z.infer<typeof CreateVulnerabiliteSchema>>({
    resolver: zodResolver(CreateVulnerabiliteSchema)
  });

  React.useEffect(() => {
    dispatch(fetchSpeciesAsync());
    dispatch(fetchUnitsAsync());
    dispatch(fetchAssetTypesAsync());
  }, [dispatch]);

  const handleClose = () => {
    setShow(false);
    createVulnerabiliteForm.reset();
  };
  const handleShow = () => setShow(true);

  // Pagination logic
  const totalPages = Math.ceil(vulnerabilites.length / itemsPerPage);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  //const vulnerabilites = speciesList.slice(startIndex, endIndex);
  // delete Vulnerabilite
  const handleDeleteVulnerabilite = async (id: string, reason: string) => {
    try {
      const token = user?.token;
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}vulnerability-level/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Add token to Authorization header
        },
        body: JSON.stringify({ reason }), // Include reason in the request body
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete vulnerability');
      }
      setVulnerabilites((prev) => prev.filter((vulnerabilite) => vulnerabilite.id !== id));
      toast.success('Vulnérabilité supprimée avec succès !', {
        autoClose: 2000
      });
    } catch (error) {
      toast.error('Erreur lors de la suppression de la vulnérabilité', {
        autoClose: 4000
      });
    }
  };
  // Ajout Vulnerabilites
  const handleAddVulnerabilite = async (data: z.infer<typeof CreateVulnerabiliteSchema>) => {
    try {
      const token = user?.token;
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}vulnerability-level`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Add token to Authorization header
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to add vulnerability');
      }
      const newVulnerabilite = await response.json();
      setVulnerabilites((prev) => [...prev, newVulnerabilite]);
      toast.success('Vulnérabilité ajoutée avec succès !', {
        autoClose: 2000
      });
      handleClose();
    } catch (error) {
      toast.error('Erreur lors de l\'ajout de la vulnérabilité', {
        autoClose: 4000
      });
    }
  };
  // fetch Vulnerabilites
  React.useEffect(() => {
    const fetchVulnerabilities = async () => {
      try {
        const token = user?.token;
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}vulnerability-level`, {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to Authorization header
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch vulnerabilities');
        }
        const data = await response.json();
        setVulnerabilites(data);
         
      } catch (error) {
        console.error('Error fetching vulnerabilities:', error);
      }
    };
    fetchVulnerabilities();
  }, []);
 

  return (
    <>
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold">Liste des Vulnérabilités </h3>
          <Button variant="primary" onClick={handleShow} className="shadow-sm">
            Ajouter une Vulnerabilite
          </Button>
        </div>
        <div>
          <Table striped bordered hover responsive className="shadow-sm">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Numéro de référence</th>
                <th>Nom</th>
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
                vulnerabilites?.map((vulnerabilte: Vulnerabilite, index: number) => (
                  <tr key={vulnerabilte.id}>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>{vulnerabilte.referenceNumber}</td>
                    <td>{vulnerabilte.name}</td>
                  
                   

                    <td style={{ width: '1%' }}>
                      <div className="d-flex gap-2 align-items-center justify-content-center">
                        <Link to={vulnerabilte.id} className="text-black">
                          <AiOutlineFolderView size={30} />
                        </Link>

                        {/* <UpdateSpecies species={vulnerabilte} /> */}
                         
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteVulnerabilite(vulnerabilte.id,'Données créées par erreur')}
                          className="shadow-sm"
                        >
                          Supprimer
                        </Button>
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
            <Modal.Title>Créer une Vulnerabilite {createStatus === 'loading' && <Spinner size="sm" className="ms-2" />}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={createVulnerabiliteForm.handleSubmit(handleAddVulnerabilite)}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Nom</Form.Label>
                <Form.Control
                  id="name"
                  className={`form-control shadow-sm ${createVulnerabiliteForm.formState.errors.name ? 'is-invalid' : ''}`}
                  {...createVulnerabiliteForm.register('name')}
                />
                {createVulnerabiliteForm.formState.errors.name && (
                  <div className="invalid-feedback">{createVulnerabiliteForm.formState.errors.name.message}</div>
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
