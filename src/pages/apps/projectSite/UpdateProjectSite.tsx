import { z } from 'zod';
import { useState } from 'react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import { FaRegEdit } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { updateProjectSiteAsync } from 'features/project-site/projectSiteSlice';
import { ProjectSiteSchema } from 'features/project-site/projectSiteType';

const UpdateProjectSite = ({ site }: { site: z.infer<typeof ProjectSiteSchema> }) => {
  const [show, setShow] = useState(false);
  const dispatch = useAppDispatch();
  const { updateStatus } = useAppSelector((state) => state.projectSite);

  // Define a schema omitting unnecessary fields
  const ProjectSiteOmitted = ProjectSiteSchema.omit({
    referenceNumber: true,
    slug: true,
    villages: true
  });

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors }
  } = useForm<z.infer<typeof ProjectSiteOmitted>>({
    defaultValues: {
      id: site.id,
      name: site.name
    }
  });

  // Close modal and reset form values
  const handleClose = () => {
    reset({ name: site.name, id: site.id });
    setShow(false);
  };

  // Handle form submission
  const onSubmit = async (data: z.infer<typeof ProjectSiteOmitted>) => {
    try {
      await dispatch(updateProjectSiteAsync(data)).unwrap();
      handleClose();
    } catch (error) {
      setError('name', { message: 'Une erreur est survenue.' });
      console.error('Failed to update project site:', error);
    }
  };

  return (
    <>
      {/* Edit Button */}
      <Button type="button" onClick={() => setShow(true)} className="shadow-sm" aria-label={`Modifier le tronçon ${site.name}`}>
        <FaRegEdit />
      </Button>

      {/* Edit Modal */}
      {show && (
        <Modal show={show} onHide={handleClose} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Modifier le tronçon</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Modal.Body>
              {/* Name Field */}
              <Form.Group className="mb-3">
                <Form.Label htmlFor="name" className="fw-bold">
                  Nom du tronçon
                </Form.Label>
                <Form.Control
                  id="name"
                  type="text"
                  className={`shadow-sm ${errors.name ? 'is-invalid' : ''}`}
                  placeholder="Entrez le nom du tronçon"
                  {...register('name', { required: 'Ce champ est requis.' })}
                />
                {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
              </Form.Group>
            </Modal.Body>
            <Modal.Footer className="border-0">
              {/* Cancel Button */}
              <Button variant="outline-secondary" type="button" onClick={handleClose} className="shadow-sm">
                Annuler
              </Button>
              {/* Submit Button */}
              <Button variant="primary" type="submit" className="shadow-sm px-4">
                {updateStatus !== 'loading' ? (
                  'Enregistrer'
                ) : (
                  <>
                    <Spinner size="sm" /> Enregistrement...
                  </>
                )}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      )}
    </>
  );
};

export default UpdateProjectSite;
