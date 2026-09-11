import { format, formatDistanceToNow, differenceInMonths, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function formatDate(date: string | Date): string {
  return format(new Date(date), "dd/MM/yyyy", { locale: ptBR });
}

export function formatTime(date: string | Date): string {
  return format(new Date(date), "HH:mm", { locale: ptBR });
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
}

export function formatTimeAgo(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ptBR });
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

export function getChildAge(birthDate: string): string {
  const birth = new Date(birthDate);
  const now = new Date();
  const months = differenceInMonths(now, birth);
  const days = differenceInDays(now, birth);

  if (months < 1) return `${days} dias`;
  if (months < 12) return `${months} ${months === 1 ? 'mês' : 'meses'}`;
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (remainingMonths === 0) return `${years} ${years === 1 ? 'ano' : 'anos'}`;
  return `${years} ${years === 1 ? 'ano' : 'anos'} e ${remainingMonths} ${remainingMonths === 1 ? 'mês' : 'meses'}`;
}

export function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia!';
  if (h < 18) return 'Boa tarde!';
  return 'Boa noite!';
}

export function getEventEmoji(type: string): string {
  const emojis: Record<string, string> = {
    feeding: '🍼',
    food: '🍎',
    diaper: '🧷',
    sleep: '😴',
    bath: '🛁',
    temperature: '🌡️',
    weight: '⚖️',
    medication: '💊',
    note: '📝',
  };
  return emojis[type] || '📋';
}

export function getEventLabel(type: string): string {
  const labels: Record<string, string> = {
    feeding: 'Mamou',
    food: 'Alimentação',
    diaper: 'Fralda',
    sleep: 'Sono',
    bath: 'Banho',
    temperature: 'Temperatura',
    weight: 'Peso',
    medication: 'Medicamento',
    note: 'Observação',
  };
  return labels[type] || type;
}

export function getEventColor(type: string): string {
  const colors: Record<string, string> = {
    feeding: 'var(--color-feeding)',
    food: 'var(--color-food)',
    diaper: 'var(--color-diaper-pee)',
    sleep: 'var(--color-sleep)',
    bath: 'var(--color-bath)',
    temperature: 'var(--color-temp)',
    weight: 'var(--color-weight)',
    medication: 'var(--color-medicine)',
    note: 'var(--color-note)',
  };
  return colors[type] || 'var(--color-text-secondary)';
}

export function getEventBg(type: string): string {
  const bgs: Record<string, string> = {
    feeding: 'var(--color-feeding-bg)',
    food: 'var(--color-food-bg)',
    diaper: 'var(--color-diaper-pee-bg)',
    sleep: 'var(--color-sleep-bg)',
    bath: 'var(--color-bath-bg)',
    temperature: 'var(--color-temp-bg)',
    weight: 'var(--color-weight-bg)',
    medication: 'var(--color-medicine-bg)',
    note: 'var(--color-note-bg)',
  };
  return bgs[type] || 'var(--color-bg-input)';
}

export function nowISO(): string {
  const now = new Date();
  const tzOffset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - tzOffset).toISOString().slice(0, 16);
}

export function todayISO(): string {
  const now = new Date();
  const tzOffset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - tzOffset).toISOString().split('T')[0];
}

export function utcToLocalString(utcDateStr: string): string {
  if (!utcDateStr) return '';
  const date = new Date(utcDateStr);
  const tzOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
}

export function localToUTC(localDateStr: string): string {
  if (!localDateStr) return '';
  return new Date(localDateStr).toISOString();
}
