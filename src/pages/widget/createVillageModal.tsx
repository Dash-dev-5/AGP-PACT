import { useAppDispatch, useAppSelector } from 'app/hooks';
import { fetchCommitteesAsync } from 'features/commitee/committeeSlice';
import { fetchProjectSitesAsync } from 'features/project-site/projectSiteSlice';
import { createVillage, fetchProvinces } from 'features/province/provinceSlice';
import { AddVillage, ICity, IProvince } from 'features/province/provinceType';
import { useEffect, useState } from 'react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

interface FormData {
  name: string;
  village: string;
  province: string;
  city: string;
  sector: string;
  projectSite: string;
  committee: string;
}

const CreateVillageModal: React.FC<{ show: boolean; handleClose: () => void }> = ({ show, handleClose }) => {
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<FormData>();

  const [selectedProvince, setSelectedProvince] = useState<IProvince | null>(null);
  const [selectedCity, setSelectedCity] = useState<ICity | null>(null);

  const { projectSites } = useAppSelector((state) => state.projectSite);
  const { committees } = useAppSelector((state) => state.committee);
  const { provinces } = useAppSelector((state) => state.province);

  const provinceId = watch('province');
  const cityId = watch('city');

  //Fetch all villages of committee
  useEffect(() => {
    dispatch(fetchCommitteesAsync({ allInOnePage: true }));
    dispatch(fetchProjectSitesAsync());
    dispatch(fetchProvinces());
  }, [dispatch]);

  useEffect(() => {
    setSelectedProvince(provinces?.find((province) => province.id === provinceId) || null);
    setSelectedCity(selectedProvince?.cities.find((city) => city.id === cityId) || null);
  }, [selectedProvince, provinceId, cityId]);

  //Submit data
  const onSubmit = async (data: FormData) => {
    const params: AddVillage = {
      name: data.name,
      projectSite: data.projectSite,
      committee: data.committee,
      sector: data.sector
    };

    const toastId = toast.loading('Veuillez patienter...');
    try {
      await dispatch(createVillage(params)).unwrap();

      toast.update(toastId, {
        render: 'Village ajoute avec succes',
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
        autoClose: 6000
      });
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Ajouter un village à un comité</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ height: 'auto' }}>
            <div className="mb-2 row">
              <Form.Group>
                <Form.Label>Nom du village</Form.Label>
                <Form.Control
                  type="text"
                  {...register('name', {
                    required: {
                      value: true,
                      message: 'Veuillez entrer le nom du village'
                    }
                  })}
                />
                {errors?.name && <p className="text-danger mb-0">{errors?.name?.message}</p>}
              </Form.Group>
            </div>

            <div className="mb-2 row">
              <Form.Group controlId="formStep2" className="mt-2 col-lg-6">
                <Form.Label>Site du projet</Form.Label>
                <Form.Select
                  {...register('projectSite', {
                    required: {
                      value: true,
                      message: 'Veuillez choisir le site de projet'
                    }
                  })}
                >
                  <option value="">Choisissez un site</option>
                  {projectSites.map((item, index) => (
                    <option key={index} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </Form.Select>
                {errors?.projectSite && <p className="text-danger mb-0">{errors?.name?.message}</p>}
              </Form.Group>
              <Form.Group controlId="formStep2" className="mt-2 col-lg-6">
                <Form.Label>Comité</Form.Label>
                <Form.Select
                  {...register('committee', {
                    required: {
                      value: true,
                      message: 'Veuillez choisir un comité'
                    }
                  })}
                >
                  <option value="">Choisissez un comité</option>
                  {committees.data.map((item, index) => (
                    <option key={index} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </Form.Select>
                {errors?.committee && <p className="text-danger mb-0">{errors?.committee?.message}</p>}
              </Form.Group>
            </div>

            <div className="row mb-2">
              <Form.Group className="mt-2 col-lg-6">
                <Form.Label>Province</Form.Label>
                <Form.Select
                  {...register('province', {
                    required: {
                      value: true,
                      message: 'Veuillez selectionner une province'
                    }
                  })}
                  defaultValue=""
                >
                  <option value="">Sélectionner la province</option>
                  {provinces?.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </Form.Select>
                {errors?.province && <p className="text-danger mb-0">{errors.province.message}</p>}
              </Form.Group>
              <Form.Group className="mt-2 col-lg-6">
                <Form.Label>Ville</Form.Label>
                <Form.Select
                  {...register('city', {
                    required: {
                      value: true,
                      message: 'Veuillez selectionner une ville'
                    }
                  })}
                  defaultValue=""
                  disabled={!selectedProvince}
                >
                  <option value="">Sélectionner la ville</option>
                  {selectedProvince?.cities.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </Form.Select>
                {errors?.city && <p className="text-danger mb-0">{errors.city.message}</p>}
              </Form.Group>
            </div>
            <div className="row mb-5">
              <Form.Group className="mt-2 col-lg-6">
                <Form.Label>Secteur</Form.Label>
                <Form.Select
                  {...register('sector', {
                    required: {
                      value: true,
                      message: 'Veuillez selectionner un secteur'
                    }
                  })}
                  defaultValue=""
                  disabled={!selectedCity}
                >
                  <option value="">Sélectionner le secteur</option>
                  {selectedCity?.sectors.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </Form.Select>
                {errors?.sector && <p className="text-danger mb-0">{errors.sector.message}</p>}
              </Form.Group>
            </div>
          </div>
          <Button variant="primary" type="submit" className="mt-3" disabled={false}>
            {false ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Enregistrement...
              </>
            ) : (
              'Enregistrer'
            )}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateVillageModal;
