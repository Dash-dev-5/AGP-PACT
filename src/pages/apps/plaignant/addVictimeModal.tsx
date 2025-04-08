import { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';
import { fetchVulnerability } from 'api/fetchData';
import { useEffect, useState } from 'react';
import { Button, Col, FloatingLabel, Form, Modal, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { ProjeSite } from 'types/auth';

export const AddVictimeModalFormData = z.object({
  firstName: z.string().min(1, { message: 'Le prénom est requis' }),
  lastName: z.string().min(1, { message: 'Le nom est requis' }),
  middleName: z.string().optional(),
  dateOfBirth: z.string().refine(
    (val) => {
      const date = new Date(val);
      return date.toString() !== 'Invalid Date';
    },
    { message: 'La date de naissance est invalide' }
  ),
  gender: z.enum(['Male', 'Female'], { message: 'Le sexe est requis' }),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  relationshipToComplainant: z.string().min(1, { message: 'La relation avec le plaignant est requise' }),
  vulnerabilityLevel: z.string().min(1, { message: 'Le niveau de vulnérabilité est requis' })
});

function AddVictimeModal({
  show,
  setAjoutVictime,
  saveVictimesData
}: {
  show: boolean;
  setAjoutVictime: React.Dispatch<React.SetStateAction<boolean>>;
  saveVictimesData: (data: any) => void;
}) {
  const handleClose = () => setAjoutVictime(false);
  const [vulnerability, setVulnerability] = useState<ProjeSite[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<z.infer<typeof AddVictimeModalFormData>>({
    resolver: zodResolver(AddVictimeModalFormData)
  });

  const renderOptions = (items: { id: string; name: string }[]) =>
    items.map((item) => (
      <option key={item.id} value={item.id}>
        {item.name}
      </option>
    ));

  useEffect(() => {
    const loadVulnerability = async () => {
      const fetchedVulnerability = await fetchVulnerability();
      setVulnerability(fetchedVulnerability);
    };

    loadVulnerability();
  }, []);

  const onSubmit = (data: z.infer<typeof AddVictimeModalFormData>) => {
    saveVictimesData(data);
    reset();
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Ajouter une victime</Modal.Title>
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
              Enregistrer
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AddVictimeModal;
