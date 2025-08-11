<?php
// Lee todos los archivos de la carpeta productos y genera un JSON para el frontend
function buscarProductosEn($ruta, $categoria) {
    $productos = [];
    if (!is_dir($ruta)) return $productos;
    $archivos = scandir($ruta);
    foreach ($archivos as $archivo) {
        if ($archivo === '.' || $archivo === '..') continue;
        $ext = strtolower(pathinfo($archivo, PATHINFO_EXTENSION));
        if (!in_array($ext, ['jpg', 'jpeg', 'png', 'webp'])) continue;
        $nombre = ucwords(str_replace(['-', '_', '.jpg', '.jpeg', '.png', '.webp'], [' ', ' ', '', '', '', ''], $archivo));
        // Convertir la ruta absoluta a relativa para el frontend
        $rutaRelativa = str_replace(__DIR__, '', $ruta);
        $rutaRelativa = ltrim($rutaRelativa, '/');
        $productos[] = [
            'nombre' => $nombre,
            'img' => 'img/productos' . ($categoria !== 'otros' ? '/' . $categoria : '') . '/' . $archivo,
            'descripcion' => 'Descripción pendiente',
            'precio' => 'RD$ 0',
            'categoria' => $categoria
        ];
    }
    return $productos;
}

$base = __DIR__ . '/img/productos';
$productos = [];
$productos = array_merge(
    buscarProductosEn($base . '/proteina', 'proteina'),
    buscarProductosEn($base . '/ropa', 'ropa'),
    buscarProductosEn($base . '/pastilla', 'pastilla')
);
// También buscar productos sueltos en la raíz de productos
$productos = array_merge($productos, buscarProductosEn($base, 'otros'));
usort($productos, function($a, $b) { return strcmp($a['nombre'], $b['nombre']); });
header('Content-Type: application/json');
echo json_encode($productos);
