<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
require_once 'db_connect.php';

try {

    // On sélectionne les colonnes dans la table 'objet'
    $stmt = $pdo->query("SELECT id, nom, type, description, statut FROM objet");
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($items);

} catch(PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>