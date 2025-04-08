import { CreateComplaint } from 'features/complaint/complaintType';
import React from 'react';
import { Control, FieldErrors, useFieldArray, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import OneVictime from './OneVictime';
import { Button, Row } from 'react-bootstrap';

const Victimes: React.FC<{
  control: Control<CreateComplaint, any>;
  register: UseFormRegister<CreateComplaint>;
  setValue: UseFormSetValue<CreateComplaint>;
  watch: UseFormWatch<CreateComplaint>;
  errors: FieldErrors<CreateComplaint>;
}> = ({ control, register, setValue, watch, errors }) => {
  const { fields, append, remove } = useFieldArray({ control, name: 'victims' });
  const appendOneVictime = () => {
    append({
      firstName: '',
      lastName: '',
      email: '',
      gender: 'Male',
      phone: '',
      dateOfBirth: '',
      addressLine1: '',
      province: '',
      city: '',
      sector: '',
      village: '',
      vulnerabilityLevel: '',
      relationshipToComplainant: 'Acquaintance'
    });
  };
  return (
    <div className="mb-4">
      {fields.map((_, index) => (
        <OneVictime index={index} register={register} setValue={setValue} watch={watch} errors={errors} />
      ))}

      <Button onClick={() => appendOneVictime()}>Ahouter une victime</Button>
    </div>
  );
};

export default Victimes;
