export const LEVELS = ['Beginner', 'Level 2', 'Level 3', 'Level 4', 'Adult'] as const
export type Level = typeof LEVELS[number]
