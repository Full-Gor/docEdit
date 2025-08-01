export interface Template {
  id: string;
  title: string;
  description: string;
  category: TemplateCategory;
  icon: string;
  route: string;
  color: string;
}

export type TemplateCategory = 
  | 'institutional'
  | 'events'
  | 'hr'
  | 'internal'
  | 'marketing'
  | 'forms';

export interface Document {
  id: string;
  templateId: string;
  title: string;
  content: any;
  createdAt: Date;
  updatedAt: Date;
  status: DocumentStatus;
}

export type DocumentStatus = 'draft' | 'published' | 'archived';

export interface FormField {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'date' | 'email' | 'phone' | 'number';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  value?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
}

export type UserRole = 'admin' | 'manager' | 'employee';

export interface Event {
  id: string;
  title: string;
  date: Date;
  location: string;
  attendees: number;
  status: EventStatus;
}

export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled'; 