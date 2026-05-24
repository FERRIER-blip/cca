from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db

# --- CORRECTION DES IMPORTS ---
from app.models.models import Expert as ExpertModel
from app.schemas.schemas import ExpertCreate, ExpertUpdate, Expert as ExpertSchema
# ------------------------------

from app.api.auth import get_current_admin

router = APIRouter(prefix="/experts", tags=["Experts"])


@router.get("/", response_model=List[ExpertSchema])
def get_experts(db: Session = Depends(get_db)):
    # ✅ Utilisation de ExpertModel
    experts = db.query(ExpertModel).filter(ExpertModel.is_active == True).all()
    return experts


@router.get("/all", response_model=List[ExpertSchema])
def get_all_experts(admin=Depends(get_current_admin), db: Session = Depends(get_db)):
    # ✅ Utilisation de ExpertModel
    experts = db.query(ExpertModel).all()
    return experts


@router.get("/{expert_id}", response_model=ExpertSchema)
def get_expert(expert_id: int, db: Session = Depends(get_db)):
    # ✅ Utilisation de ExpertModel
    expert = db.query(ExpertModel).filter(ExpertModel.id == expert_id).first()
    if not expert:
        raise HTTPException(status_code=404, detail="Expert not found")
    return expert


@router.post("/", response_model=ExpertSchema)
def create_expert(
    expert_data: ExpertCreate,
    admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    # ✅ Création avec ExpertModel
    db_expert = ExpertModel(**expert_data.dict())
    db.add(db_expert)
    db.commit()
    db.refresh(db_expert)
    return db_expert


@router.put("/{expert_id}", response_model=ExpertSchema)
def update_expert(
    expert_id: int,
    expert_data: ExpertUpdate,
    admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    # ✅ Recherche avec ExpertModel
    expert = db.query(ExpertModel).filter(ExpertModel.id == expert_id).first()
    if not expert:
        raise HTTPException(status_code=404, detail="Expert not found")
    
    update_data = expert_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(expert, field, value)
    
    db.commit()
    db.refresh(expert)
    return expert


@router.delete("/{expert_id}")
def delete_expert(
    expert_id: int,
    admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    # ✅ Recherche avec ExpertModel
    expert = db.query(ExpertModel).filter(ExpertModel.id == expert_id).first()
    if not expert:
        raise HTTPException(status_code=404, detail="Expert not found")
    
    db.delete(expert)
    db.commit()
    return {"message": "Expert deleted successfully"}