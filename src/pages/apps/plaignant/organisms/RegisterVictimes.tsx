import React from 'react';
import { Button, Table } from 'react-bootstrap';
import { ProjeSite } from 'types/auth';
import AddVictimeModal from '../addVictimeModal';
import DeleteRegisterVictimes from './DeleteRegisterVictimes';
import UpdateRegisterVictimes from './UpdateRegisterVictimes';
import { RegerationFormType } from 'features/dataManagement/registrationSteps/registrationStepsType';
import { AnonymousRegistrationForm } from 'features/dataManagement/anonynousRegistrationSteps/anonynousRegistrationStepsType';
import useAuth from 'hooks/useAuth';
import { ComplaintRegistrationForm } from 'features/dataManagement/complainantComplaintSteps/complainantComplaintStepsType';
import { fetchVulnerability } from 'api/fetchData';

interface Props {
  saveVictimesData: (data: any) => void;
  updateVictimeByIndex: (index: number, data: any) => void;
  deleteVictimeByIndex: (index: number) => void;
  formData: RegerationFormType | AnonymousRegistrationForm | ComplaintRegistrationForm;
}

const RegisterVictimes: React.FC<Props> = ({ formData, deleteVictimeByIndex, saveVictimesData, updateVictimeByIndex }) => {
  const { user } = useAuth();
  const [ajoutVictime, setAjoutVictime] = React.useState(false);
  const [vulnerability, setVulnerability] = React.useState<ProjeSite[]>([]);
  const [currentUserVulnerabilityLevelName, setCurrentUserVulnerabilityLevelName] = React.useState<ProjeSite | undefined>();

  React.useEffect(() => {
    const loadVulnerabilityData = async () => {
      const fetchedVulnerability = await fetchVulnerability();
      setVulnerability(fetchedVulnerability);
    };

    loadVulnerabilityData();
  }, []);

  React.useEffect(() => {
    const vulnerabilityLevel = vulnerability.find((v) => v.id === formData.complainant?.vulnerabilityLevel);
    if (vulnerabilityLevel) {
      setCurrentUserVulnerabilityLevelName(vulnerabilityLevel);
    }
  }, [vulnerability]);

  return (
    <div className="register-victimes-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="section-title">Victimes</h2>
        <Button variant="primary" onClick={() => setAjoutVictime(true)}>
          Ajouter une victime
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th className="text-center">#</th>
            <th className="text-center">Nom</th>
            <th className="text-center">Post-Nom</th>
            <th className="text-center">Prénom</th>
            <th className="text-center">Sexe</th>
            <th className="text-center">Date de naissance</th>
            <th className="text-center">Degré de vulnérabilité</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {formData.isComplainantAffected && formData.complainant && (
            <tr>
              <td className="text-center">1</td>
              <td className="text-center">{user?.role ? user.lastName : formData.complainant.lastName}</td>
              <td className="text-center">{user?.role ? user.middleName : formData.complainant.middleName || '-'}</td>
              <td className="text-center">{user?.role ? user.firstName : formData.complainant.firstName}</td>
              <td className="text-center">{(user?.role ? user.gender : formData.complainant.gender) === 'Male' ? 'Homme' : 'Femme'}</td>
              <td className="text-center">
                {new Date(user?.role ? user.dateOfBirth : formData.complainant.dateOfBirth).toLocaleDateString('fr-FR')}
              </td>
              <td className="text-center">{user ? user.vulnerabilityLevelName : currentUserVulnerabilityLevelName?.name || '-'}</td>
              <td className="text-center">-</td>
            </tr>
          )}
          {formData.victims.map((row, index) => {
            const currentVulnerability = vulnerability.find((v) => v.id === row.vulnerabilityLevel);
            return (
              <tr key={index}>
                <td className="text-center">{formData.isComplainantAffected ? index + 2 : index + 1}</td>
                <td className="text-center">{row.firstName}</td>
                <td className="text-center">{row.middleName || '-'}</td>
                <td className="text-center">{row.lastName}</td>
                <td className="text-center">{row.gender === 'Male' ? 'Homme' : 'Femme'}</td>
                <td className="text-center">{new Date(row.dateOfBirth).toLocaleDateString('fr-FR')}</td>
                <td className="text-center">{currentVulnerability?.name || '-'}</td>
                <td className="text-center d-flex justify-content-center gap-2">
                  <UpdateRegisterVictimes victime={row} index={index} updateVictimeByIndex={updateVictimeByIndex} />
                  <DeleteRegisterVictimes deleteVictime={() => deleteVictimeByIndex(index)} />
                </td>
              </tr>
            );
          })}
          {!formData.victims.length && (
            <tr>
              <td colSpan={8} className="text-center">
                Aucune victime ajoutée.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {ajoutVictime && <AddVictimeModal show={ajoutVictime} setAjoutVictime={setAjoutVictime} saveVictimesData={saveVictimesData} />}
    </div>
  );
};

export default RegisterVictimes;
