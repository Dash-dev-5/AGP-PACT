import React from 'react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import { FaRegEdit } from 'react-icons/fa';

import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { z } from 'zod';
import { PriceSchema } from 'features/species/SpeciesTypes';
import { zodResolver } from '@hookform/resolvers/zod';

const UpdateSpeciesPrice = ({ speciePrices }: { speciePrices: z.infer<typeof PriceSchema> }) => {
  const [show, setShow] = React.useState(false);

  const dispatch = useAppDispatch();
  const { projectSites } = useAppSelector((state) => state.projectSite);
  const { updatePriceStatus } = useAppSelector((state) => state.species);

  const SpeciesPriceOmitted = PriceSchema.omit({ referenceNumber: true, slug: true });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<z.infer<typeof SpeciesPriceOmitted>>({
    resolver: zodResolver(SpeciesPriceOmitted)
  });

  React.useEffect(() => {
    if (show) {
      reset({
        id: speciePrices.id,
        price: speciePrices.price,
        projectSiteId: speciePrices.projectSiteId,
        projectSiteName: speciePrices.projectSiteName,
        speciesId: speciePrices.speciesId,
        speciesName: speciePrices.speciesName
      });
    }
  }, [show, speciePrices, reset]);

  const handleClose = () => {
    setShow(false);
  };

  const onSubmit = async (data: z.infer<typeof SpeciesPriceOmitted>) => {
    try {
      console.log('Updating species price with:', data);

      // Uncomment and customize this block when integrating with API
      // await dispatch(updateSpeciesPriceAsync(data)).unwrap();
      // toast.success('Prix mis à jour avec succès !');
      // handleClose();
    } catch (error) {
      console.error('Failed to update species price:', error);
      // toast.error('Une erreur est survenue.');
    }
  };

  return (
    <>
      <Button type="button" onClick={() => setShow(true)} className="shadow-sm" aria-label="Edit Species Price">
        <FaRegEdit />
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Modifier une Espèce {updatePriceStatus === 'loading' && <Spinner size="sm" className="ms-2" />}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Tronçons</Form.Label>
              <Form.Select className={`shadow-sm ${errors.projectSiteId ? 'is-invalid' : ''}`} {...register('projectSiteId')}>
                <option value="">Sélectionnez un tronçon</option>
                {projectSites.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.name}
                  </option>
                ))}
              </Form.Select>
              {errors.projectSiteId && <div className="invalid-feedback">{errors.projectSiteId.message}</div>}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label htmlFor="price" className="fw-bold">
                Prix
              </Form.Label>
              <Form.Control
                id="price"
                type="number"
                step="0.01"
                min={0}
                placeholder="Entrez le prix"
                {...register('price', { valueAsNumber: true })}
                className={`shadow-sm ${errors.price ? 'is-invalid' : ''}`}
              />
              {errors.price && <div className="invalid-feedback">{errors.price.message}</div>}
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 shadow-sm">
              Enregistrer
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default UpdateSpeciesPrice;
