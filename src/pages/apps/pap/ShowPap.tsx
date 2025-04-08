import { useAppDispatch, useAppSelector } from 'app/hooks';
import { fetchPapByIdAsync } from 'features/pap/papSlice';
import React, { useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

const ShowPap = () => {
  const { status, singlePap } = useAppSelector((state) => state.pap);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { papId } = useParams();

  useEffect(() => {
    if (papId) {
      dispatch(fetchPapByIdAsync(papId));
    }
  }, [papId, dispatch]);

  return (
    <div className="container mt-5">
      {status === 'loading' && (
        <div className="text-center text-primary">
          <Spinner animation="border" />
        </div>
      )}
      {status === 'succeeded' && singlePap && (
        <div className="card">
          <div className="card-header bg-primary text-white">
            <h3>Détails pour le code : {singlePap.code}</h3>
          </div>
          <div className="card-body">
            <div className="row mb-3">
              <div className="col-md-6">
                <strong>Code:</strong> {singlePap.code}
              </div>
              <div className="col-md-6">
                <strong>Nom complet:</strong> {singlePap.fullName}
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <strong>Sexe:</strong> {singlePap.gender}
              </div>
              <div className="col-md-6">
                <strong>Âge:</strong> {singlePap.age}
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <strong>Téléphone:</strong> {singlePap.phone}
              </div>
              <div className="col-md-6">
                <strong>Numéro de pièce d'identité:</strong> {singlePap.identityDocumentNumber}
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <strong>Type de propriété:</strong> {singlePap.propertyType}
              </div>
              <div className="col-md-6">
                <strong>Territoire:</strong> {singlePap.territory}
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <strong>Village:</strong> {singlePap.village}
              </div>
              <div className="col-md-6">
                <strong>Coordonnées:</strong> Longitude: {singlePap.longitude}, Latitude: {singlePap.latitude}
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <strong>Surface:</strong> {singlePap.surface} m²
              </div>
              <div className="col-md-6">
                <strong>CU:</strong> {singlePap.cu}
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <strong>Plus-value:</strong> {singlePap.plusValue}
              </div>
              <div className="col-md-6">
                <strong>Annexe Surface:</strong> {singlePap.annexeSurface}
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <strong>Activité commerciale:</strong> {singlePap.activiteCommerciale}
              </div>
              <div className="col-md-6">
                <strong>Arbres affectés:</strong> {singlePap.arbreAffectee}
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <strong>Nombre de jours:</strong> {singlePap.nombreJours}
              </div>
              <div className="col-md-6">
                <strong>Équivalent en dollars:</strong> ${singlePap.equivalentDollars}
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <strong>Perte de revenu locatif:</strong> ${singlePap.perteRevenuLocatif}
              </div>
              <div className="col-md-6">
                <strong>Assistance déménagement:</strong> ${singlePap.assistanceDemenagement}
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <strong>Assistance pour personnes vulnérables:</strong> {singlePap.assistance_personne_vulnerable || 'N/A'}
              </div>
              <div className="col-md-6">
                <strong>Accord de libération de lieu:</strong> {singlePap.accordLiberationLieu ? 'Oui' : 'Non'}
              </div>
            </div>
          </div>
        </div>
      )}
      {status === 'failed' && <div className="alert alert-danger text-center">Échec du chargement des données. Veuillez réessayer.</div>}
    </div>
  );
};

export default ShowPap;
