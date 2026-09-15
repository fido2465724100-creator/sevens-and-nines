import { CardBackStyle } from '../engine/types';

export interface CardBackOption {
  id: CardBackStyle;
  nameRu: string;
  nameEn: string;
  description: string;
  primaryColor: string;
  accentColor: string;
}

export const CARD_BACK_OPTIONS: CardBackOption[] = [
  {
    id: 'classic-blue',
    nameRu: 'Классическая синяя',
    nameEn: 'Classic Blue',
    description: 'Традиционный сапфировый орнамент с филигранью',
    primaryColor: '#1e3a8a',
    accentColor: '#60a5fa',
  },
  {
    id: 'classic-red',
    nameRu: 'Классическая красная',
    nameEn: 'Classic Red',
    description: 'Винтажный рубиновый геометрический узор',
    primaryColor: '#991b1b',
    accentColor: '#f87171',
  },
  {
    id: 'soviet-atlas',
    nameRu: 'Советская «Атласная»',
    nameEn: 'Soviet Satin',
    description: 'Ностальгический узор классических карт СССР',
    primaryColor: '#831843',
    accentColor: '#f472b6',
  },
  {
    id: 'royal-gold',
    nameRu: 'Золото на черном',
    nameEn: 'Royal Gold & Black',
    description: 'Роскошный золотой орнамент на черном бархате',
    primaryColor: '#18181b',
    accentColor: '#fbbf24',
  },
  {
    id: 'emerald',
    nameRu: 'Изумрудный дракон',
    nameEn: 'Emerald Dragon',
    description: 'Благородный изумрудный кельтский орнамент',
    primaryColor: '#064e3b',
    accentColor: '#34d399',
  },
  {
    id: 'cyber-neon',
    nameRu: 'Киберпанк Неон',
    nameEn: 'Cyber Neon',
    description: 'Футуристические неоновые микросхемы',
    primaryColor: '#0f172a',
    accentColor: '#06b6d4',
  },
  {
    id: 'wood-vintage',
    nameRu: 'Винтажное дерево',
    nameEn: 'Rustic Wood',
    description: 'Теплая текстура резного дуба с гравировкой',
    primaryColor: '#451a03',
    accentColor: '#d97706',
  },
  {
    id: 'galaxy',
    nameRu: 'Космос / Туманность',
    nameEn: 'Cosmic Nebula',
    description: 'Глубокий космос со звездным сиянием',
    primaryColor: '#311042',
    accentColor: '#a855f7',
  },
];
