from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from typing import List, Optional
from app.db.database import get_db

# Modèles et Schémas
from app.models.models import (
    Training as TrainingModel, 
    Enrollment as EnrollmentModel, 
    Module as ModuleModel,
    UserModuleProgress as ProgressModel
)
from app.schemas.schemas import (
    TrainingCreate, 
    TrainingUpdate, 
    Training as TrainingSchema, 
    EnrollmentCreate, 
    Enrollment as EnrollmentSchema,
    UserModuleProgress as ProgressSchema
)

from app.api.auth import get_current_user, get_current_admin

router = APIRouter(prefix="/trainings", tags=["Trainings"])

# --- ROUTES PUBLIQUES ---

@router.get("/", response_model=List[TrainingSchema])
def get_trainings(db: Session = Depends(get_db)):
    return db.query(TrainingModel).filter(TrainingModel.is_active == True).all()

@router.get("/{slug}", response_model=TrainingSchema)
def get_training_by_slug(slug: str, db: Session = Depends(get_db)):
    training = db.query(TrainingModel).options(joinedload(TrainingModel.modules)).filter(TrainingModel.slug == slug).first()
    if not training:
        raise HTTPException(status_code=404, detail="Formation introuvable")
    return training

# --- ROUTES ADMIN ---

@router.post("/", response_model=TrainingSchema)
def create_training(
    training_data: TrainingCreate,
    admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    existing = db.query(TrainingModel).filter(TrainingModel.slug == training_data.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Slug déjà utilisé")
    
    # Utilisation de model_dump() (Pydantic v2) ou dict() (v1)
    modules_data = training_data.modules
    dump_func = getattr(training_data, "model_dump", training_data.dict)
    training_dict = dump_func(exclude={'modules'})
    
    db_training = TrainingModel(**training_dict)
    db.add(db_training)
    db.flush() 

    if modules_data:
        for idx, mod in enumerate(modules_data):
            mod_dump = getattr(mod, "model_dump", mod.dict)
            db_module = ModuleModel(**mod_dump(), training_id=db_training.id, order=idx+1)
            db.add(db_module)
    
    db.commit()
    db.refresh(db_training)
    return db_training

@router.put("/{training_id}", response_model=TrainingSchema)
def update_training(
    training_id: int,
    training_data: TrainingUpdate,
    admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Met à jour une formation et ses modules"""
    # Utilisation de .filter().first() au lieu de .get() pour SQLAlchemy 2.0+
    db_training = db.query(TrainingModel).filter(TrainingModel.id == training_id).first()
    if not db_training:
        raise HTTPException(status_code=404, detail="Formation introuvable")
    
    # CRITIQUE : Préparation des données de mise à jour
    dump_func = getattr(training_data, "model_dump", training_data.dict)
    
    # exclude_unset=True est vital pour le PUT partiel (422 si absent et champs manquants)
    update_data = dump_func(exclude_unset=True, exclude={'modules'})
    
    for key, value in update_data.items():
        setattr(db_training, key, value)
    
    # Gestion des modules
    if training_data.modules is not None:
        # On supprime les anciens modules proprement
        db.query(ModuleModel).filter(ModuleModel.training_id == training_id).delete()
        for idx, mod in enumerate(training_data.modules):
            # Sécurité pour transformer le schéma en dictionnaire
            if hasattr(mod, "model_dump"):
                mod_data = mod.model_dump()
            elif hasattr(mod, "dict"):
                mod_data = mod.dict()
            else:
                mod_data = mod
            
            db_module = ModuleModel(**mod_data, training_id=training_id, order=idx+1)
            db.add(db_module)
        
    try:
        db.commit()
        db.refresh(db_training)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Erreur lors de la mise à jour : {str(e)}")
        
    return db_training

@router.delete("/{training_id}")
def delete_training(training_id: int, admin=Depends(get_current_admin), db: Session = Depends(get_db)):
    training = db.query(TrainingModel).filter(TrainingModel.id == training_id).first()
    if not training:
        raise HTTPException(status_code=404, detail="Formation introuvable")
    db.delete(training)
    db.commit()
    return {"message": "Formation et modules supprimés"}