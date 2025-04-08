import React from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { FaRegEdit } from 'react-icons/fa';

import { ComplaintType, updateComplaintTypeAsync } from 'features/complaintType/complaintTypeSlice';
import { useForm } from 'react-hook-form';
import { useAppDispatch } from 'app/hooks';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const updateComplaintTypeSchema = z.object({
  id: z.string(),
  name: z.string().nonempty('Le nom est requis'),
  isSensitive: z.enum(['true', 'false']).refine((val) => val === 'true' || val === 'false', {
    message: "Veuillez sélectionner une valeur valide pour 'Est sensible'"
  })
});

type UpdateComplaintTypeForm = z.infer<typeof updateComplaintTypeSchema>;

const UpdatePlainteType = ({ complaintType }: { complaintType: ComplaintType }) => {
  const [show, setShow] = React.useState(false);
  const dispatch = useAppDispatch();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<UpdateComplaintTypeForm>({
    resolver: zodResolver(updateComplaintTypeSchema),
    defaultValues: {
      id: complaintType.id,
      name: complaintType.name,
      isSensitive: complaintType.isSensitive ? 'true' : 'false'
    }
  });

  const handleClose = () => {
    setShow(false);
    reset();
  };

  const onSubmit = async (data: UpdateComplaintTypeForm) => {
    try {
      await dispatch(updateComplaintTypeAsync({ ...data, isSensitive: data.isSensitive === 'true' })).unwrap();
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Button type="button" onClick={() => setShow(true)} className="shadow-sm">
        <FaRegEdit />
      </Button>
      {show && (
        <Modal show={show} onHide={handleClose} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Modifier Type de plainte</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Modal.Body className="p-4">
              <div className="form-group mb-3">
                <label htmlFor="name">Nom</label>
                <input id="name" className={`form-control shadow-sm ${errors.name ? 'is-invalid' : ''}`} {...register('name')} />
                {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
              </div>

              <div className="form-group mb-3">
                <label htmlFor="isSensitive">Est sensible</label>
                <select
                  id="isSensitive"
                  className={`form-control shadow-sm ${errors.isSensitive ? 'is-invalid' : ''}`}
                  {...register('isSensitive')}
                >
                  <option value="true">Oui</option>
                  <option value="false">Non</option>
                </select>
                {errors.isSensitive && <div className="invalid-feedback">{errors.isSensitive.message}</div>}
              </div>
            </Modal.Body>
            <Modal.Footer className="border-0 justify-content-between">
              <Button variant="danger" type="button" onClick={handleClose} className="shadow-sm">
                Annuler
              </Button>
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

export default UpdatePlainteType;
