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
    # ✅ Correction : On retire le filtre is_active s'il n'existe pas en base
    query = db.query(PartnerModel)
    
    # ✅ On ne trie par 'order' que si la colonne existe
    if hasattr(PartnerModel, 'order'):
        query = query.order_by(PartnerModel.order)
        
    return query.all()


@router.get("/all", response_model=List[PartnerSchema])
def get_all_partners(admin=Depends(get_current_admin), db: Session = Depends(get_db)):
    query = db.query(PartnerModel)
    
    if hasattr(PartnerModel, 'order'):
        query = query.order_by(PartnerModel.order)
        
    return query.all()


@router.post("/", response_model=PartnerSchema)
def create_partner(
    partner_data: PartnerCreate,
    admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
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
    partner = db.query(PartnerModel).filter(PartnerModel.id == partner_id).first()
    if not partner:
        raise HTTPException(status_code=404, detail="Partner not found")
    
    update_data = partner_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        # ✅ Sécurité : on ne met à jour que si le champ existe dans le modèle
        if hasattr(partner, field):
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
    partner = db.query(PartnerModel).filter(PartnerModel.id == partner_id).first()
    if not partner:
        raise HTTPException(status_code=404, detail="Partner not found")
    
    db.delete(partner)
    db.commit()
    return {"message": "Partner deleted successfully"}