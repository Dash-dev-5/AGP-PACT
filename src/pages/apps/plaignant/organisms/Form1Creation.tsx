import React from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button, Col, Form, Image, Row } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import imageRegister from 'assets/images/register.png';
import { useAppDispatch } from 'app/hooks';
import { RegerationFormType } from 'features/dataManagement/registrationSteps/registrationStepsType';
import { ActionCreatorWithPayload } from '@reduxjs/toolkit';

export const Form1VictimeDataType = z
  .object({
    username: z
      .string()
      .min(3, { message: "Le nom d'utilisateur doit comporter au moins 3 caractères" })
      .max(20, { message: "Le nom d'utilisateur ne peut pas dépasser 20 caractères" })
      .regex(/^[a-zA-Z0-9_]+$/, { message: "Le nom d'utilisateur ne peut contenir que des lettres, des chiffres et des underscores" }),
    password: z.string().min(3, { message: 'Le mot de passe doit comporter au moins 8 caractères' }),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword']
  });

interface Form1CreationProps {
  formData: RegerationFormType;
  saveStepData: ActionCreatorWithPayload<Partial<RegerationFormType>>;
}

const Form1Creation: React.FC<Form1CreationProps> = ({ formData, saveStepData }) => {
  const dispatch = useAppDispatch();

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<z.infer<typeof Form1VictimeDataType>>({
    resolver: zodResolver(Form1VictimeDataType),
    defaultValues: {
      username: formData.complainant.username,
      password: formData.complainant.password,
      confirmPassword: formData.complainant.password
    }
  });

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const onSubmit = (data: z.infer<typeof Form1VictimeDataType>) => {
    dispatch(saveStepData({ complainant: { ...formData.complainant, username: data.username, password: data.password } }));
  };

  return (
    <>
      <div>
        <div className="mb-5" style={{ height: '24.5rem' }}>
          <div className="mb-4">
            <span className="fs-4 fw-bold">Creation de compte</span>
          </div>
          <Row>
            <Col md={12} lg={6}>
              <Form.Group className="my-3 col-lg-12">
                <Form.Label>
                  Nom d'utilisateur <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control {...register('username')} type="text" autoComplete="username" />
                {errors.username ? <p className="text-danger">{errors.username.message}</p> : <p style={{ height: '1.375rem' }}></p>}
              </Form.Group>
              <Form.Group className="my-3 col-lg-12">
                <Form.Label>
                  Mot de passe <span className="text-danger">*</span>
                </Form.Label>
                <div className="input-group">
                  <Form.Control {...register('password')} type={showPassword ? 'text' : 'password'} autoComplete="new-password" />
                  <Button variant="danger" onClick={togglePasswordVisibility}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </div>
                {errors.password ? <p className="text-danger">{errors.password.message}</p> : <p style={{ height: '1.375rem' }}></p>}
              </Form.Group>
              <Form.Group className="my-3 col-lg-12">
                <Form.Label>
                  Confirmez le mot de passe <span className="text-danger">*</span>
                </Form.Label>
                <div className="input-group">
                  <Form.Control
                    {...register('confirmPassword')}
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                  />
                  <Button variant="danger" onClick={toggleConfirmPasswordVisibility}>
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </div>
                {errors.confirmPassword ? (
                  <p className="text-danger">{errors.confirmPassword.message}</p>
                ) : (
                  <p style={{ height: '1.375rem' }}></p>
                )}
              </Form.Group>
            </Col>
            <Col md={12} lg={6} className="d-none d-lg-block">
              <Image src={imageRegister} style={{ height: '18rem', width: '22rem' }} />
            </Col>
          </Row>
        </div>
        <div
          className="d-flex justify-content-between"
          style={{
            padding: '10px',
            backgroundColor: 'white'
          }}
        >
          <Button variant="primary" type="button" onClick={handleSubmit(onSubmit)}>
            Suivant
          </Button>
        </div>
      </div>
    </>
  );
};

export default Form1Creation;
