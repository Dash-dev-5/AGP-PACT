import { useAppDispatch, useAppSelector } from 'app/hooks';
import { fetchCommitteesAsync } from 'features/commitee/committeeSlice';
import { fetchProjectSitesAsync } from 'features/project-site/projectSiteSlice';
import { updateVillage } from 'features/province/provinceSlice';
import { AddVillage, IVillage } from 'features/province/provinceType';
import { Edit } from 'iconsax-react';
import React, { useEffect, useState } from 'react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const VillageUpdateModal: React.FC<{ village: IVillage }> = ({ village }) => {
  const [show, setShow] = useState(false);
  const {
    register,
    handleSubmit,

    formState: { errors }
  } = useForm<AddVillage>({
    defaultValues: {
      name: village.name,
      committee: village.committeeId as string,
      projectSite: village.projectSiteId as string
    }
  });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { projectSites } = useAppSelector((state) => state.projectSite);
  const { committees } = useAppSelector((state) => state.committee);

  // Parse URL params for city, province, and sector if they exist
  const urlParams = new URLSearchParams(location.search);
  const city = urlParams.get('city');
  const province = urlParams.get('province');
  const sector = urlParams.get('sector');

  //Fetch all villages of committee
  useEffect(() => {
    dispatch(fetchCommitteesAsync({ allInOnePage: true }));
    dispatch(fetchProjectSitesAsync());
  }, [dispatch]);

  const onSubmit = async (data: AddVillage) => {
    console.log(data);

    if (data.name === village.name && data.committee === village.committeeId && data.projectSite === village.projectSiteId) {
      setShow(false);
      toast.success('Aucune modification !', {
        autoClose: 1000
      });
      return;
    }
    const toastId = toast.loading('Veuillez patienter...');
    try {
      await dispatch(updateVillage({ id: village.id, village: data })).unwrap();
      toast.update(toastId, {
        render: 'Village modifie avec succes',
        type: 'success',
        isLoading: false,
        autoClose: 1000
      });
      navigate(`${location.pathname}?city=${city}&province=${province}&sector=${sector}`);
    } catch (error: any) {
      console.log(error);

      toast.update(toastId, {
        render: error,
        type: 'error',
        isLoading: false,
        autoClose: 3000
      });
    } finally {
      setShow(false);
    }
  };

  return (
    <>
      <Button variant="primary" size="sm" onClick={() => setShow(true)}>
        <Edit size="16" color="#FFFFFF" />
      </Button>
      {show && (
        <Modal show={show} onHide={() => setShow(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Modifier le village ({village?.name})</Modal.Title>
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

                <Form.Group controlId="formStep2" className="mt-2">
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
                <Form.Group controlId="formStep2" className="mt-2">
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

              <Button variant="primary" type="submit" className="mt-3 px-4 py-2" disabled={false}>
                {false ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Modification...
                  </>
                ) : (
                  'Modifier'
                )}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default VillageUpdateModal;
