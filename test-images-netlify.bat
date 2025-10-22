@echo off
echo ========================================
echo TEST IMAGES NETLIFY
echo ========================================

echo [1/4] Test des images locales...
echo Test placeholder-image.jpg...
if exist "public\placeholder-image.jpg" (
    echo ✅ placeholder-image.jpg existe
) else (
    echo ❌ placeholder-image.jpg manquant
)

echo Test factureimage/header.jpg...
if exist "public\factureimage\header.jpg" (
    echo ✅ header.jpg existe
) else (
    echo ❌ header.jpg manquant
)

echo Test factureimage/footer.jpg...
if exist "public\factureimage\footer.jpg" (
    echo ✅ footer.jpg existe
) else (
    echo ❌ footer.jpg manquant
)

echo.
echo [2/4] Test des images dans dist...
echo Test dist/placeholder-image.jpg...
if exist "dist\placeholder-image.jpg" (
    echo ✅ dist/placeholder-image.jpg existe
) else (
    echo ❌ dist/placeholder-image.jpg manquant
)

echo Test dist/factureimage/header.jpg...
if exist "dist\factureimage\header.jpg" (
    echo ✅ dist/header.jpg existe
) else (
    echo ❌ dist/header.jpg manquant
)

echo Test dist/factureimage/footer.jpg...
if exist "dist\factureimage\footer.jpg" (
    echo ✅ dist/footer.jpg existe
) else (
    echo ❌ dist/footer.jpg manquant
)

echo.
echo [3/4] URLs Netlify a tester:
echo https://ediba-inter.netlify.app/placeholder-image.jpg
echo https://ediba-inter.netlify.app/factureimage/header.jpg
echo https://ediba-inter.netlify.app/factureimage/footer.jpg

echo.
echo [4/4] Verification des chemins dans le code...
findstr /r /s "placeholder-image.jpg" src\*.tsx
findstr /r /s "header.jpg" src\*.tsx
findstr /r /s "footer.jpg" src\*.tsx

echo.
echo ========================================
echo TEST TERMINE
echo ========================================
pause
