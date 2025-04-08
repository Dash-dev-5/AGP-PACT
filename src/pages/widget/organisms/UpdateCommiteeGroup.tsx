import { useAppDispatch, useAppSelector } from 'app/hooks';
import { UpdateCommiteeGroupType, updateGroupCommitees } from 'features/groupCommittes/groupCommiteesSlice';
import React from 'react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { FaEdit } from 'react-icons/fa';

const UpdateCommiteeGroup: React.FC<{ id: string; currentName: string }> = ({ id, currentName }) => {
  const [show, setShow] = React.useState(false);
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors }
  } = useForm<UpdateCommiteeGroupType>();

  const { updateStatus } = useAppSelector((state) => state.groupCommitees);

  const submitUpdate = async (data: UpdateCommiteeGroupType) => {
    try {
      await dispatch(updateGroupCommitees({ id, name: data.name })).unwrap();
      handleClose();
    } catch (error) {
      setError('name', { message: 'Une erreur est survenue' });
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
            <Modal.Title>Modifier le groupe de comité {updateStatus === 'loading' && <Spinner animation="border" />}</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit(submitUpdate)}>
            <Modal.Body className="p-4">
              <Form.Group className="mb-3">
                <Form.Label>Nom du groupe</Form.Label>
                <Form.Control type="text" defaultValue={currentName} {...register('name', { required: true })} />
                {errors.name && <span className="text-danger">Ce champ est requis</span>}
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

export default UpdateCommiteeGroup;
