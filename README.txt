Florian Cheffot 11511072	
Fonctionnalit�s:
-Afficher toutes les photos de l�utilisateur dans une galerie de 6 images par ligne
-Afficher une photo particuli�re s�lectionn�e dans la galerie
-Filtrer les photos qui ont un certain tag, avec un menu permettant de s�lectionner un tag dans la liste des tous les tags utilis�s dans la collection
-Modifier la description d�une photo et les tags qui lui sont associ�s
-Ajouter une photo � la collection de l�utilisateur, en pr�cisant sa description et ses tags
-Modifier le nombre de photos affich�es sur chaque ligne de la galerie
-Trier et filtrer les photos par dates

Probl�me avec la taille des photos dans la galerie.

1/ Prend la photo qu'on lui donne et met � jour la modale. Appel�e au chargement.
2/Update photo permet de mettre � jour l'interace. Download promise appele updatePhoto. 
3/ R�cup�re menu et ann�e. Parcours le DOM puis r�cup�re photo qui correspond et v�rifie ses attributs. L'ann�e n'est pas dans le DOM.
4/Edition de la photo: R�cup�re la photo courante via variable globale. Met � jour description et tags � partir de la fen�tre modale.
5/On reprend les donn�es qu'on veut met � jour et avc l'update on l'envoie en PUT qui fera la modification sur le serveur
6/Upload photo, on prend le retour qui est le moment ou on a le r�sultat et on met � jour le retour avec les nouvelles donn�es, on doit obtenir la collection compl�te avec cette photo en plus.
7/Ajout d'une photo en locale, le serveur prend en compte et on appelle downloadpromise pour que le serveur mette � jour la galerie.
DownloadPromise r�cup�re la collection.
8/Nombre de photos par lignes: