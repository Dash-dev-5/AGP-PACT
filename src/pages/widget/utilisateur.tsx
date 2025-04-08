import React, { useEffect, useState } from 'react';
import { Form, Button, Modal, Table, Spinner, Pagination, Row, Tab, Nav, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useForm } from 'react-hook-form';
import { Manager } from 'types/auth';
import { fetchAllCommittees, InitialStateCommittee } from 'api/fetchData';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { createManagerAsync, fetchManagersAsync, setCurrentPage } from 'features/utilisateur/managerSlice';
import CustomToast from 'components/customToast';
import { useNavigate } from 'react-router-dom';
import { Commitees } from 'types/commitee';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faTableCells } from '@fortawesome/free-solid-svg-icons';

export default function Utilisateur() {
  const { register, handleSubmit, reset } = useForm<Manager>();
  const [show, setShow] = useState(false);
  const [committees, setCommitees] = useState<Commitees[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [currentPageState, setCurrentPageState] = useState<number>(1);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const { isLoading, managers, currentPage, totalItems } = useAppSelector((state) => state.manager);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  //Fetch all provinces
  useEffect(() => {
    fetchAllCommittees()
      .then((response: InitialStateCommittee) => {
        const committeeList = Array.isArray(response.committees) ? response.committees : [];
        setCommitees(committeeList);
      })
      .catch(() => {});
  }, []);

  //Fetch all manager
  const pageSize = 12;
  useEffect(() => {
    dispatch(fetchManagersAsync({ pageSize, currentPage: currentPageState, filter: searchTerm }));
  }, [dispatch, currentPage, currentPageState, searchTerm]);

  // Function to retrieve 'page' parameter from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const page = params.get('page');
    if (page) {
      setCurrentPageState(Number(page));
    }
  }, [location.search]);

  //Paginate
  const totalPages = Math.ceil(totalItems / pageSize);
  const handlePageChange = (pageNumber: number) => {
    navigate(`?page=${pageNumber}`);
    setCurrentPageState(pageNumber);
  };

  //Submit data
  const onSubmit = async (data: Manager) => {
    try {
      await dispatch(createManagerAsync(data)).unwrap();
      setShowToast(true);
      setToastMessage('Gestionnaire créé avec succès !');
      setToastType('success');
      reset();
      setTimeout(() => {
        handleClose();
      }, 1000);
    } catch (error) {
      setShowToast(true);
      setToastMessage(String(error));
      setToastType('error');
    }
  };
  return (
    <>
      <div className="row">
        <div className="d-flex flex-column flex-md-row gap-2 gap-md-0 justify-content-md-between mb-5">
          <div className="w-md-25">
            <Form.Control
              type="text"
              placeholder="Rechercher un utilisateur"
              aria-label="Rechercher"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline-primary" className="me-2 w-md-25" onClick={handleShow}>
            Ajouter un utilisateur
          </Button>
        </div>
        <Row>
          <div>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th className="text-center">#</th>
                  <th>Nom</th>
                  <th>Post Nom</th>
                  <th>Prénom</th>
                  <th>Comité</th>
                  <th>Role</th>
                </tr>
              </thead>
              {!isLoading && !!managers.length && (
                <tbody>
                  {managers.map((m, index) => (
                    <tr key={index}>
                      <td className="text-center">{index + 1}</td>
                      <td>{m.lastName}</td>
                      <td>{m.middleName}</td>
                      <td>{m.firstName}</td>
                      <td>{m.committeeName ? m.committeeName : '-'}</td>
                      <td>{m.role}</td>
                    </tr>
                  ))}
                </tbody>
              )}
            </Table>
            {isLoading && (
              <div className="text-center w-100">
                <Spinner className="text-primary" as="span" animation="border" size="sm" role="status" aria-hidden="true" />
              </div>
            )}
            {!isLoading && managers.length === 0 && <p className="text-center">Aucun utilisateur trouvé.</p>}
          </div>
        </Row>

        <div className="d-flex justify-content-end">
          {managers.length > 0 && (
            <Pagination className="mb-0">
              <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPageState === 1} />
              <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPageState === 1}>
                {/* <FontAwesomeIcon icon={faChevronLeft} /> */}
              </Pagination.Prev>
              {[...Array(totalPages).keys()].map((number) => (
                <Pagination.Item key={number + 1} active={number + 1 === currentPageState} onClick={() => handlePageChange(number + 1)}>
                  {number + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next onClick={() => handlePageChange(currentPageState + 1)} disabled={currentPageState === totalPages}>
                {/* <FontAwesomeIcon icon={faChevronRight} /> */}
              </Pagination.Next>
              <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPageState === totalPages} />
            </Pagination>
          )}
        </div>
      </div>

      {/* Modal */}
      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un utilisateur</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="row mb-2">
              <Form.Group controlId="lastName" className="col-4">
                <Form.Label>Nom</Form.Label>
                <Form.Control {...register('lastName')} required />
              </Form.Group>

              <Form.Group controlId="middleName" className="col-4">
                <Form.Label>Post Nom</Form.Label>
                <Form.Control {...register('middleName')} required />
              </Form.Group>

              <Form.Group controlId="firstName" className="col-4">
                <Form.Label>Prénom</Form.Label>
                <Form.Control {...register('firstName')} required />
              </Form.Group>
            </div>

            <div className="row mb-2">
              <Form.Group controlId="dateOfBirth" className="col-4">
                <Form.Label>Date de naissance</Form.Label>
                <Form.Control type="date" {...register('dateOfBirth')} required />
              </Form.Group>

              <Form.Group controlId="gender" className="col-4">
                <Form.Label>Genre</Form.Label>
                <Form.Control as="select" {...register('gender')} required>
                  <option value="Male">Homme</option>
                  <option value="Female">Femme</option>
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="email" className="col-4">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" {...register('email')} required />
              </Form.Group>
            </div>

            <div className="row mb-2">
              <Form.Group controlId="phone" className="col-4">
                <Form.Label>Téléphone</Form.Label>
                <Form.Control type="tel" {...register('phone')} required />
              </Form.Group>

              <Form.Group controlId="addressLine1" className="col-4">
                <Form.Label>Ligne d'adresse 1</Form.Label>
                <Form.Control {...register('addressLine1')} required />
              </Form.Group>

              <Form.Group controlId="addressLine2" className="col-4">
                <Form.Label>Ligne d'adresse 2</Form.Label>
                <Form.Control {...register('addressLine2')} />
              </Form.Group>
            </div>
            <div className="row mb-2">
              <Form.Group controlId="username" className="col-4">
                <Form.Label>Nom d'utilisateur</Form.Label>
                <Form.Control {...register('username')} required />
              </Form.Group>

              <Form.Group controlId="password" className="col-4">
                <Form.Label>Mot de passe</Form.Label>
                <Form.Control type="password" {...register('password')} required />
              </Form.Group>
              <Form.Group controlId="province" className="col-4">
                <Form.Label>Comité</Form.Label>
                <Form.Control as="select" {...register('committee')} required>
                  <option value="">Sélectionnez un comité</option>
                  {committees.map((c, index) => (
                    <option key={index} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </div>

            <Button variant="primary" type="submit" className="mt-3" disabled={isLoading}>
              {isLoading ? (
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
      <CustomToast message={toastMessage} type={toastType} show={showToast} onClose={() => setShowToast(false)} />
    </>
  );
}
