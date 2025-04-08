import { Controller, useForm } from 'react-hook-form';

import { Form, Button, Spinner, Row, Col } from 'react-bootstrap';
import { CreatePap } from 'features/pap/papTypes';
import PhoneInput from 'react-phone-number-input';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { createPapAsync } from 'features/pap/papSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { parseError } from 'utils/verbes';

const AddPap = () => {
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.pap);

  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<CreatePap>();

  const onSubmit = async (data: CreatePap) => {
    try {
      await dispatch(createPapAsync(data)).unwrap();
      toast.success('PAP créé avec succès');
      navigate('/gestion/pap');
    } catch (error) {
      toast.error(parseError(error));
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-center">Ajouter un PAP</h3>
      <Form onSubmit={handleSubmit(onSubmit)} className="p-4 bg-light rounded shadow-sm">
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Code PAP</Form.Label>
              <Form.Control {...register('code')} placeholder="Ex: PAP12345" />
              {errors.code && <p className="text-danger small">{errors.code.message}</p>}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Nom complet</Form.Label>
              <Form.Control {...register('fullName')} placeholder="Ex: Jean Doe" />
              {errors.fullName && <p className="text-danger small">{errors.fullName.message}</p>}
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label>Sexe</Form.Label>
              <Form.Select {...register('gender')}>
                <option value="">Sélectionnez</option>
                <option value="Male">Masculin</option>
                <option value="Female">Féminin</option>
              </Form.Select>
              {errors.gender && <p className="text-danger small">{errors.gender.message}</p>}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Âge</Form.Label>
              <Form.Control type="number" {...register('age')} placeholder="Ex: 30" />
              {errors.age && <p className="text-danger small">{errors.age.message}</p>}
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label>Numéro de téléphone</Form.Label>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => <PhoneInput {...field} defaultCountry="CD" className="form-control" />}
              />
              {errors.phone && <p className="text-danger small">{errors.phone.message}</p>}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Numéro de la pièce d'identité</Form.Label>
              <Form.Control {...register('identityDocumentNumber')} />
              {errors.identityDocumentNumber && <p className="text-danger small">{errors.identityDocumentNumber.message}</p>}
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label>Type de propriété</Form.Label>
              <Form.Control {...register('propertyType')} placeholder="Ex: Terrain" />
              {errors.propertyType && <p className="text-danger small">{errors.propertyType.message}</p>}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Territoire</Form.Label>
              <Form.Control {...register('territory')} placeholder="Ex: Kinshasa" />
              {errors.territory && <p className="text-danger small">{errors.territory.message}</p>}
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label>Village</Form.Label>
              <Form.Control {...register('village')} placeholder="Ex: Kinshasa" />
              {errors.village && <p className="text-danger small">{errors.village.message}</p>}
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label>Longitude</Form.Label>
              <Form.Control {...register('longitude')} placeholder="Ex: -1.2921" />
              {errors.longitude && <p className="text-danger small">{errors.longitude.message}</p>}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Latitude</Form.Label>
              <Form.Control {...register('latitude')} placeholder="Ex: 36.8219" />
              {errors.latitude && <p className="text-danger small">{errors.latitude.message}</p>}
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Coordonnées</Form.Label>
              <Form.Control {...register('coordonnees')} placeholder="Ex: -1.2921,36.8219" />
              {errors.coordonnees && <p className="text-danger small">{errors.coordonnees.message}</p>}
            </Form.Group>
          </Col>

          {[
            {
              name: 'surface',
              label: 'Surface (m²)',
              type: 'number',
              placeholder: 'Ex: 500'
            },
            {
              name: 'cu',
              label: 'CU',
              type: 'number',
              placeholder: 'Ex: 100'
            },
            {
              name: 'plusValue',
              label: 'Plus-value',
              type: 'number',
              placeholder: 'Ex: 1000'
            },
            {
              name: 'annexeSurface',
              label: 'Annexe Surface',
              type: 'number',
              placeholder: 'Ex: 200'
            },
            {
              name: 'activiteCommerciale',
              label: 'Activité Commerciale',
              placeholder: 'Ex: Commerce'
            },
            {
              name: 'arbreAffectee',
              label: 'Arbre Affectée',
              placeholder: 'Ex: Palmier'
            },
            {
              name: 'nombreJours',
              label: 'Nombre de jours',
              type: 'number',
              placeholder: 'Ex: 30'
            },
            {
              name: 'equivalentDollars',
              label: 'Equivalent en Dollars',
              type: 'number',
              placeholder: 'Ex: 1000'
            },
            {
              name: 'perteRevenuLocatif',
              label: 'Perte de Revenu Locatif',
              type: 'number',
              placeholder: 'Ex: 500'
            },
            {
              name: 'assistanceDemenagement',
              label: 'Assistance Déménagement',
              type: 'number',
              placeholder: 'Ex: 300'
            },
            {
              name: 'assistance_personne_vulnerable',
              label: 'Assistance Personne Vulnérable',
              type: 'number',
              placeholder: 'Ex: 200'
            }
          ].map((field) => (
            <Col md={6} key={field.name}>
              <Form.Group className="mb-3">
                <Form.Label>{field.label}</Form.Label>
                <Form.Control {...register(field.name as keyof CreatePap)} type={field.type || 'text'} placeholder={field.placeholder} />
                {errors[field.name as keyof CreatePap] && (
                  <p className="text-danger small">{errors[field.name as keyof CreatePap]?.message}</p>
                )}
              </Form.Group>
            </Col>
          ))}
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Accord de Libération de Lieu</Form.Label>
          <Form.Check type="checkbox" label="Oui" {...register('accordLiberationLieu')} />
          {errors.accordLiberationLieu && <p className="text-danger small">{errors.accordLiberationLieu.message}</p>}
        </Form.Group>

        <Button type="submit" variant="primary" disabled={status === 'loading'} className="w-100">
          {status === 'loading' ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Enregistrement...
            </>
          ) : (
            'Enregistrer'
          )}
        </Button>
      </Form>
    </div>
  );
};

export default AddPap;
