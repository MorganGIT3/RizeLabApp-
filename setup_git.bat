@echo off
chcp 65001 >nul
echo Initialisation du repository Git...
git init
git remote add origin https://github.com/MorganGIT3/RizeLabApp-.git 2>nul
if %errorlevel% neq 0 (
    git remote set-url origin https://github.com/MorganGIT3/RizeLabApp-.git
)
git add .
git commit -m "Initial commit - RizeApp V1 MVP"
echo.
echo Repository Git configuré avec succès!
echo Remote: https://github.com/MorganGIT3/RizeLabApp-.git
echo.
echo Vous pouvez maintenant pousser le code avec: git push -u origin main

