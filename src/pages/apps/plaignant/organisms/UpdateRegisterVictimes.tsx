import React from 'react';
import { Button, Col, FloatingLabel, Form, Modal, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { fetchVulnerability } from 'api/fetchData';
import { ProjeSite } from 'types/auth';
import { FaRegEdit } from 'react-icons/fa';
import { z } from 'zod';
import { AddVictimeModalFormData } from '../addVictimeModal';
import { zodResolver } from '@hookform/resolvers/zod';
import { VictimeType } from 'features/dataManagement/dataManagementType';

const UpdateRegisterVictimes = ({
  index,
  victime,
  updateVictimeByIndex
}: {
  index: number;
  victime: VictimeType;
  updateVictimeByIndex: (index: number, data: any) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<z.infer<typeof AddVictimeModalFormData>>({
    resolver: zodResolver(AddVictimeModalFormData),
    defaultValues: {
      firstName: victime.firstName,
      lastName: victime.lastName,
      middleName: victime.middleName,
      dateOfBirth: victime.dateOfBirth,
      gender: victime.gender,
      relationshipToComplainant: victime.relationshipToComplainant,
      vulnerabilityLevel: victime.vulnerabilityLevel
    }
  });

  const [show, setShow] = React.useState(false);
  const [vulnerability, setVulnerability] = React.useState<ProjeSite[]>([]);

  const handleClose = () => {
    setShow(false);
  };

  React.useEffect(() => {
    const loadVulnerability = async () => {
      const fetchedVulnerability = await fetchVulnerability();
      setVulnerability(fetchedVulnerability);
    };

    loadVulnerability();
  }, []);

  const renderOptions = (items: { id: string; name: string }[]) =>
    items.map((item) => (
      <option key={item.id} value={item.id}>
        {item.name}
      </option>
    ));

  const onSubmit = (data: z.infer<typeof AddVictimeModalFormData>) => {
    updateVictimeByIndex(index, data);
    handleClose();
  };

  return (
    <>
      <Button type="button" variant="outline-primary" onClick={() => setShow(true)}>
        <FaRegEdit />
      </Button>
      {show && (
        <Modal show={show} onHide={handleClose} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Modifier une victime</Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4">
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row className="g-3 mb-3">
                <Col md={4}>
                  <FloatingLabel label="Nom">
                    <Form.Control type="text" {...register('firstName')} isInvalid={!!errors.firstName} />
                    <Form.Control.Feedback type="invalid">{errors.firstName?.message}</Form.Control.Feedback>
                  </FloatingLabel>
                </Col>
                <Col md={4}>
                  <FloatingLabel label="Post-nom">
                    <Form.Control type="text" {...register('middleName')} />
                  </FloatingLabel>
                </Col>
                <Col md={4}>
                  <FloatingLabel label="Prénom">
                    <Form.Control type="text" {...register('lastName')} isInvalid={!!errors.lastName} />
                    <Form.Control.Feedback type="invalid">{errors.lastName?.message}</Form.Control.Feedback>
                  </FloatingLabel>
                </Col>
              </Row>
              <Row className="g-3 mb-3">
                <Col md={6}>
                  <FloatingLabel label="Date de naissance">
                    <Form.Control type="date" {...register('dateOfBirth')} isInvalid={!!errors.dateOfBirth} />
                    <Form.Control.Feedback type="invalid">{errors.dateOfBirth?.message}</Form.Control.Feedback>
                  </FloatingLabel>
                </Col>
                <Col md={6}>
                  <FloatingLabel label="Sexe">
                    <Form.Select {...register('gender')} isInvalid={!!errors.gender}>
                      <option value="">Sélectionnez le sexe</option>
                      <option value="Male">Homme</option>
                      <option value="Female">Femme</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{errors.gender?.message}</Form.Control.Feedback>
                  </FloatingLabel>
                </Col>
              </Row>
              <Row className="g-3 mb-3">
                <Col md={6}>
                  <FloatingLabel label="Relation avec le plaignant">
                    <Form.Select {...register('relationshipToComplainant')} isInvalid={!!errors.relationshipToComplainant}>
                      <option value="">Sélectionnez une relation</option>
                      <option value="Child">Enfant</option>
                      <option value="Acquaintance">Connaissance</option>
                      <option value="Spouse">Conjoint</option>
                      <option value="Other family member">Autre membre de la famille</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{errors.relationshipToComplainant?.message}</Form.Control.Feedback>
                  </FloatingLabel>
                </Col>
                <Col md={6}>
                  <FloatingLabel label="Niveau de vulnérabilité">
                    <Form.Select {...register('vulnerabilityLevel')} isInvalid={!!errors.vulnerabilityLevel}>
                      <option value="">Sélectionnez un niveau</option>
                      {renderOptions(vulnerability)}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{errors.vulnerabilityLevel?.message}</Form.Control.Feedback>
                  </FloatingLabel>
                </Col>
              </Row>
              <Modal.Footer className="border-0">
                <Button variant="danger" onClick={handleClose}>
                  Annuler
                </Button>
                <Button variant="primary" type="submit">
                  Modifier
                </Button>
              </Modal.Footer>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default UpdateRegisterVictimes;
