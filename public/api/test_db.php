<?php
/**
 * ==============================================================================
 * DATABASE CONNECTION TESTER & SYSTEM DIAGNOSTICS
 * SIMON - SATUPUTARU (DINPUTARU Kabupaten Demak)
 * ==============================================================================
 * 
 * Akses URL ini melalui browser:
 * https://simon.satuputarudemak.id/api/test_db.php
 */

require_once __DIR__ . '/config.php';

$is_browser = (isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'text/html') !== false) || !isset($_SERVER['HTTP_ACCEPT']);
$action = $_GET['action'] ?? ($_POST['action'] ?? '');
$sync_message = null;
$sync_error = null;

// 1. Fitur Auto-Sync / Import SQL Otomatis via Tombol
if ($action === 'sync' && $pdo !== null) {
    $possible_paths = [
        __DIR__ . '/../database/simon_satuputaru.sql',
        __DIR__ . '/../../database/simon_satuputaru.sql',
        __DIR__ . '/database/simon_satuputaru.sql'
    ];
    $sql_file = null;
    foreach ($possible_paths as $p) {
        if (file_exists($p)) {
            $sql_file = $p;
            break;
        }
    }

    if ($sql_file) {
        try {
            $sql_content = file_get_contents($sql_file);
            // Nonaktifkan foreign key checks sementara untuk menghindari constraint ordering issues
            $pdo->exec("SET FOREIGN_KEY_CHECKS = 0;");
            $pdo->exec($sql_content);
            $pdo->exec("SET FOREIGN_KEY_CHECKS = 1;");
            $sync_message = "Sinkronisasi database berhasil! Seluruh struktur tabel dan data master 2026 telah diterapkan ke MySQL.";
        } catch (Exception $e) {
            $sync_error = "Sinkronisasi otomatis gagal: " . $e->getMessage() . " Silakan import file SQL melalui phpMyAdmin.";
        }
    } else {
        $sync_error = "File database/simon_satuputaru.sql tidak ditemukan di server.";
    }

    if (!$is_browser || (isset($_GET['format']) && $_GET['format'] === 'json')) {
        echo json_encode([
            'status' => $sync_error ? 'error' : 'success',
            'message' => $sync_message ?? $sync_error
        ]);
        exit;
    }
}

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
        '1. Pastikan nama database, user, dan password di config.php (atau config.local.php) sudah sesuai dengan yang dibuat di hPanel Hostinger.',
        '2. Pastikan database user telah diberikan hak akses penuh (ALL PRIVILEGES) pada database tersebut.',
        '3. Pastikan host database adalah "localhost" (atau 127.0.0.1 di Hostinger).',
        '4. Cek apakah Anda sudah mengimpor file SQL (database/simon_satuputaru.sql) melalui menu phpMyAdmin di Hostinger.'
    ];
} else {
    try {
        $serverVersion = $pdo->query('select version()')->fetchColumn();
        $response['status'] = 'success';
        $response['message'] = 'Koneksi ke database MySQL berhasil! (MySQL/MariaDB ' . $serverVersion . ')';

        $expected_tables = ['system_settings', 'bidang', 'users', 'projects', 'monitoring_paket', 'sipd_programs', 'sipd_kegiatan', 'sipd_sub_kegiatan', 'years'];
        $tables_found = [];
        $missing_count = 0;

        foreach ($expected_tables as $tbl) {
            try {
                $stmt = $pdo->query("SELECT COUNT(*) as cnt FROM `{$tbl}`");
                $count = $stmt->fetchColumn();
                $tables_found[$tbl] = [
                    'exists' => true,
                    'row_count' => (int)$count
                ];
            } catch (Exception $ex) {
                $missing_count++;
                $tables_found[$tbl] = [
                    'exists' => false,
                    'error' => 'Tabel belum ada (Silakan import database/simon_satuputaru.sql)'
                ];
            }
        }
        $response['tables'] = $tables_found;
        $response['missing_tables_count'] = $missing_count;
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
                max-width: 800px;
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
            .status-warning {
                background: rgba(245, 158, 11, 0.15);
                border: 1px solid #f59e0b;
                color: #fbbf24;
            }
            .card {
                background: #0f172a;
                border: 1px solid #334155;
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 20px;
            }
            .card-title {
                font-size: 14px;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                color: #94a3b8;
                font-weight: 700;
                margin-bottom: 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .config-row {
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
                border-bottom: 1px solid #1e293b;
                font-size: 14px;
            }
            .config-row:last-child { border-bottom: none; }
            .config-label { color: #94a3b8; }
            .config-val { font-family: monospace; font-weight: 600; color: #e2e8f0; }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 10px;
                font-size: 14px;
            }
            th, td {
                padding: 10px 12px;
                text-align: left;
                border-bottom: 1px solid #1e293b;
            }
            th { color: #94a3b8; font-weight: 600; }
            .pill {
                padding: 4px 10px;
                border-radius: 999px;
                font-size: 12px;
                font-weight: 600;
                display: inline-block;
            }
            .pill-green { background: rgba(16, 185, 129, 0.2); color: #34d399; }
            .pill-red { background: rgba(239, 68, 68, 0.2); color: #f87171; }
            .pill-amber { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }
            .tips-list {
                padding-left: 20px;
                color: #cbd5e1;
                font-size: 13px;
                line-height: 1.6;
            }
            .footer-links {
                display: flex;
                flex-wrap: wrap;
                gap: 12px;
                margin-top: 24px;
            }
            .btn {
                text-decoration: none;
                padding: 10px 18px;
                border-radius: 8px;
                font-size: 13px;
                font-weight: 600;
                display: inline-flex;
                align-items: center;
                gap: 8px;
                cursor: pointer;
                border: none;
                transition: all 0.2s;
            }
            .btn-primary { background: #0284c7; color: white; }
            .btn-primary:hover { background: #0369a1; }
            .btn-success { background: #10b981; color: white; }
            .btn-success:hover { background: #059669; }
            .btn-outline { background: transparent; color: #94a3b8; border: 1px solid #475569; }
            .btn-outline:hover { background: #334155; color: #f8fafc; }
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

            <?php if (!empty($sync_message)): ?>
                <div class="status-banner status-success">
                    <span>🎉</span>
                    <div><?php echo htmlspecialchars($sync_message); ?></div>
                </div>
            <?php endif; ?>

            <?php if (!empty($sync_error)): ?>
                <div class="status-banner status-error">
                    <span>⚠️</span>
                    <div><?php echo htmlspecialchars($sync_error); ?></div>
                </div>
            <?php endif; ?>

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
                <div class="card-title">PARAMETER KONEKSI MYSQL</div>
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
                    <div class="card-title">
                        <span>STATUS TABEL DATABASE (DATABASE/SIMON_SATUPUTARU.SQL)</span>
                        <?php if ($response['missing_tables_count'] > 0 || (isset($response['tables']['projects']['row_count']) && $response['tables']['projects']['row_count'] < 500) || (isset($response['tables']['monitoring_paket']['row_count']) && $response['tables']['monitoring_paket']['row_count'] < 400)): ?>
                            <span class="pill pill-amber"><?php echo $response['missing_tables_count']; ?> Tabel Perlu Diperbarui</span>
                        <?php else: ?>
                            <span class="pill pill-green">Semua Tabel Lengkap (9/9)</span>
                        <?php endif; ?>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Nama Tabel</th>
                                <th>Status</th>
                                <th>Keterangan & Jumlah Data</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($response['tables'] as $tableName => $tInfo): ?>
                                <tr>
                                    <td>
                                        <code><?php echo htmlspecialchars($tableName); ?></code>
                                        <?php if ($tableName === 'projects'): ?>
                                            <div style="font-size:11px; color:#38bdf8; margin-top:2px;">(Master Data Pekerjaan)</div>
                                        <?php elseif ($tableName === 'monitoring_paket'): ?>
                                            <div style="font-size:11px; color:#34d399; margin-top:2px;">(Master Data Paket Pekerjaan & Monitoring Paket)</div>
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <?php if ($tInfo['exists']): ?>
                                            <span class="pill pill-green">Ready / Ada</span>
                                        <?php else: ?>
                                            <span class="pill pill-red">Belum Diimport</span>
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <?php 
                                            if (isset($tInfo['row_count'])) {
                                                echo '<strong>' . number_format($tInfo['row_count']) . ' baris</strong>';
                                                if ($tableName === 'projects' && $tInfo['row_count'] < 500) {
                                                    echo ' <span style="color:#fbbf24; font-size:12px;">(Tersedia 558 data 2026 di file SQL terbaru)</span>';
                                                }
                                                if ($tableName === 'monitoring_paket' && $tInfo['row_count'] < 400) {
                                                    echo ' <span style="color:#fbbf24; font-size:12px;">(Tersedia 478 paket 2026 di file SQL terbaru)</span>';
                                                }
                                            } else {
                                                echo '<span style="color:#f87171;">' . htmlspecialchars($tInfo['error']) . '</span>';
                                            }
                                        ?>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>

                    <?php if ($response['missing_tables_count'] > 0 || (isset($response['tables']['projects']['row_count']) && $response['tables']['projects']['row_count'] < 500)): ?>
                        <div style="margin-top: 20px; padding: 16px; background: rgba(2, 132, 199, 0.1); border: 1px solid #0284c7; border-radius: 8px;">
                            <div style="font-weight: 600; color: #38bdf8; margin-bottom: 6px;">⚡ Sinkronisasi Cepat 1-Klik:</div>
                            <div style="font-size: 13px; color: #cbd5e1; margin-bottom: 12px;">
                                File <code>database/simon_satuputaru.sql</code> terbaru kini telah disiapkan lengkap dengan 11 Program, 22 Kegiatan, 88 Sub Kegiatan, dan 558 Paket 2026. Anda dapat langsung mengklik tombol di bawah untuk menyinkronkan seluruh tabel ke MySQL secara otomatis:
                            </div>
                            <form method="POST" action="?action=sync" style="display: inline-block;">
                                <button type="submit" class="btn btn-success" onclick="return confirm('Jalankan impor otomatis file database/simon_satuputaru.sql ke MySQL?')">
                                    ⚡ Jalankan Import & Sinkronkan Database Sekarang
                                </button>
                            </form>
                            <a href="../database/simon_satuputaru.sql" download class="btn btn-outline" style="margin-left: 8px;">
                                📥 Download File SQL (phpMyAdmin)
                            </a>
                        </div>
                    <?php endif; ?>
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
                <a href="../database/simon_satuputaru.sql" download class="btn btn-outline">📥 Unduh simon_satuputaru.sql</a>
                <a href="?format=json" class="btn btn-outline">{ } Lihat Output Format JSON</a>
                <a href="?action=sync" class="btn btn-outline" onclick="return confirm('Jalankan impor ulang database?')">🔄 Re-Sync Database</a>
            </div>
        </div>
    </body>
    </html>
    <?php
    exit;
}

// Output standar JSON jika diakses via API / AJAX
echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
