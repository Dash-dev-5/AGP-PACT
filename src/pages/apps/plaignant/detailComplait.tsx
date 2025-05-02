import { useAppDispatch, useAppSelector } from 'app/hooks';
import { fetchComplaintById } from 'features/complaint/complaintSlice';
import { Fragment, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import VerticalLinearStepper from '../traitement/traitement';
import { Accordion, AccordionDetails, Typography } from '@mui/material';
import { AccordionSummary } from '@mui/material';
import useAuth from 'hooks/useAuth';
import TreatmentComplaint from '../traitement/traitementComplaint';

const DetailComplait = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  console.log('id from parm complaint', id);
  const { user } = useAuth();
  const { oneComplaint } = useAppSelector((state) => state.complaint);
  console.log('oneComplaint tes', oneComplaint);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const token = user?.token; // Retrieve token from localStorage
        console.log('Token:', token);


        const response = await fetch(`http://plaintes.celluleinfra.org:8181/api/v1//complaints/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to Authorization header
          },
        });
        const data = await response.json();
        console.log('Fetched complaint data:', data);
        dispatch(fetchComplaintById(data));
      } catch (error) {
        console.error('Error fetching complaint:', error);
      }
    };

    if (id) {
      fetchComplaint();
    }
  }, [id, dispatch]);
  useEffect(() => {
    if (id) dispatch(fetchComplaintById(id));
  }, [dispatch, id]);

  return (
    <div>
      <Row>
        <h5>Traitement de plainte </h5>
      </Row>

      <Row className="mt-4">
        <Col md={5}>{user?.role !== 'Complainant' ? <VerticalLinearStepper /> : <TreatmentComplaint />}</Col>
        <Col className="container mt-4">
          <div>
            {oneComplaint?.complainant && (
              <Accordion defaultExpanded>
                <AccordionSummary aria-controls="panel1-content" id="panel1-header">
                  <Typography>Plaignant Informations</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <div className="row mb-3">
                    <div className="col-4">
                      <div className="d-flex flex-column">
                        <strong>Nom</strong>
                        <span translate="no">{oneComplaint.complainant.lastName}</span>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="d-flex flex-column">
                        <strong>Postnom</strong>
                        <span translate="no">{oneComplaint.complainant?.middleName ? oneComplaint.complainant.middleName : '-'}</span>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="d-flex flex-column">
                        <strong>Prénom</strong>
                        <span translate="no">{oneComplaint.complainant.firstName}</span>
                      </div>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-4">
                      <div className="d-flex flex-column">
                        <strong>Sexe</strong>
                        <span translate="no">
                          {oneComplaint.complainant?.gender === 'Male'
                            ? 'Homme'
                            : oneComplaint?.complainant?.gender === 'Female'
                              ? 'Femme'
                              : '-'}
                        </span>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="d-flex flex-column">
                        <strong>Email</strong>
                        <span translate="no" className="text-truncate" style={{ maxWidth: '100%' }}>
                          {oneComplaint.complainant?.email ? oneComplaint.complainant.email : '-'}
                        </span>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="d-flex flex-column">
                        <strong>Phone</strong>
                        <span translate="no">{oneComplaint.complainant?.phone ? oneComplaint.complainant.phone : '-'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-4">
                      <div className="d-flex flex-column">
                        <strong>Profession</strong>
                        <span translate="no">
                          {oneComplaint.complainant?.professionName === 'Autres'
                            ? oneComplaint.complainant?.otherProfession
                            : oneComplaint.complainant.professionName}
                        </span>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="d-flex flex-column">
                        <strong>Date de naissance</strong>
                        <span translate="no">{oneComplaint.complainant.dateOfBirth}</span>
                      </div>
                    </div>

                    <div className="col-4">
                      <div className="d-flex flex-column">
                        <strong>Province</strong>
                        <span translate="no">{oneComplaint.complainant.provinceName}</span>
                      </div>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-4">
                      <div className="d-flex flex-column">
                        <strong>Ville</strong>
                        <span translate="no">{oneComplaint.complainant.cityName}</span>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="d-flex flex-column">
                        <strong>Secteur</strong>
                        <span translate="no">{oneComplaint.complainant.sectorName}</span>
                      </div>
                    </div>

                    <div className="col-4">
                      <div className="d-flex flex-column">
                        <strong>Village</strong>
                        <span translate="no">{oneComplaint.complainant.villageName}</span>
                      </div>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-4">
                      <div className="d-flex flex-column">
                        <strong>Adresse</strong>
                        <span translate="no">{oneComplaint?.complainant?.addressLine1}</span>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="d-flex flex-column">
                        <strong>Niveau de vulnerabilite</strong>
                        <span translate="no">
                          {oneComplaint?.complainant?.vulnerabilityLevelName === 'Autres'
                            ? oneComplaint?.complainant?.otherVulnerability
                            : oneComplaint?.complainant?.vulnerabilityLevelName}
                        </span>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="d-flex flex-column">
                        <strong>Personnalite juridique</strong>
                        <span translate="no">{oneComplaint?.complainant?.legalPersonality}</span>
                      </div>
                    </div>
                  </div>
                </AccordionDetails>
              </Accordion>
            )}
            <Accordion defaultExpanded>
              <AccordionSummary aria-controls="panel2-content" id="panel2-header">
                <Typography>Plainte</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className="row mb-3">
                  <div className="col-4">
                    <div className="d-flex flex-column">
                      <strong>Date du début</strong>
                      <span>{oneComplaint?.incidentStartDate}</span>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="d-flex flex-column">
                      <strong>Date de la fin</strong>
                      <span>{oneComplaint?.incidentEndDate}</span>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="d-flex flex-column">
                      <strong>Préjudice</strong>
                      <span>{oneComplaint?.prejudice?.name}</span>
                    </div>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-4">
                    <div className="d-flex flex-column" style={{ maxWidth: '100%' }}>
                      <strong>Description</strong>
                      <p style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>{oneComplaint?.description}</p>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="d-flex flex-column" style={{ maxWidth: '100%' }}>
                      <strong>Document associé</strong>
                      {oneComplaint?.document ? (
                        <a
                          href={oneComplaint?.document}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ wordWrap: 'break-word', color: '#007bff' }}
                        >
                          Télécharger le document
                        </a>
                      ) : (
                        <p>Aucun document disponible.</p>
                      )}
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="d-flex flex-column">
                      <strong>Email</strong>
                      <span className="text-truncate" style={{ maxWidth: '100%' }}>
                        {oneComplaint?.complainant?.email != null ? oneComplaint?.complainant?.email : '-'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="row mb-3">
                  
                  <div className="col-4">
                    <div className="d-flex flex-column">
                      <strong>Phone</strong>
                      <span>{oneComplaint?.complainant?.phone != null ? oneComplaint?.complainant?.phone : '-'}</span>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="d-flex flex-column">
                      <strong>Province</strong>
                      <span>{oneComplaint?.provinceName}</span>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="d-flex flex-column">
                      <strong>Ville</strong>
                      <span> {oneComplaint?.cityName}</span>
                    </div>
                  </div>
                </div>
                <div className="row mb-3">
                  
                  <div className="col-4">
                    <div className="d-flex flex-column">
                      <strong>Secteur</strong>
                      <span>{oneComplaint?.sectorName}</span>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="d-flex flex-column">
                      <strong>Village</strong>
                      <span>{oneComplaint?.villageName}</span>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="d-flex flex-column">
                      <strong>Adresse</strong>
                      <span> {oneComplaint?.addressLine1}</span>
                    </div>
                  </div>

 
                </div>
                <div className="row mb-3">
                  
                  <div className="col-4">
                    <div className="d-flex flex-column">
                      <strong>Longitude</strong>
                      <span>{oneComplaint?.longitude != null ? oneComplaint?.longitude : 'Non definie'}</span>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="d-flex flex-column">
                      <strong>Latitude</strong>
                      <span>{oneComplaint?.latitude != null ? oneComplaint?.latitude : 'Non definie' }</span>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="d-flex flex-column">
                      <strong>Code</strong>
                      <span>{oneComplaint?.code}</span>
                    </div>
                  </div>
                </div>
                <div className="row mb-3">
                  
                  <div className="col-4">
                    <div className="d-flex flex-column">
                      <strong>Type de plainte</strong>
                      <span>{oneComplaint?.type?.name === 'Autres'
                            ? oneComplaint?.otherType
                            : oneComplaint?.type?.name}</span>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="d-flex flex-column">
                      <strong>La plainte est</strong>
                      <span>{oneComplaint?.isSensitive ? 'Sensible' : 'Non sensible' }</span>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="d-flex flex-column">
                      <strong>Le plaignant est-il affecter?</strong>
                      <span>{oneComplaint?.isComplainantAffected ? 'Oui' : 'Non' }</span>
                    </div>
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary aria-controls="panel2-content" id="panel2-header">
                <Typography>Espèces affectées</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className="row">
                  {oneComplaint?.species!.map((item) => (
                    <Fragment key={item.id}>
                      <div className="col-4">
                        <div className="d-flex flex-column">
                          <strong>Espèce</strong>
                          <span>{item.otherSpecies ? item.otherSpecies : item.speciesName}</span>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="d-flex flex-column">
                          <strong>Quantité</strong>
                          <span>{item.quantity}</span>
                        </div>
                      </div>
                      <div className="col-4 mb-2">
                        <div className="d-flex flex-column">
                          <strong>Montant total</strong>
                          <span className="fw-bold">{item.totalPrice * item.quantity} FC</span>
                        </div>
                      </div>
                    </Fragment>
                  ))}
                </div>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary aria-controls="panel2-content" id="panel2-header">
                <Typography>Victime</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className="row">
                  {oneComplaint?.victims.map((item) => (
                    <Fragment key={item.id}>
                      <div className="col-4">
                        <div className="d-flex flex-column mb-2">
                          <strong>Nom</strong>
                          <span> {item.firstName}</span>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="d-flex flex-column mb-2">
                          <strong>Postnom</strong>
                          <span>{item.middleName}</span>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="d-flex flex-column mb-2">
                          <strong>Prénom</strong>
                          <span>{item.lastName}</span>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="d-flex flex-column">
                          <strong>Sexe</strong>
                          <span>{item.gender === 'Male' ? 'Homme' : item.gender === 'Female' ? 'Femme' : '-'}</span>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="d-flex flex-column">
                          <strong>Date naissance</strong>
                          <span>{item.dateOfBirth}</span>
                        </div>
                      </div>
                    </Fragment>
                  ))}
                </div>
              </AccordionDetails>
            </Accordion>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default DetailComplait;
