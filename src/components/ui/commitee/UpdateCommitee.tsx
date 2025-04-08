import { useAppDispatch, useAppSelector } from 'app/hooks';
import { UpdateCommiteeType, updateCommittee } from 'features/commitee/committeeSlice';
import React from 'react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { FaEdit } from 'react-icons/fa';

const UpdateCommitee: React.FC<{ id: string; currentName: string; groupId: string }> = ({ id, currentName, groupId }) => {
  const [show, setShow] = React.useState(false);
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors }
  } = useForm<UpdateCommiteeType>({ defaultValues: { id: id, name: currentName, group: groupId } });

  const { updateStatus } = useAppSelector((state) => state.committee);
  const { groupCommittees } = useAppSelector((state) => state.groupCommitees);

  const submitUpdate = async (data: UpdateCommiteeType) => {
    try {
      await dispatch(updateCommittee(data)).unwrap();
      handleClose();
    } catch (error) {
      setError('group', { message: String(error) });
    }
  };

  const handleClose = () => {
    setShow(false);
  };

  React.useEffect(() => {
    if (updateStatus === 'succeeded') {
      handleClose();
      reset({ id: id, name: currentName });
    }
  }, [updateStatus]);

  return (
    <>
      <Button type="button" variant="primary" onClick={() => setShow(true)}>
        <FaEdit />
      </Button>

      {show && (
        <Modal show={show} onHide={handleClose} centered={true}>
          <Modal.Header closeButton>
            <Modal.Title>Modifier la Comité {updateStatus === 'loading' && <Spinner animation="border" />}</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit(submitUpdate)}>
            <Modal.Body className="p-4">
              <Form.Group className="mb-3">
                <Form.Label>Nom du Comité</Form.Label>
                <Form.Control type="text" defaultValue={currentName} {...register('name', { required: true })} />
                {errors.name && <span className="text-danger">Ce champ est requis</span>}
              </Form.Group>
              <Form.Group controlId="group" className="mb-3">
                <Form.Label>Groupe de comité</Form.Label>
                <Form.Control as="select" {...register('group')} required>
                  <option value="">Sélectionnez un groupe</option>
                  {groupCommittees.map((group, index) => (
                    <option key={index} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <div className="d-flex align-items-center gap-3 justify-content-end">
                <Button variant="outline-secondary" onClick={handleClose} type="button">
                  Annuler
                </Button>
                <Button variant="primary" type="submit">
                  Modifier
                </Button>
              </div>
            </Modal.Footer>
          </Form>
        </Modal>
      )}
    </>
  );
};

export default UpdateCommitee;
