import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Badge, Button, Col, Form, Pagination, Row, Table, Spinner } from 'react-bootstrap';
import CreateChooseCreate from './modalPlainte';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { fetchComplaints } from 'features/complaint/complaintSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import ComplaintBanner from './complaintbanner';

const PlaintePage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { complaints, isLoading } = useAppSelector((state) => state.complaint);
  const [showChooseOptions, setShowChooseOptions] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPageState, setCurrentPageState] = useState(0);
  const pageSize = 12;

  React.useEffect(() => {
    dispatch(fetchComplaints({ pageSize, currentPage: currentPageState, filter: searchTerm }));
  }, [dispatch, currentPageState, searchTerm]);

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const page = params.get('page');
    if (page) {
      setCurrentPageState(Number(page));
    }
  }, [location.search]);

  const totalPages = Math.ceil(complaints.totalItems / pageSize);
  const handlePageChange = (pageNumber: number) => {
    navigate(`?page=${pageNumber}`);
    setCurrentPageState(pageNumber);
  };

  return (
    <>
      <Row>
        <ComplaintBanner />
      </Row>

      <Row className="align-items-center g-3 mt-3">
        <Col xs={12} md={4}>
          <Form.Control type="text" placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </Col>

        <Col xs="auto" className="ms-auto">
          <Button variant="primary" onClick={() => navigate('plainte-generale')}>
            <FontAwesomeIcon icon={faPlus} className="me-2" /> Créer plainte
          </Button>
        </Col>
      </Row>

      <Row className="mt-4">
        {isLoading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <>
            <Table striped bordered hover responsive className="table-sm">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Nom plaignant</th>
                  <th>Téléphone</th>
                  <th>Date</th>
                  <th>Village</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {complaints.data.map((item, index) => {
                  const startIndex = pageSize * currentPageState;
                  return (
                    <tr key={item.id} onClick={() => navigate(`${item.id}`)} style={{ cursor: 'pointer' }}>
                      <td>{index + 1 + startIndex}</td>
                      <td>{item.complainant ? `${item.complainant.firstName} ${item.complainant.lastName}` : ''}</td>
                      <td>{item.complainant ? item.complainant.phone : '-'}</td>
                      <td>
                        {item.createdAt
                          ? new Intl.DateTimeFormat('fr-FR', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit'
                            }).format(new Date(item.createdAt))
                          : '-'}
                      </td>
                      <td>{item.villageName}</td>
                      <td className="text-center">
                        {item.isEligible === false ? (
                          <Badge bg="danger">Rejeté</Badge>
                        ) : item.status === 'In progress' ? (
                          <Badge bg="secondary">En cours</Badge>
                        ) : item.status === 'Closed' ? (
                          <Badge bg="success">Clôturé</Badge>
                        ) : (
                          <Badge bg="warning">En attente</Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>

            <Pagination className="justify-content-end mt-3">
              <Pagination.First onClick={() => handlePageChange(0)} disabled={currentPageState === 0} />
              <Pagination.Prev onClick={() => handlePageChange(currentPageState - 1)} disabled={currentPageState === 0} />
              {[...Array(totalPages).keys()].map((number) => (
                <Pagination.Item key={number} active={number === currentPageState} onClick={() => handlePageChange(number)}>
                  {number + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next onClick={() => handlePageChange(currentPageState + 1)} disabled={currentPageState >= totalPages - 1} />
              <Pagination.Last onClick={() => handlePageChange(totalPages - 1)} disabled={currentPageState >= totalPages - 1} />
            </Pagination>
          </>
        )}
      </Row>

      <CreateChooseCreate show={showChooseOptions} setShowChooseOptions={setShowChooseOptions} />
    </>
  );
};

export default PlaintePage;
