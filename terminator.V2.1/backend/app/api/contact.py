from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db

# --- CORRECTION DES IMPORTS (Double alias conservé) ---
from app.models.models import (
    ContactMessage as ContactMessageModel, 
    ServiceRequest as ServiceRequestModel
)
from app.schemas.schemas import (
    ContactMessageCreate, 
    ContactMessage as ContactMessageSchema, 
    ServiceRequestCreate, 
    ServiceRequest as ServiceRequestSchema
)
# ---------------------------------------------

from app.api.auth import get_current_user, get_current_admin

router = APIRouter(prefix="/contact", tags=["Contact"])

# --- MESSAGES DE CONTACT ---

@router.post("/message", response_model=ContactMessageSchema)
def send_message(message_data: ContactMessageCreate, db: Session = Depends(get_db)):
    db_message = ContactMessageModel(**message_data.dict())
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

@router.get("/messages", response_model=List[ContactMessageSchema])
def get_messages(admin=Depends(get_current_admin), db: Session = Depends(get_db)):
    return db.query(ContactMessageModel).order_by(ContactMessageModel.created_at.desc()).all()

# ✅ AJOUT : Marquer un message comme lu
@router.put("/messages/{message_id}/read", response_model=ContactMessageSchema)
def mark_message_as_read(message_id: int, admin=Depends(get_current_admin), db: Session = Depends(get_db)):
    message = db.query(ContactMessageModel).filter(ContactMessageModel.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Message introuvable")
    message.is_read = True
    db.commit()
    db.refresh(message)
    return message

# ✅ AJOUT : Supprimer un message (Le bouton qui ne répondait pas)
@router.delete("/messages/{message_id}")
def delete_message(message_id: int, admin=Depends(get_current_admin), db: Session = Depends(get_db)):
    message = db.query(ContactMessageModel).filter(ContactMessageModel.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Message introuvable")
    db.delete(message)
    db.commit()
    return {"message": "Message supprimé avec succès"}


# --- DEMANDES DE SERVICES ---

@router.post("/service-request", response_model=ServiceRequestSchema)
def create_service_request(
    request_data: ServiceRequestCreate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_request = ServiceRequestModel(**request_data.dict(), user_id=current_user.id)
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request

@router.get("/service-requests", response_model=List[ServiceRequestSchema])
def get_service_requests(admin=Depends(get_current_admin), db: Session = Depends(get_db)):
    return db.query(ServiceRequestModel).order_by(ServiceRequestModel.created_at.desc()).all()

@router.put("/service-requests/{request_id}", response_model=ServiceRequestSchema)
def update_service_request(
    request_id: int,
    status: str,
    admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    request = db.query(ServiceRequestModel).filter(ServiceRequestModel.id == request_id).first()
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
    
    request.status = status
    db.commit()
    db.refresh(request)
    return request

# ✅ AJOUT OPTIONNEL : Supprimer une requête de service
@router.delete("/service-requests/{request_id}")
def delete_service_request(request_id: int, admin=Depends(get_current_admin), db: Session = Depends(get_db)):
    request = db.query(ServiceRequestModel).filter(ServiceRequestModel.id == request_id).first()
    if not request:
        raise HTTPException(status_code=404, detail="Requête introuvable")
    db.delete(request)
    db.commit()
    return {"message": "Requête supprimée"}