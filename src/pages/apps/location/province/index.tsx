import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Modal, Row, Spinner, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { toast } from 'react-toastify';
// import UpdateProvince from './UpdateProvince';
// import DeleteProvince from './DeleteProvince';

import { z } from 'zod';
import { addProvince, fetchProvinces } from 'features/province/provinceSlice';
import { CreateProvince } from 'features/province/provinceType';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProvinceSchema } from 'features/province/provinceValidation';
import DeleteProvince from './DeleteProvince';
import UpdateProvince from './UpdateProvince';
import { useNavigate } from 'react-router-dom';

export default function Province() {
  const [show, setShow] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { provinces, error, status } = useAppSelector((state) => state.province);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CreateProvince>({
    resolver: zodResolver(createProvinceSchema)
  });

  React.useEffect(() => {
    dispatch(fetchProvinces());
  }, [dispatch]);

  const onSubmit = async (data: CreateProvince) => {
    const toastId = toast.loading('Veuillez patienter...');
    try {
      await dispatch(addProvince(data)).unwrap();
      toast.update(toastId, {
        render: 'Province ajoute avec succes',
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
        autoClose: 3000
      });
    }
  };
  const handleClose = () => {
    setShow(false);
    reset();
  };
  const handleShow = () => setShow(true);
  return (
    <>
      <div className="row">
        <div className="d-flex justify-content-between mb-3">
          <div className="mb-3">
            <span className="fs-4">Liste des provinces </span>
          </div>
          <Button variant="primary" onClick={handleShow} className="w-auto text-center mb-2">
            Ajouter une province
          </Button>
        </div>
        <Row>
          <div>
            <Table striped bordered hover responsive className="table-sm">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Nom</th>
                  <th>nombre de ville</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {status === 'loading' && (
                  <tr>
                    <td colSpan={3} className="text-center">
                      <Spinner animation="border" size="sm" className="text-primary" />
                    </td>
                  </tr>
                )}
                {status === 'failed' && (
                  <tr>
                    <td colSpan={3} className="text-center text-danger">
                      {error}
                    </td>
                  </tr>
                )}
                {status === 'succeeded' &&
                  provinces.length > 0 &&
                  provinces.map((province, index) => (
                    <tr key={province.id}>
                      <td>{index + 1}</td>
                      <td>{province.name}</td>
                      <td>{province.cities.length}</td>
                      <td style={{ width: '1%' }}>
                        <div className="d-flex gap-2 align-items-center justify-content-center">
                          <Button disabled={!province.cities.length} onClick={() => navigate(province.id)}>
                            Villes
                          </Button>
                          <UpdateProvince province={province} />
                          <DeleteProvince id={province.id} name={province.name} />
                        </div>
                      </td>
                    </tr>
                  ))}
                {status === 'succeeded' && provinces.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center">
                      Aucune province trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Row>
      </div>

      {show && (
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Ajouter une province</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group mb-3">
                <label htmlFor="name">Nom</label>
                <input id="name" className="form-control" {...register('name')} />
              </div>
              {errors.name && <p>{errors.name.message}</p>}
              <Button variant="primary" type="submit">
                Enregistré
              </Button>
            </form>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
}
