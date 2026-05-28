// --- Types de base ---
export interface Testimonial {
  id: number;
  rating: number;
  author_name: string;
  author_title: string;
  author_company: string;
  content: string;
  image_url?: string; // Uniformisé
  is_approved: boolean;
  is_featured: boolean;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  is_active: boolean;
  is_admin: boolean;
  is_superadmin: boolean;
  created_at: string;
}

export interface Domain { 
  id: number; 
  name: string; 
  slug: string; 
  description: string; 
  icon: string; 
  order: number; 
  is_active: boolean; 
}

// --- LMS / Trainings ---
export interface Module {
  id: number;
  training_id: number;
  title: string;
  order: number;
  content_text?: string;
  video_url?: string;
  exercise_content?: string;
  unlock_condition: 'none' | 'previous_completed';
}

export interface Training {
  id: number;
  title: string;
  slug: string;
  description: string;
  full_content?: string;
  duration?: string;
  price?: number;
  image_url?: string;
  domain_id?: number;
  domain?: Domain;
  modules: Module[];
  enrollments_count?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// --- Modèles enrichis ---
export interface Service { 
  id: number; 
  title: string; 
  slug: string; 
  description: string; 
  full_content?: string; 
  icon: string; 
  order: number; 
  is_active: boolean; 
}

export interface Partner { 
  id: number; 
  name: string; 
  logo_url: string; 
  website?: string; 
}

export interface Expert { 
  id: number; 
  first_name: string; 
  last_name: string; 
  role: string; 
  title?: string; 
  bio: string; 
  image_url?: string; // Uniformisé (suppression de photo_url)
}

export interface News { 
  id: number; 
  title: string; 
  slug: string; 
  content: string; 
  excerpt?: string; 
  image_url?: string; 
  created_at: string; 
  published_at?: string; 
  is_published: boolean; 
}

export interface ContactMessage { 
  id: number; 
  name: string; 
  email: string; 
  subject?: string; 
  message: string; 
  phone?: string; 
  is_read: boolean; 
  created_at: string; 
}

export interface ServiceRequest { 
  id: number; 
  service_id: number; 
  contact_name: string; 
  contact_email: string; 
  contact_phone?: string; 
  company?: string; 
  message: string; 
  status: string; 
}

export interface DashboardStats {
  total_users: number;
  total_trainings: number;
  total_services: number;
  total_testimonials: number;
  total_partners: number;
  pending_requests: number;
  recent_enrollments: number;
}

export interface ModuleProgress {
  id: number;
  module_id: number;
  is_completed: boolean;
  completed_at?: string;
}

export interface Enrollment {
  id: number;
  user_id: number;
  training_id: number;
  status: 'active' | 'completed' | 'suspended';
  progress_percent: number;
  enrolled_at: string;
  completed_at?: string;
  training: Training;
}

export interface Expert {
  id: number;
  name: string;
  title?: string;
  photo_url?: string;
}