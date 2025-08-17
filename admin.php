<?php
// admin.php - Backend para el panel de administración Black Gym
header('Content-Type: application/json; charset=utf-8');
$host = 'localhost';
$user = 'root';
$pass = '';
$db = 'blackgym';
$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    echo json_encode(["error" => "Error de conexión a la base de datos."]);
    exit;
}
$data = json_decode(file_get_contents('php://input'), true);
$accion = $data['accion'] ?? '';
$usuario = $data['usuario'] ?? '';
$clave = $data['clave'] ?? '';

// Usuarios y contraseñas
$usuarios = [
    'superadmin' => 'Admin4321',
    'admin' => 'Admin1234'
];

function autorizado($usuario, $clave = null) {
    global $usuarios;
    if ($clave === null) return isset($usuarios[$usuario]);
    return isset($usuarios[$usuario]) && $usuarios[$usuario] === $clave;
}

if ($accion === 'login') {
    if (autorizado($usuario, $clave)) {
        echo json_encode(["success" => true, "usuario" => $usuario]);
    } else {
        echo json_encode(["success" => false, "error" => "Usuario o contraseña incorrectos."]);
    }
    exit;
}

if (!autorizado($usuario)) {
    echo json_encode(["error" => "No autorizado."]);
    exit;
}

if ($accion === 'listar') {
    $res = $conn->query("SELECT id, nombre, descripcion, precio, categoria, img FROM productos ORDER BY id DESC");
    $productos = [];
    while ($row = $res->fetch_assoc()) {
        $productos[] = [
            "id" => $row["id"],
            "nombre" => $row["nombre"],
            "descripcion" => $row["descripcion"],
            "precio" => "RD$ " . number_format($row["precio"], 0, '', '.'),
            "categoria" => $row["categoria"],
            "img" => $row["img"]
        ];
    }
    echo json_encode(["productos" => $productos]);
    exit;
}

if ($accion === 'agregar') {
    $stmt = $conn->prepare("INSERT INTO productos (nombre, descripcion, precio, categoria, img) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param('ssdss', $data['nombre'], $data['descripcion'], $data['precio'], $data['categoria'], $data['img']);
    $ok = $stmt->execute();
    echo json_encode(["success" => $ok]);
    exit;
}

if ($accion === 'obtener') {
    $id = intval($data['id']);
    $res = $conn->query("SELECT * FROM productos WHERE id=$id LIMIT 1");
    $prod = $res->fetch_assoc();
    echo json_encode($prod);
    exit;
}

if ($accion === 'editar') {
    $id = intval($data['id']);
    $stmt = $conn->prepare("UPDATE productos SET nombre=?, descripcion=?, precio=?, categoria=?, img=? WHERE id=?");
    $stmt->bind_param('ssdssi', $data['nombre'], $data['descripcion'], $data['precio'], $data['categoria'], $data['img'], $id);
    $ok = $stmt->execute();
    echo json_encode(["success" => $ok]);
    exit;
}

if ($accion === 'eliminar' && $usuario === 'superadmin') {
    $id = intval($data['id']);
    $ok = $conn->query("DELETE FROM productos WHERE id=$id");
    echo json_encode(["success" => $ok]);
    exit;
}
// Acción para importar productos desde la carpeta img/productos
if ($accion === 'importar' && ($usuario === 'admin' || $usuario === 'superadmin')) {
    $dir = __DIR__ . '/img/productos';
    if (!is_dir($dir)) {
        echo json_encode(["error" => "No se encontró la carpeta de productos."]);
        exit;
    }
    $archivos = array_filter(scandir($dir), function($f) {
        return !is_dir($f) && preg_match('/\.(jpg|jpeg|png|webp)$/i', $f);
    });
    $importados = 0;
    foreach ($archivos as $archivo) {
        $nombre = preg_replace('/\.[^.]+$/', '', $archivo);
        $descripcion = "Producto importado automáticamente.";
        $precio = 499; // Precio genérico
        $categoria = "General";
        $img = 'img/productos/' . $archivo;
        // Verificar si ya existe el producto con esa imagen
        $res = $conn->query("SELECT id FROM productos WHERE img='" . $conn->real_escape_string($img) . "' LIMIT 1");
        if ($res->num_rows === 0) {
            $stmt = $conn->prepare("INSERT INTO productos (nombre, descripcion, precio, categoria, img) VALUES (?, ?, ?, ?, ?)");
            $stmt->bind_param('ssdss', $nombre, $descripcion, $precio, $categoria, $img);
            if ($stmt->execute()) $importados++;
        }
    }
    echo json_encode(["success" => true, "importados" => $importados]);
    exit;
}

echo json_encode(["error" => "Acción no válida."]);
?>
