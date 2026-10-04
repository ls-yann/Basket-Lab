# Basket Lab

Bibliothèque web interactive d'entraînements de basket.

## Organisation

```text
main/
├── index.html              # Point d'entrée de l'application
├── pages/                  # Fiches HTML normalisées et imprimables
├── documents/              # Ressources PDF
├── data/
│   └── documents.json      # Index des PDF pour la bibliothèque
├── tools/
│   ├── document-import.html # Assistant graphique d'import
│   └── document-import.js
└── assets/
    ├── css/styles.css      # Styles de l'application
    ├── css/page.css        # Styles communs des fiches
    ├── js/app.js           # Recherche, filtres et favoris
    ├── js/page.js          # Impression des fiches
    └── images/             # Schémas et illustrations des fiches
```

Les fichiers historiques sont conservés dans `pages/` et `documents/`. Les pages HTML utilisent des chemins relatifs adaptés à cette nouvelle arborescence.

La bibliothèque principale regroupe les 234 PDF et les fiches HTML éditoriales. Les catégories de chaque PDF sont enregistrées dans `data/documents.json` et les compteurs des filtres sont calculés à partir de toutes les ressources, pas à partir de valeurs statiques.

Chaque fiche HTML possède le bouton **Imprimer / PDF**. Il ouvre la boîte d'impression du navigateur avec une mise en page dédiée : choisir ensuite « Enregistrer au format PDF ». Cette solution fonctionne sur GitHub Pages sans serveur ni dépendance externe.

Pour ajouter un PDF, ouvrir `tools/document-import.html`, choisir une catégorie et le fichier, puis suivre le chemin et l'entrée JSON générés. GitHub Pages ne permet pas à un site publié de modifier directement le dépôt : il faut ensuite ajouter le PDF et l'entrée JSON dans Git, puis pousser les changements.

## Procédure import nouveau Drill :  
Procédure complète
Après avoir utilisé l’outil :

créer le dossier indiqué, par exemple :

```main/documents/Défense/```

y déposer le PDF ;
ajouter l’entrée générée dans :
```main/data/documents.json```

publier les changements :

```git add main/
git commit -m "Add defense drill PDF"
git push
```

Limitation importante de GitHub Pages
GitHub Pages est un hébergement statique. Un site hébergé dessus ne peut pas écrire directement dans le dépôt GitHub ni téléverser définitivement un fichier.

L’outil graphique prépare donc l’import, mais la dernière étape doit encore être faite localement puis envoyée avec Git.