@echo off
title SIMON: Restart Chrome Debugging
echo ====================================================================
echo   SIMON - SATU PUTARU: RESTART CHROME DENGAN REMOTE DEBUGGING
echo ====================================================================
echo.
echo Menutup jendela Chrome lama agar port debugging dapat aktif...
taskkill /IM chrome.exe /F >nul 2>&1
timeout /t 1 /nobreak >nul
echo Membuka Chrome kembali pada port 9222...
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 "http://127.0.0.1:3008/"
echo.
echo ====================================================================
echo Chrome telah terbuka! Sesi login Anda tersimpan otomatis.
echo Silakan kembali ke chat Antigravity dan ketik "lanjutkan".
echo ====================================================================
pause

