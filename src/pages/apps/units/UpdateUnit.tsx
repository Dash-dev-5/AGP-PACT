import React from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { FaRegEdit } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { useAppDispatch } from 'app/hooks';
import { z } from 'zod';
import { UnitSchema } from 'features/units/unitsType';
import { updateUnitAsync } from 'features/units/unitsSlice';

const UpdateUnit = ({ unit }: { unit: z.infer<typeof UnitSchema> }) => {
  const [show, setShow] = React.useState(false);
  const dispatch = useAppDispatch();

  // Omit unnecessary fields from UnitSchema
  const UnitOmitted = UnitSchema.omit({ referenceNumber: true, slug: true });

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors }
  } = useForm<z.infer<typeof UnitOmitted>>({
    defaultValues: {
      id: unit.id,
      name: unit.name
    }
  });

  // Close the modal and reset form values
  const handleClose = () => {
    reset({ name: unit.name, id: unit.id });
    setShow(false);
  };

  // Handle form submission
  const onSubmit = async (data: z.infer<typeof UnitOmitted>) => {
    try {
      await dispatch(updateUnitAsync(data)).unwrap();
      handleClose();
    } catch (error) {
      setError('name', { message: 'Une erreur est survenue.' });
      console.error('Failed to update unit:', error);
    }
  };

  return (
    <>
      {/* Edit Button */}
      <Button type="button" onClick={() => setShow(true)} className="shadow-sm">
        <FaRegEdit />
      </Button>

      {/* Modal */}
      {show && (
        <Modal show={show} onHide={handleClose} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Modifier Unité</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Modal.Body>
              {/* Input Field */}
              <Form.Group className="mb-3">
                <Form.Label htmlFor="name" className="fw-bold">
                  Nom
                </Form.Label>
                <Form.Control
                  id="name"
                  type="text"
                  className={`shadow-sm ${errors.name ? 'is-invalid' : ''}`}
                  {...register('name', { required: 'Ce champ est requis.' })}
                />
                {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
              </Form.Group>
            </Modal.Body>
            <Modal.Footer className="border-0">
              {/* Cancel Button */}
              <Button variant="danger" type="button" onClick={handleClose} className="shadow-sm">
                Annuler
              </Button>
              {/* Submit Button */}
              <Button variant="primary" type="submit" className="px-4 shadow-sm">
                Enregistrer
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      )}
    </>
  );
};

export default UpdateUnit;
