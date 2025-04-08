import React from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { FaRegEdit } from 'react-icons/fa';

import { Prejudice, updatePrejudiceAsync } from 'features/prejudice/prejudiceSlice';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const updatePrejudiceSchema = z.object({
  id: z.string(),
  name: z.string().nonempty('Le nom est requis.'),
  typeId: z.string().nonempty('Le type de plainte est requis.')
});

type UpdatePrejudiceForm = z.infer<typeof updatePrejudiceSchema>;

const UpdatePrejudice = ({ prejudice }: { prejudice: Prejudice }) => {
  const [show, setShow] = React.useState(false);
  const { complaintTypes } = useAppSelector((state) => state.complaintType);

  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors }
  } = useForm<UpdatePrejudiceForm>({
    resolver: zodResolver(updatePrejudiceSchema),
    defaultValues: {
      typeId: prejudice.typeId,
      id: prejudice.id,
      name: prejudice.name
    }
  });

  const handleClose = () => {
    reset({ typeId: prejudice.typeId, id: prejudice.id, name: prejudice.name });
    setShow(false);
  };

  const onSubmit = async (data: UpdatePrejudiceForm) => {
    try {
      await dispatch(updatePrejudiceAsync(data)).unwrap();
      handleClose();
    } catch (error) {
      setError('name', { message: 'Une erreur est survenue lors de la mise à jour.' });
      console.error('Failed to update prejudice:', error);
    }
  };

  return (
    <>
      <Button type="button" variant="primary" onClick={() => setShow(true)}>
        <FaRegEdit />
      </Button>
      {show && (
        <Modal show={show} onHide={handleClose} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Modifier Préjudice</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Modal.Body className="p-4">
              <div className="form-group mb-3">
                <Form.Label htmlFor="name">Nom</Form.Label>
                <Form.Control id="name" className={`shadow-sm ${errors.name ? 'is-invalid' : ''}`} {...register('name')} />
                {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
              </div>

              <div className="form-group mb-3">
                <Form.Label htmlFor="type">Type</Form.Label>
                <Form.Select id="type" className={`shadow-sm ${errors.typeId ? 'is-invalid' : ''}`} {...register('typeId')}>
                  <option value="">-- Choisir un type de plainte --</option>
                  {complaintTypes.map((complaintType) => (
                    <option value={complaintType.id} key={complaintType.id}>
                      {complaintType.name}
                    </option>
                  ))}
                </Form.Select>
                {errors.typeId && <div className="invalid-feedback">{errors.typeId.message}</div>}
              </div>
            </Modal.Body>
            <Modal.Footer className="border-0 justify-content-between">
              <Button variant="outline-secondary" type="button" onClick={handleClose} className="shadow-sm">
                Annuler
              </Button>
              <Button variant="primary" type="submit" className="shadow-sm px-4">
                Enregistrer
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      )}
    </>
  );
};

export default UpdatePrejudice;
