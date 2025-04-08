import { useAppDispatch, useAppSelector } from 'app/hooks';
import { CreateComplaint } from 'features/complaint/complaintType';
import { fetchProvinces } from 'features/province/provinceSlice';
import { fetchVulnerability } from 'features/vulnerability/vulnerabilitySlice';
import React from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';

const OneVictime: React.FC<{
  index: number;
  register: UseFormRegister<CreateComplaint>;
  setValue: UseFormSetValue<CreateComplaint>;
  watch: UseFormWatch<CreateComplaint>;
  errors: FieldErrors<CreateComplaint>;
}> = ({ index, register, setValue, watch, errors }) => {
  const dispatch = useAppDispatch();
  const { provinces } = useAppSelector((state) => state.province);
  const { vulnerabilities } = useAppSelector((state) => state.vulnerability);

  React.useEffect(() => {
    dispatch(fetchProvinces());
    dispatch(fetchVulnerability());
  }, [dispatch]);

  return (
    <div className="border border-solid border-2 rounded-4 p-3 mb-4">
      <h4>Victime {index + 1}</h4>
      <Row>
        <Form.Group className="mb-3 col-lg-4 col-md-6">
          <Form.Label>Prénom</Form.Label>
          <Form.Control type="text" {...register(`victims.${index}.firstName`)} placeholder="Prénom" />
        </Form.Group>
        <Form.Group className="mb-3 col-lg-4 col-md-6">
          <Form.Label>Nom</Form.Label>
          <Form.Control type="text" {...register(`victims.${index}.lastName`)} placeholder="Nom" />
        </Form.Group>
        <Form.Group className="mb-3 col-lg-4 col-md-6">
          <Form.Label>Postnom</Form.Label>
          <Form.Control type="text" {...register(`victims.${index}.middleName`)} placeholder="Postnom" />
        </Form.Group>
        <Form.Group className="mb-3 col-lg-4 col-md-6">
          <Form.Label>Date de naissance</Form.Label>
          <Form.Control type="date" {...register(`victims.${index}.dateOfBirth`)} placeholder="Date de naissance" />
        </Form.Group>
        <Form.Group className="mb-3 col-lg-4 col-md-6">
          <Form.Label>Genre</Form.Label>
          <Form.Select {...register(`victims.${index}.gender`)}>
            <option value="Male">Homme</option>
            <option value="Female">Femme</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3 col-lg-4 col-md-6">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" {...register(`victims.${index}.email`)} placeholder="Email" />
        </Form.Group>
        <Form.Group className="mb-3 col-lg-4 col-md-6">
          <Form.Label>Telephone</Form.Label>
          <Form.Control type="text" {...register(`victims.${index}.phone`)} placeholder="Telephone" />
        </Form.Group>
        <Form.Group className="col-lg-4 col-md-6">
          <Form.Label>Niveau de vulnérabilité</Form.Label>
          <Form.Select {...register(`victims.${index}.vulnerabilityLevel`)}>
            {vulnerabilities.map((vulnerability) => (
              <option key={vulnerability.id} value={vulnerability.id}>
                {vulnerability.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3 col-lg-4 col-md-6">
          <Form.Label>Adresse 1</Form.Label>
          <Form.Control
            type="text"
            {...register(`victims.${index}.addressLine1`, { required: { value: true, message: "L'adresse est obligatoire" } })}
            placeholder="Première adresse"
          />
          {errors?.victims?.[index]?.addressLine1?.message && (
            <Form.Text className="text-danger">{errors.victims[index]?.addressLine1?.message}</Form.Text>
          )}
        </Form.Group>
        <Form.Group className="mb-3 col-lg-4 col-md-6">
          <Form.Label>Adresse 2</Form.Label>
          <Form.Control type="text" {...register(`victims.${index}.addressLine2`)} placeholder="Deuxième adresse" />
        </Form.Group>
        <Form.Group className="mb-3 col-lg-4 col-md-6">
          <Form.Label>Relation avec le plaignant</Form.Label>
          <Form.Select {...register(`victims.${index}.relationshipToComplainant`)}>
            <option value="Spouse">Conjoint(e)</option>
            <option value="Child">Enfant</option>
            <option value="Acquaintance">Connaissance</option>
            <option value="Other family member">Autre membre de la famille</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3 col-lg-4 col-md-6">
          <Form.Label>Province</Form.Label>
          <Form.Select
            {...register(`victims.${index}.province`, {
              required: {
                value: true,
                message: 'Veuillez selectionner une province'
              },
              onChange: (e) => {
                setValue(`victims.${index}.city`, '');
                setValue(`victims.${index}.sector`, '');
                setValue(`victims.${index}.village`, '');
                setValue(`victims.${index}.province`, e.target.value);
              }
            })}
          >
            <option value="">Sélectionner la province</option>
            {provinces?.map((province) => (
              <option key={province.id} value={province.id}>
                {province.name}
              </option>
            ))}
          </Form.Select>
          {errors?.victims?.[index]?.province && <p className="text-danger">{errors?.victims?.[index]?.province?.message}</p>}
        </Form.Group>
        {watch(`victims.${index}.province`) && (
          <Form.Group className="mb-3 col-lg-4 col-md-6">
            <Form.Label>Ville</Form.Label>
            <Form.Select
              {...register(`victims.${index}.city`, {
                required: {
                  value: true,
                  message: 'Veuillez selectionner une ville'
                },
                onChange: (e) => {
                  setValue(`victims.${index}.sector`, '');
                  setValue(`victims.${index}.village`, '');
                  setValue(`victims.${index}.city`, e.target.value);
                }
              })}
            >
              <option value="">Sélectionner la ville</option>
              {provinces &&
                provinces
                  .find((province) => province.id === watch(`victims.${index}.province`))
                  ?.cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
            </Form.Select>
            {errors?.victims?.[index]?.city && <p className="text-danger">{errors?.victims?.[index]?.city?.message}</p>}
          </Form.Group>
        )}
        {watch(`victims.${index}.city`) && (
          <Form.Group className="mb-3 col-lg-4 col-md-6">
            <Form.Label>Secteur</Form.Label>
            <Form.Select
              {...register(`victims.${index}.sector`, {
                required: {
                  value: true,
                  message: 'Veuillez selectionner un secteur'
                },
                onChange: (e) => setValue(`victims.${index}.sector`, e.target.value)
              })}
              required
            >
              <option value="">Sélectionner le secteur</option>
              {provinces &&
                provinces
                  .find((province) => province.id === watch(`victims.${index}.province`))
                  ?.cities.find((city) => city.id === watch(`victims.${index}.city`))
                  ?.sectors.map((sector) => (
                    <option key={sector.id} value={sector.id}>
                      {sector.name}
                    </option>
                  ))}
            </Form.Select>
            {errors?.victims?.[index]?.sector && <p className="text-danger">{errors?.victims?.[index]?.sector?.message}</p>}
          </Form.Group>
        )}
        {watch(`victims.${index}.sector`) && (
          <Form.Group className="mb-3 col-lg-4 col-md-6">
            <Form.Label>Village</Form.Label>
            <Form.Select
              {...register(`victims.${index}.village`, {
                required: {
                  value: true,
                  message: 'Veuillez selectionner un village'
                },
                onChange: (e) => setValue(`victims.${index}.village`, e.target.value)
              })}
            >
              <option value="">Sélectionner le village</option>
              {provinces &&
                provinces
                  .find((province) => province.id === watch(`victims.${index}.province`))
                  ?.cities.find((city) => city.id === watch(`victims.${index}.city`))
                  ?.sectors.find((sector) => sector.id === watch(`victims.${index}.sector`))
                  ?.villages.map((village) => (
                    <option key={village.id} value={village.id}>
                      {village.name}
                    </option>
                  ))}
            </Form.Select>
            {errors?.victims?.[index]?.village && <p className="text-danger">{errors?.victims?.[index]?.village?.message}</p>}
          </Form.Group>
        )}
      </Row>
    </div>
  );
};

export default OneVictime;

// to review
