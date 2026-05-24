// User types
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  is_active: boolean;
  is_admin: boolean;
  is_superadmin: boolean; // Ajouté pour la gestion d'équipe
  created_at: string;
}

// Module types (Nouveau pour le LMS)
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

export interface ModuleProgress {
  id: number;
  module_id: number;
  is_completed: boolean;
  completed_at?: string;
}

// Training types (Mise à jour)
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
  modules: Module[]; // Liste des chapitres
  enrollments_count?: number; // Pour l'admin
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Enrollment {
  id: number;
  user_id: number;
  training_id: number;
  status: 'active' | 'completed' | 'suspended';
  progress_percent: number; // On utilise le % calculé par le backend
  enrolled_at: string;
  completed_at?: string;
  training: Training;
}

// Les autres types (Service, Expert, Testimonial, etc.) restent identiques
export interface Domain { id: number; name: string; slug: string; description: string; icon: string; order: number; is_active: boolean; }
export interface Service { id: number; title: string; slug: string; description: string; icon: string; order: number; is_active: boolean; }
export interface DashboardStats {
  total_users: number;
  total_trainings: number;
  total_services: number;
  total_testimonials: number;
  total_partners: number;
  pending_requests: number;
  recent_enrollments: number;
}