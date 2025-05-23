import React from 'react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import { FaRegEdit } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import {  UpdateVillageType } from 'features/village/villageType';
import { updateVillage } from 'features/village/villageSlice';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateVillageSchema } from 'features/village/villageValidation';
import { toast } from 'react-toastify';

const UpdateVillage = ({ village }: { village: UpdateVillageType }) => {
  const [show, setShow] = React.useState(false);
  const dispatch = useAppDispatch();
  const { cities } = useAppSelector((state) => state.Villes);
  const { updateStatus } = useAppSelector((state) => state.villages);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<UpdateVillageType>({
    resolver: zodResolver(updateVillageSchema),
    defaultValues: {
  id: village.id,
  name: village.name,
  sector: village.sector,
}

  });

  const handleClose = () => {
    reset({
  id: village.id,
  name: village.name,
  sector: village.sector,
});

    setShow(false);
  };

  const onSubmit = async (data: UpdateVillageType) => {
    // const { id , ...updateData  } = data;
    // console.log('updateData', updateData);
    

    try {
      await dispatch(updateVillage({ id : data.id, name : data.name , sector : data.sector  })).unwrap()
      handleClose();  
      toast.success('Quartier/Village mis à jour avec succès', { autoClose: 2000 });
    } catch (error) {
      console.error('Échec de la mise à jour :', error);
      toast.error('Une erreur est survenue lors de la mise à jour');
    }
  };

  return (
    <>
      <Button type="button" onClick={() => setShow(true)}>
        <FaRegEdit />
      </Button>
      {show && (
        <Modal show={show} onHide={handleClose} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              Modifier le quartier/village
              {updateStatus === 'loading' && <Spinner size="sm" animation="border" />}
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Modal.Body className="p-4">
              <div className="form-group mb-3">
                <label htmlFor="name">Nom</label>
                <input
                  id="name"
                  className="form-control my-2"
                  {...register('name', { required: 'Ce champ est requis' })}
                />
                {errors.name && <div className="text-danger">{errors.name.message}</div>}
              </div>
              <div className="form-group mb-3">
                <label htmlFor="referenceNumber">secteur id</label>
                <input
                  id="sector"
                  className="form-control my-2"
                  {...register('sector')}
                />
              </div>
              {updateStatus === 'failed' && <p className="text-danger">Une erreur est survenue !</p>}
            </Modal.Body>
            <Modal.Footer className="border-0 justify-content-between">
              <Button variant="danger" type="button" onClick={handleClose}>
                Annuler
              </Button>
              <Button variant="primary" type="submit" className="px-4">
                {updateStatus === 'loading' ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  'Enregistrer'
                )}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      )}
    </>
  );
};

export default UpdateVillage;
