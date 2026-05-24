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
    # Correction : Suppression du filtre is_active s'il n'existe pas dans le modèle
    return db.query(TestimonialModel).all()

@router.get("/featured", response_model=List[TestimonialSchema])
def get_featured_testimonials(db: Session = Depends(get_db)):
    # Correction : Si is_active et is_featured n'existent pas, 
    # on retourne tous les témoignages ou on adapte selon vos colonnes réelles
    return db.query(TestimonialModel).all()

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

    # Ajoute ceci à la fin de ton fichier testimonials.py
@router.put("/{testimonial_id}", response_model=TestimonialSchema)
def update_testimonial(
    testimonial_id: int,
    update_data: dict, # On accepte un dictionnaire partiel
    admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    testimonial = db.query(TestimonialModel).filter(TestimonialModel.id == testimonial_id).first()
    if not testimonial:
        raise HTTPException(status_code=404, detail="Témoignage introuvable")
    
    # Mise à jour dynamique des champs (is_approved, is_featured, etc.)
    for key, value in update_data.items():
        setattr(testimonial, key, value)
    
    db.commit()
    db.refresh(testimonial)
    return testimonial