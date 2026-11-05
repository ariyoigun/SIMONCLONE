<?php
/**
 * ==============================================================================
 * KONFIGURASI KONEKSI DATABASE MYSQL HOSTINGER
 * SIMON - SATUPUTARU (DINPUTARU Kabupaten Demak)
 * Alamat Domain: https://simon.satuputarudemak.id
 * ==============================================================================
 * 
 * PANDUAN PENGISIAN DI HOSTINGER hPanel:
 * 1. Buka hPanel Hostinger -> Masuk menu "Databases" -> "Kelola Database".
 * 2. Salin Nama Database, Nama User, dan Password yang telah dibuat di Hostinger.
 * 3. Default sistem saat ini telah dikonfigurasikan untuk database u490770675_simona.
 */

// Konfigurasi Default Kredensial Database Hostinger
$db_host = 'localhost';               // Default di Hostinger adalah 'localhost'
$db_name = 'u490770675_simona';       // Nama Database di Hostinger (u490770675_simona)
$db_user = 'u490770675_adminsimon';   // Nama Pengguna Database di Hostinger (u490770675_adminsimon)
$db_pass = '*Demak2026';              // Kata Sandi Database Hostinger (*Demak2026)
$db_port = '3306';

// Memuat kredensial lokal Hostinger jika ada file config.local.php (Aman dari overwrite Git)
if (file_exists(__DIR__ . '/config.local.php')) {
    require __DIR__ . '/config.local.php';
}

// Header CORS & Format Output JSON
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Expires: 0');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    $dsn = "mysql:host={$db_host};port={$db_port};dbname={$db_name};charset=utf8mb4";
    $pdo = new PDO($dsn, $db_user, $db_pass, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
        PDO::ATTR_TIMEOUT            => 5,
        PDO::MYSQL_ATTR_MULTI_STATEMENTS => true,
    ]);
} catch (PDOException $e) {
    // Mode offline / fallback informasi jika database belum diisi di Hostinger
    $pdo = null;
    $db_connection_error = $e->getMessage();
}
