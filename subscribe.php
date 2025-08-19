<?php
// subscribe.php - Procesa la suscripción y envía correo de confirmación
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}

$email = filter_var($_POST['email'] ?? '', FILTER_VALIDATE_EMAIL);
if (!$email) {
    echo json_encode(['success' => false, 'message' => 'Correo inválido']);
    exit;
}

// Configuración del correo
$asunto = '¡Bienvenido a la Comunidad Black Gym!';
$mensaje = '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"></head><body style="font-family:sans-serif; background:#f7f7f7; color:#222; padding:30px;">'
    .'<div style="max-width:500px; margin:auto; background:#fff; border-radius:8px; box-shadow:0 2px 8px #0001; padding:30px;">'
    .'<img src="https://i.ibb.co/6b8Qw8B/blackgym-logo.jpg" alt="Black Gym" style="width:120px; display:block; margin:auto 0 20px auto;">'
    .'<h2 style="color:#181818;">¡Gracias por suscribirte a nuestro boletín!</h2>'
    .'<p>Hola,</p>'
    .'<p>Te damos la bienvenida a la comunidad <b>Black Gym</b>. A partir de ahora recibirás en tu correo electrónico nuestras mejores novedades, artículos exclusivos, promociones y consejos para transformar tu cuerpo y tu vida.</p>'
    .'<ul style="color:#181818;">
        <li>Ofertas y descuentos exclusivos</li>
        <li>Tips de entrenamiento y nutrición</li>
        <li>Noticias y eventos especiales</li>
    </ul>'
    .'<p style="margin-top:30px; color:#888; font-size:13px;">Si no te suscribiste o deseas dejar de recibir estos correos, puedes ignorar este mensaje.</p>'
    .'<p style="margin-top:10px; color:#181818;">¡Gracias por confiar en nosotros!</p>'
    .'<p style="color:#181818; font-weight:bold;">Equipo Black Gym</p>'
    .'</div></body></html>';
$cabeceras = "MIME-Version: 1.0" . "\r\n";
$cabeceras .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$cabeceras .= "From: Black Gym <no-reply@blackgym.com>\r\n";

if (mail($email, $asunto, $mensaje, $cabeceras)) {
    echo json_encode(['success' => true, 'message' => '¡Te has suscrito exitosamente! Revisa tu correo para más información.']);
} else {
    echo json_encode(['success' => false, 'message' => 'No se pudo enviar el correo de bienvenida. Intenta más tarde.']);
}
