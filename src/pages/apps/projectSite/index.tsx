import { z } from 'zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Modal, Row, Spinner, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { toast } from 'react-toastify';
import UpdateProjectSite from './UpdateProjectSite';
import DeleteProjectSite from './DeleteProjectSite';
import { CreateProjectSiteSchema } from 'features/project-site/projectSiteType';
import { createProjectSiteAsync, fetchProjectSitesAsync } from 'features/project-site/projectSiteSlice';

const ProjectSite = () => {
  const [show, setShow] = useState(false);
  const dispatch = useAppDispatch();

  const { projectSites, status, error, createStatus } = useAppSelector((state) => state.projectSite);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<z.infer<typeof CreateProjectSiteSchema>>();

  React.useEffect(() => {
    dispatch(fetchProjectSitesAsync());
  }, [dispatch]);

  // Handle form submission
  const onSubmit = async (data: z.infer<typeof CreateProjectSiteSchema>) => {
    const toastId = toast.loading('Veuillez patienter...');
    try {
      await dispatch(createProjectSiteAsync(data)).unwrap();
      toast.update(toastId, {
        render: 'Tronçon ajouté avec succès.',
        type: 'success',
        isLoading: false,
        autoClose: 2000
      });
      handleClose();
    } catch (error) {
      toast.update(toastId, {
        render: `Erreur: ${error}`,
        type: 'error',
        isLoading: false,
        autoClose: 4000
      });
    }
  };

  // Modal handlers
  const handleClose = () => {
    reset();
    setShow(false);
  };
  const handleShow = () => setShow(true);

  return (
    <>
      <div className="row">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold">Liste des tronçons routiers</h4>
          <Button variant="primary" onClick={handleShow} className="shadow-sm">
            Ajouter un tronçon
          </Button>
        </div>

        <div>
          <Table striped bordered hover responsive className="shadow-sm">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Nom</th>
                <th>Localités</th>
                <th>Actions</th>
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
                    {error || 'Erreur de chargement. Veuillez réessayer.'}
                  </td>
                </tr>
              )}
              {status === 'succeeded' &&
                projectSites.length > 0 &&
                projectSites.map((site, index) => (
                  <tr key={site.id}>
                    <td>{index + 1}</td>
                    <td>{site.name}</td>
                    <td>{site.villages?.map((village) => village.name).join(', ') || 'Aucune localité'}</td>
                    <td style={{ width: '1%' }}>
                      <div className="d-flex justify-content-center gap-2">
                        <UpdateProjectSite site={site} />
                        <DeleteProjectSite id={site.id} name={site.name} />
                      </div>
                    </td>
                  </tr>
                ))}
              {status === 'succeeded' && projectSites.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center">
                    Aucun tronçon trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>

      {/* Add Project Site Modal */}
      {show && (
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Ajouter un tronçon routier</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group mb-3">
                <label htmlFor="name" className="fw-bold">
                  Nom du tronçon
                </label>
                <input
                  id="name"
                  type="text"
                  className={`form-control shadow-sm ${errors.name ? 'is-invalid' : ''}`}
                  placeholder="Entrez le nom du tronçon"
                  {...register('name', { required: 'Ce champ est requis.' })}
                />
                {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
              </div>
              <Button type="submit" variant="primary" className="w-100 shadow-sm">
                {createStatus !== 'loading' ? (
                  'Enregistrer'
                ) : (
                  <>
                    <Spinner size="sm" /> Enregistrement...
                  </>
                )}
              </Button>
            </form>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default ProjectSite;
