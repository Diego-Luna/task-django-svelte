// ruta: /Users/diegofranciscolunalopez/Documents/facildate/frontend/src/lib/i18n/translations.ts
export type TranslationKey =
  | 'appTitle'
  | 'tasks'
  | 'addTask'
  | 'editTask'
  | 'cancel'
  | 'title'
  | 'description'
  | 'status'
  | 'todo'
  | 'done'
  | 'save'
  | 'update'
  | 'delete'
  | 'complete'
  | 'reopen'
  | 'filter'
  | 'all'
  | 'noTasksFound'
  | 'addFirstTask'
  | 'confirmDelete'
  | 'error'
  | 'created'
  | 'optional'
  | 'language'
  | 'login'
  | 'logout'
  | 'register'
  | 'username'
  | 'password'
  | 'confirmPassword'
  | 'email'
  | 'firstName'
  | 'lastName'
  | 'loginSuccess'
  | 'registerSuccess'
  | 'enterUsername'
  | 'enterPassword'
  | 'usernameRequired'
  | 'passwordRequired'
  | 'passwordsDoNotMatch'
  | 'visibility'
  | 'private'
  | 'global'
  | 'createdBy'
  | 'myAccount'
  | 'loginToCreatePrivate'
  | 'profile'
  | 'dictate'
  | 'listening'
  | 'speechRecognitionError'
  | 'browserNotSupported';

export type Translations = Record<TranslationKey, string>;

export const translations: Record<string, Translations> = {
  en: {
    appTitle: 'Task Manager',
    tasks: 'Tasks',
    addTask: 'Add Task',
    editTask: 'Edit Task',
    cancel: 'Cancel',
    title: 'Title',
    description: 'Description',
    status: 'Status',
    todo: 'To Do',
    done: 'Done',
    save: 'Save',
    update: 'Update',
    delete: 'Delete',
    complete: 'Complete',
    reopen: 'Reopen',
    filter: 'Filter:',
    all: 'All',
    noTasksFound: 'No tasks found.',
    addFirstTask: 'Add your first task',
    confirmDelete: 'Are you sure you want to delete this task?',
    error: 'An error occurred',
    created: 'Created:',
    optional: 'optional',
    language: 'Language',
    login: 'Login',
    logout: 'Logout',
    register: 'Register',
    username: 'Username',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    email: 'Email',
    firstName: 'First Name',
    lastName: 'Last Name',
    loginSuccess: 'Logged in successfully',
    registerSuccess: 'Account registered successfully',
    enterUsername: 'Enter your username',
    enterPassword: 'Enter your password',
    usernameRequired: 'Username is required',
    passwordRequired: 'Password is required',
    passwordsDoNotMatch: 'Passwords do not match',
    visibility: 'Visibility',
    private: 'Private',
    global: 'Global',
    createdBy: 'By',
    myAccount: 'My Account',
    loginToCreatePrivate: 'Login to create private tasks',
    profile: 'Profile',
    dictate: 'Dictate',
    listening: 'Listening...',
    speechRecognitionError: 'Speech recognition error',
    browserNotSupported: 'Your browser does not support speech recognition',
  },
  fr: {
    appTitle: 'Gestionnaire de Tâches',
    tasks: 'Tâches',
    addTask: 'Ajouter une Tâche',
    editTask: 'Modifier la Tâche',
    cancel: 'Annuler',
    title: 'Titre',
    description: 'Description',
    status: 'État',
    todo: 'À Faire',
    done: 'Terminée',
    save: 'Enregistrer',
    update: 'Mettre à jour',
    delete: 'Supprimer',
    complete: 'Terminer',
    reopen: 'Rouvrir',
    filter: 'Filtre:',
    all: 'Toutes',
    noTasksFound: 'Aucune tâche trouvée.',
    addFirstTask: 'Ajoutez votre première tâche',
    confirmDelete: 'Êtes-vous sûr de vouloir supprimer cette tâche?',
    error: 'Une erreur est survenue',
    created: 'Créé le:',
    optional: 'optionnel',
    language: 'Langue',
    login: 'Connexion',
    logout: 'Déconnexion',
    register: 'S\'inscrire',
    username: 'Nom d\'utilisateur',
    password: 'Mot de passe',
    confirmPassword: 'Confirmer le mot de passe',
    email: 'Email',
    firstName: 'Prénom',
    lastName: 'Nom',
    loginSuccess: 'Connexion réussie',
    registerSuccess: 'Compte créé avec succès',
    enterUsername: 'Entrez votre nom d\'utilisateur',
    enterPassword: 'Entrez votre mot de passe',
    usernameRequired: 'Le nom d\'utilisateur est requis',
    passwordRequired: 'Le mot de passe est requis',
    passwordsDoNotMatch: 'Les mots de passe ne correspondent pas',
    visibility: 'Visibilité',
    private: 'Privée',
    global: 'Globale',
    createdBy: 'Par',
    myAccount: 'Mon Compte',
    loginToCreatePrivate: 'Connectez-vous pour créer des tâches privées',
    profile: 'Profil',
    dictate: 'Dicter',
    listening: 'Écoute...',
    speechRecognitionError: 'Erreur de reconnaissance vocale',
    browserNotSupported: 'Votre navigateur ne prend pas en charge la reconnaissance vocale',
  }
};

// Crear función de traducción
export function createTranslate(lang: string) {
  return (key: TranslationKey): string => {
    return translations[lang]?.[key] || translations.en[key] || key;
  };
}