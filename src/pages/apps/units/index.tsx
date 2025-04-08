import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Modal, Row, Spinner, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import UpdateUnit from './UpdateUnit';
import DeleteUnit from './DeleteUnit';
import { createUnitAsync, fetchUnitsAsync } from 'features/units/unitsSlice';
import { z } from 'zod';
import { CreateUnitSchema } from 'features/units/unitsType';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Units() {
  const [show, setShow] = useState(false);
  const dispatch = useAppDispatch();
  const { units, status, error } = useAppSelector((state) => state.units);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<z.infer<typeof CreateUnitSchema>>();

  // Fetch units on component mount
  React.useEffect(() => {
    dispatch(fetchUnitsAsync());
  }, [dispatch]);

  // Handle form submission
  const onSubmit = async (data: z.infer<typeof CreateUnitSchema>) => {
    const toastId = toast.loading('Veuillez patienter...');
    try {
      await dispatch(createUnitAsync(data)).unwrap();
      toast.update(toastId, {
        render: 'Unité ajoutée avec succès.',
        type: 'success',
        isLoading: false,
        autoClose: 2000
      });
      handleClose();
    } catch (error) {
      toast.update(toastId, {
        render: String(error),
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
          <h4 className="fw-bold">Liste des unités de mesure</h4>
          <Button variant="primary" onClick={handleShow} className="shadow-sm">
            Ajouter une unité
          </Button>
        </div>

        <Row>
          <div>
            <Table striped bordered hover responsive className="shadow-sm">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Nom</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {status === 'loading' && (
                  <tr>
                    <td colSpan={3} className="text-center">
                      <Spinner animation="border" size="sm" />
                    </td>
                  </tr>
                )}
                {status === 'failed' && (
                  <tr>
                    <td colSpan={3} className="text-center text-danger">
                      {error || "Une erreur s'est produite."}
                    </td>
                  </tr>
                )}
                {status === 'succeeded' &&
                  units.length > 0 &&
                  units.map((unit, index) => (
                    <tr key={unit.id}>
                      <td>{index + 1}</td>
                      <td>{unit.name}</td>
                      <td style={{ width: '1%' }}>
                        <div className="d-flex justify-content-center gap-2">
                          <UpdateUnit unit={unit} />
                          <DeleteUnit id={unit.id} name={unit.name} />
                        </div>
                      </td>
                    </tr>
                  ))}
                {status === 'succeeded' && units.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center">
                      Aucune unité trouvée.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Row>
      </div>

      {/* Modal for adding a new unit */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter une unité de mesure</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group mb-3">
              <label htmlFor="name" className="fw-bold">
                Nom de l'unité
              </label>
              <input
                id="name"
                className={`form-control shadow-sm ${errors.name ? 'is-invalid' : ''}`}
                placeholder="Entrez le nom de l'unité"
                {...register('name', { required: 'Ce champ est requis.' })}
              />
              {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
            </div>
            <Button type="submit" variant="primary" className="w-100 shadow-sm">
              Enregistrer
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}
