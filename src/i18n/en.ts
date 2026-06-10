export default {
  onboarding: {
    title: "What's your dog's name?",
    placeholder: "Bella, Max, Luna...",
    cta: "Meet {{name}}'s routine",
    ctaDefault: "Create routine",
  },
  ready: {
    title: "{{name}}'s routine is ready",
    subtitle: "Here's what your day looks like together.",
    cta: "Let's go",
  },
  slots: {
    morning: 'Morning',
    afternoon: 'Afternoon',
    evening: 'Evening',
  },
  tasks: {
    feed: 'Feed {{name}}',
    water: 'Fresh water',
    morningWalk: 'Morning walk',
    eveningWalk: 'Evening walk',
    play: 'Play time',
  },
  reflection: {
    afternoonPrompt: 'How did play time make you feel?',
  },
  moods: {
    happy: 'Happy',
    calm: 'Calm',
    anxious: 'Anxious',
    tired: 'Tired',
    connected: 'Connected',
  },
  moodEmoji: {
    happy: '😊',
    calm: '😌',
    anxious: '😟',
    tired: '😴',
    connected: '🐾',
  },
  celebration: {
    taskDone: 'Great job!',
    slotDone: '{{slot}} done with {{name}}!',
  },
  tabs: {
    today: 'Today',
    history: 'History',
    manage: 'Manage',
  },
  notifications: {
    morning: {
      title: 'Good morning 🌅',
      body: 'Time for your morning ritual with {{name}}.',
    },
    afternoon: {
      title: 'Afternoon together ☀️',
      body: '{{name}} would love some time with you.',
    },
    evening: {
      title: 'Winding down 🌙',
      body: 'A gentle evening with {{name}} awaits.',
    },
  },
  history: {
    title: 'Care History',
    weekSummary: '{{count}} tasks completed this week with {{name}}',
    empty: 'Your care history will appear here.',
    taskCount_one: '{{count}} task',
    taskCount_other: '{{count}} tasks',
    moodContext: '{{slot}} · {{mood}}',
  },
  manage: {
    title: 'Manage',
    addTask: 'Add task',
    slotLabel: 'Slot',
    taskNamePlaceholder: 'Task name...',
    save: 'Save',
    cancel: 'Cancel',
    deleteTask: 'Remove task',
    notificationTime: 'Reminder time',
    notificationTimeLabel: 'Reminder at {{time}}, tap to change',
    renameTask: 'Rename {{task}}',
    removeTaskLabel: 'Remove {{task}}',
    hour: 'Hour',
    minute: 'Minute',
  },
} as const;
