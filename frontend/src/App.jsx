import React, { useEffect, useState } from 'react';

function App() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('http://localhost/reservation_list2/api/get_items.php')
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error("Erreur API:", err));
  }, []);

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark">Catalogue d'Objets</h2>
        <button className="btn btn-primary rounded-pill px-4">+ Ajouter un objet</button>
      </div>

      <div className="row">
        {items.map((item) => (
          <div key={item.id} className="col-md-4 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <h5 className="card-title fw-bold">{item.nom}</h5>
                <p className="text-muted small">ID: {item.id}</p>

                <div className="mb-3">
                  <span className={`badge rounded-pill ${item.statut === "Disponible" ? "bg-success" : "bg-danger"}`}>
                    {item.statut}
                  </span>
                  <span className="ms-2 text-secondary small">Type: {item.type}</span>
                </div>

                <button
                  className={`btn w-100 fw-bold ${item.statut === "Disponible" ? "btn-primary" : "btn-secondary disabled"}`}
                >
                  {item.statut === "Disponible" ? "Réserver" : "Indisponible"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;