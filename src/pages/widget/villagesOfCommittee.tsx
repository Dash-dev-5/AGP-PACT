import { useAppDispatch, useAppSelector } from 'app/hooks';
import { useEffect, useMemo, useState } from 'react';
import { Button, Col, Form, Row, Spinner, Table } from 'react-bootstrap';
import CreateVillageModal from './createVillageModal';
import { fetchProvinces } from 'features/province/provinceSlice';
import { useForm } from 'react-hook-form';
import VillageUpdateModal from './villageUpdateModal';
import DeleteVillage from 'components/ui/village/DeleteVillage';
import useAuth from 'hooks/useAuth';

interface FormData {
  provinceId: string;
  cityId: string;
  sectorId: string;
}

export default function VillagesOfCommittee() {
  const dispatch = useAppDispatch();

  const [show, setShow] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // const { user } = useAuth();
  // console.log(user?.token);

  const { register, watch, setValue } = useForm<FormData>({
    defaultValues: {
      provinceId: '',
      cityId: '',
      sectorId: ''
    }
  });

  const selectedProvinceId = watch('provinceId');
  const selectedCityId = watch('cityId');
  const selectedSectorId = watch('sectorId');

  const { status, error, provinces } = useAppSelector((state) => state.province);

  useEffect(() => {
    dispatch(fetchProvinces());
  }, [dispatch]);

  // Fetch selected province, city, and sector from the hierarchy
  const selectedProvince = provinces?.find((p) => p.id === selectedProvinceId);
  const selectedCity = selectedProvince?.cities.find((c) => c.id === selectedCityId);
  const selectedSector = selectedCity?.sectors.find((s) => s.id === selectedSectorId);

  const filteredVillages = useMemo(() => {
    const villages = selectedSector?.villages || [];
    return searchTerm ? villages.filter((village) => village.name?.toLowerCase().includes(searchTerm.toLowerCase())) : villages;
  }, [searchTerm, selectedSector]);

  return (
    <>
      <div>
        <div className="mb-3">
          <span className="fs-4">Liste de villages</span>
        </div>
        <div className="d-flex flex-column flex-md-row gap-2 justify-content-md-between mb-5">
          <Form.Control
            type="text"
            placeholder="Rechercher un village"
            className="w-25"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="outline-primary" onClick={() => setShow(true)}>
            Ajouter un village
          </Button>
        </div>
        <Row className="mb-4">
          <Col xs={12} md={4}>
            <Form.Select
              {...register('provinceId')}
              onChange={(e) => {
                setValue('provinceId', e.target.value);
                setValue('cityId', '');
                setValue('sectorId', '');
              }}
            >
              <option value="">Sélectionnez une province</option>
              {provinces?.map((province) => (
                <option key={province.id} value={province.id}>
                  {province.name}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col xs={12} md={4}>
            <Form.Select
              {...register('cityId')}
              disabled={!selectedProvinceId}
              onChange={(e) => {
                setValue('cityId', e.target.value);
                setValue('sectorId', '');
              }}
            >
              <option value="">Sélectionnez une ville</option>
              {selectedProvince?.cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col xs={12} md={4}>
            <Form.Select {...register('sectorId')} disabled={!selectedCityId}>
              <option value="">Sélectionnez un secteur</option>
              {selectedCity?.sectors.map((sector) => (
                <option key={sector.id} value={sector.id}>
                  {sector.name}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Table striped bordered hover responsive>
              <thead className="text-center">
                <tr>
                  <th>#</th>
                  <th>Nom du Village</th>
                  <th>Comité</th>
                  <th>Tronçon</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {status === 'loading' && (
                  <tr>
                    <td colSpan={5} className="text-center">
                      <Spinner size="sm" />
                    </td>
                  </tr>
                )}
                {status === 'failed' && (
                  <tr>
                    <td colSpan={5} className="text-center">
                      {error}
                    </td>
                  </tr>
                )}
                {status === 'succeeded' && !selectedSectorId && (
                  <tr>
                    <td colSpan={5} className="text-center text-danger">
                      Sélectionnez tous les filtres
                    </td>
                  </tr>
                )}
                {status === 'succeeded' && selectedSectorId && filteredVillages.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center">
                      Aucune localité trouvée.
                    </td>
                  </tr>
                )}

                {status === 'succeeded' &&
                  filteredVillages.map((village, index) => (
                    <tr key={village.id}>
                      <td>{index + 1}</td>
                      <td>{village.name}</td>
                      <td>{village.committeeName}</td>
                      <td>{village.projectSiteName}</td>
                      <td className="d-flex gap-2 align-items-center justify-content-center">
                        <VillageUpdateModal village={village} />
                        <DeleteVillage id={village.id} name={village.name} />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </div>

      {show && <CreateVillageModal handleClose={() => setShow(false)} show={show} />}
    </>
  );
}
