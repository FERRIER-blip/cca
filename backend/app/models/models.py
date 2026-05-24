from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, Text, DateTime, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
from datetime import datetime

# --- TABLES D'ASSOCIATION ---

expert_domains = Table(
    'expert_domains',
    Base.metadata,
    Column('expert_id', Integer, ForeignKey('experts.id', ondelete="CASCADE")),
    Column('domain_id', Integer, ForeignKey('domains.id', ondelete="CASCADE"))
)

# --- MODÈLES ---

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    first_name = Column(String)
    last_name = Column(String)
    hashed_password = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    is_superadmin = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    enrollments = relationship("Enrollment", back_populates="user")

class Domain(Base):
    __tablename__ = "domains"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    slug = Column(String, unique=True, index=True)
    description = Column(Text)
    icon = Column(String, default="folder")
    order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)

    trainings = relationship("Training", back_populates="domain")

class Training(Base):
    __tablename__ = "trainings"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    slug = Column(String, unique=True, index=True)
    description = Column(Text)
    full_content = Column(Text, nullable=True)
    duration = Column(String, nullable=True)
    price = Column(Float, default=0.0)
    image_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

    domain_id = Column(Integer, ForeignKey("domains.id"))
    domain = relationship("Domain", back_populates="trainings")
    modules = relationship("Module", back_populates="training", cascade="all, delete-orphan")
    enrollments = relationship("Enrollment", back_populates="training")

class Module(Base):
    __tablename__ = "modules"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    order = Column(Integer, default=1)
    content_text = Column(Text, nullable=True)
    video_url = Column(String, nullable=True)
    exercise_content = Column(Text, nullable=True)
    unlock_condition = Column(String, default="previous_completed")
    
    training_id = Column(Integer, ForeignKey("trainings.id"))
    training = relationship("Training", back_populates="modules")
    user_progress = relationship("UserModuleProgress", back_populates="module")

class UserModuleProgress(Base):
    """C'est cette classe qu'il manquait !"""
    __tablename__ = "user_module_progress"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    module_id = Column(Integer, ForeignKey("modules.id"))
    is_completed = Column(Boolean, default=False)
    completed_at = Column(DateTime(timezone=True), nullable=True)

    module = relationship("Module", back_populates="user_progress")

class Enrollment(Base):
    __tablename__ = "enrollments"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    training_id = Column(Integer, ForeignKey("trainings.id"))
    status = Column(String, default="active")
    progress_percent = Column(Float, default=0.0)
    enrolled_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)

    user = relationship("User", back_populates="enrollments")
    training = relationship("Training", back_populates="enrollments")

class Service(Base):
    __tablename__ = "services"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    slug = Column(String, unique=True, index=True)
    description = Column(Text)
    full_content = Column(Text, nullable=True)
    icon = Column(String, default="briefcase")
    image_url = Column(String, nullable=True)
    order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ServiceRequest(Base):
    __tablename__ = "service_requests"
    id = Column(Integer, primary_key=True, index=True)
    service_id = Column(Integer, ForeignKey("services.id"), nullable=True)
    contact_name = Column(String)
    contact_email = Column(String)
    message = Column(Text)
    status = Column(String, default="pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Expert(Base):
    __tablename__ = "experts"  # <--- CETTE LIGNE EST MANQUANTE OU MAL ÉCRITE

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)  # On garde 'name' puisque c'est ce que tu as configuré
    title = Column(String)
    bio = Column(Text)
    specialties = Column(String)

class Partner(Base):
    __tablename__ = "partners"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    logo_url = Column(String, nullable=True)
    # Harmonisé avec le schéma (on utilise website_url partout)
    website = Column(String, nullable=True) 
    # Ajouté pour correspondre à ton API
    is_active = Column(Boolean, default=True)
    # Ajouté pour correspondre à ton API
    order = Column(Integer, default=0)
    # Ajouté pour correspondre à ton Schéma
    created_at = Column(DateTime, default=datetime.utcnow)

class Testimonial(Base):
    __tablename__ = "testimonials"
    id = Column(Integer, primary_key=True, index=True)
    author_name = Column(String)
    author_title = Column(String)
    author_company = Column(String)
    content = Column(Text)
    rating = Column(Integer)
    is_approved = Column(Boolean, default=False)
    is_featured = Column(Boolean, default=False)

    # --- NEWS & CONTACT SCHEMAS ---

# --- NEWS MODEL ---
class News(Base):
    __tablename__ = "news"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    slug = Column(String, unique=True, index=True)
    excerpt = Column(Text)  # <--- Vérifie si cette ligne existe ou si elle s'appelle autrement (ex: summary)
    content = Column(Text)
    is_published = Column(Boolean, default=False)
    published_at = Column(DateTime, default=datetime.utcnow)

# --- CONTACT MODEL ---
class ContactMessage(Base):
    __tablename__ = "contacts" # INDISPENSABLE
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String)
    subject = Column(String)
    message = Column(Text)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())