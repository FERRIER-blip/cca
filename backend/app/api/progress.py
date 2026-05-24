from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from app.db.database import get_db
from app.models.models import (
    Module as ModuleModel, 
    UserModuleProgress as ProgressModel, 
    Enrollment as EnrollmentModel,
    Training as TrainingModel
)
from app.schemas.schemas import UserModuleProgress as ProgressSchema
from app.api.auth import get_current_user

router = APIRouter(prefix="/progress", tags=["Progress"])

@router.post("/update/{module_id}", response_model=ProgressSchema)
def mark_module_as_completed(
    module_id: int, 
    current_user = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """
    Marque un module comme terminé et recalcule automatiquement 
    le pourcentage de progression globale de la formation.
    """
    # 1. Vérifier si le module existe
    module = db.query(ModuleModel).filter(ModuleModel.id == module_id).first()
    if not module:
        raise HTTPException(status_code=404, detail="Module introuvable")

    # 2. Vérifier si l'étudiant est bien inscrit à cette formation
    enrollment = db.query(EnrollmentModel).filter(
        EnrollmentModel.user_id == current_user.id,
        EnrollmentModel.training_id == module.training_id
    ).first()
    
    if not enrollment:
        raise HTTPException(
            status_code=403, 
            detail="Vous n'êtes pas inscrit à cette formation"
        )

    # 3. Enregistrer ou mettre à jour la progression du module
    progress = db.query(ProgressModel).filter(
        ProgressModel.user_id == current_user.id,
        ProgressModel.module_id == module_id
    ).first()

    if not progress:
        progress = ProgressModel(
            user_id=current_user.id,
            module_id=module_id,
            is_completed=True,
            completed_at=func.now()
        )
        db.add(progress)
    else:
        progress.is_completed = True
        progress.completed_at = func.now()

    # 4. RECALCUL DU POURCENTAGE GLOBAL
    # Compter le nombre total de modules pour cette formation
    total_modules = db.query(ModuleModel).filter(
        ModuleModel.training_id == module.training_id
    ).count()

    # Compter le nombre de modules terminés par l'utilisateur pour cette formation
    completed_modules = db.query(ProgressModel).join(ModuleModel).filter(
        ProgressModel.user_id == current_user.id,
        ModuleModel.training_id == module.training_id,
        ProgressModel.is_completed == True
    ).count()

    # Calcul du ratio
    if total_modules > 0:
        new_percentage = (completed_modules / total_modules) * 100
    else:
        new_percentage = 0.0

    # Mettre à jour la table Enrollment
    enrollment.progress_percent = round(new_percentage, 2)
    
    # Si 100%, on passe le statut en "completed"
    if new_percentage >= 100:
        enrollment.status = "completed"
        if not enrollment.completed_at:
            enrollment.completed_at = func.now()

    db.commit()
    db.refresh(progress)
    
    return progress

@router.get("/status/{training_id}", response_model=List[ProgressSchema])
def get_training_progress_status(
    training_id: int, 
    current_user = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """
    Récupère la liste des modules terminés par l'étudiant pour une formation spécifique.
    Utile pour afficher les coches vertes ou les cadenas sur l'interface.
    """
    progress_list = db.query(ProgressModel).join(ModuleModel).filter(
        ProgressModel.user_id == current_user.id,
        ModuleModel.training_id == training_id
    ).all()
    
    return progress_list