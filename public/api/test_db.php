<?php
/**
 * ==============================================================================
 * DATABASE CONNECTION TESTER & SYSTEM DIAGNOSTICS
 * SIMON - SATUPUTARU (DINPUTARU Kabupaten Demak)
 * ==============================================================================
 * 
 * Akses URL ini melalui browser:
 * https://domain-anda.com/api/test_db.php
 */

require_once __DIR__ . '/config.php';

$is_browser = (isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'text/html') !== false) || !isset($_SERVER['HTTP_ACCEPT']);

$response = [
    'timestamp' => date('Y-m-d H:i:s'),
    'php_version' => PHP_VERSION,
    'db_config' => [
        'host' => $db_host ?? 'unknown',
        'port' => $db_port ?? '3306',
        'database' => $db_name ?? 'unknown',
        'user' => $db_user ?? 'unknown',
    ],
    'status' => 'unknown',
    'message' => '',
    'tables' => [],
    'troubleshooting' => []
];

if (!isset($pdo) || $pdo === null) {
    $response['status'] = 'error';
    $response['message'] = 'Gagal terhubung ke database MySQL: ' . ($db_connection_error ?? 'PDO tidak terdefinisi.');
    $response['troubleshooting'] = [
        '1. Pastikan nama database, user, dan password di config.php (atau config.local.php) sudah sesuai dengan yang dibuat di hPanel / cPanel.',
        '2. Pastikan database user telah diberikan hak akses penuh (ALL PRIVILEGES) pada database tersebut.',
        '3. Pastikan host database adalah "localhost" (atau 127.0.0.1 di sebagian besar hosting).',
        '4. Cek apakah Anda sudah mengimpor file SQL (database/simon_satuputaru.sql) melalui menu phpMyAdmin di hosting.'
    ];
} else {
    try {
        $serverVersion = $pdo->query('select version()')->fetchColumn();
        $response['status'] = 'success';
        $response['message'] = 'Koneksi ke database MySQL berhasil! (MySQL/MariaDB ' . $serverVersion . ')';

        $expected_tables = ['system_settings', 'bidang', 'users', 'projects', 'sipd_programs', 'sipd_kegiatan', 'sipd_sub_kegiatan', 'years'];
        $tables_found = [];

        foreach ($expected_tables as $tbl) {
            try {
                $stmt = $pdo->query("SELECT COUNT(*) as cnt FROM `{$tbl}`");
                $count = $stmt->fetchColumn();
                $tables_found[$tbl] = [
                    'exists' => true,
                    'row_count' => (int)$count
                ];
            } catch (Exception $ex) {
                $tables_found[$tbl] = [
                    'exists' => false,
                    'error' => 'Tabel belum ada (Silakan import database/simon_satuputaru.sql)'
                ];
            }
        }
        $response['tables'] = $tables_found;
    } catch (Exception $e) {
        $response['status'] = 'error';
        $response['message'] = 'Koneksi berhasil tetapi gagal menjalankan query: ' . $e->getMessage();
    }
}

