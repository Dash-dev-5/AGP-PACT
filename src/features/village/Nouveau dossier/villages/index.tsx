import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Modal, Spinner, Table, Form } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { toast } from 'react-toastify';
import { zodResolver } from '@hookform/resolvers/zod';

import { fetchProvinces } from 'features/province/provinceSlice';
import { fetchTerritories } from 'features/territoire/territorySlice';
import { fetchSectors } from 'features/sector/communeSlice';
import { fetchVillages, addNeighborhood } from 'features/village/villageSlice';
import { CreateVillage } from 'features/village/villageType';
import { createVillageSchema } from 'features/village/villageValidation';
import DeleteVillage from './DeleteVillage';
import UpdateVillage from './UpdateVillage';

export default function Village() {
  const dispatch = useAppDispatch();

  const [show, setShow] = useState(false);
  const [idProvince, setIdProvince] = useState('');
  const [type, setType] = useState<'village' | 'quartier' | ''>('');
  const [idTarget, setIdTarget] = useState('');

  const { provinces } = useAppSelector((state) => state.province);
  const { territories } = useAppSelector((state) => state.territory);
  const { sectors } = useAppSelector((state) => state.sectors);
  const { villages, status, error } = useAppSelector((state) => state.villages);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<CreateVillage>({
    resolver: zodResolver(createVillageSchema),
  });

  useEffect(() => {
    dispatch(fetchProvinces());
  }, [dispatch]);

  useEffect(() => {
    if (!idProvince || !type) return;

    if (type === 'village') {
      dispatch(fetchTerritories({ id: idProvince }));
    } else if (type === 'quartier') {
      dispatch(fetchSectors({ id: idProvince }));
    }
  }, [dispatch, idProvince, type]);

  useEffect(() => {
    if (idTarget) {
      dispatch(fetchVillages({ id: idTarget }));
    }
  }, [dispatch, idTarget]);

  // Réinitialisation des sélections lors de l'ouverture du modal
  useEffect(() => {
    if (show) {
      setIdProvince('');
      setType('');
      setIdTarget('');
    }
  }, [show]);

  const handleClose = () => {
    setShow(false);
    reset();
    setIdTarget('');
    setType('');
  };

  const onSubmit = async (data: CreateVillage) => {
    const payload = {
      name: data.name,
      ...(type === 'village'
        ? { territory: idTarget }
        : { sector: idTarget }),
    };

    const toastId = toast.loading('Veuillez patienter...');
    try {
      await dispatch(addNeighborhood(payload)).unwrap();
      toast.update(toastId, {
        render: 'Quartier/Village ajouté avec succès',
        type: 'success',
        isLoading: false,
        autoClose: 2000,
      });
      handleClose();
    } catch (error) {
      toast.update(toastId, {
        render: String(error),
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between mb-3">
        <span className="fs-4">Liste des quartiers/villages</span>
        <Button onClick={() => setShow(true)}>Ajouter</Button>
      </div>

      <Form.Group className="mb-3">
        <Form.Label>Choisir une province</Form.Label>
        <Form.Select value={idProvince} onChange={(e) => {
          setIdProvince(e.target.value);
          setType('');
          setIdTarget('');
        }}>
          <option value="">-- Sélectionnez une province --</option>
          {provinces.map((province) => (
            <option key={province.id} value={province.id}>{province.name}</option>
          ))}
        </Form.Select>
      </Form.Group>

      {idProvince && (
        <Form.Group className="mb-3">
          <Form.Label>Type de zone</Form.Label>
          <div className="d-flex gap-3">
            <Form.Check
              type="radio"
              label="Village"
              name="type"
              value="village"
              checked={type === 'village'}
              onChange={() => {
                setType('village');
                setIdTarget('');
              }}
            />
            <Form.Check
              type="radio"
              label="Quartier"
              name="type"
              value="quartier"
              checked={type === 'quartier'}
              onChange={() => {
                setType('quartier');
                setIdTarget('');
              }}
            />
          </div>
        </Form.Group>
      )}

      {type && (
        <Form.Group className="mb-3">
          <Form.Label>
            {type === 'village' ? 'Choisir un territoire' : 'Choisir une commune'}
          </Form.Label>
          <Form.Select value={idTarget} onChange={(e) => setIdTarget(e.target.value)}>
            <option value="">
              -- Sélectionnez une {type === 'village' ? 'territoire' : 'commune'} --
            </option>
            {(type === 'village' ? territories : sectors).map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </Form.Select>
        </Form.Group>
      )}

      <Table striped bordered hover>
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Nom</th>
            <th>Comité</th>
            <th>Référence</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {status === 'loading' && (
            <tr><td colSpan={5} className="text-center"><Spinner animation="border" size="sm" /></td></tr>
          )}
          {status === 'failed' && (
            <tr><td colSpan={5} className="text-danger text-center">{error}</td></tr>
          )}
          {status === 'succeeded' && villages.length > 0 ? (
            villages.map((village, index) => (
              <tr key={village.id}>
                <td>{index + 1}</td>
                <td>{village.name}</td>
                <td>{village.committeeName}</td>
                <td>{village.referenceNumber}</td>
                <td>
                  <div className="d-flex gap-2 justify-content-center">
                    <UpdateVillage village={village} />
                    <DeleteVillage id={village.id} name={village.name} />
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan={5} className="text-center">Aucun quartier/village trouvé</td></tr>
          )}
        </tbody>
      </Table>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un quartier/village</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>Province</Form.Label>
              <Form.Select
                value={idProvince}
                onChange={(e) => {
                  setIdProvince(e.target.value);
                  setType('');
                  setIdTarget('');
                }}
              >
                <option value="">-- Sélectionnez une province --</option>
                {provinces.map((province) => (
                  <option key={province.id} value={province.id}>
                    {province.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {idProvince && (
              <Form.Group className="mb-3">
                <Form.Label>Type de zone</Form.Label>
                <div className="d-flex gap-3">
                  <Form.Check
                    type="radio"
                    label="Village"
                    name="type"
                    value="village"
                    checked={type === 'village'}
                    onChange={() => {
                      setType('village');
                      setIdTarget('');
                    }}
                  />
                  <Form.Check
                    type="radio"
                    label="Quartier"
                    name="type"
                    value="quartier"
                    checked={type === 'quartier'}
                    onChange={() => {
                      setType('quartier');
                      setIdTarget('');
                    }}
                  />
                </div>
              </Form.Group>
            )}

            {type && (
              <Form.Group className="mb-3">
                <Form.Label>
                  {type === 'village' ? 'Territoire' : 'Commune'}
                </Form.Label>
                <Form.Select
                  value={idTarget}
                  onChange={(e) => setIdTarget(e.target.value)}
                >
                  <option value="">
                    -- Sélectionnez une {type === 'village' ? 'territoire' : 'commune'} --
                  </option>
                  {(type === 'village' ? territories : sectors).map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Nom</Form.Label>
              <Form.Control {...register('name')} isInvalid={!!errors.name} />
              <Form.Control.Feedback type="invalid">
                {errors.name?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Button variant="primary" type="submit" disabled={isSubmitting || !idTarget}>
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}
