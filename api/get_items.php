<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Configuration de la connexion
$host = "localhost";
$db_name = "reservation_list";
$username = "root";
$password = ""; // Par défaut vide sur Wamp

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // On sélectionne tes vraies colonnes dans la table 'objet'
    $stmt = $pdo->query("SELECT id, nom, type, description, statut FROM objet");
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($items);

} catch(PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>