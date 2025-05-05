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
  | 'language';

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
    language: 'Language'
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
    language: 'Langue'
  }
};

// Crear función de traducción
export function createTranslate(lang: string) {
  return (key: TranslationKey): string => {
    return translations[lang]?.[key] || translations.en[key] || key;
  };
}