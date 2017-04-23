Florian Cheffot 11511072	
Fonctionnalités:
-Afficher toutes les photos de l’utilisateur dans une galerie de 6 images par ligne
-Afficher une photo particulière sélectionnée dans la galerie
-Filtrer les photos qui ont un certain tag, avec un menu permettant de sélectionner un tag dans la liste des tous les tags utilisés dans la collection
-Modifier la description d’une photo et les tags qui lui sont associés
-Ajouter une photo à la collection de l’utilisateur, en précisant sa description et ses tags
-Modifier le nombre de photos affichées sur chaque ligne de la galerie
-Trier et filtrer les photos par dates

Problème avec la taille des photos dans la galerie.

1/ Prend la photo qu'on lui donne et met à jour la modale. Appelée au chargement.
2/Update photo permet de mettre à jour l'interace. Download promise appele updatePhoto. 
3/ Récupère menu et année. Parcours le DOM puis récupère photo qui correspond et vérifie ses attributs. L'année n'est pas dans le DOM.
4/Edition de la photo: Récupère la photo courante via variable globale. Met à jour description et tags à partir de la fenêtre modale.
5/On reprend les données qu'on veut met à jour et avc l'update on l'envoie en PUT qui fera la modification sur le serveur
6/Upload photo, on prend le retour qui est le moment ou on a le résultat et on met à jour le retour avec les nouvelles données, on doit obtenir la collection complète avec cette photo en plus.
7/Ajout d'une photo en locale, le serveur prend en compte et on appelle downloadpromise pour que le serveur mette à jour la galerie.
DownloadPromise récupère la collection.
8/Nombre de photos par lignes: