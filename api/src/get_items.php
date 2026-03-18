<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Simulation de données (bientôt remplacé par MySQL)
$items = [
    [
        "id" => "T-001",
        "nom" => "Tesla Model 3",
        "type" => "Voiture",
        "statut" => "Disponible",
        "quantite" => 1
    ],
    [
        "id" => "T-002",
        "nom" => "MacBook Pro 14",
        "type" => "Ordinateur",
        "statut" => "Réservé",
        "quantite" => 0
    ]
];

echo json_encode($items);