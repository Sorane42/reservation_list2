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

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h2 className="fw-bold m-0">Catalogue d'Objets</h2>
        <Button variant="primary" onClick={handleShow} className="rounded-pill px-4 shadow-sm">
          + Ajouter un objet
        </Button>
      </div>

      <Row>
        {items.map((item) => (
          <Col key={item.id} md={4} className="mb-4">
            <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
              <Card.Body className="p-4 d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <Card.Title className="fw-bold h5 mb-0">{item.nom}</Card.Title>
                  <Badge pill bg={item.statut === "Disponible" ? "success" : "danger"}>
                    {item.statut}
                  </Badge>
                </div>
                <p className="text-primary small fw-semibold mb-2">{item.type}</p>
                <Card.Text className="text-muted small flex-grow-1">
                  {item.description || "Aucune description fournie."}
                </Card.Text>
                <hr className="my-3 opacity-10" />
                <Button
                  variant={item.statut === "Disponible" ? "outline-primary" : "secondary"}
                  className="w-100 fw-bold"
                  disabled={item.statut !== "Disponible"}
                  style={{ borderRadius: '10px' }}
                >
                  {item.statut === "Disponible" ? "Réserver cet objet" : "Indisponible"}
                </Button>
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
    </Container>
  );
}

export default App;