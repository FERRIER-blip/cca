from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db

# --- UTILISATION DES ALIAS POUR ÉVITER LE CONFLIT ---
from app.models.models import Testimonial as TestimonialModel
from app.schemas.schemas import TestimonialCreate, Testimonial as TestimonialSchema
# ---------------------------------------------------

from app.api.auth import get_current_admin

router = APIRouter(prefix="/testimonials", tags=["Testimonials"])

@router.get("/", response_model=List[TestimonialSchema])
def get_testimonials(db: Session = Depends(get_db)):
    results = db.query(TestimonialModel).all()
    # On s'assure que created_at existe pour éviter la ResponseValidationError
    for item in results:
        if not hasattr(item, 'created_at') or item.created_at is None:
            item.created_at = None
    return results

@router.get("/featured", response_model=List[TestimonialSchema])
def get_featured_testimonials(db: Session = Depends(get_db)):
    # Filtrage par is_featured si la colonne existe, sinon retourne tout
    results = db.query(TestimonialModel).filter(TestimonialModel.is_featured == True).all()
    for item in results:
        if not hasattr(item, 'created_at') or item.created_at is None:
            item.created_at = None
    return results

@router.post("/", response_model=TestimonialSchema)
def create_testimonial(
    testimonial_data: TestimonialCreate,
    admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    db_testimonial = TestimonialModel(**testimonial_data.dict())
    db.add(db_testimonial)
    db.commit()
    db.refresh(db_testimonial)
    return db_testimonial

@router.delete("/{testimonial_id}")
def delete_testimonial(
    testimonial_id: int,
    admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    testimonial = db.query(TestimonialModel).filter(TestimonialModel.id == testimonial_id).first()
    if not testimonial:
        raise HTTPException(status_code=404, detail="Témoignage introuvable")
    db.delete(testimonial)
    db.commit()
    return {"message": "Témoignage supprimé"}

@router.put("/{testimonial_id}", response_model=TestimonialSchema)
def update_testimonial(
    testimonial_id: int,
    update_data: dict, 
    admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    testimonial = db.query(TestimonialModel).filter(TestimonialModel.id == testimonial_id).first()
    if not testimonial:
        raise HTTPException(status_code=404, detail="Témoignage introuvable")
    
    # Mise à jour dynamique
    for key, value in update_data.items():
        if hasattr(testimonial, key):
            setattr(testimonial, key, value)
    
    db.commit()
    db.refresh(testimonial)
    
    # Sécurité anti-crash : on garantit que l'objet renvoyé a un created_at (même None)
    if not hasattr(testimonial, 'created_at') or testimonial.created_at is None:
        testimonial.created_at = None
        
    return testimonial