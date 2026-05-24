from typing import List, Optional, Union, Any, Dict
from pydantic import BaseModel, EmailStr, Field, field_validator
from datetime import datetime
import json

# --- UTILITAIRES ---
def decode_json_field(v):
    if isinstance(v, str):
        try:
            return json.loads(v)
        except json.JSONDecodeError:
            return v
    return v

# --- USER SCHEMAS ---
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
    is_admin: Optional[bool] = None
    is_superadmin: Optional[bool] = None

class User(UserBase):
    id: int
    is_active: bool
    is_admin: bool
    is_superadmin: bool
    created_at: datetime
    class Config:
        from_attributes = True

# --- EXPERT SCHEMAS ---
class ExpertBase(BaseModel):
    name: str
    role: str
    bio: str
    image_url: Optional[str] = None
    is_active: bool = True

class ExpertCreate(ExpertBase):
    pass

class ExpertUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    bio: Optional[str] = None
    image_url: Optional[str] = None
    is_active: Optional[bool] = None

class Expert(ExpertBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

# --- MODULE SCHEMAS ---
class ModuleBase(BaseModel):
    title: str
    order: int = 1
    content_text: Optional[str] = None
    video_url: Optional[str] = None
    exercise_content: Optional[str] = None
    unlock_condition: str = "previous_completed"

class ModuleCreate(ModuleBase):
    pass

class Module(ModuleBase):
    id: int
    training_id: int
    class Config:
        from_attributes = True

# --- PROGRESS SCHEMAS ---
class UserModuleProgressBase(BaseModel):
    module_id: int
    is_completed: bool = False

class UserModuleProgress(UserModuleProgressBase):
    id: int
    completed_at: Optional[datetime] = None
    class Config:
        from_attributes = True

# --- TRAINING SCHEMAS ---
class TrainingBase(BaseModel):
    title: str
    slug: str
    description: str
    full_content: Optional[str] = None
    duration: Optional[str] = None
    price: float = 0.0
    image_url: Optional[str] = None
    domain_id: Optional[int] = None
    is_active: bool = True

class TrainingCreate(TrainingBase):
    modules: Optional[Any] = []
    @field_validator('modules', mode='before')
    @classmethod
    def decode_modules_create(cls, v):
        return decode_json_field(v)

class TrainingUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    full_content: Optional[str] = None
    duration: Optional[str] = None
    price: Optional[float] = None
    image_url: Optional[str] = None
    domain_id: Optional[int] = None
    is_active: Optional[bool] = None
    modules: Optional[Any] = None 
    @field_validator('modules', mode='before')
    @classmethod
    def decode_modules_update(cls, v):
        return decode_json_field(v)
    class Config:
        from_attributes = True

class Training(TrainingBase):
    id: int
    created_at: datetime
    updated_at: datetime
    modules: List[Module] = []
    enrollments_count: Optional[int] = 0
    class Config:
        from_attributes = True

# --- SERVICE SCHEMAS ---
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
    class Config:
        from_attributes = True

# --- SERVICE REQUEST SCHEMAS ---
class ServiceRequestBase(BaseModel):
    service_id: Optional[int] = None
    contact_name: str
    contact_email: EmailStr
    message: str

class ServiceRequestCreate(ServiceRequestBase):
    pass

class ServiceRequest(ServiceRequestBase):
    id: int
    status: str = "pending"
    created_at: datetime
    service: Optional[Service] = None
    class Config:
        from_attributes = True

# --- PARTNER SCHEMAS ---
class PartnerBase(BaseModel):
    name: str
    # Optionnel car si un logo manque en base, Pydantic bloquera la réponse
    logo_url: Optional[str] = None 
    website: Optional[str] = None
    is_active: bool = True

class PartnerCreate(PartnerBase):
    pass

class PartnerUpdate(BaseModel):
    name: Optional[str] = None
    logo_url: Optional[str] = None
    website_url: Optional[str] = None
    is_active: Optional[bool] = None

class Partner(PartnerBase):
    id: int
    # La correction CRITIQUE : rendre la date optionnelle
    created_at: Optional[datetime] = None 
    
    class Config:
        from_attributes = True
# --- NEWS SCHEMAS ---
class NewsBase(BaseModel):
    title: str
    slug: str
    content: str
    image_url: Optional[str] = None
    is_active: bool = True

class NewsCreate(NewsBase):
    pass

class NewsUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    content: Optional[str] = None
    image_url: Optional[str] = None
    is_active: Optional[bool] = None

class News(NewsBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

# --- DOMAIN SCHEMAS ---
class DomainBase(BaseModel):
    name: str
    slug: str
    description: str
    icon: str = "folder"
    order: int = 0
    is_active: bool = True

class DomainCreate(DomainBase):
    pass

class Domain(DomainBase):
    id: int
    class Config:
        from_attributes = True

# --- TESTIMONIAL SCHEMAS ---
class TestimonialBase(BaseModel):
    author_name: str
    content: str
    rating: int = 5

class TestimonialCreate(TestimonialBase):
    pass

class Testimonial(TestimonialBase):
    id: int
    is_approved: bool = False
    created_at: Optional[datetime] = None
    class Config:
        from_attributes = True

# --- CONTACT SCHEMAS ---
class ContactMessageBase(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str

class ContactMessageCreate(ContactMessageBase):
    pass

class ContactMessage(ContactMessageBase):
    id: int
    is_read: bool = False
    created_at: datetime
    class Config:
        from_attributes = True

# --- ENROLLMENT SCHEMAS ---
class EnrollmentBase(BaseModel):
    training_id: int
    status: str = "active"

class EnrollmentCreate(EnrollmentBase):
    user_id: Optional[int] = None

class Enrollment(EnrollmentBase):
    id: int
    user_id: int
    progress_percent: float
    enrolled_at: datetime
    completed_at: Optional[datetime] = None
    training: Training
    user_name: Optional[str] = None
    class Config:
        from_attributes = True

# --- AUTH & DASHBOARD ---
class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

class DashboardStats(BaseModel):
    total_users: int
    total_trainings: int
    total_services: int
    total_testimonials: int
    total_partners: int
    pending_requests: int
    recent_enrollments: int

# --- REBUILD ---
TrainingCreate.model_rebuild()
TrainingUpdate.model_rebuild()
Training.model_rebuild()
ServiceRequest.model_rebuild()
Enrollment.model_rebuild()