// Jika diakses langsung lewat browser, tampilkan UI diagnosis yang elegan
if ($is_browser && (!isset($_GET['format']) || $_GET['format'] !== 'json')) {
    header('Content-Type: text/html; charset=UTF-8');
    ?>
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Diagnostik Database - SIMON SATUPUTARU</title>
        <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                background: #0f172a;
                color: #f8fafc;
                padding: 40px 20px;
                display: flex;
                justify-content: center;
            }
            .container {
                max-width: 760px;
                width: 100%;
                background: #1e293b;
                border-radius: 16px;
                padding: 32px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.4);
                border: 1px solid #334155;
            }
            .header {
                display: flex;
                align-items: center;
                gap: 16px;
                border-bottom: 1px solid #334155;
                padding-bottom: 20px;
                margin-bottom: 24px;
            }
            .badge-logo {
                width: 48px;
                height: 48px;
                background: linear-gradient(135deg, #0284c7, #2563eb);
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                font-weight: bold;
            }
            h1 { font-size: 20px; color: #f8fafc; font-weight: 700; }
            .subtitle { font-size: 13px; color: #94a3b8; margin-top: 4px; }
            .status-banner {
                padding: 16px 20px;
                border-radius: 12px;
                font-weight: 600;
                font-size: 15px;
                margin-bottom: 24px;
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .status-success {
                background: rgba(16, 185, 129, 0.15);
                border: 1px solid #10b981;
                color: #34d399;
            }
            .status-error {
                background: rgba(239, 68, 68, 0.15);
                border: 1px solid #ef4444;
                color: #f87171;
            }
            .card {
                background: #0f172a;
                border-radius: 10px;
                padding: 18px;
                margin-bottom: 20px;
                border: 1px solid #334155;
            }
            .card-title {
                font-size: 13px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                color: #94a3b8;
                margin-bottom: 12px;
                font-weight: bold;
            }
            .config-row {
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
                border-bottom: 1px solid #1e293b;
                font-size: 13.5px;
            }
            .config-row:last-child { border-bottom: none; }
            .config-label { color: #94a3b8; }
            .config-val { color: #f8fafc; font-family: monospace; font-weight: 600; }
            table {
                width: 100%;
                border-collapse: collapse;
                font-size: 13px;
            }
            th, td {
                padding: 10px 12px;
                text-align: left;
                border-bottom: 1px solid #1e293b;
            }
            th { color: #94a3b8; font-weight: 600; }
            .pill {
                padding: 3px 8px;
                border-radius: 9999px;
                font-size: 11px;
                font-weight: bold;
                display: inline-block;
            }
            .pill-green { background: #064e3b; color: #6ee7b7; }
            .pill-red { background: #7f1d1d; color: #fca5a5; }
            .tips-list {
                list-style: none;
                padding: 0;
            }
            .tips-list li {
                font-size: 13px;
                padding: 8px 0;
                color: #cbd5e1;
                line-height: 1.5;
            }
            .footer-links {
                display: flex;
                gap: 12px;
                margin-top: 24px;
            }
            .btn {
                text-decoration: none;
                padding: 10px 16px;
                border-radius: 8px;
                font-size: 13px;
                font-weight: 600;
                display: inline-block;
            }
            .btn-primary { background: #0284c7; color: white; }
            .btn-outline { background: transparent; color: #94a3b8; border: 1px solid #475569; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="badge-logo">🏛️</div>
                <div>
                    <h1>Testing Koneksi Database SIMON SATUPUTARU</h1>
                    <div class="subtitle">Dinas Pekerjaan Umum dan Penataan Ruang Kabupaten Demak</div>
                </div>
            </div>

            <?php if ($response['status'] === 'success'): ?>
                <div class="status-banner status-success">
                    <span>✅</span>
                    <div><?php echo htmlspecialchars($response['message']); ?></div>
                </div>
            <?php else: ?>
                <div class="status-banner status-error">
                    <span>❌</span>
                    <div><?php echo htmlspecialchars($response['message']); ?></div>
                </div>
            <?php endif; ?>

            <div class="card">
                <div class="card-title">Parameter Koneksi MySQL</div>
                <div class="config-row">
                    <span class="config-label">Host</span>
                    <span class="config-val"><?php echo htmlspecialchars($response['db_config']['host'] . ':' . $response['db_config']['port']); ?></span>
                </div>
                <div class="config-row">
                    <span class="config-label">Database Name</span>
                    <span class="config-val"><?php echo htmlspecialchars($response['db_config']['database']); ?></span>
                </div>
                <div class="config-row">
                    <span class="config-label">Database User</span>
                    <span class="config-val"><?php echo htmlspecialchars($response['db_config']['user']); ?></span>
                </div>
                <div class="config-row">
                    <span class="config-label">PHP Version</span>
                    <span class="config-val"><?php echo htmlspecialchars($response['php_version']); ?></span>
                </div>
            </div>

            <?php if (!empty($response['tables'])): ?>
                <div class="card">
                    <div class="card-title">Status Tabel Database (database/simon_satuputaru.sql)</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Nama Tabel</th>
                                <th>Status</th>
                                <th>Jumlah Data</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($response['tables'] as $tableName => $tInfo): ?>
                                <tr>
                                    <td><code><?php echo htmlspecialchars($tableName); ?></code></td>
                                    <td>
                                        <?php if ($tInfo['exists']): ?>
                                            <span class="pill pill-green">Ready / Ada</span>
                                        <?php else: ?>
                                            <span class="pill pill-red">Belum Diimport</span>
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <?php echo isset($tInfo['row_count']) ? number_format($tInfo['row_count']) . ' baris' : '<span style="color:#f87171;">' . htmlspecialchars($tInfo['error']) . '</span>'; ?>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            <?php endif; ?>

            <?php if (!empty($response['troubleshooting'])): ?>
                <div class="card" style="border-color: #ef4444;">
                    <div class="card-title" style="color: #f87171;">Panduan Pemecahan Masalah Koneksi Hosting:</div>
                    <ul class="tips-list">
                        <?php foreach ($response['troubleshooting'] as $tip): ?>
                            <li><?php echo htmlspecialchars($tip); ?></li>
                        <?php endforeach; ?>
                    </ul>
                </div>
            <?php endif; ?>

            <div class="footer-links">
                <a href="../" class="btn btn-primary">← Buka Aplikasi SIMON</a>
                <a href="?format=json" class="btn btn-outline">{ } Lihat Output Format JSON</a>
            </div>
        </div>
    </body>
    </html>
    <?php
    exit;
}

// Output standar JSON jika diakses via API / AJAX
echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
