# Créer des images de remplacement simples
# Logo EDIBA simple
echo "Création du logo EDIBA..."
echo "iVBORw0KGgoAAAANSUhEUgAAAMgAAAA8CAYAAADX7T+7AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAAWdEVYdENyZWF0aW9uIFRpbWUAMDgvMjgvMjUwMDAwAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDI1LTEwLTIwVDA3OjEzOjAwKzAwOjAwAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDI1LTEwLTIwVDA3OjEzOjAwKzAwOjAwAAAAAElFTkSuQmCC" | Out-File -FilePath "public\logo-ediba.png" -Encoding ASCII

# Image d'en-tête de facture
echo "Création de l'en-tête de facture..."
echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" | Out-File -FilePath "public\factureimage\header.jpg" -Encoding ASCII

# Image de pied de facture  
echo "Création du pied de facture..."
echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" | Out-File -FilePath "public\factureimage\footer.jpg" -Encoding ASCII

echo "Images de remplacement créées!"
