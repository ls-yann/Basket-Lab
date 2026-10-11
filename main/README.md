# Basket Lab

Bibliothèque web interactive d'entraînements de basket.

## Organisation

```text
main/
├── index.html              # Point d'entrée de l'application
├── pages/                  # Fiches HTML normalisées et imprimables
├── documents/              # Ressources PDF
├── data/
│   ├── documents.json      # Index des PDF pour la bibliothèque
│   └── trainings.json      # Index des fiches HTML affichées sur l'accueil
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

Les fichiers historiques sont conservés dans `pages/` et `documents/`. Les cartes de l'accueil ne contiennent plus leurs liens en dur dans le JavaScript : `data/trainings.json` est la source unique du titre, de la description et du chemin de chaque fiche HTML. Le champ `file` correspond toujours au fichier réellement ouvert.

## Modifier le titre ou la catégorie d'une carte

Pour une fiche HTML, modifier l'objet correspondant dans `main/data/trainings.json` :

```json
{
  "id": 1,
  "title": "Shoot-09",
  "category": "Shoots",
  "description": "Tir après démarquage et écran vers le haut.",
  "file": "pages/drill-semaine-80.html",
  "type": "html"
}
```

Le champ `file` ne doit pas changer si le fichier n'est pas déplacé. Pour que le titre affiché dans la fiche soit identique à celui de la carte, modifier également `<title>` et `<h1 class="page-title">` dans le fichier HTML. La catégorie affichée dans l'en-tête se trouve dans `<div class="page-category">`.

Pour un PDF, modifier l'objet correspondant dans `main/data/documents.json` (`name`, `category` et `file`). Les catégories doivent reprendre les familles du contenu ou de l'arborescence : `Shoots`, `Passes`, `Fastbreak`, `Clinic`, `Transition défensive`, etc. Les fichiers de Greg Tonagel sont ainsi classés `Clinic`.

Après toute modification, vérifier que le chemin `file` existe bien, puis recharger la bibliothèque. Aucun changement n'est nécessaire dans `app.js`.

La bibliothèque principale regroupe les 234 PDF et les fiches HTML éditoriales. Les catégories de chaque PDF sont enregistrées dans `data/documents.json` et les compteurs des filtres sont calculés à partir de toutes les ressources, pas à partir de valeurs statiques.

Chaque fiche HTML possède le bouton **Imprimer / PDF**. Il ouvre la boîte d'impression du navigateur avec une mise en page dédiée : choisir ensuite « Enregistrer au format PDF ». Cette solution fonctionne sur GitHub Pages sans serveur ni dépendance externe.

Pour ajouter un PDF, ouvrir `tools/document-import.html`, choisir une catégorie et le fichier, puis suivre le chemin et l'entrée JSON générés. GitHub Pages ne permet pas à un site publié de modifier directement le dépôt : il faut ensuite ajouter le PDF et l'entrée JSON dans Git, puis pousser les changements.

## Procédure import nouveau Drill :  
Procédure complète
Après avoir utilisé l’outil :

déposer le PDF dans `main/documents/` avec le nom indiqué ;
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