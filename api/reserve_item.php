<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

require_once 'db_connect.php'; // On utilise ton fichier de connexion centralisé

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['id']) && isset($data['date_fin'])) {
    try {
        // On met à jour le statut ET la date de fin
        $sql = "UPDATE objet SET statut = 'Réservé', fin_reservation = :date_fin WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':id' => $data['id'],
            ':date_fin' => $data['date_fin']
        ]);

        echo json_encode(["status" => "success", "message" => "Réservé jusqu'au " . $data['date_fin']]);
    } catch(PDOException $e) {
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
}
?>