export default {
  onboarding: {
    title: 'מה שם הכלב שלך?',
    placeholder: 'בלה, מקס, לונה...',
    cta: 'לשגרה של {{name}}',
    ctaDefault: 'ליצור שגרה',
  },
  ready: {
    title: 'השגרה של {{name}} מוכנה',
    subtitle: 'הנה איך נראה היום שלכם יחד.',
    cta: 'בואו נתחיל',
  },
  slots: {
    morning: 'בוקר',
    afternoon: 'צהריים',
    evening: 'ערב',
  },
  tasks: {
    feed: 'להאכיל את {{name}}',
    water: 'מים טריים',
    morningWalk: 'טיול בוקר',
    eveningWalk: 'טיול ערב',
    play: 'זמן משחק',
  },
  reflection: {
    afternoonPrompt: 'איך זמן המשחק גרם לך להרגיש?',
  },
  moods: {
    happy: 'שמח',
    calm: 'רגוע',
    anxious: 'חרד',
    tired: 'עייף',
    connected: 'מחובר',
  },
  moodEmoji: {
    happy: '😊',
    calm: '😌',
    anxious: '😟',
    tired: '😴',
    connected: '🐾',
  },
  celebration: {
    taskDone: 'כל הכבוד!',
    slotDone: '{{slot}} הסתיים עם {{name}}!',
  },
  tabs: {
    today: 'היום',
    history: 'היסטוריה',
    manage: 'ניהול',
  },
  history: {
    title: 'היסטוריית טיפול',
    weekSummary: '{{count}} משימות הושלמו השבוע עם {{name}}',
    empty: 'היסטוריית הטיפול שלך תופיע כאן.',
  },
  manage: {
    title: 'ניהול',
    addTask: 'הוסף משימה',
    slotLabel: 'זמן',
    taskNamePlaceholder: 'שם המשימה...',
    save: 'שמור',
    cancel: 'ביטול',
    deleteTask: 'הסר משימה',
    notificationTime: 'זמן התראה',
  },
} as const;
