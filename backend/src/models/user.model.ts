// src/models/user.model.ts

export type UserRole = 'admin' | 'dsc_member' | 'supervisor' | 'co_supervisor' | 'student';

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

export interface UserLoginDTO {
  email: string;
  password: string;
}

export interface UserCreateDTO {
  email: string;
  name: string;
  password: string;
  role: UserRole;
  universityId?: string; // Optional, for student users
}
