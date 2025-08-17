// admin.js - Panel de administración Black Gym
// Modo demo para GitHub Pages: solo muestra mensaje informativo
document.addEventListener('DOMContentLoaded', function() {
    const root = document.getElementById('admin-root') || document.body;
    root.innerHTML = `<div style='max-width:480px;margin:60px auto;padding:2rem 1.5rem;background:#fffbe8;border-radius:18px;box-shadow:0 8px 32px #FFD70033;text-align:center;'>
        <h2 style='color:#FFD700;font-weight:bold;'>Panel de Administración (Demo)</h2>
        <p style='color:#181818;font-size:1.15rem;'>Esta versión no tiene funciones de administración porque está optimizada para GitHub Pages.<br><br>Si necesitas un panel real, usa una solución con backend (PHP, Node.js, Firebase, etc).</p>
    </div>`;
});
