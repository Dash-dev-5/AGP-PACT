import { z } from 'zod';
import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Badge, Button, Modal, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { CreateComplaintType, createComplaintTypeAsync, fetchComplaintTypesAsync } from 'features/complaintType/complaintTypeSlice';
import { toast } from 'react-toastify';
import DeletePlainteType from 'components/ui/plainte-type/DeletePlainteType';
import UpdatePlainteType from 'components/ui/plainte-type/UpdatePlainteType';
import { zodResolver } from '@hookform/resolvers/zod';

const createComplaintTypeSchema = z.object({
  name: z.string().nonempty('Le nom est requis'),
  isSensitive: z.enum(['true', 'false']).refine((val) => val === 'true' || val === 'false', {
    message: "Veuillez sélectionner une valeur valide pour 'Est sensible'"
  })
});

interface CreateComplaintTypeExtended extends z.infer<typeof createComplaintTypeSchema> {}

export default function PlainteTypePage() {
  const [show, setShow] = useState(false);
  const dispatch = useAppDispatch();
  const { complaintTypes } = useAppSelector((state) => state.complaintType);

  console.log('########## complaintTypes ', complaintTypes);
 
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CreateComplaintTypeExtended>({
    resolver: zodResolver(createComplaintTypeSchema)
  });

  React.useEffect(() => {
    dispatch(fetchComplaintTypesAsync());
  }, [dispatch]);

  const onSubmit: SubmitHandler<CreateComplaintTypeExtended> = async (data) => {
    const payload: CreateComplaintType = { ...data, isSensitive: JSON.parse(data.isSensitive) };
    console.log(payload);

    const toastId = toast.loading('Veuillez patienter...');
    try {
      await dispatch(createComplaintTypeAsync(payload)).unwrap();
      toast.update(toastId, {
        render: 'Type de plainte ajouté avec succès',
        type: 'success',
        isLoading: false,
        autoClose: 2000
      });
    } catch (error) {
      toast.update(toastId, {
        render: String(error),
        type: 'error',
        isLoading: false,
        autoClose: 6000
      });
    }

    handleClose();
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold">Liste des types de plainte</h3>
          <Button variant="primary" onClick={handleShow} className="shadow-sm">
            Ajouter un type de plainte
          </Button>
        </div>
        <Table striped bordered hover className="shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Nom</th>
              <th>Est sensible</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {complaintTypes.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>
                  <Badge bg={item.isSensitive ? 'danger' : 'success'}>{item.isSensitive ? 'Oui' : 'Non'}</Badge>
                </td>
                <td>
                  <div className="d-flex gap-2 align-items-center">
                    <UpdatePlainteType complaintType={item} />
                    <DeletePlainteType id={item.id} name={item.name} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {show && (
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Ajouter un type de plainte</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit(onSubmit)} className="p-3">
              <div className="form-group mb-3">
                <label htmlFor="name" className="form-label">
                  Nom
                </label>
                <input id="name" className="form-control shadow-sm" {...register('name')} />
                {errors.name && <p className="text-danger small">{errors.name.message}</p>}
              </div>

              <div className="form-group mb-3">
                <label htmlFor="isSensitive" className="form-label">
                  Est sensible
                </label>
                <select id="isSensitive" className="form-control shadow-sm" {...register('isSensitive')}>
                  <option value="true">Oui</option>
                  <option value="false">Non</option>
                </select>
                {errors.isSensitive && <p className="text-danger small">{errors.isSensitive.message}</p>}
              </div>

              <Button variant="primary" type="submit" className="w-100 shadow-sm">
                Enregistrer
              </Button>
            </form>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
}
