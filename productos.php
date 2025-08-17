<?php
// productos.php - Devuelve productos de ejemplo en formato JSON sin base de datos
header('Content-Type: application/json; charset=utf-8');

$productos = [
    [
        "id" => 1,
        "nombre" => "Creatina Monohidrato 400g",
        "descripcion" => "Creatina pura para mejorar fuerza y rendimiento.",
        "precio" => "RD$ 1,200",
        "categoria" => "proteina",
        "img" => "img/productos/proteina/Creatina Monohidrato 400 g (80 Porciones).webp"
    ],
    [
        "id" => 2,
        "nombre" => "Camiseta deportiva para hombre",
        "descripcion" => "Material transpirable y cómodo para tus entrenamientos.",
        "precio" => "RD$ 650",
        "categoria" => "ropa",
        "img" => "img/productos/ropa/Camiseta deportiva para hombre.webp"
    ],
    [
        "id" => 3,
        "nombre" => "Universal Nutrition Animal Pak",
        "descripcion" => "Complejo vitamínico para atletas de alto rendimiento.",
        "precio" => "RD$ 1,800",
        "categoria" => "vitaminas",
        "img" => "img/productos/Vitaminas/Universal Nutrition, Animal Pak (44 paquetes).webp"
    ],
    [
        "id" => 4,
        "nombre" => "Whey Gold Standard 100% Protein",
        "descripcion" => "Proteína de alta calidad para recuperación muscular.",
        "precio" => "RD$ 2,200",
        "categoria" => "proteina",
        "img" => "img/productos/proteina/Whey Gold Standard 100% Protein Optimum Nutrition ON.webp"
    ],
    [
        "id" => 5,
        "nombre" => "Leggings deportivos Mujer gris",
        "descripcion" => "Leggings cómodos y flexibles para entrenamiento.",
        "precio" => "RD$ 900",
        "categoria" => "ropa",
        "img" => "img/productos/ropa/Leggings deportivos Mujer gris.webp"
    ]
];

echo json_encode($productos, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
?>
