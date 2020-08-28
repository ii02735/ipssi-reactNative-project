## Projet React Native IPSSI

Ce projet a consisté à faire un clone de l'application _YUKA_ en React Native.
Par conséquent ce dernier devait avoir pour principale fonctionnalité **d'analyser un produit depuis son code-barres en passant par la *caméra***

### Ce qui a été fait

- Un petit système de navigation à l'aide de **React Navigation**
- La partie **Scanner** en utilisant la caméra depuis l'API fournie par ***Expo***
- La partie de l'affichage des **Résultats**
- La partie des produits favoris
- La sauvegarde des produits recherchés
- Une recherche de produit en **saisissant** son code-barres

Un serveur **ExpressJS** avait commencé à être conçu pour gérer des utilisateurs en passant par SQLite, mais n'a pas été abouti. Par conséquent, l'application ne possède pas de système d'authentification.

La gestion des états a été converte par **Redux** et les **States** classiques quand cela était nécessaire + le projet a été codé en ***TypeScript***