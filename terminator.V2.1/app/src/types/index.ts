// User types
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

// Service types
export interface Service {
  id: number;
  title: string;
  slug: string;
  description: string;
  full_content?: string;
  icon: string;
  image_url?: string;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Training types
export interface Training {
  id: number;
  title: string;
  slug: string;
  description: string;
  full_content?: string;
  duration?: string;
  price?: number;
  image_url?: string;
  video_url?: string;
  document_url?: string;
  domain_id?: number;
  domain?: Domain;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Enrollment {
  id: number;
  user_id: number;
  training_id: number;
  status: string;
  progress: number;
  enrolled_at: string;
  completed_at?: string;
  training: Training;
}

// Domain types
export interface Domain {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  order: number;
  is_active: boolean;
}

// Expert types
export interface Expert {
  id: number;
  first_name: string;
  last_name: string;
  title: string;
  bio: string;
  photo_url?: string;
  specialties: string;
  is_active: boolean;
  created_at: string;
}

// Testimonial types
export interface Testimonial {
  id: number;
  user_id?: number;
  author_name: string;
  author_title?: string;
  author_company?: string;
  content: string;
  rating: number;
  photo_url?: string;
  is_approved: boolean;
  is_featured: boolean;
  created_at: string;
}

// Partner types
export interface Partner {
  id: number;
  name: string;
  logo_url: string;
  website?: string;
  order: number;
  is_active: boolean;
}

// News types
export interface News {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url?: string;
  is_published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

// Video types
export interface Video {
  id: number;
  title: string;
  description?: string;
  video_url: string;
  thumbnail_url?: string;
  is_featured: boolean;
  order: number;
  is_active: boolean;
  created_at: string;
}

// Contact types
export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface ServiceRequest {
  id: number;
  user_id?: number;
  service_id?: number;
  service?: Service;
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
  company?: string;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
}

// Dashboard types
export interface DashboardStats {
  total_users: number;
  total_trainings: number;
  total_services: number;
  total_testimonials: number;
  total_partners: number;
  pending_requests: number;
  recent_enrollments: number;
}

export interface Activity {
  type: string;
  description: string;
  date: string;
}
