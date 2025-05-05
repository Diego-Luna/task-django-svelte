# Your Task Management Solution

FacilDate is a sleek and modern task management app designed to make your life easier. Built with SvelteKit for the frontend and Django REST Framework for the backend, it offers a responsive interface, multilingual support, and advanced features like voice input for tasks. Whether you're managing personal to-dos or collaborating with a team, FacilDate has you covered.

## Why You'll Love FacilDate

- 🔒 **Secure User Authentication**: Easily register, log in, and manage your profile.
- 🌍 **Multilingual Support**: Switch seamlessly between English and French.
- ✅ **Effortless Task Management**: Create, edit, complete, and delete tasks with ease.
- 🎙️ **Voice Input**: Add tasks by simply speaking them out loud.
- 👀 **Custom Task Visibility**: Choose between public and private tasks.
- 🛡️ **Built-in Security**: Protects against common vulnerabilities like XSS.

## How FacilDate is Organized

```
/
├── frontend/             # The SvelteKit-powered frontend
│   ├── src/              # All the frontend source code
│   ├── static/           # Static assets like images and icons
│   └── Dockerfile        # Configuration for the frontend container
├── backend/              # The Django REST API backend
│   ├── accounts/         # Handles user authentication and profiles
│   ├── tasks/            # Manages task-related API endpoints
│   └── Dockerfile        # Configuration for the backend container
└── docker-compose.yml    # Orchestrates the entire application
```

## Getting Started

### Running in Development Mode

Want to see how it all works? Follow these steps to get started in development mode:

```bash
# Clone the repository
git clone https://github.com/yourusername/facildate.git
cd facildate

# Start the development environment
docker-compose up
```

Once everything is up and running, you can access the app at:
- Frontend: [http://localhost:5001](http://localhost:5001)
- Backend API: [http://localhost:8000](http://localhost:8000)

### Running in Production Mode

Ready to go live? Here's how to deploy FacilDate in production:

```bash
# Build and run the app for production
chmod +x deploy-prod.sh
./deploy-prod.sh
```

Your app will be available at:
- Frontend: [http://localhost:5002](http://localhost:5002)
- Backend API: [http://localhost:8000](http://localhost:8000)

## How FacilDate Works

1. **User Authentication**:
   - Sign up via the `/auth/register` endpoint.
   - Log in to receive secure JWT tokens for API access.
   - Access protected routes with ease.

2. **Task Management**:
   - Public tasks are visible to everyone.
   - Private tasks are only accessible to their creators.
   - Filter tasks by status (e.g., todo or done).

3. **Voice Input**:
   - Use your browser's Web Speech API to dictate tasks.
   - Supports both English and French.
   - Note: Browser support may vary.

4. **Multilingual Interface**:
   - Choose your preferred language (English or French).
   - Translations are applied across the entire app.
   - Dates and times are formatted based on your language choice.

---

# FacilDate : Votre Solution de Gestion de Tâches

FacilDate est une application moderne et élégante de gestion de tâches conçue pour simplifier votre quotidien. Avec un frontend propulsé par SvelteKit et un backend basé sur Django REST Framework, FacilDate offre une interface réactive, un support multilingue et des fonctionnalités avancées comme la saisie vocale. Que vous gériez des tâches personnelles ou collaboriez en équipe, FacilDate est là pour vous.

## Pourquoi Vous Allez Adorer FacilDate

- 🔒 **Authentification Sécurisée** : Inscrivez-vous, connectez-vous et gérez votre profil facilement.
- 🌍 **Support Multilingue** : Passez sans effort de l'anglais au français.
- ✅ **Gestion de Tâches Simplifiée** : Créez, modifiez, complétez et supprimez des tâches en toute simplicité.
- 🎙️ **Saisie Vocale** : Ajoutez des tâches simplement en les dictant.
- 👀 **Visibilité Personnalisée des Tâches** : Choisissez entre tâches publiques et privées.
- 🛡️ **Sécurité Intégrée** : Protège contre les vulnérabilités courantes comme le XSS.

## Organisation de FacilDate

```
/
├── frontend/             # Frontend propulsé par SvelteKit
│   ├── src/              # Tout le code source du frontend
│   ├── static/           # Ressources statiques comme les images et icônes
│   └── Dockerfile        # Configuration du conteneur frontend
├── backend/              # Backend API REST basé sur Django
│   ├── accounts/         # Gestion de l'authentification et des profils utilisateurs
│   ├── tasks/            # Gestion des endpoints API liés aux tâches
│   └── Dockerfile        # Configuration du conteneur backend
└── docker-compose.yml    # Orchestration de l'application
```

## Démarrage

### Mode Développement

Vous voulez voir comment tout fonctionne ? Suivez ces étapes pour démarrer en mode développement :

```bash
# Clonez le dépôt
git clone https://github.com/votrenomdutilisateur/facildate.git
cd facildate

# Démarrez l'environnement de développement
docker-compose up
```

Une fois tout en place, vous pouvez accéder à l'application à :
- Frontend : [http://localhost:5001](http://localhost:5001)
- API Backend : [http://localhost:8000](http://localhost:8000)

### Mode Production

Prêt à passer en production ? Voici comment déployer FacilDate :

```bash
# Compilez et exécutez l'application pour la production
chmod +x deploy-prod.sh
./deploy-prod.sh
```

Votre application sera disponible à :
- Frontend : [http://localhost:5002](http://localhost:5002)
- API Backend : [http://localhost:8000](http://localhost:8000)

## Comment FacilDate Fonctionne

1. **Authentification Utilisateur** :
   - Inscrivez-vous via le endpoint `/auth/register`.
   - Connectez-vous pour recevoir des tokens JWT sécurisés pour l'accès à l'API.
   - Accédez facilement aux routes protégées.

2. **Gestion des Tâches** :
   - Les tâches publiques sont visibles par tout le monde.
   - Les tâches privées sont accessibles uniquement à leurs créateurs.
   - Filtrez les tâches par statut (par exemple, à faire ou terminé).

3. **Saisie Vocale** :
   - Utilisez l'API Web Speech de votre navigateur pour dicter des tâches.
   - Supporte l'anglais et le français.
   - Remarque : Le support peut varier selon les navigateurs.

4. **Interface Multilingue** :
   - Choisissez votre langue préférée (anglais ou français).
   - Les traductions sont appliquées dans toute l'application.
   - Les dates et heures sont formatées en fonction de votre choix de langue.
