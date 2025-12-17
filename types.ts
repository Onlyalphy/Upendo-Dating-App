export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Transgender = 'Transgender'
}

export enum ViewState {
  Landing = 'Landing',
  Onboarding = 'Onboarding',
  Dashboard = 'Dashboard',
  Chat = 'Chat',
  Profile = 'Profile'
}

export interface UserProfile {
  id: string;
  name: string; // Real name
  email: string;
  phone: string;
  age: number;
  gender: Gender;
  interestedIn: Gender[];
  county: string;
  town: string;
  bio: string;
  idPhoto: File | null; // For verification
  isVerified: boolean;
  avatarUrl: string;
}

export interface MatchProfile {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  county: string;
  town: string;
  bio: string;
  imageUrl: string;
  isOnline: boolean;
  distanceKm: number;
}

export interface Message {
  id: string;
  senderId: string; // 'me' or matchId
  text: string;
  timestamp: Date;
}

export interface ChatSession {
  matchId: string;
  messages: Message[];
  lastMessagePreview: string;
  unreadCount: number;
}