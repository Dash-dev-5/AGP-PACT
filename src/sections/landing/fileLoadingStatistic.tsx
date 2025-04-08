import { Card, Form } from 'react-bootstrap';
import { useEffect, useState } from 'react';

const FileLoadingStatistic = () => {
  const reports = [
    { title: 'Rapport 2021', date: '2021', description: 'Rapport annuel 2021', link: '/path/to/report2021.pdf' },
    { title: 'Rapport 2022', date: '2022', description: 'Rapport annuel 2022', link: '/path/to/report2022.pdf' },
    { title: 'Rapport 2023', date: '2023', description: 'Rapport annuel 2023', link: '/path/to/report2023.pdf' },
    { title: 'Rapport 2024', date: '2024', description: 'Rapport annuel 2024', link: '/path/to/report2024.pdf' }
  ];

  const years = Array.from(new Set(reports.map((report) => report.date)));
  const [selectedYear, setSelectedYear] = useState('');
  const [filteredReports, setFilteredReports] = useState(reports);

  useEffect(() => {
    if (selectedYear) {
      setFilteredReports(reports.filter((report) => report.date === selectedYear));
    } else {
      setFilteredReports(reports);
    }
  }, [selectedYear, reports]);

  return (
    <div style={{ padding: '2rem', backgroundColor: '#f9f9f9', textAlign: 'center' }}>
      <h2>Rapports publiés</h2>
      <p>
        Consultez et téléchargez les rapports publiés. Sélectionnez une année pour filtrer les résultats et accéder aux rapports pertinents.
      </p>
      <Form.Select
        aria-label="Filtrer les rapports par année"
        onChange={(e) => setSelectedYear(e.target.value)}
        value={selectedYear}
        style={{ width: '210px', margin: '1rem auto' }}
      >
        <option value="">Toutes les années</option>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </Form.Select>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
        {filteredReports.map((report, index) => (
          <Card
            key={index}
            style={{
              width: '18rem',
              borderRadius: '12px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              textAlign: 'left',
              backgroundColor: '#ffffff',
            }}
          >
            <Card.Body>
              <Card.Title style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#333' }}>
                {report.title}
              </Card.Title>
              <Card.Subtitle style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                Date de publication : {report.date}
              </Card.Subtitle>
              <Card.Text style={{ fontSize: '0.95rem', color: '#555' }}>
                {report.description}
              </Card.Text>
              <a
                href={report.link}
                download
                style={{
                  display: 'inline-block',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#2e87cc',
                  color: '#fff',
                  borderRadius: '5px',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                }}
              >
                Télécharger le rapport
              </a>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FileLoadingStatistic;
