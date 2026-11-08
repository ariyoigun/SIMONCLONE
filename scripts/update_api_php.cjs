const fs = require('fs');
let c = fs.readFileSync('public/api/api.php', 'utf8');

// 1. In header migration:
if (!c.includes('show_galeri_slideshow')) {
  c = c.replace(
    "$pdo->exec(\"ALTER TABLE system_settings MODIFY COLUMN galeri_json LONGTEXT DEFAULT NULL\");",
    `$pdo->exec("ALTER TABLE system_settings MODIFY COLUMN galeri_json LONGTEXT DEFAULT NULL");
        try {
            $pdo->exec("ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS show_galeri_slideshow TINYINT(1) DEFAULT 0");
            $pdo->exec("ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS show_slideshow_unggulan TINYINT(1) DEFAULT 1");
            $pdo->exec("ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS show_peta_koordinat TINYINT(1) DEFAULT 0");
            $pdo->exec("ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS slideshow_unggulan_json LONGTEXT DEFAULT NULL");
        } catch (Exception $ex) {}`
  );
}

// 2. In load_all:
if (!c.includes("$settings['showGaleriSlideshow'] =")) {
  c = c.replace(
    "if (!empty($settings['bidang_descriptions_json'])) {\r\n                $settings['bidangDescriptions'] = json_decode($settings['bidang_descriptions_json'], true);\r\n            }",
    `if (!empty($settings['bidang_descriptions_json'])) {
                $settings['bidangDescriptions'] = json_decode($settings['bidang_descriptions_json'], true);
            }
            $settings['showGaleriSlideshow'] = isset($settings['show_galeri_slideshow']) ? (bool)$settings['show_galeri_slideshow'] : false;
            $settings['showSlideshowUnggulan'] = isset($settings['show_slideshow_unggulan']) ? (bool)$settings['show_slideshow_unggulan'] : true;
            $settings['showPetaKoordinat'] = isset($settings['show_peta_koordinat']) ? (bool)$settings['show_peta_koordinat'] : false;
            if (!empty($settings['slideshow_unggulan_json'])) {
                $settings['slideshowUnggulan'] = json_decode($settings['slideshow_unggulan_json'], true);
            }`
  );
}

// 3. In save_settings:
if (!c.includes("show_galeri_slideshow = :show_galeri_slideshow")) {
  c = c.replace(
    "custom_texts_json = :custom_texts_json,\r\n                bidang_descriptions_json = :bidang_descriptions_json",
    `custom_texts_json = :custom_texts_json,
                bidang_descriptions_json = :bidang_descriptions_json,
                show_galeri_slideshow = :show_galeri_slideshow,
                show_slideshow_unggulan = :show_slideshow_unggulan,
                show_peta_koordinat = :show_peta_koordinat,
                slideshow_unggulan_json = :slideshow_unggulan_json`
  );

  c = c.replace(
    "':bidang_descriptions_json' => !empty($input['bidangDescriptions']) ? json_encode($input['bidangDescriptions']) : null",
    `':bidang_descriptions_json' => !empty($input['bidangDescriptions']) ? json_encode($input['bidangDescriptions']) : null,
                ':show_galeri_slideshow' => !empty($input['showGaleriSlideshow']) ? 1 : 0,
                ':show_slideshow_unggulan' => isset($input['showSlideshowUnggulan']) && !$input['showSlideshowUnggulan'] ? 0 : 1,
                ':show_peta_koordinat' => !empty($input['showPetaKoordinat']) ? 1 : 0,
                ':slideshow_unggulan_json' => !empty($input['slideshowUnggulan']) ? json_encode($input['slideshowUnggulan']) : null`
  );
}

fs.writeFileSync('public/api/api.php', c, 'utf8');
console.log('public/api/api.php updated successfully!');
