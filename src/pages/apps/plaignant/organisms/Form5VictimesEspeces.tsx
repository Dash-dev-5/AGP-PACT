import React from 'react';
import { Button, Table } from 'react-bootstrap';
import AddEspeceModal from '../addEspeceModal';
import { RegerationFormType } from 'features/dataManagement/registrationSteps/registrationStepsType';
import { AnonymousRegistrationForm } from 'features/dataManagement/anonynousRegistrationSteps/anonynousRegistrationStepsType';
import { ComplaintRegistrationForm } from 'features/dataManagement/complainantComplaintSteps/complainantComplaintStepsType';
import DeleteEspeceModal from '../DeleteEspeceModal';
import UpdateEspeceModal from '../UpdateEspeceModal';

interface Props {
  saveSpeciesData: (data: any) => void;
  formData: RegerationFormType | AnonymousRegistrationForm | ComplaintRegistrationForm;
  deleteSpeciesByIndex: (index: number) => void;
  updateSpeciesByIndex: (index: number, data: any) => void;
}

const Form5VictimesEspeces: React.FC<Props> = ({ saveSpeciesData, formData, deleteSpeciesByIndex, updateSpeciesByIndex }) => {
  const [ajouteEspece, setAjouteEspece] = React.useState(false);

  return (
    <div className="form5-victimes-especes-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="section-title">Espèces affectées</h2>
        <Button variant="danger" onClick={() => setAjouteEspece(true)}>
          Ajouter une espèce affectée
        </Button>
      </div>

      <div className="species-table-container" style={{ minHeight: '5rem' }}>
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Désignation</th>
              <th>Catégorie</th>
              <th>Quantité</th>
              <th>Unité</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {formData.species.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-muted">
                  Aucune espèce ajoutée.
                </td>
              </tr>
            ) : (
              formData.species.map((row, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{row.otherSpecies || row.speciesName}</td>
                  <td>{row.assetName}</td>
                  <td>{row.quantity}</td>
                  <td>{row.unit || '-'}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <div className="d-flex gap-2 justify-content-center">
                      <UpdateEspeceModal species={row} index={index} updateSpeciesByIndex={updateSpeciesByIndex} />
                      <DeleteEspeceModal deleteSpecies={() => deleteSpeciesByIndex(index)} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      {ajouteEspece && <AddEspeceModal setAjoutEspece={setAjouteEspece} show={ajouteEspece} saveSpeciesData={saveSpeciesData} />}
    </div>
  );
};

export default Form5VictimesEspeces;
