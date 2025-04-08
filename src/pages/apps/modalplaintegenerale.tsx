
import {  Button, Col, FloatingLabel, Form, Row } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
 
function CreatePlainteGenerale({
    show,
    setShowPlainteGenerale,
  }: {
    show: boolean;
    setShowPlainteGenerale: React.Dispatch<React.SetStateAction<boolean>>;
  }) {
     
    const handleClose = () => setShowPlainteGenerale(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const onSubmit = (data: any) => {
      
      handleClose();
      reset();
    };

    return (
      <>
        <Modal show={show} onHide={handleClose} centered={true} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Création Plainte Génerale</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit(onSubmit)} method='POST'>
              <Row className="g-2 mt-2">
                <Col>
                  <Form.Label>Nom</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder=""
                    {...register("amount", { required: false })}
                  />
                </Col>
                <Col>
                  <Form.Label>Postnom</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder=""
                    {...register("percentage", { required: false })}
                  />
                </Col>
                <Col>
                  <Form.Label>Prenom</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder=""
                    {...register("percentage", { required: false })}
                  />
                </Col>
              </Row>
              <Row className="g-2 mt-4">
                <Col>
                  <Form.Label>Debut Date</Form.Label>
                  <Form.Control
                    type="date"
                    placeholder=""
                    {...register("amount", { required: false })}
                  />
                </Col>
                <Col>
                  <Form.Label>Fin Date</Form.Label>
                  <Form.Control
                    type="date"
                    placeholder=""
                    {...register("percentage", { required: false })}
                  />
                </Col>
              </Row>
              <Row className="g-2 mt-4">
                <Col>
                  <FloatingLabel controlId="floatingInputGrid" label="Categorie">
                    <Form.Select {...register('deductionTypeResource', { required: true })}>
                      <option value="">Select categorie</option>
                    </Form.Select>
                  </FloatingLabel>
                </Col>
                <Col>
                  <FloatingLabel controlId="floatingInputGrid" label="Type">
                    <Form.Select {...register('deductionTypeResource', { required: true })}>
                      <option value="">Select type</option>
                    </Form.Select>
                  </FloatingLabel>
                </Col>
              </Row>
              <Row className="g-2 mt-4">
                <Col>
                  <FloatingLabel controlId="floatingInputGrid" label="Pays">
                    <Form.Select {...register('deductionTypeResource', { required: true })}>
                      <option value="">Selectionnez pays</option>
                    </Form.Select>
                  </FloatingLabel>
                </Col>
                <Col>
                  <FloatingLabel controlId="floatingInputGrid" label="Province">
                    <Form.Select {...register('deductionTypeResource', { required: true })}>
                      <option value="">Selectionnez province</option>
                    </Form.Select>
                  </FloatingLabel>
                </Col>
              </Row>
              <Row className="g-2 mt-4">
                <Col>
                  <FloatingLabel controlId="floatingInputGrid" label="Ville">
                    <Form.Select {...register('deductionTypeResource', { required: true })}>
                      <option value="">Selectioonez ville</option>
                    </Form.Select>
                  </FloatingLabel>
                </Col>
                <Col>
                  <FloatingLabel controlId="floatingInputGrid" label="Secteur">
                    <Form.Select {...register('deductionTypeResource', { required: true })}>
                      <option value="">Selectionnez secteur</option>
                    </Form.Select>
                  </FloatingLabel>
                </Col>
              </Row>
              <Row className="g-2 mt-4">
                <Col>
                  <FloatingLabel controlId="floatingInputGrid" label="Village">
                    <Form.Select {...register('deductionTypeResource', { required: true })}>
                      <option value="">Selectionnez village</option>
                    </Form.Select>
                  </FloatingLabel>
                </Col>
                <Col>
                  <FloatingLabel controlId="floatingInputGrid" label="Secteur">
                    <Form.Select {...register('deductionTypeResource', { required: true })}>
                      <option value="">Selectionnez secteur</option>
                    </Form.Select>
                  </FloatingLabel>
                </Col>
              </Row>
              <Row className="g-2 mt-2">
                <Col>
                  <Form.Check
                    inline
                    label="Est-ce qu'il est sSensible"
                    name="group1"
                  />
                </Col>
                <Col>
                  <Form.Check
                    inline
                    label="Plainte Affecté"
                    name="group1"
                  />
                </Col>
              </Row>
              <Row className="g-2 mt-2">
                  <Col>
                      <Form.Label>Pay Period Start</Form.Label>
                      <Form.Control type="date" placeholder="" {...register("payPeriodStart", { required: false })} />
                  </Col>
                  <Col>
                      <Form.Label>Pay Period End</Form.Label>
                      <Form.Control type="date" placeholder="" {...register("payPeriodEnd", { required: false })} />
                  </Col>
              </Row>
              <Row className="g-3 mt-2">
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                  <Form.Label>Description</Form.Label>
                  <Form.Control as="textarea" rows={4} style={{ resize: 'none' }} {...register("description", { required: true })} />
                </Form.Group>
              </Row>
            <Modal.Footer className="border-0 justify-content-between">
              <Button variant="" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" className="px-4">
                Save
              </Button>
            </Modal.Footer>
            </Form>
          </Modal.Body>
        </Modal>
      </>
    );
  }
 
  export default CreatePlainteGenerale;