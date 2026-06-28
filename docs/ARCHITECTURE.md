# Notes techniques

One-page long scroll (`index.html` + `js/main.js`). Pas de framework, pas de CMS.

## Images

Dossier `images/` en WebP avec fallback PNG via `<picture>`. Les scripts `optimize-images.mjs` et `wrap-images.mjs` servent à régénérer les assets après ajout de photos.

## Réservation

Le formulaire ouvre un `mailto:` pré-rempli — pas de backend, pas de FormSubmit. Marie-Claire reçoit la demande directement dans sa boîte mail.

## Interactions

Lightbox galerie, carrousel avis, FAQ accordéon, menu mobile : tout dans `main.js`. WhatsApp via lien `wa.me`.

## SEO & infra

JSON-LD LodgingBusiness + FAQ dans le HTML ou injecté au chargement. `vercel.json` identique aux autres sites statiques Bulle (clean URLs, cache).
