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

  // États pour gérer l'interface
  const [show, setShow] = useState(false);
  const [idProvince, setIdProvince] = useState('');
  const [type, setType] = useState<'village' | 'quartier' | ''>('');
  const [idVille, setIdVille] = useState('');    // Pour le cas "quartier": la ville choisie (pour récupérer ses secteurs)
  const [idTarget, setIdTarget] = useState('');  // Pour stocker l'identifiant du territoire (pour village) ou de la commune (pour quartier)

  // Sélecteurs depuis Redux
  const { provinces } = useAppSelector((state) => state.province);
  const { territories } = useAppSelector((state) => state.territory);
  const { cities } = useAppSelector((state) => state.Villes);
  const { sectors } = useAppSelector((state) => state.sectors);
  const { villages, status, error } = useAppSelector((state) => state.villages);

  // Configuration du form via react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<CreateVillage>({
    resolver: zodResolver(createVillageSchema),
    // defaultValues: { city: '' }  // si vous attendez un champ "city" pour le quartier
  });

  // Au chargement, récupère les provinces
  useEffect(() => {
    dispatch(fetchProvinces());
  }, [dispatch]);

  // Lorsque la province est choisie et selon le type
  useEffect(() => {
    if (!idProvince || !type) return;
    if (type === 'village') {
      dispatch(fetchTerritories({ id: idProvince }));
    } else if (type === 'quartier') {
      dispatch(fetchCitiesByTerritory({ id: idProvince }));
    }
  }, [dispatch, idProvince, type]);

  // Pour le cas des quartiers : une fois la ville choisie, récupère les communes/secteurs
  useEffect(() => {
    if (type === 'quartier' && idVille) {
      dispatch(fetchSectors({ id: idVille }));
    }
  }, [dispatch, idVille, type]);

  // Chargement des villages (pour affichage dans le tableau) en fonction de l'élément choisi
  useEffect(() => {
    if (idTarget) {
      dispatch(fetchVillages({ id: idTarget }));
      console.log('vvvvvvvvvvvv :',villages);
      
    }
  }, [dispatch, idTarget]);

  // Fermeture du modal et réinitialisation
  const handleClose = () => {
    setShow(false);
    reset();
    setIdProvince('');
    setType('');
    setIdVille('');
    setIdTarget('');
  };

  // Soumission du formulaire
  const onSubmit = async (data: CreateVillage) => {
    // Pour l'ajout, selon le type, on envoie un payload approprié
    console.log('data', data);
    
    const payload =
      type === 'village'
        ? { name: data.name, sector: idTarget }
        : { name: data.name, sector: idTarget };
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
      {/* Affichage du tableau existant */}
      <div className="d-flex justify-content-between mb-3">
        <span className="fs-4">Liste des quartiers/villages</span>
        <Button onClick={() => setShow(true)}>Ajouter</Button>
      </div>

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
                setIdVille(''); // pas utilisé pour les villages
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

      {/* Sélections en fonction du type */}
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

      {/* Tableau d'affichage */}
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

  {type === 'quartier' && idTarget ? (
    (sectors.find((sector) => sector.id === idTarget)?.villages ?? []).length > 0 ? (
      (sectors.find((sector) => sector.id === idTarget)?.villages ?? []).map((village, index) => (
        <tr key={village.id}>
          <td>{index + 1}</td>
          <td>{village.name}</td>
          <td>{village.committeeName}</td>
          <td>{village.referenceNumber}</td>
          <td>
            <div className="d-flex gap-2 justify-content-center">
              <UpdateVillage village={{id: village.id , name : village.name,sector : idTarget}} />
              <DeleteVillage id={village.id} name={village.name} />
            </div>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan={5} className="text-center">Aucun quartier trouvé</td>
      </tr>
    )
  ) : status === 'succeeded' && villages.length > 0 ? (
    villages.map((village, index) => (
      <tr key={village.id}>
        <td>{index + 1}</td>
        <td>{village.name}</td>
        <td>{village.committeeName}</td>
        <td>{village.referenceNumber}</td>
        <td>
          <div className="d-flex gap-2 justify-content-center">
            <UpdateVillage village={{id: village.id , name : village.name, sector : idTarget}} />
            <DeleteVillage id={village.id} name={village.name} />
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

      {/* Modal pour l'ajout */}
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
{/*
            {type === 'quartier' ? (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Ville / Référence</Form.Label>
                  <Form.Select {...register('city')} defaultValue={idTarget}>
                    <option value="">-- Sélectionnez une référence --</option>
                    {sectors.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </Form.Select>
                  {errors.city && <small className="text-danger">{errors.city.message}</small>}
                </Form.Group>
              </>
            ) : (
              <Form.Group className="mb-3">
                <Form.Label>Référence</Form.Label>
                <Form.Select {...register('city')} defaultValue={idTarget}>
                  <option value="">-- Sélectionnez une référence --</option>
                  {territories.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            )} */}
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
                setIdVille(''); // pas utilisé pour les villages
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

      {/* Sélections en fonction du type */}
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
            <Button variant="primary" type="submit" disabled={isSubmitting || !idTarget}>
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}
