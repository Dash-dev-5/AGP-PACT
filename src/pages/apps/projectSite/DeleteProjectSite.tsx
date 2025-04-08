import { z } from 'zod';
import { useState } from 'react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import { FaRegTrashAlt } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { deleteProjectSiteAsync } from 'features/project-site/projectSiteSlice';
import { DeleteProjectSiteSchema } from 'features/project-site/projectSiteType';

const DeleteProjectSite = ({ id, name }: { id: string; name: string }) => {
  const [show, setShow] = useState(false);
  const dispatch = useAppDispatch();
  const { deleteStatus } = useAppSelector((state) => state.projectSite);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<z.infer<typeof DeleteProjectSiteSchema>>();

  // Handle form submission
  const submitDelete = async (data: z.infer<typeof DeleteProjectSiteSchema>) => {
    try {
      await dispatch(deleteProjectSiteAsync({ id, reason: data.reason })).unwrap();
      handleClose();
    } catch (error) {
      setError('reason', { message: 'Une erreur est survenue.' });
      console.error('Delete error:', error);
    }
  };

  // Close modal
  const handleClose = () => setShow(false);

  return (
    <>
      {/* Delete Button */}
      <Button
        type="button"
        variant="danger"
        onClick={() => setShow(true)}
        className="shadow-sm"
        aria-label={`Supprimer le tronçon ${name}`}
      >
        <FaRegTrashAlt />
      </Button>

      {/* Delete Confirmation Modal */}
      {show && (
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              Supprimer le tronçon
              {deleteStatus === 'loading' && <Spinner size="sm" className="ms-2" />}
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit(submitDelete)}>
            <Modal.Body>
              <p>
                Confirmez-vous la suppression du tronçon <strong className="text-primary">{name}</strong> ?
              </p>
              {/* Reason Field */}
              <Form.Group className="mb-3">
                <Form.Label htmlFor="reason" className="fw-bold">
                  Raison
                </Form.Label>
                <Form.Select
                  id="reason"
                  {...register('reason', { required: 'Ce champ est requis.' })}
                  className={`shadow-sm ${errors.reason ? 'is-invalid' : ''}`}
                >
                  <option value="">-- Choisir --</option>
                  <option value="Bad data">Données erronées</option>
                  <option value="Data created by mistake and more">Données créées par erreur</option>
                </Form.Select>
                {errors.reason && <div className="invalid-feedback">{errors.reason.message}</div>}
              </Form.Group>
            </Modal.Body>
            <Modal.Footer className="border-0">
              {/* Cancel Button */}
              <Button variant="primary" type="button" onClick={handleClose} className="shadow-sm">
                Annuler
              </Button>
              {/* Submit Button */}
              <Button variant="danger" type="submit" className="shadow-sm px-4">
                Supprimer
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      )}
    </>
  );
};

export default DeleteProjectSite;
