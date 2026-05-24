from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db

# --- CORRECTION DES IMPORTS (Utilisation d'alias pour les modèles) ---
from app.models.models import Training as TrainingModel, Enrollment as EnrollmentModel
from app.schemas.schemas import (
    TrainingCreate, 
    TrainingUpdate, 
    Training as TrainingSchema, 
    EnrollmentCreate, 
    Enrollment as EnrollmentSchema
)
# --------------------------------------------------------------------

from app.api.auth import get_current_user, get_current_admin

router = APIRouter(prefix="/trainings", tags=["Trainings"])

@router.get("/", response_model=List[TrainingSchema])
def get_trainings(db: Session = Depends(get_db)):
    # ✅ Utilise TrainingModel
    return db.query(TrainingModel).filter(TrainingModel.is_active == True).all()


@router.get("/all", response_model=List[TrainingSchema])
def get_all_trainings(admin=Depends(get_current_admin), db: Session = Depends(get_db)):
    # ✅ Utilise TrainingModel
    return db.query(TrainingModel).all()


@router.post("/enroll", response_model=EnrollmentSchema)
def enroll_in_training(
    enrollment_data: EnrollmentCreate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # ✅ Utilise EnrollmentModel
    existing = db.query(EnrollmentModel).filter(
        EnrollmentModel.user_id == current_user.id,
        EnrollmentModel.training_id == enrollment_data.training_id
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Déjà inscrit à cette formation")

    enrollment = EnrollmentModel(
        user_id=current_user.id,
        training_id=enrollment_data.training_id,
        status="pending",
        progress=0
    )
    db.add(enrollment)
    db.commit()
    db.refresh(enrollment)
    return enrollment


@router.get("/my/enrollments", response_model=List[EnrollmentSchema])
def get_my_enrollments(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    # ✅ Utilise EnrollmentModel
    return db.query(EnrollmentModel).filter(EnrollmentModel.user_id == current_user.id).all()


@router.get("/{slug}", response_model=TrainingSchema)
def get_training_by_slug(slug: str, db: Session = Depends(get_db)):
    # ✅ C'est cette ligne qui débloquera l'affichage de ta page "En savoir plus"
    training = db.query(TrainingModel).filter(TrainingModel.slug == slug).first()
    if not training:
        raise HTTPException(status_code=404, detail="Formation introuvable")
    return training


@router.post("/", response_model=TrainingSchema)
def create_training(
    training_data: TrainingCreate,
    admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    # ✅ Utilise TrainingModel
    existing = db.query(TrainingModel).filter(TrainingModel.slug == training_data.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Slug déjà utilisé")
    
    db_training = TrainingModel(**training_data.dict())
    db.add(db_training)
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
    # ✅ Utilise TrainingModel
    training = db.query(TrainingModel).filter(TrainingModel.id == training_id).first()
    if not training:
        raise HTTPException(status_code=404, detail="Formation introuvable")
    
    for field, value in training_data.dict(exclude_unset=True).items():
        setattr(training, field, value)
        
    db.commit()
    db.refresh(training)
    return training


@router.delete("/{training_id}")
def delete_training(
    training_id: int,
    admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    # ✅ Utilise TrainingModel
    training = db.query(TrainingModel).filter(TrainingModel.id == training_id).first()
    if not training:
        raise HTTPException(status_code=404, detail="Formation introuvable")
    
    db.delete(training)
    db.commit()
    return {"message": "Formation supprimée avec succès"}