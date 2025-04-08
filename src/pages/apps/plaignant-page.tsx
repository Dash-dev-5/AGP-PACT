import React from 'react';
import { Table, Row, Nav, Pagination, InputGroup, Form } from 'react-bootstrap';

import { useAppDispatch, useAppSelector } from 'app/hooks';
import { fetchComplainantsAsync } from 'features/complainant/complainantSlice';
import { useNavigate } from 'react-router-dom';

export default function PlaignantPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { complainants } = useAppSelector((state) => state.complainant);
  const [currentPageState, setCurrentPageState] = React.useState<number>(1);
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  const pageSize = 12;

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const page = params.get('page');
    if (page) {
      setCurrentPageState(Number(page));
    }
  }, [location.search]);

  React.useEffect(() => {
    dispatch(fetchComplainantsAsync({ pageSize, pageNo: currentPageState, sortBy: 'createdAt', filter: searchQuery }));
  }, [dispatch, currentPageState, searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  //Paginate
  const totalPages = Math.ceil(complainants.totalItems / pageSize);
  const handlePageChange = (pageNumber: number) => {
    navigate(`?page=${pageNumber}`);
    setCurrentPageState(pageNumber);
  };

  return (
    <>
      <Row>
        <Nav variant="underline" className="mb-3 w-100">
          <div className="d-flex justify-content-between my-4 px-4 w-100">
            <div>
              <span className="fs-4">Liste de plaignants</span>
            </div>
            <div>
              <InputGroup>
                <Form.Control type="text" placeholder="Rechercher par nom ou référence" value={searchQuery} onChange={handleSearchChange} />
              </InputGroup>
            </div>
          </div>
        </Nav>
        <div>
          <Table striped bordered hover responsive className="table-sm">
            <thead className="table-dark">
              <tr>
                <th>Numero de reference</th>
                <th>Nom complet</th>
                <th>Genre</th>
                <th>Telephone</th>
                <th>Email</th>
                <th>Profession</th>
                <th>Ville</th>
              </tr>
            </thead>
            <tbody>
              {complainants.data.map((complainant) => (
                <tr key={complainant.id}>
                  <td>{complainant.referenceNumber}</td>
                  <td>
                    {complainant.firstName} {complainant.lastName} {complainant.middleName}
                  </td>
                  <td>{complainant.gender === 'Male' ? 'Homme' : complainant.gender === 'Female' ? 'Femme' : '-'}</td>
                  <td>{complainant.phone}</td>
                  <td>{complainant.email}</td>
                  <td>{complainant.professionName}</td>
                  <td>{complainant.cityName}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <div className="d-flex justify-content-end">
          {Array.isArray(complainants.data) && complainants.data.length > 0 && (
            <Pagination className="mb-0">
              <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPageState === 1} />
              <Pagination.Prev onClick={() => handlePageChange(currentPageState - 1)} disabled={currentPageState === 1} />
              {[...Array(totalPages).keys()].map((number) => {
                const pageNumber = number + 1;
                return (
                  <Pagination.Item key={pageNumber} active={pageNumber === currentPageState} onClick={() => handlePageChange(pageNumber)}>
                    {pageNumber}
                  </Pagination.Item>
                );
              })}
              <Pagination.Next onClick={() => handlePageChange(currentPageState + 1)} disabled={currentPageState >= totalPages} />
              <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPageState >= totalPages} />
            </Pagination>
          )}
        </div>
      </Row>

      <div className="row">
        <div className="mb-4"></div>
      </div>
    </>
  );
}
