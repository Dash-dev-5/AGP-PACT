import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button, Modal, Row, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { fetchComplaintTypesAsync } from 'features/complaintType/complaintTypeSlice';
import { toast } from 'react-toastify';
import { CreatePrejudice, createPrejudiceAsync, fetchPrejudicesAsync } from 'features/prejudice/prejudiceSlice';

import UpdatePrejudice from 'components/ui/prejudice/UpdatePrejudice';
import DeletePrejudice from 'components/ui/prejudice/DeletePrejudice';

export default function Prejudice() {
  const [show, setShow] = useState(false);
  const dispatch = useAppDispatch();
  const { complaintTypes } = useAppSelector((state) => state.complaintType);
  const { prejudices } = useAppSelector((state) => state.prejudice);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<CreatePrejudice>();

  React.useEffect(() => {
    dispatch(fetchPrejudicesAsync());
    dispatch(fetchComplaintTypesAsync());
  }, [dispatch]);

  const onSubmit: SubmitHandler<CreatePrejudice> = async (data) => {
    const toastId = toast.loading('Veuillez patienter...');
    try {
      await dispatch(createPrejudiceAsync(data)).unwrap();
      toast.update(toastId, {
        render: 'Préjudice ajouté avec succès',
        type: 'success',
        isLoading: false,
        autoClose: 2000
      });
    } catch (error) {
      toast.update(toastId, {
        render: String(error),
        type: 'error',
        isLoading: false,
        autoClose: 4000
      });
    }

    handleClose();
  };

  const handleClose = () => {
    setShow(false);
    reset();
  };
  const handleShow = () => setShow(true);

  return (
    <>
      <div className="container mt-4">
        <div className="d-flex justify-content-between mb-4">
          <h3 className="fw-bold">Liste de Préjudices</h3>
          <Button variant="primary" onClick={handleShow} className="shadow-sm">
            Ajouter un préjudice
          </Button>
        </div>
        <Row>
          <Table striped bordered hover responsive className="shadow-sm">
            <thead className="table-dark">
              <tr>
                <th>Numéro de référence</th>
                <th>Nom</th>
                <th>Type de plainte</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {prejudices.map((prejudice) => (
                <tr key={prejudice.id}>
                  <td>{prejudice.referenceNumber}</td>
                  <td>{prejudice.name}</td>
                  <td>{prejudice.typeName}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <UpdatePrejudice prejudice={prejudice} />
                      <DeletePrejudice id={prejudice.id} name={prejudice.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Row>
      </div>

      {show && (
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Ajouter un Préjudice</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group mb-3">
                <label htmlFor="name" className="form-label">
                  Nom
                </label>
                <input
                  id="name"
                  className={`form-control shadow-sm ${errors.name ? 'is-invalid' : ''}`}
                  {...register('name', { required: 'Ce champ est requis' })}
                />
                {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
              </div>

              <div className="form-group mb-3">
                <label htmlFor="type" className="form-label">
                  Type de plainte
                </label>
                <select
                  id="type"
                  className={`form-control shadow-sm ${errors.type ? 'is-invalid' : ''}`}
                  {...register('type', { required: 'Veuillez sélectionner un type de plainte' })}
                >
                  <option value="">-- Choisir un type de plainte --</option>
                  {complaintTypes.map((complaintType) => (
                    <option value={complaintType.id} key={complaintType.id}>
                      {complaintType.name}
                    </option>
                  ))}
                </select>
                {errors.type && <div className="invalid-feedback">{errors.type.message}</div>}
              </div>

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
