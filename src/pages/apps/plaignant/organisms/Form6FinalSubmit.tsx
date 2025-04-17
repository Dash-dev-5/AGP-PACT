import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

import RegisterVictimes from './RegisterVictimes';
import { RegerationFormType } from 'features/dataManagement/registrationSteps/registrationStepsType';
import { AnonymousRegistrationForm } from 'features/dataManagement/anonynousRegistrationSteps/anonynousRegistrationStepsType';
import { ComplaintRegistrationForm } from 'features/dataManagement/complainantComplaintSteps/complainantComplaintStepsType';
//
import { useAppSelector } from 'app/hooks';
interface Form6FinalSubmitProps {
  prevStep: () => void;
  onSubmit: () => Promise<void>;
  saveVictimesData: (data: any) => void;
  updateVictimeByIndex: (index: number, data: any) => void;
  deleteVictimeByIndex: (index: number) => void;
  formData: RegerationFormType | AnonymousRegistrationForm | ComplaintRegistrationForm;
}
//const { professions } = useAppSelector((state) => state.profession);
// Removed from global scope
// Form6FinalSubmit component
const FormSummary: React.FC<{ formData: any; provinces: any[]; professions: any[]; incidentCauses: any[] }> = ({
  formData,
  provinces,
  professions,
  incidentCauses
}) => {
  const {
    description,
    incidentStartDate,
    incidentEndDate,
    addressLine1,
    isComplainantAffected,
    // Removed unused variable
    city,
    sector,
    village,
    type,
    isSensitive,
    species,
    complainant
  } = formData;

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div style={styles.container}>
      <h4 style={styles.title}>Récapitulatif de la Déclaration</h4>

      <table style={styles.table}>
        <tbody>
          <tr>
            <th style={styles.th}>Description</th>
            <td style={styles.td}>{description || 'Non renseignée'}</td>
          </tr>
          <tr>
            <th style={styles.th}>Date de début de l'incident</th>
            <td style={styles.td}>{incidentStartDate ? formatDate(incidentStartDate) : 'Non renseignée'}</td>
          </tr>
          <tr>
            <th style={styles.th}>Date de fin de l'incident</th>
            <td style={styles.td}>{incidentEndDate ? formatDate(incidentEndDate) : 'Non renseignée'}</td>
          </tr>
          <tr>
            <th style={styles.th}>Adresse</th>
            <td style={styles.td}>{addressLine1 || 'Non renseignée'}</td>
          </tr>
          <tr>
            <th style={styles.th}>Le plaignant est-il affecté ?</th>
            <td style={styles.td}></td>
            <td style={styles.td}>{isComplainantAffected === true ? 'Oui' : isComplainantAffected === false ? 'Non' : 'Non renseigné'}</td>
          </tr>
          <tr>
            <th style={styles.th}>Type d'incident</th>
            <td style={styles.td}>{incidentCauses.find((incidentCause) => incidentCause.id === type)?.name || 'Non renseignée'}</td>
          </tr>
          <tr>
            <th style={styles.th}>Incident sensible</th>
            <td style={styles.td}>{isSensitive ? 'Oui' : 'Non'}</td>
          </tr>

          {complainant && (
            <>
              <tr>
                <th style={{ ...styles.th, ...styles.sectionTitle }} colSpan={2}>
                  Informations du Plaignant
                </th>
              </tr>
              <tr>
                <th style={styles.th}>Nom</th>
                <td style={styles.td}>
                  {`${complainant.firstName || ''} ${
                    complainant.middleName ? complainant.middleName + ' ' : ''
                  }${complainant.lastName || ''}` || 'Non renseigné'}
                </td>
              </tr>
              <tr>
                <th style={styles.th}>Date de naissance</th>
                <td style={styles.td}>{complainant.dateOfBirth ? formatDate(complainant.dateOfBirth) : 'Non renseignée'}</td>
              </tr>
              <tr>
                <th style={styles.th}>Genre</th>
                <td style={styles.td}>{complainant.gender || 'Non renseigné'}</td>
              </tr>
              <tr>
                <th style={styles.th}>Adresse</th>
                <td style={styles.td}>{complainant.addressLine1 || 'Non renseignée'}</td>
              </tr>
              <tr>
                <th style={styles.th}>Téléphone</th>
                <td style={styles.td}>{complainant.phone || 'Non renseigné'}</td>
              </tr>
              <tr>
                <th style={styles.th}>Email</th>
                <td style={styles.td}>{complainant.email || 'Non renseigné'}</td>
              </tr>
              <tr>
                <th style={styles.th}>Province</th>
                <td style={styles.td}>
                  {provinces.find((province: any) => province.id === complainant.province)?.name || 'Non renseignée'}
                </td>
              </tr>
              <tr>
                <th style={styles.th}>Ville</th>
                <td style={styles.td}>
                  {provinces
                    .find((province: any) => province.cities?.some((c: any) => c.id === city))
                    ?.cities?.find((c: any) => c.id === city)?.name || 'Non renseignée'}
                </td>
              </tr>
              <tr>
                <th style={styles.th}>Secteur</th>
                <td style={styles.td}>
                  {provinces
                    .find((province: any) => province.cities?.some((c: any) => c.id === city))
                    ?.cities?.find((c: any) => c.id === city)
                    ?.sectors?.find((s: any) => s.id === sector)?.name || 'Non renseignée'}
                </td>
              </tr>
              <tr>
                <th style={styles.th}>Village</th>
                <td style={styles.td}>
                  {provinces
                    .find((province: any) => province.cities?.some((c: any) => c.id === city))
                    ?.cities?.find((c: any) => c.id === city)
                    ?.sectors?.find((s: any) => s.id === sector)
                    ?.villages?.find((v: any) => v.id === village)?.name || 'Non renseignée'}
                </td>
              </tr>
              <tr>
                <th style={styles.th}>Profession</th>
                <td style={styles.td}>
                  {professions.find((profession) => profession.id === complainant.profession)?.name || 'Non renseignée'}
                </td>
              </tr>
            </>
          )}

          {species && species.length > 0 && (
            <>
              <tr>
                <th style={{ ...styles.th, ...styles.sectionTitle }} colSpan={2}>
                  Espèces Affectées
                </th>
              </tr>
              {species.map((item: any, index: number) => (
                <tr key={index}>
                  <th style={styles.th}>Espèce ({item.assetName || 'Actif'})</th>
                  <td style={styles.td}>
                    {item.speciesName || 'Non renseignée'}, Quantité: {item.quantity || 'Non renseignée'} {item.unit || ''}
                  </td>
                </tr>
              ))}
            </>
          )}

          {!description &&
            !incidentStartDate &&
            !incidentEndDate &&
            !addressLine1 &&
            !complainant &&
            (!species || species.length === 0) && (
              <tr>
                <td colSpan={2} style={styles.emptyMessage}>
                  Aucune information n'a été soumise pour le moment.
                </td>
              </tr>
            )}
        </tbody>
      </table>
    </div>
  );
};
// This component is responsible for displaying the final step of the form submission process.
const Form6FinalSubmit: React.FC<Form6FinalSubmitProps> = ({
  prevStep,
  onSubmit,
  deleteVictimeByIndex,
  saveVictimesData,
  updateVictimeByIndex,
  formData
}) => {
  const { handleSubmit } = useForm();
  const { provinces } = useAppSelector((state) => state.province); // Moved here to ensure proper scope
  const { professions } = useAppSelector((state) => state.profession);
  const { incidentCauses } = useAppSelector((state) => state.type);

  return (
    <>
      <RegisterVictimes
        saveVictimesData={saveVictimesData}
        updateVictimeByIndex={updateVictimeByIndex}
        deleteVictimeByIndex={deleteVictimeByIndex}
        formData={formData}
      />
      <Form
        onSubmit={handleSubmit(onSubmit)}
        className="d-flex justify-content-between"
        style={{
          padding: '10px',
          backgroundColor: 'white'
        }}
      >
        <Button variant="secondary" onClick={() => prevStep()} type="button">
          Retour
        </Button>

        <Button variant="primary" type="submit">
          Envoyer
        </Button>
      </Form>
      <FormSummary formData={formData} provinces={provinces} professions={professions} incidentCauses={incidentCauses} />
    </>
  );
};

