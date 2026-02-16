
export enum UserRole {
  VISITOR = 'VISITOR',
  MEMBER = 'MEMBER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

export enum MembershipPlan {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM',
  VIP = 'VIP'
}

export interface User {
  id: string;
  email: string;
  name: string;
  nickname: string;
  role: UserRole;
  membershipPlan: MembershipPlan;
  motorcycleModel: string;
  experienceLevel: 'Novice' | 'Intermediate' | 'Expert' | 'Veteran';
  avatar: string;
  bio: string;
  points: number;
  badges: string[];
}

export interface RideEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  participants: number;
  limit: number;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  description: string;
  image: string;
}

export interface MapMarker {
  id: string;
  type: 'Rider' | 'Event' | 'Shop' | 'Cafe' | 'Hazard';
  lat: number;
  lng: number;
  title: string;
  description?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'EVENT' | 'SYSTEM' | 'INVITE' | 'ALERT';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}
