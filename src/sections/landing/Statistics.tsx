import { Row, Card, Form } from 'react-bootstrap';
import styles from './Statistics.module.css';
import React, { useEffect, useState } from 'react';
import image1 from 'assets/images/image-1.jpeg.jpg';
import image2 from 'assets/images/image-2.jpeg.jpg';
import { fetchSite } from 'api/fetchData';

const Statistics = () => {
  const [selectedTroncon, setSelectedTroncon] = useState('');

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [projectSite, setProjectSite] = useState<any[]>([]);
  const [data, setData] = useState<any[]>([]); // Ensure data is initialized as an array

  //get all projectSite
  useEffect(() => {
    const loadProjectSite = async () => {
      try {
        const fetchedSite = await fetchSite();
        setProjectSite(fetchedSite);
      } catch (error) {
        console.error('Erreur lors du chargement des sites du projet :', error);
      }
    };

    loadProjectSite();
  }, []);

  useEffect(() => {
    if (projectSite) {
      fetchData();
    }
  }, [projectSite]);

 
  const fetchData = async () => {

    const currentDate = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
    const effectiveStartDate = startDate || currentDate;
    const effectiveEndDate = endDate || currentDate;

    let url = `${import.meta.env.VITE_APP_API_URL}complaints/statistic`;
    if (selectedTroncon) {
      url += `?projectSite=${selectedTroncon}&startDate=${effectiveStartDate}&endDate=${effectiveEndDate}`;
    }

    try {
      const response = await fetch(url);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Erreur lors de la récupération des données :', error);
    }
  };

  useEffect(() => {

    fetchData();
  }, [selectedTroncon, startDate, endDate]);

  //filtre type complaint
  const generalComplaints = Array.isArray(data) ? data.filter((item) => item.category === 'General') : [];
  const sensibleComplaints = Array.isArray(data) ? data.filter((item) => item.category === 'Sensible') : [];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Vérifie la largeur lors du redimensionnement
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize); // Nettoyage de l'écouteur
    };
  }, []);

  return (
    <div id="stats">
      <Row
        style={{
          height: 'auto',
          backgroundColor: '#ed4d4c',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}
      >
        <div
          style={{
            textAlign: 'center',
            width: '52rem',
            color: '#ffffff'
          }}
        >
          <p>
            Ces filtres permettent d'afficher les statistiques par axe routier ou par province d&rsquo;intervention du projet PACT.
            Sélectionnez une option pour obtenir rapidement les statistiques ciblées et pertinentes.
          </p>
        </div>
        <div className="d-flex flex-column flex-sm-row align-items-center justify-content-center" style={{ gap: '1rem' }}>
          <Form.Label className="text-white">Axe routier :</Form.Label>
          <Form.Select
            aria-label="Filtrer par tronçon"
            style={{
              width: 'auto',
              minWidth: '280px',
              maxWidth: '100%',
            }}
            onChange={(e) => setSelectedTroncon(e.target.value)}
          >
            <option value="">Tous les tronçons</option>
            {projectSite.map((troncon: any, index: any) => (
              <option key={index} value={troncon.id}>
          {troncon.name}
              </option>
            ))}
          </Form.Select>
          <Form.Label className="text-white">Période :</Form.Label>
          <div className="d-flex flex-column flex-sm-row align-items-center" style={{ gap: '0.5rem' }}>
            <Form.Control
              type="date"
              id="startDate"
              style={{
          width: 'auto',
          minWidth: '140px',
          maxWidth: '100%',
              }}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <span className="text-white">à</span>
            <Form.Control
              type="date"
              id="endDate"
              style={{
          width: 'auto',
          minWidth: '140px',
          maxWidth: '100%',
              }}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </Row>
      <section className={`${styles['statistics-section']}`}>
        <div>
          <Row>
        <div className="d-flex justify-content-center align-items-center">
          <Card
            style={{
          width: '20rem',
          margin: '1rem',
          borderRadius: '10px',
          boxShadow: '1px 1px 3px 1px rgba(0, 0, 0, 0.2)',
          height: '26rem',
          backgroundImage: `url(${image1})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
            className="text-center d-none d-md-block"
            onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '5px 5px 15px rgba(0, 0, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '1px 1px 3px 1px rgba(0, 0, 0, 0.2)';
                }}
              ></Card>
              <div className="">
                <h2 className="text-center mt-4">Statistiques des Plaintes Générales</h2>
                <div className="d-flex flex-column flex-sm-row justify-content-center flex-wrap">
                  {generalComplaints.map((p, index) => (
                  <React.Fragment key={index}>
                    <Card
                    style={{
                      width: '18rem',
                      margin: '1rem',
                      borderRadius: '15px',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                      overflow: 'hidden',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      backgroundColor: '#f8f9fa'
                    }}
                    className="text-center"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                    }}
                    >
                    <Card.Header
                      style={{
                      backgroundColor: '#ed4d4c',
                      color: '#fff',
                      fontWeight: 'bold',
                      fontSize: '1.2rem',
                      }}
                    >
                      Total Plaintes
                    </Card.Header>
                    <Card.Body>
                      <Row className="justify-content-center fs-3 fw-bold">{p.totalComplaints}</Row>
                    </Card.Body>
                    </Card>
                    <Card
                    style={{
                      width: '18rem',
                      margin: '1rem',
                      borderRadius: '15px',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                      overflow: 'hidden',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      backgroundColor: '#f8f9fa'
                    }}
                    className="text-center"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                    }}
                    >
                    <Card.Header
                      style={{
                      backgroundColor: '#ffc107',
                      color: '#fff',
                      fontWeight: 'bold',
                      fontSize: '1.2rem',
                      }}
                    >
                      Plaintes en Cours
                    </Card.Header>
                    <Card.Body>
                      <Row className="justify-content-center fs-3 fw-bold">{p.complaintInProgress}</Row>
                    </Card.Body>
                    </Card>
                    <Card
                    style={{
                      width: '18rem',
                      margin: '1rem',
                      borderRadius: '15px',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                      overflow: 'hidden',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      backgroundColor: '#f8f9fa'
                    }}
                    className="text-center"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                    }}
                    >
                    <Card.Header
                      style={{
                      backgroundColor: '#28a745',
                      color: '#fff',
                      fontWeight: 'bold',
                      fontSize: '1.2rem',
                      }}
                    >
                      Plaintes Traitées
                    </Card.Header>
                    <Card.Body>
                      <Row className="justify-content-center fs-3 fw-bold">{p.complaintProcessed}</Row>
                    </Card.Body>
                    </Card>
                  </React.Fragment>
                  ))}
                </div>
                <div className="d-flex justify-content-center" style={{ width: isMobile ? 'auto' : '40rem', marginLeft: '1rem' }}>
                  <p className="text-justify mt-3">
                    Les plaintes générales ou non sensibles concernent tout mécontentement lié au processus de mise en œuvre des activités
                    du projet. Elles renvoient aux types de plainte notamment mauvaise gestion du projet, impacts sociaux, conditions de
                    travail, impacts environnementaux, réinstallation, destruction de la biodiversité et des ressources naturelles vivantes,
                    patrimoine culturel, etc.
                  </p>
                </div>
              </div>
            </div>
          </Row>
        </div>
      </section>
      <section className={`${styles['statistics-sections']}`}>
        <div>
          <Row>
            <div className="d-flex justify-content-center align-items-center">
              <div>
                <h2 className="text-center mt-5" style={{ color: '#ffffff' }}>
                  Statistiques des Plaintes Sensibles
                </h2>
                <div className="d-flex flex-column flex-sm-row justify-content-center flex-wrap">
                  {sensibleComplaints.map((p, index) => (
                    <React.Fragment key={index}>
                      <Card
                        style={{
                          width: 'auto',
                          margin: '1rem',
                          borderRadius: '10px',
                          boxShadow: '1px 1px 3px 1px rgba(0, 0, 0, 0.2)',
                          height: '8rem',
                          transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                        }}
                        className="text-center"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.05)';
                          e.currentTarget.style.boxShadow = '5px 5px 15px rgba(0, 0, 0, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = '1px 1px 3px 1px rgba(0, 0, 0, 0.2)';
                        }}
                      >
                        <Card.Body className="justify-content-center">
                          <Row className="justify-content-center fs-6 fw-bold">Total Plaintes</Row>
                          <Row className="justify-content-center fs-3 fw-bold">{p.totalComplaints}</Row>
                        </Card.Body>
                      </Card>
                      <Card
                        style={{
                          width: 'auto',
                          margin: '1rem',
                          borderRadius: '10px',
                          boxShadow: '1px 1px 3px 1px rgba(0, 0, 0, 0.2)',
                          height: '8rem',
                          transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                        }}
                        className="text-center"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.05)';
                          e.currentTarget.style.boxShadow = '5px 5px 15px rgba(0, 0, 0, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = '1px 1px 3px 1px rgba(0, 0, 0, 0.2)';
                        }}
                      >
                        <Card.Body className="justify-content-center">
                          <Row className="justify-content-center fs-6 fw-bold">Plaintes en Cours</Row>
                          <Row className="justify-content-center fs-3 fw-bold">{p.complaintInProgress}</Row>
                        </Card.Body>
                      </Card>
                      <Card
                        style={{
                          width: 'auto',
                          margin: '1rem',
                          borderRadius: '10px',
                          boxShadow: '1px 1px 3px 1px rgba(0, 0, 0, 0.2)',
                          height: '8rem',
                          transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                        }}
                        className="text-center"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.05)';
                          e.currentTarget.style.boxShadow = '5px 5px 15px rgba(0, 0, 0, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = '1px 1px 3px 1px rgba(0, 0, 0, 0.2)';
                        }}
                      >
                        <Card.Body className="justify-content-center">
                          <Row className="justify-content-center fs-6 fw-bold">Plaintes Traitées</Row>
                          <Row className="justify-content-center fs-3 fw-bold">{p.complaintProcessed}</Row>
                        </Card.Body>
                      </Card>
                    </React.Fragment>
                  ))}
                </div>
                <div className="d-flex justify-content-center" style={{ width: isMobile ? 'auto' : '40rem', marginLeft: '1rem' }}>
                  <p className="text-justify mt-3">
                    Les plaintes sensibles se rapportent à tout mécontentement lié aux Violences Basées sur le Genre, Exploitation, Abus et
                    Harcèlement Sexuels (VBG-EAHS). Elles correspondent aux types de plainte notamment violences physique, verbale (y
                    compris le discours de haine), sexuelle, psychologique, socio-économique et harcèlement. Elles sont traitées de manière
                    confidentielle, transparente et sans représailles afin de garantir une protection maximale des plaignants.
                  </p>
                </div>
              </div>
              <Card
                style={{
                  width: '20rem',
                  margin: '1rem',
                  borderRadius: '10px',
                  boxShadow: '1px 1px 3px 1px rgba(0, 0, 0, 0.2)',
                  height: '26rem',
                  backgroundImage: `url(${image2})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                }}
                className="text-center d-none d-md-block"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '5px 5px 15px rgba(0, 0, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '1px 1px 3px 1px rgba(0, 0, 0, 0.2)';
                }}
              ></Card>
            </div>
          </Row>
        </div>
      </section>
    </div>
  );
};

export default Statistics;