const styles = {
  container: {
    marginBottom: '20px',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    width: '100%', // Pour que le tableau occupe la largeur du conteneur
    overflowX: 'auto' as 'auto' // Pour gérer les tableaux potentiellement larges sur les petits écrans
  },
  title: {
    marginBottom: '20px',
    color: '#333',
    fontSize: '1.5em',
    fontWeight: 'bold',
    textAlign: 'left' as 'left' // Added explicit type casting
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as 'collapse', // Explicitly cast to the correct type
    marginTop: '10px'
  },
  th: {
    border: '1px solid #ddd',
    padding: '10px',
    textAlign: 'left' as 'left', // Added explicit type casting
    fontWeight: 'bold',
    backgroundColor: '#f2f2f2',
    fontSize: '0.95em',
    color: '#333'
  },
  td: {
    border: '1px solid #ddd',
    padding: '10px',
    fontSize: '0.95em',
    color: '#444'
  },
  sectionTitle: {
    fontWeight: 'bold',
    padding: '12px 10px',
    backgroundColor: '#e0e0e0',
    color: '#333',
    textAlign: 'left' as 'left', // Added explicit type casting
    fontSize: '1.1em'
  },
  emptyMessage: {
    padding: '15px',
    fontStyle: 'italic',
    color: '#777',
    textAlign: 'center' as 'center' // Added explicit type casting
  }
};
export default Form6FinalSubmit;
