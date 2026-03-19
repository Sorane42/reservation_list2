import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Card, Badge, Container, Row, Col } from 'react-bootstrap';

function App() {
  const [items, setItems] = useState([]);
  const [show, setShow] = useState(false);
  const [newObjet, setNewObjet] = useState({ nom: '', type: 'Autre', description: '', statut: 'Disponible' });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const fetchItems = () => {
    fetch('http://localhost/reservation_list2/api/get_items.php')
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error(err));
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost/reservation_list2/api/add_item.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newObjet),
    })
    .then(res => res.json())
    .then(() => {
      fetchItems();
      handleClose();
      setNewObjet({ nom: '', type: 'Autre', description: '', statut: 'Disponible' });
    });
  };

  const [showReserveModal, setShowReserveModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [dateFin, setDateFin] = useState('');

  const openReserveModal = (id) => {
    setSelectedItemId(id);
    setShowReserveModal(true);
  };

  const confirmReservation = (e) => {
    e.preventDefault();
    fetch('http://localhost/reservation_list2/api/reserve_item.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selectedItemId, date_fin: dateFin }),
    })
    .then(res => res.json())
    .then(() => {
      fetchItems();
      setShowReserveModal(false);
      setDateFin('');
    });
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'Voiture':
        return 'bi-car-front-fill'; // Icône de voiture
      case 'Informatique':
      case 'Ordinateur':
        return 'bi-laptop'; // Icône d'ordinateur
      case 'Matériel':
        return 'bi-tools'; // Icône d'outils
      case 'Téléphone':
          return 'bi-phone'; // Icône de téléphone
      default:
        return 'bi-box-seam'; // Icône par défaut (boîte)
    }
  };

  // Filtres
  const [filterType, setFilterType] = useState('Tous');
  const [filterStatus, setFilterStatus] = useState('Tous');
  const filteredItems = items.filter(item => {
    const matchType = filterType === 'Tous' || item.type === filterType;
    const matchStatus = filterStatus === 'Tous' || item.statut === filterStatus;
    return matchType && matchStatus;
  });

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h2 className="fw-bold m-0">Catalogue d'Objets</h2>
        <Button variant="primary" onClick={handleShow} className="rounded-pill px-4 shadow-sm">
          + Ajouter un objet
        </Button>
      </div>

      <div className="mb-4">
  {/* Filtres par Type */}
  <div className="d-flex flex-wrap gap-2 mb-3">
    {['Tous', 'Voiture', 'Informatique', 'Matériel', 'Téléphone'].map(type => (
      <button
        key={type}
        onClick={() => setFilterType(type)}
        className={`btn btn-sm rounded-pill px-3 ${filterType === type ? 'btn-primary' : 'btn-outline-secondary text-dark bg-white'}`}
      >
        {type}
      </button>
    ))}
  </div>

  {/* Filtres par Statut */}
  <div className="d-flex gap-2">
    <button
      onClick={() => setFilterStatus('Tous')}
      className={`btn btn-sm ${filterStatus === 'Tous' ? 'fw-bold border-bottom border-2 border-primary' : ''}`}
    >
      Tous
    </button>
    <button
      onClick={() => setFilterStatus('Disponible')}
      className={`btn btn-sm ${filterStatus === 'Disponible' ? 'text-success fw-bold' : ''}`}
    >
      Disponibles
    </button>
    <button
      onClick={() => setFilterStatus('Réservé')}
      className={`btn btn-sm ${filterStatus === 'Réservé' ? 'text-danger fw-bold' : ''}`}
    >
      Réservés
    </button>
    </div>
  </div>

      <Row>
        {filteredItems.map((item) => (
          <Col key={item.id} md={4} className="mb-4">
            <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
              <Card.Body className="p-4 d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <Card.Title className="fw-bold h5 mb-0">
                    <i className={`bi ${getIconForType(item.type)} me-2`} style={{ fontSize: '1rem' }}></i>
                    {item.nom}</Card.Title>
                  <Badge pill bg={item.statut === "Disponible" ? "success" : "danger"}>
                    {item.statut}
                  </Badge>
                </div>
                <p className="text-primary small fw-semibold mb-2">
                  {item.type}
                </p>
                <Card.Text className="text-muted small flex-grow-1">
                  {item.description || "Aucune description fournie."}
                </Card.Text>
                <hr className="my-3 opacity-10" />
                <button
                  className={`btn w-100 fw-bold mt-3 ${item.statut === "Disponible" ? "btn-outline-primary" : "btn-secondary disabled"}`}
                  onClick={() => item.statut === "Disponible" ? openReserveModal(item.id) : null}
                  disabled={item.statut !== "Disponible"}
                >
                  {item.statut === "Disponible"
                    ? "Réserver"
                    : `Indisponible (jusqu'au ${new Date(item.fin_reservation).toLocaleDateString()})`}
                </button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* MODALE DE FORMULAIRE */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">Nouvel Objet</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-3">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Nom de l'objet</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ex: Caméra Sony"
                onChange={(e) => setNewObjet({...newObjet, nom: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Type</Form.Label>
              <Form.Select onChange={(e) => setNewObjet({...newObjet, type: e.target.value})}>
                <option value="Autre">Choisir un type...</option>
                <option value="Voiture">Voiture</option>
                <option value="Informatique">Informatique</option>
                <option value="Matériel">Matériel</option>
                <option value="Téléphone">Téléphone</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Détails de l'objet..."
                onChange={(e) => setNewObjet({...newObjet, description: e.target.value})}
              />
            </Form.Group>

            <div className="d-flex gap-2 mt-4">
              <Button variant="light" className="w-100" onClick={handleClose}>Annuler</Button>
              <Button variant="primary" className="w-100" type="submit">Enregistrer</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* MODALE DE CHOIX DE DATE */}
      <Modal show={showReserveModal} onHide={() => setShowReserveModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Date de fin</Modal.Title>
      </Modal.Header>
      <Form onSubmit={confirmReservation}>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Jusqu'à quand ?</Form.Label>
            <Form.Control
              type="date"
              required
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDateFin(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" type="submit" className="w-100">
            Confirmer
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
    </Container>
  );
}

export default App;