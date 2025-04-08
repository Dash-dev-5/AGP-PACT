import React from 'react';

const Partners = () => {
  return (
    <div className="bg-white mt-4" style={{ padding: '1rem' }}>
      <div className="container">
        <div className="row justify-content-center align-items-center">
          <div className="col-6 col-md-4 col-lg-3 mb-3 text-center">
            <img
              src="/img/partners/logo-ITP.png"
              alt="Logo ITP"
              className="img-fluid rounded"
              style={{ maxHeight: '150px', maxWidth: '100%', objectFit: 'contain' }}
            />
          </div>
          <div className="col-6 col-md-4 col-lg-3 mb-3 text-center">
            <img
              src="/img/partners/logo-cellule-infrastructure.jpg"
              alt="Logo Partner 2"
              className="img-fluid rounded"
              style={{ maxHeight: '150px', maxWidth: '100%', objectFit: 'contain' }}
            />
          </div>
          <div className="col-6 col-md-4 col-lg-3 mb-3 text-center">
            <img
              src="/img/partners/la-banque-mondiale-logo.png"
              alt="Logo Banque Mondiale"
              className="img-fluid rounded"
              style={{ maxHeight: '150px', maxWidth: '100%', objectFit: 'contain' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Partners;
