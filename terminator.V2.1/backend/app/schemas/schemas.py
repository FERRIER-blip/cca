from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


# User schemas
class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    phone: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None


class User(UserBase):
    id: int
    is_active: bool
    is_admin: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str
    user: User


# Expert schemas
class ExpertBase(BaseModel):
    first_name: str
    last_name: str
    title: str
    bio: str
    photo_url: Optional[str] = None
    specialties: str
    is_active: bool = True


class ExpertCreate(ExpertBase):
    pass


class ExpertUpdate(ExpertBase):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    title: Optional[str] = None
    bio: Optional[str] = None
    photo_url: Optional[str] = None
    specialties: Optional[str] = None
    is_active: Optional[bool] = None


class Expert(ExpertBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


# Service schemas
class ServiceBase(BaseModel):
    title: str
    slug: str
    description: str
    full_content: Optional[str] = None
    icon: str = "briefcase"
    image_url: Optional[str] = None
    order: int = 0
    is_active: bool = True


class ServiceCreate(ServiceBase):
    pass


class ServiceUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    full_content: Optional[str] = None
    icon: Optional[str] = None
    image_url: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None


class Service(ServiceBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# Domain schemas
class DomainBase(BaseModel):
    name: str
    slug: str
    description: str
    icon: str = "folder"
    order: int = 0
    is_active: bool = True


class DomainCreate(DomainBase):
    pass


class DomainUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None


class Domain(DomainBase):
    id: int
    
    class Config:
        from_attributes = True


# Training schemas
class TrainingBase(BaseModel):
    title: str
    slug: str
    description: str
    full_content: Optional[str] = None
    duration: Optional[str] = None
    price: Optional[float] = None
    image_url: Optional[str] = None
    video_url: Optional[str] = None
    document_url: Optional[str] = None
    domain_id: Optional[int] = None
    is_active: bool = True


class TrainingCreate(TrainingBase):
    pass


class TrainingUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    full_content: Optional[str] = None
    duration: Optional[str] = None
    price: Optional[float] = None
    image_url: Optional[str] = None
    video_url: Optional[str] = None
    document_url: Optional[str] = None
    domain_id: Optional[int] = None
    is_active: Optional[bool] = None


class Training(TrainingBase):
    id: int
    created_at: datetime
    updated_at: datetime
    domain: Optional[Domain] = None
    
    class Config:
        from_attributes = True


# Enrollment schemas
class EnrollmentBase(BaseModel):
    training_id: int
    status: str = "pending"
    progress: int = 0


class EnrollmentCreate(EnrollmentBase):
    pass


class Enrollment(EnrollmentBase):
    id: int
    user_id: int
    enrolled_at: datetime
    completed_at: Optional[datetime] = None
    training: Training
    
    class Config:
        from_attributes = True


# Testimonial schemas
class TestimonialBase(BaseModel):
    author_name: str
    author_title: Optional[str] = None
    author_company: Optional[str] = None
    content: str
    rating: int = 5
    photo_url: Optional[str] = None
    is_featured: bool = False


class TestimonialCreate(TestimonialBase):
    pass


class TestimonialUpdate(BaseModel):
    author_name: Optional[str] = None
    author_title: Optional[str] = None
    author_company: Optional[str] = None
    content: Optional[str] = None
    rating: Optional[int] = None
    photo_url: Optional[str] = None
    is_approved: Optional[bool] = None
    is_featured: Optional[bool] = None


class Testimonial(TestimonialBase):
    id: int
    user_id: Optional[int] = None
    is_approved: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


# Partner schemas
class PartnerBase(BaseModel):
    name: str
    logo_url: str
    website: Optional[str] = None
    order: int = 0
    is_active: bool = True


class PartnerCreate(PartnerBase):
    pass


class PartnerUpdate(BaseModel):
    name: Optional[str] = None
    logo_url: Optional[str] = None
    website: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None


class Partner(PartnerBase):
    id: int
    
    class Config:
        from_attributes = True


# News schemas
class NewsBase(BaseModel):
    title: str
    slug: str
    excerpt: str
    content: str
    image_url: Optional[str] = None
    is_published: bool = False


class NewsCreate(NewsBase):
    pass


class NewsUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    image_url: Optional[str] = None
    is_published: Optional[bool] = None


class News(NewsBase):
    id: int
    published_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# Service Request schemas
class ServiceRequestBase(BaseModel):
    service_id: Optional[int] = None
    contact_name: str
    contact_email: EmailStr
    contact_phone: Optional[str] = None
    company: Optional[str] = None
    message: str


class ServiceRequestCreate(ServiceRequestBase):
    pass


class ServiceRequest(ServiceRequestBase):
    id: int
    user_id: Optional[int] = None
    status: str
    created_at: datetime
    updated_at: datetime
    service: Optional[Service] = None
    
    class Config:
        from_attributes = True


# Video schemas
class VideoBase(BaseModel):
    title: str
    description: Optional[str] = None
    video_url: str
    thumbnail_url: Optional[str] = None
    is_featured: bool = False
    order: int = 0
    is_active: bool = True


class VideoCreate(VideoBase):
    pass


class VideoUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    video_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    is_featured: Optional[bool] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None


class Video(VideoBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


# Contact Message schemas
class ContactMessageBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    subject: str
    message: str


class ContactMessageCreate(ContactMessageBase):
    pass


class ContactMessage(ContactMessageBase):
    id: int
    is_read: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


# Dashboard stats
class DashboardStats(BaseModel):
    total_users: int
    total_trainings: int
    total_services: int
    total_testimonials: int
    total_partners: int
    pending_requests: int
    recent_enrollments: int
