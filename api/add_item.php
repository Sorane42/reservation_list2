<?php
// On force l'affichage des erreurs pour le débug
ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

require_once 'db_config.php';

$content = file_get_contents("php://input");
$data = json_decode($content, true);

if (isset($data['nom'])) {
    try {
        $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8", DB_USER, DB_PASS);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // ATTENTION : Vérifie que tes colonnes s'appellent bien comme ça
        $sql = "INSERT INTO objet (nom, type, description, statut) VALUES (:nom, :type, :description, :statut)";
        $stmt = $pdo->prepare($sql);

        $stmt->execute([
            ':nom'         => $data['nom'],
            ':type'        => !empty($data['type']) ? $data['type'] : 'Autre',
            ':description' => !empty($data['description']) ? $data['description'] : '',
            ':statut'      => 'Disponible'
        ]);

        echo json_encode(["status" => "success", "message" => "Objet ajouté"]);

    } catch(PDOException $e) {
        // Si ça plante ici, on renvoie l'erreur en JSON proprement
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Données incomplètes"]);
}