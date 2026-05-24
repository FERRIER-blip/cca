from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db

from app.models.models import Service as ServiceModel 
from app.schemas.schemas import ServiceCreate, ServiceUpdate, Service as ServiceSchema
from app.api.auth import get_current_admin

# Note: Pas de slash final dans le préfixe
router = APIRouter(prefix="/services", tags=["Services"])

# --- 1. ROUTES FIXES (Toujours en premier) ---

@router.get("/", response_model=List[ServiceSchema])
def get_services(db: Session = Depends(get_db)):
    return db.query(ServiceModel).filter(ServiceModel.is_active == True).order_by(ServiceModel.order).all()

@router.get("/all", response_model=List[ServiceSchema])
def get_all_services(admin=Depends(get_current_admin), db: Session = Depends(get_db)):
    return db.query(ServiceModel).order_by(ServiceModel.order).all()

# --- 2. ACTIONS DE CRÉATION ET MODIFICATION ---

@router.post("/", response_model=ServiceSchema, status_code=status.HTTP_201_CREATED)
def create_service(
    service_data: ServiceCreate,
    admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    # Vérification du slug unique
    existing = db.query(ServiceModel).filter(ServiceModel.slug == service_data.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Ce slug est déjà utilisé")
    
    db_service = ServiceModel(**service_data.dict())
    db.add(db_service)
    db.commit()
    db.refresh(db_service)
    return db_service

@router.put("/{service_id}", response_model=ServiceSchema)
def update_service(
    service_id: int, # On force le type int pour le distinguer du slug
    service_data: ServiceUpdate,
    admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    service = db.query(ServiceModel).filter(ServiceModel.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service introuvable")
    
    update_data = service_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(service, field, value)
    
    db.commit()
    db.refresh(service)
    return service

@router.delete("/{service_id}")
def delete_service(
    service_id: int,
    admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    service = db.query(ServiceModel).filter(ServiceModel.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service introuvable")
    
    db.delete(service)
    db.commit()
    return {"message": "Service supprimé avec succès"}

# --- 3. ROUTES DYNAMIQUES (Toujours en dernier) ---

@router.get("/{slug}", response_model=ServiceSchema)
def get_service_by_slug(slug: str, db: Session = Depends(get_db)):
    # On cherche d'abord par slug
    service = db.query(ServiceModel).filter(ServiceModel.slug == slug).first()
    
    # Si non trouvé et que c'est un chiffre, on essaie par ID
    if not service and slug.isdigit():
        service = db.query(ServiceModel).filter(ServiceModel.id == int(slug)).first()

    if not service:
        raise HTTPException(status_code=404, detail=f"Service '{slug}' introuvable")
    return service