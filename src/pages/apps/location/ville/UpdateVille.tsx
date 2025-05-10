import React from 'react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import { FaRegEdit } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { UpdateCityType, ICity } from 'features/ville/villeType';
import { updateCity } from 'features/ville/citySlice';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateCitySchema } from 'features/ville/cityValidation';
import { toast } from 'react-toastify';

const UpdateVille = ({ ville }: { ville: ICity }) => {
  const [show, setShow] = React.useState(false);
  const dispatch = useAppDispatch();
  const { provinces } = useAppSelector((state) => state.province); // Récupérer les provinces
  const { updateStatus } = useAppSelector((state) => state.Villes);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<UpdateCityType>({
    resolver: zodResolver(updateCitySchema),  // Utilisation du schéma de validation pour la ville
    defaultValues: {
      id: ville.id,
      name: ville.name,
      province: ville.province // Ajouter la province actuelle
    }
  });

  const handleClose = () => {
    reset({
      id: ville.id,
      name: ville.name,
      province: ville.province // Réinitialiser la province
    });
    setShow(false);
  };

  const onSubmit = async (data: UpdateCityType) => {
    const { id, name, province } = data;

    // Préparer les données à envoyer à l'API
    const updateData = {
      name,
      province
    };

    try {
      // Dispatcher l'action pour mettre à jour la ville
      await dispatch(updateCity({ id, updateData })).unwrap();
      handleClose();
      toast.success('Ville mise à jour avec succès', {
        autoClose: 2000
      });
    } catch (error) {
      console.error('Échec de la mise à jour de la ville :', error);
      toast.error('Une erreur est survenue lors de la mise à jour de la ville');
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
              Modifier la ville
              {updateStatus === 'loading' && <Spinner size="sm" animation="border" />}
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Modal.Body className="p-4">
              <div className="form-group mb-3">
                <label htmlFor="name">Nom de la Ville</label>
                <input
                  id="name"
                  className="form-control my-2"
                  {...register('name', { required: 'Ce champ est requis' })}
                />
                {errors.name && <div className="text-danger">{errors.name.message}</div>}
              </div>
              <div className="form-group mb-3">
                <label htmlFor="province">Province</label>
                <Form.Select
                  id="province"
                  {...register('province', { required: 'La province est requise' })}
                >
                  <option value="">-- Sélectionner une province --</option>
                  {provinces.map((province) => (
                    <option key={province.id} value={province.id}>
                      {province.name}
                    </option>
                  ))}
                </Form.Select>
                {errors.province && <div className="text-danger">{errors.province.message}</div>}
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

export default UpdateVille;
