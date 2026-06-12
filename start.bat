@echo off
chcp 65001 >nul
rem 启动个人音乐播放器，自动用默认浏览器打开 index.html
cd /d "%~dp0"
start "" "index.html"
