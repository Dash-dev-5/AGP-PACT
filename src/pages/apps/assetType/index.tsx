import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Modal, Row, Spinner, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { toast } from 'react-toastify';
import UpdateAssetType from './UpdateAssetType';
import DeleteAssetType from './DeleteAssetType';
import { createAssetTypeAsync, fetchAssetTypesAsync } from 'features/asset-type/assetTypeSlice';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateAssetTypeSchema } from 'features/asset-type/assetTypeType';

export default function AssetType() {
  const [show, setShow] = useState(false);
  const dispatch = useAppDispatch();
  const { assetTypes, status, error } = useAppSelector((state) => state.assetType);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<z.infer<typeof CreateAssetTypeSchema>>({
    resolver: zodResolver(CreateAssetTypeSchema)
  });

  React.useEffect(() => {
    dispatch(fetchAssetTypesAsync());
  }, [dispatch]);

  const onSubmit = async (data: z.infer<typeof CreateAssetTypeSchema>) => {
    const toastId = toast.loading('Veuillez patienter...');
    try {
      await dispatch(createAssetTypeAsync(data)).unwrap();
      toast.update(toastId, {
        render: "Type d'actif ajouté avec succès",
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

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold">Liste des types d'actifs</h3>
          <Button variant="primary" onClick={handleShow} className="shadow-sm">
            Ajouter un type d'actif
          </Button>
        </div>
        <Row className="px-0">
          <Table striped bordered hover responsive className="shadow-sm">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Nom</th>
                <th>Actions</th>
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
                assetTypes.length > 0 &&
                assetTypes.map((assetType, index) => (
                  <tr key={assetType.id}>
                    <td>{index + 1}</td>
                    <td>{assetType.name}</td>

                    <td style={{ width: '1%' }}>
                      <div className="d-flex gap-2 align-items-center justify-content-center">
                        <UpdateAssetType assetType={assetType} />
                        <DeleteAssetType id={assetType.id} name={assetType.name} />
                      </div>
                    </td>
                  </tr>
                ))}
              {status === 'succeeded' && assetTypes.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center">
                    Aucun type d'actif trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Row>
      </div>

      {show && (
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Ajouter un type d'actif</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group mb-3">
                <label htmlFor="name" className="form-label">
                  Nom
                </label>
                <input id="name" className={`form-control shadow-sm ${errors.name ? 'is-invalid' : ''}`} {...register('name')} />
                {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
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
