import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';

function App() {
  const [items, setItems] = useState([]);

  // Récupération des données depuis PHP
  useEffect(() => {
    fetch('http://localhost/reservation_list2/api/get_items.php')
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error("Erreur API:", err));
  }, []);

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Catalogue d'Objets</h2>
      <Row>
        {items.map((item) => (
          <Col key={item.id} md={4} className="mb-4">
            <Card className="shadow-sm border-0">
              <Card.Body>
                <Card.Title>{item.nom}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">ID: {item.id}</Card.Subtitle>
                <div className="my-3">
                  <Badge bg={item.statut === "Disponible" ? "success" : "danger"}>
                    {item.statut}
                  </Badge>
                  <span className="ms-2 text-secondary text-sm">Quantité: {item.quantite}</span>
                </div>

                <Button
                  variant="primary"
                  className="w-100"
                  disabled={item.statut !== "Disponible"}
                >
                  {item.statut === "Disponible" ? "Réserver" : "Indisponible"}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default App;