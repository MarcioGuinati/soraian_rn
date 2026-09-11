export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
}

export interface Child {
  id: string;
  userId: string;
  name: string;
  birthDate: string;
  gender: string;
  photo?: string;
  birthWeight?: number;
  birthHeight?: number;
  bloodType?: string;
  parentNames?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  sharedAccess?: any[];
}

export interface FeedingRecord {
  id: string;
  childId: string;
  type: string;
  amountMl?: number;
  breastSide?: string;
  durationMinutes?: number;
  recordedAt: string;
  notes?: string;
  createdAt: string;
}

export interface FoodRecord {
  id: string;
  childId: string;
  mealType: string;
  food: string;
  amount?: number;
  unit?: string;
  recordedAt: string;
  notes?: string;
  createdAt: string;
}

export interface DiaperRecord {
  id: string;
  childId: string;
  type: string;
  consistency?: string;
  color?: string;
  amount?: string;
  recordedAt: string;
  notes?: string;
  createdAt: string;
}

export interface SleepRecord {
  id: string;
  childId: string;
  startedAt: string;
  endedAt?: string;
  durationMinutes?: number;
  location?: string;
  isActive: boolean;
  notes?: string;
  createdAt: string;
}

export interface BathRecord {
  id: string;
  childId: string;
  startedAt: string;
  durationMinutes?: number;
  waterTemperature?: number;
  notes?: string;
  createdAt: string;
}

export interface TemperatureRecord {
  id: string;
  childId: string;
  temperature: number;
  measurementMethod?: string;
  recordedAt: string;
  notes?: string;
  createdAt: string;
}

export interface WeightRecord {
  id: string;
  childId: string;
  weight: number;
  height?: number;
  headCircumference?: number;
  recordedAt: string;
  notes?: string;
  createdAt: string;
}

export interface MedicationRecord {
  id: string;
  childId: string;
  medicationName: string;
  dosage: string;
  unit?: string;
  recordedAt: string;
  reason?: string;
  notes?: string;
  createdAt: string;
}

export interface NoteRecord {
  id: string;
  childId: string;
  category?: string;
  content: string;
  recordedAt: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  childId: string;
  professional: string;
  specialty?: string;
  date: string;
  time?: string;
  location?: string;
  reason?: string;
  notes?: string;
  createdAt: string;
}

export interface Vaccine {
  id: string;
  childId: string;
  name: string;
  dose?: string;
  date: string;
  batch?: string;
  location?: string;
  notes?: string;
  createdAt: string;
}

export interface Reminder {
  id: string;
  childId: string;
  title: string;
  description?: string;
  dateTime: string;
  recurrence?: string;
  enabled: boolean;
  createdAt: string;
}

export interface TimelineEvent {
  id: string;
  eventType: string;
  eventDate: string;
  [key: string]: any;
}

export interface DashboardData {
  today: {
    feeding: { count: number; totalMl: number; last: FeedingRecord | null };
    food: { count: number; last: FoodRecord | null };
    diaper: { peeCount: number; poopCount: number; total: number; lastPee: DiaperRecord | null; lastPoop: DiaperRecord | null };
    sleep: { totalMinutes: number; count: number; last: SleepRecord | null; activeSleep: SleepRecord | null };
    bath: { count: number; last: BathRecord | null };
    temperature: TemperatureRecord | null;
    weight: WeightRecord | null;
  };
  upcomingReminders: Reminder[];
}

export type RecordType = 'feeding' | 'food' | 'diaper' | 'sleep' | 'bath' | 'temperature' | 'weight' | 'medication' | 'note';
