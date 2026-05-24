from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models import models as m 
from app.schemas import schemas as s
from app.api.auth import get_current_admin

router = APIRouter(prefix="/admin", tags=["Admin"])


# 📊 DASHBOARD
@router.get("/dashboard", response_model=s.DashboardStats)
def get_dashboard_stats(
    admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    try:
        return s.DashboardStats(
            total_users=db.query(m.User).count(),
            total_trainings=db.query(m.Training).count(),
            total_services=db.query(m.Service).count(),
            total_testimonials=db.query(m.Testimonial).count(),
            total_partners=db.query(m.Partner).count(),
            pending_requests=db.query(m.ServiceRequest)
                .filter(m.ServiceRequest.status == "new")
                .count(),
            recent_enrollments=db.query(m.Enrollment).count()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# 👥 GET USERS
@router.get("/users", response_model=List[s.User])
def get_all_users(
    admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    return db.query(m.User).order_by(m.User.created_at.desc()).all()


# 🔄 TOGGLE ACTIVE (ACTIVER / BLOQUER)
@router.put("/users/{user_id}/toggle-status")
def toggle_user_status(
    user_id: int,
    admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    user = db.query(m.User).filter(m.User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # 🔴 Sécurité : empêcher de se désactiver soi-même
    if user.id == admin.id:
        raise HTTPException(
            status_code=400,
            detail="Vous ne pouvez pas désactiver votre propre compte"
        )

    user.is_active = not user.is_active
    db.commit()
    db.refresh(user)

    return {
        "message": "Statut mis à jour",
        "is_active": user.is_active
    }


# 🔐 TOGGLE ADMIN
@router.put("/users/{user_id}/toggle-admin")
def toggle_user_admin(
    user_id: int,
    admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    user = db.query(m.User).filter(m.User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # 🔴 Sécurité : empêcher de retirer son propre rôle admin
    if user.id == admin.id:
        raise HTTPException(
            status_code=400,
            detail="Vous ne pouvez pas modifier votre propre rôle admin"
        )

    user.is_admin = not user.is_admin
    db.commit()
    db.refresh(user)

    return {
        "message": "Rôle admin mis à jour",
        "is_admin": user.is_admin
    }


# 🗑️ DELETE USER
@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    user = db.query(m.User).filter(m.User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # 🔴 Sécurité critique
    if user.id == admin.id:
        raise HTTPException(
            status_code=400,
            detail="Vous ne pouvez pas supprimer votre propre compte"
        )

    db.delete(user)
    db.commit()

    return {"message": "Utilisateur supprimé"}


# 🕒 ACTIVITÉS RÉCENTES
@router.get("/recent-activities")
def get_recent_activities(
    admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    users = db.query(m.User)\
        .order_by(m.User.created_at.desc())\
        .limit(5)\
        .all()

    return [
        {
            "type": "user",
            "description": f"Nouvel utilisateur : {u.email}",
            "date": u.created_at
        }
        for u in users
    ]