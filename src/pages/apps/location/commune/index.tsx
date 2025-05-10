import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Modal, Spinner, Table, Form } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { toast } from 'react-toastify';
import { zodResolver } from '@hookform/resolvers/zod';

import { fetchProvinces } from 'features/province/provinceSlice';
import { fetchTerritories } from 'features/territoire/territorySlice';
import { fetchCitiesByTerritory } from 'features/ville/citySlice';
import { fetchSectors } from 'features/sector/communeSlice';
import { fetchVillages, addNeighborhood } from 'features/village/villageSlice';
import { CreateVillage } from 'features/village/villageType';
import { createVillageSchema } from 'features/village/villageValidation';
import DeleteVillage from './DeleteVillage';
import UpdateVillage from './UpdateVillage';

export default function Village() {
  const dispatch = useAppDispatch();

  // États pour interface principale
  const [idProvince, setIdProvince] = useState('');
  const [type, setType] = useState<'village' | 'quartier' | ''>('');
  const [idVille, setIdVille] = useState('');
  const [idTarget, setIdTarget] = useState('');
  const [show, setShow] = useState(false);

  // États internes pour le modal
  const [modalProvince, setModalProvince] = useState('');
  const [modalType, setModalType] = useState<'village' | 'quartier' | ''>('');
  const [modalVille, setModalVille] = useState('');
  const [modalTarget, setModalTarget] = useState('');

  // Sélecteurs Redux
  const { provinces } = useAppSelector((state) => state.province);
  const { territories } = useAppSelector((state) => state.territory);
  const { cities } = useAppSelector((state) => state.Villes);
  const { sectors } = useAppSelector((state) => state.sectors);
  const { villages, status, error } = useAppSelector((state) => state.villages);

  // Formulaire
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
    if (type === 'village') dispatch(fetchTerritories({ id: idProvince }));
    if (type === 'quartier') dispatch(fetchCitiesByTerritory({ id: idProvince }));
  }, [dispatch, idProvince, type]);

  useEffect(() => {
    if (type === 'quartier' && idVille) {
      dispatch(fetchSectors({ id: idVille }));
    }
  }, [dispatch, idVille, type]);

  useEffect(() => {
    if (idTarget) dispatch(fetchVillages({ id: idTarget }));
  }, [dispatch, idTarget]);

  // Gérer les select dans le modal
  useEffect(() => {
    if (!modalProvince || !modalType) return;
    if (modalType === 'village') dispatch(fetchTerritories({ id: modalProvince }));
    if (modalType === 'quartier') dispatch(fetchCitiesByTerritory({ id: modalProvince }));
  }, [dispatch, modalProvince, modalType]);

  useEffect(() => {
    if (modalType === 'quartier' && modalVille) {
      dispatch(fetchSectors({ id: modalVille }));
    }
  }, [dispatch, modalVille, modalType]);

  const handleClose = () => {
    setShow(false);
    reset();
    setModalProvince('');
    setModalType('');
    setModalVille('');
    setModalTarget('');
  };

  const handleShow = () => {
    setShow(true);
  };

  const onSubmit = async (data: CreateVillage) => {
    console.log('data :', data);
    
    const payload =
      modalType === 'village'
        ? { name: data.name, territory: modalTarget }
        : { name: data.name, sector: modalTarget };

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
        <Button onClick={handleShow}>Ajouter</Button>
      </div>

      {/* Filtres principaux */}
      <Form.Group className="mb-3">
        <Form.Label>Choisir une province</Form.Label>
        <Form.Select
          value={idProvince}
          onChange={(e) => {
            setIdProvince(e.target.value);
            setType('');
            setIdVille('');
            setIdTarget('');
          }}
        >
          <option value="">-- Sélectionnez une province --</option>
          {provinces.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
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
                setIdVille('');
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
                setIdVille('');
                setIdTarget('');
              }}
            />
          </div>
        </Form.Group>
      )}

      {type === 'village' && (
        <Form.Group className="mb-3">
          <Form.Label>Choisir un territoire</Form.Label>
          <Form.Select value={idTarget} onChange={(e) => setIdTarget(e.target.value)}>
            <option value="">-- Sélectionnez un territoire --</option>
            {territories.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      )}

      {type === 'quartier' && (
        <>
          <Form.Group className="mb-3">
            <Form.Label>Choisir une ville</Form.Label>
            <Form.Select
              value={idVille}
              onChange={(e) => {
                setIdVille(e.target.value);
                setIdTarget('');
              }}
            >
              <option value="">-- Sélectionnez une ville --</option>
              {cities.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          {idVille && (
            <Form.Group className="mb-3">
              <Form.Label>Choisir une commune</Form.Label>
              <Form.Select value={idTarget} onChange={(e) => setIdTarget(e.target.value)}>
                <option value="">-- Sélectionnez une commune --</option>
                {sectors.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          )}
        </>
      )}

      {/* Tableau des quartiers/villages */}
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
            <tr>
              <td colSpan={5} className="text-center">
                <Spinner animation="border" size="sm" />
              </td>
            </tr>
          )}
          {status === 'failed' && (
            <tr>
              <td colSpan={5} className="text-danger text-center">
                {error}
              </td>
            </tr>
          )}
          {status === 'succeeded' && villages.length > 0 ? (
            villages.map((v, i) => (
              <tr key={v.id}>
                <td>{i + 1}</td>
                <td>{v.name}</td>
                <td>{v.committeeName}</td>
                <td>{v.referenceNumber}</td>
                <td>
                  <div className="d-flex gap-2 justify-content-center">
                    <UpdateVillage village={v} />
                    <DeleteVillage id={v.id} name={v.name} />
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center">Aucun quartier/village trouvé</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Modal d'ajout */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un quartier/village</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>Nom</Form.Label>
              <Form.Control {...register('name')} isInvalid={!!errors.name} />
              <Form.Control.Feedback type="invalid">
                {errors.name?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Province</Form.Label>
              <Form.Select
                value={modalProvince}
                onChange={(e) => {
                  setModalProvince(e.target.value);
                  setModalType('');
                  setModalVille('');
                  setModalTarget('');
                }}
              >
                <option value="">-- Sélectionnez une province --</option>
                {provinces.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {modalProvince && (
              <Form.Group className="mb-3">
                <Form.Label>Type de zone</Form.Label>
                <div className="d-flex gap-3">
                  <Form.Check
                    type="radio"
                    label="Village"
                    value="village"
                    name="modalType"
                    checked={modalType === 'village'}
                    onChange={() => {
                      setModalType('village');
                      setModalVille('');
                      setModalTarget('');
                    }}
                  />
                  <Form.Check
                    type="radio"
                    label="Quartier"
                    value="quartier"
                    name="modalType"
                    checked={modalType === 'quartier'}
                    onChange={() => {
                      setModalType('quartier');
                      setModalVille('');
                      setModalTarget('');
                    }}
                  />
                </div>
              </Form.Group>
            )}

            {modalType === 'village' && (
              <Form.Group className="mb-3">
                <Form.Label>Territoire</Form.Label>
                <Form.Select value={modalTarget} onChange={(e) => setModalTarget(e.target.value)}>
                  <option value="">-- Sélectionnez un territoire --</option>
                  {territories.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            )}

            {modalType === 'quartier' && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Ville</Form.Label>
                  <Form.Select
                    value={modalVille}
                    onChange={(e) => {
                      setModalVille(e.target.value);
                      setModalTarget('');
                    }}
                  >
                    <option value="">-- Sélectionnez une ville --</option>
                    {cities.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                {modalVille && (
                  <Form.Group className="mb-3">
                    <Form.Label>Commune</Form.Label>
                    <Form.Select
                      value={modalTarget}
                      onChange={(e) => setModalTarget(e.target.value)}
                    >
                      <option value="">-- Sélectionnez une commune --</option>
                      {sectors.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                )}
              </>
            )}

            <Button variant="primary" type="submit" disabled={isSubmitting || !modalTarget}>
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}
