<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

require_once 'db_connect.php';

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['id'])) {
    try {

        // On change le statut à 'Réservé' pour cet ID précis
        $sql = "UPDATE objet SET statut = 'Réservé' WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':id' => $data['id']]);

        echo json_encode(["status" => "success", "message" => "Objet réservé !"]);
    } catch(PDOException $e) {
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
}
?>