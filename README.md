📱 Estiam App

Bienvenue dans Estiam App, une application mobile développée avec React Native et Expo, intégrant les notifications push via Firebase Cloud Messaging (FCM) et expo-notifications.

🚀 Installation

1️⃣ Prérequis

Node.js installé (Télécharger ici)

Expo CLI installé :

npm install -g expo-cli

Un compte Firebase (Créer un compte)

2️⃣ Cloner le projet

git clone https://github.com/BerradaMB/estiam-app.git
cd estiam-app

3️⃣ Installer les dépendances

npm install

4️⃣ Configuration Firebase

Crée un fichier .env à la racine du projet et ajoute les informations suivantes :

FIREBASE_API_KEY=VOTRE_CLE_API
FIREBASE_AUTH_DOMAIN=VOTRE_AUTH_DOMAIN
FIREBASE_PROJECT_ID=VOTRE_PROJECT_ID
FIREBASE_STORAGE_BUCKET=VOTRE_STORAGE_BUCKET
FIREBASE_MESSAGING_SENDER_ID=VOTRE_MESSAGING_SENDER_ID
FIREBASE_APP_ID=VOTRE_APP_ID

5️⃣ Lancer le projet

expo start

🔔 Notifications Push

Active Cloud Messaging sur Firebase

Récupère la clé VAPID dans Paramètres > Cloud Messaging

Teste une notification avec Expo
