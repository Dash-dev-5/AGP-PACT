import React from 'react';
import { Form, Button, Modal, Table, Spinner, Row, Col, Pagination } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { GroupCommitees } from 'types/commitee';
import { createGroupCommitees, fetchGroupCommitees } from 'features/groupCommittes/groupCommiteesSlice';
import { toast } from 'react-toastify';
import UpdateCommiteeGroup from './organisms/UpdateCommiteeGroup';
import DeleteCommiteeGroup from './organisms/DeleteCommiteeGroup';

export default function GroupCommitee() {
  const { register, handleSubmit, reset } = useForm<GroupCommitees>();
  const [show, setShow] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const itemsPerPage = 5; // Define items per page

  const { status, groupCommittees, createError, createStatus } = useAppSelector((state) => state.groupCommitees);
  const dispatch = useAppDispatch();

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  React.useEffect(() => {
    dispatch(fetchGroupCommitees());
  }, [dispatch]);

  const onSubmit = async (data: GroupCommitees) => {
    const toastId = toast.loading('En cours de création...');
    try {
      await dispatch(createGroupCommitees(data)).unwrap();
      toast.update(toastId, { render: 'Groupe de Comité créé avec succès !', type: 'success', isLoading: false, autoClose: 5000 });
      reset();
      handleClose();
      // Force page reload after successful addition
      window.location.reload();
    } catch (error) {
      toast.update(toastId, {
        render: 'Erreur lors de la création du groupe de comité.',
        type: 'error',
        isLoading: false,
        autoClose: 5000,
      });
    }
  };

  const filteredGroupCommittees = React.useMemo(() => {
    if (!Array.isArray(groupCommittees)) return [];
    if (!searchTerm) return groupCommittees;
    return groupCommittees.filter((group) => group?.name?.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm, groupCommittees]);

  const paginatedGroupCommittees = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredGroupCommittees.slice(startIndex, endIndex);
  }, [filteredGroupCommittees, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredGroupCommittees.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className="row">
        <div className="mb-3">
          <span className="fs-4">Liste de groupes de comités</span>
        </div>
        <div className="d-md-flex d-none flex-column flex-md-row gap-2 gap-md-0 justify-content-md-between mb-5">
          <Form.Control
            type="text"
            placeholder="Rechercher un groupe de comité"
            aria-label="Rechercher"
            className="w-25"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="outline-primary" className="me-2 w-25" onClick={handleShow}>
            Ajouter un groupe de comité
          </Button>
        </div>

        <Row>
          <Col xs={12}>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Nom du groupe</th>
                  <th className="text-center">Nombre de comités</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {status === 'loading' && (
                  <tr>
                    <td colSpan={3} className="text-center text-primary">
                      <Spinner size="sm" />
                    </td>
                  </tr>
                )}
                {status === 'succeeded' && filteredGroupCommittees.length > 0 &&
                  filteredGroupCommittees.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td className="text-center">{item.committees?.length || 0}</td>
                      <td className="d-flex gap-2 align-items-center justify-content-center">
                        {item.id && item.name && <UpdateCommiteeGroup id={item.id} currentName={item.name} />}
                        {item.id && item.name && <DeleteCommiteeGroup id={item.id} name={item.name} />}
                      </td>
                    </tr>
                  ))}
                {status === 'succeeded' && filteredGroupCommittees.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center text-secondary">
                      Aucun groupe de comité trouvé.
                    </td>
                  </tr>
                )}
                {status === 'failed' && (
                  <tr>
                    <td colSpan={3} className="text-center text-danger">
                      {createError || 'Erreur de chargement des données.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Col>
        </Row>

        {/* Pagination */}
        <div className="d-flex justify-content-center mt-3">
          <Pagination>
            <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
            {[...Array(totalPages)].map((_, index) => (
              <Pagination.Item key={index} active={currentPage === index + 1} onClick={() => handlePageChange(index + 1)}>
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
          </Pagination>
        </div>
      </div>

      {/* Modal */}
      {show && (
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Ajouter un groupe de comité</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <div className="row mb-2">
                <Form.Group controlId="name">
                  <Form.Label>Nom</Form.Label>
                  <Form.Control {...register('name')} required />
                </Form.Group>
              </div>
              <Button variant="primary" type="submit" className="mt-3" disabled={createStatus === 'loading'}>
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
