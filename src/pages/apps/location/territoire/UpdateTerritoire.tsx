import React from 'react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import { FaRegEdit } from 'react-icons/fa';

import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from 'app/hooks';

import { IProvince, UpdateProvinceType } from 'features/province/provinceType';
import { updateProvince } from 'features/province/provinceSlice';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateProvinceSchema } from 'features/province/provinceValidation';
import { toast } from 'react-toastify';

const UpdateProvince = ({ province }: { province: IProvince }) => {
  const [show, setShow] = React.useState(false);

  const dispatch = useAppDispatch();
  const { updateStatus } = useAppSelector((state) => state.province);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors }
  } = useForm<UpdateProvinceType>({
    resolver: zodResolver(updateProvinceSchema),
    defaultValues: {
      id: province.id,
      name: province.name
    }
  });

  const handleClose = () => {
    reset({
      id: province.id,
      name: province.name
    });
    setShow(false);
  };

  const onSubmit = async (data: UpdateProvinceType) => {
    try {
      await dispatch(updateProvince(data)).unwrap();

      handleClose();
      toast.success('Province ajoute avec succes', {
        autoClose: 2000
      });
    } catch (error) {
      console.error('Failed to update province:', error);
    }
  };

  return (
    <>
      <Button type="button" onClick={() => setShow(true)}>
        <FaRegEdit />
      </Button>
      {show && (
        <Modal show={show} onHide={handleClose} centered={true} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Modifier la province {updateStatus === 'loading' && <Spinner size="sm" />}</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Modal.Body className="p-4">
              <div className="form-group mb-3">
                <label htmlFor="name">Nom</label>
                <input id="name" className="form-control my-2" {...register('name', { required: 'Ce champ est requis' })} />
                {errors.name && <div className="text-danger">{errors.name.message}</div>}
              </div>

              {updateStatus === 'failed' && <p className="text-danger">une erreur est survenue !</p>}
            </Modal.Body>
            <Modal.Footer className="border-0 justify-content-between">
              <Button variant="danger" type="button" onClick={handleClose}>
                Annulé
              </Button>
              <Button variant="primary" type="submit" className="px-4">
                Enregistrer
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      )}
    </>
  );
};

export default UpdateProvince;
