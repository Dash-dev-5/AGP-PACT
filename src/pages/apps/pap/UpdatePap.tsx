import { useEffect } from 'react';
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import PhoneInput from 'react-phone-number-input';
import { Controller, useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { UpdatePapType } from 'features/pap/papTypes';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchPapByIdAsync, updatePapAsync } from 'features/pap/papSlice';
import { toast } from 'react-toastify';
import { parseError } from 'utils/verbes';
import 'react-phone-number-input/style.css';

const UpdatePap = () => {
  const { status, singlePap } = useAppSelector((state) => state.pap);
  const { papId } = useParams();
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm<UpdatePapType['data']>();

  useEffect(() => {
    if (papId) {
      dispatch(fetchPapByIdAsync(papId));
    }
  }, [papId, dispatch]);

  useEffect(() => {
    if (singlePap) {
      reset(singlePap);
    }
  }, [singlePap, reset]);

  const onSubmit = async (data: UpdatePapType['data']) => {
    if (!papId) return;
    try {
      const params = { id: papId, data };
      await dispatch(updatePapAsync(params)).unwrap();
      toast.success('Données mises à jour avec succès !');
      navigate('/gestion/pap');
    } catch (error) {
      toast.error(parseError(error), {
        autoClose: 5000
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="container mt-4">
      <h3 className="mb-4">Mettre à jour le PAP</h3>

      <Row className="gy-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Code PAP</Form.Label>
            <Form.Control {...register('code')} placeholder="Ex: PAP12345" />
            {errors.code && <Form.Text className="text-danger">{errors.code.message}</Form.Text>}
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>Nom complet</Form.Label>
            <Form.Control {...register('fullName')} placeholder="Ex: Jean Doe" />
            {errors.fullName && <Form.Text className="text-danger">{errors.fullName.message}</Form.Text>}
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
            {errors.gender && <Form.Text className="text-danger">{errors.gender.message}</Form.Text>}
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>Âge</Form.Label>
            <Form.Control type="number" {...register('age')} placeholder="Ex: 30" />
            {errors.age && <Form.Text className="text-danger">{errors.age.message}</Form.Text>}
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
            {errors.phone && <Form.Text className="text-danger">{errors.phone.message}</Form.Text>}
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>Numéro de la pièce d'identité</Form.Label>
            <Form.Control {...register('identityDocumentNumber')} />
            {errors.identityDocumentNumber && <Form.Text className="text-danger">{errors.identityDocumentNumber.message}</Form.Text>}
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>Type de propriété</Form.Label>
            <Form.Control {...register('propertyType')} placeholder="Ex: Terrain" />
            {errors.propertyType && <Form.Text className="text-danger">{errors.propertyType.message}</Form.Text>}
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>Territoire</Form.Label>
            <Form.Control {...register('territory')} placeholder="Ex: Kinshasa" />
            {errors.territory && <Form.Text className="text-danger">{errors.territory.message}</Form.Text>}
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>Village</Form.Label>
            <Form.Control {...register('village')} placeholder="Ex: Masina" />
            {errors.village && <Form.Text className="text-danger">{errors.village.message}</Form.Text>}
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>Longitude</Form.Label>
            <Form.Control {...register('longitude')} placeholder="Ex: -1.2921" />
            {errors.longitude && <Form.Text className="text-danger">{errors.longitude.message}</Form.Text>}
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>Latitude</Form.Label>
            <Form.Control {...register('latitude')} placeholder="Ex: 36.8219" />
            {errors.latitude && <Form.Text className="text-danger">{errors.latitude.message}</Form.Text>}
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>Coordonnées</Form.Label>
            <Form.Control {...register('coordonnees')} placeholder="Ex: -1.2921,36.8219" />
            {errors.coordonnees && <Form.Text className="text-danger">{errors.coordonnees.message}</Form.Text>}
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>Surface (m²)</Form.Label>
            <Form.Control type="number" {...register('surface')} placeholder="Ex: 500" />
            {errors.surface && <Form.Text className="text-danger">{errors.surface.message}</Form.Text>}
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>CU</Form.Label>
            <Form.Control type="number" {...register('cu')} placeholder="Ex: 100" />
            {errors.cu && <Form.Text className="text-danger">{errors.cu.message}</Form.Text>}
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>Plus-value</Form.Label>
            <Form.Control type="number" {...register('plusValue')} placeholder="Ex: 1000" />
            {errors.plusValue && <Form.Text className="text-danger">{errors.plusValue.message}</Form.Text>}
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>Annexe Surface</Form.Label>
            <Form.Control type="number" {...register('annexeSurface')} placeholder="Ex: 200" />
            {errors.annexeSurface && <Form.Text className="text-danger">{errors.annexeSurface.message}</Form.Text>}
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>Activité Commerciale</Form.Label>
            <Form.Control {...register('activiteCommerciale')} placeholder="Ex: Commerce" />
            {errors.activiteCommerciale && <Form.Text className="text-danger">{errors.activiteCommerciale.message}</Form.Text>}
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>Arbre Affectée</Form.Label>
            <Form.Control {...register('arbreAffectee')} placeholder="Ex: Palmier" />
            {errors.arbreAffectee && <Form.Text className="text-danger">{errors.arbreAffectee.message}</Form.Text>}
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>Nombre de jours</Form.Label>
            <Form.Control type="number" {...register('nombreJours')} placeholder="Ex: 30" />
            {errors.nombreJours && <Form.Text className="text-danger">{errors.nombreJours.message}</Form.Text>}
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>Equivalent en Dollars</Form.Label>
            <Form.Control type="number" {...register('equivalentDollars')} placeholder="Ex: 1000" />
            {errors.equivalentDollars && <Form.Text className="text-danger">{errors.equivalentDollars.message}</Form.Text>}
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>Perte de Revenu Locatif</Form.Label>
            <Form.Control type="number" {...register('perteRevenuLocatif')} placeholder="Ex: 500" />
            {errors.perteRevenuLocatif && <Form.Text className="text-danger">{errors.perteRevenuLocatif.message}</Form.Text>}
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>Assistance Déménagement</Form.Label>
            <Form.Control type="number" {...register('assistanceDemenagement')} placeholder="Ex: 300" />
            {errors.assistanceDemenagement && <Form.Text className="text-danger">{errors.assistanceDemenagement.message}</Form.Text>}
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>Assistance Personne Vulnérable</Form.Label>
            <Form.Control type="number" {...register('assistance_personne_vulnerable')} placeholder="Ex: 200" />
            {errors.assistance_personne_vulnerable && (
              <Form.Text className="text-danger">{errors.assistance_personne_vulnerable.message}</Form.Text>
            )}
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>Accord de Libération de Lieu</Form.Label>
            <Form.Check type="checkbox" label="Oui" {...register('accordLiberationLieu')} />
            {errors.accordLiberationLieu && <Form.Text className="text-danger">{errors.accordLiberationLieu.message}</Form.Text>}
          </Form.Group>
        </Col>
      </Row>

      <div className="d-flex justify-content-end mt-4">
        <Button type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? (
            <>
              <Spinner size="sm" className="me-2" />
              Enregistrement...
            </>
          ) : (
            'Enregistrer'
          )}
        </Button>
      </div>
    </form>
  );
};

export default UpdatePap;
