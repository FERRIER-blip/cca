from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db

# --- CORRECTION DES IMPORTS ---
from app.models.models import Partner as PartnerModel
from app.schemas.schemas import PartnerCreate, PartnerUpdate, Partner as PartnerSchema
# ------------------------------

from app.api.auth import get_current_admin

router = APIRouter(prefix="/partners", tags=["Partners"])


@router.get("/", response_model=List[PartnerSchema])
def get_partners(db: Session = Depends(get_db)):
    # ✅ Utilisation de PartnerModel pour SQLAlchemy
    partners = db.query(PartnerModel).filter(PartnerModel.is_active == True).order_by(PartnerModel.order).all()
    return partners


@router.get("/all", response_model=List[PartnerSchema])
def get_all_partners(admin=Depends(get_current_admin), db: Session = Depends(get_db)):
    # ✅ Utilisation de PartnerModel
    partners = db.query(PartnerModel).order_by(PartnerModel.order).all()
    return partners


@router.post("/", response_model=PartnerSchema)
def create_partner(
    partner_data: PartnerCreate,
    admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    # ✅ Création de l'instance avec le modèle de DB
    db_partner = PartnerModel(**partner_data.dict())
    db.add(db_partner)
    db.commit()
    db.refresh(db_partner)
    return db_partner


@router.put("/{partner_id}", response_model=PartnerSchema)
def update_partner(
    partner_id: int,
    partner_data: PartnerUpdate,
    admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    # ✅ Recherche avec PartnerModel
    partner = db.query(PartnerModel).filter(PartnerModel.id == partner_id).first()
    if not partner:
        raise HTTPException(status_code=404, detail="Partner not found")
    
    update_data = partner_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(partner, field, value)
    
    db.commit()
    db.refresh(partner)
    return partner


@router.delete("/{partner_id}")
def delete_partner(
    partner_id: int,
    admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    # ✅ Suppression avec PartnerModel
    partner = db.query(PartnerModel).filter(PartnerModel.id == partner_id).first()
    if not partner:
        raise HTTPException(status_code=404, detail="Partner not found")
    
    db.delete(partner)
    db.commit()
    return {"message": "Partner deleted successfully"}