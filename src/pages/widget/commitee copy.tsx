import { useEffect, useState } from 'react';
import { Form, Button, Modal, Spinner, Pagination, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { useNavigate } from 'react-router-dom';
import { Commitees } from 'types/commitee';
import { createCommitteeAsync, fetchCommitteesAsync } from 'features/commitee/committeeSlice';
import UpdateCommitee from 'components/ui/commitee/UpdateCommitee';
import DeleteCommitee from 'components/ui/commitee/DeleteCommitee';
import { toast } from 'react-toastify';
import { fetchGroupCommitees } from 'features/groupCommittes/groupCommiteesSlice';

export default function Commitee() {
  const { register, handleSubmit, reset } = useForm<Commitees>();
  const [show, setShow] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPageState, setCurrentPageState] = useState<number>(0);
  const { committees, status, error, createStatus } = useAppSelector((state) => state.committee);
  const { groupCommittees } = useAppSelector((state) => state.groupCommitees);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  useEffect(() => {
    dispatch(fetchGroupCommitees());
  }, [dispatch]);

  // Fetch all committees with updated logic
  const pageSize = 12;
  useEffect(() => {
    if (status !== 'loading') {
      dispatch(fetchCommitteesAsync({ pageSize, currentPage: currentPageState, filter: searchTerm }));
    }
  }, [dispatch, currentPageState, searchTerm]);

  // Retrieve 'page' parameter from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const page = params.get('page');
    if (page) {
      setCurrentPageState(Number(page));
    }
  }, [location.search]);

  // Paginate with error prevention
  const totalPages = committees?.data ? Math.ceil(committees.data.length / pageSize) : 0;
  const handlePageChange = (pageNumber: number) => {
    navigate(`?page=${pageNumber}`);
    setCurrentPageState(pageNumber);
  };

  // Submit data with error handling
  const onSubmit = async (data: Commitees) => {
    const toastId = toast.loading('Enregistrement en cours...');
    try {
      await dispatch(createCommitteeAsync(data)).unwrap();
      reset();
      handleClose();
      toast.update(toastId, { render: 'Comité créé avec succès!', type: 'success', isLoading: false, autoClose: 2000 });
      dispatch(fetchCommitteesAsync({ pageSize, currentPage: currentPageState, filter: searchTerm }));
      window.location.reload(); // Force page reload after successful addition
    } catch (error) {
      toast.update(toastId, { render: String(error), type: 'error', isLoading: false, autoClose: 3000 });
    }
  };

  return (
    <>
      <div className="row">
        <div className="mb-3">
          <span className="fs-4">Liste de comités</span>
        </div>
        <div className="d-md-flex d-none flex-column flex-md-row gap-2 gap-md-0 justify-content-md-between mb-5">
          <Form.Control
            type="text"
            placeholder="Rechercher un comité"
            aria-label="Rechercher"
            className="w-25"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="outline-primary" className="me-2 w-25" onClick={handleShow}>
            Ajouter un comité
          </Button>
        </div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Nom</th>
              <th>Axe</th>
              <th>Localisation</th>
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
                  {error || 'Une erreur est survenue.'}
                </td>
              </tr>
            )}
            {status === 'succeeded' && committees?.data?.length > 0 &&
              (committees?.data || []).map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.name} {item.id}</td>
                  <td>{item.groupName}</td>
                  <td>{item.villages?.map((village) => village.name).join(', ')}</td>
                  <td>
                    <div className="d-flex gap-2 align-items-center justify-content-center">
                      {item.id && item.name && <UpdateCommitee id={item.id} currentName={item.name} groupId={item.groupId} />}
                      {item.id && item.name && <DeleteCommitee id={item.id} name={item.name} />}
                    </div>
                  </td>
                </tr>
              ))}
            {status === 'succeeded' && (!committees?.data || committees.data.length === 0) && (
              <tr>
                <td colSpan={5} className="text-center">
                  Aucun comité trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        {totalPages > 0 && (
          <Pagination className="mb-0">
            <Pagination.First onClick={() => handlePageChange(0)} disabled={currentPageState === 0} />
            <Pagination.Prev onClick={() => handlePageChange(currentPageState - 1)} disabled={currentPageState === 0} />
            {[...Array(totalPages).keys()].map((number) => (
              <Pagination.Item
                key={number}
                active={number === currentPageState}
                onClick={() => handlePageChange(number)}
              >
                {number + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => handlePageChange(currentPageState + 1)}
              disabled={currentPageState >= totalPages - 1}
            />
            <Pagination.Last
              onClick={() => handlePageChange(totalPages - 1)} disabled={currentPageState >= totalPages - 1} />
          </Pagination>
        )}
      </div>
      {show && (
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Ajouter un comité</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form
              onSubmit={handleSubmit(async (data) => {
                await onSubmit(data);
              })}
            >
              <Form.Group controlId="name" className="mb-3">
                <Form.Label>Nom</Form.Label>
                <Form.Control {...register('name')} required />
              </Form.Group>
              <Form.Group controlId="group" className="mb-3">
                <Form.Label>Groupe de comité</Form.Label>
                <Form.Control as="select" {...register('group')} required>
                  <option value="">Sélectionnez un groupe</option>
                  {groupCommittees?.map((group, index) => (
                    <option key={index} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Button variant="primary" type="submit" disabled={createStatus === 'loading'}>
                {createStatus === 'loading' ? (
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
      )}
    </>
  );
}
