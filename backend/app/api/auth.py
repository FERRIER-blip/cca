from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import List
from app.db.database import get_db

# --- IMPORTS MODÈLES ET SCHÉMAS ---
from app.models.models import User as UserModel
from app.schemas.schemas import UserCreate, UserLogin, User as UserSchema, Token, UserUpdate
# ----------------------------------

from app.core.security import verify_password, get_password_hash, create_access_token, verify_token
from app.core.config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# --- DÉPENDANCES DE SÉCURITÉ ---

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> UserModel:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = verify_token(token)
    if payload is None:
        raise credentials_exception
    
    user_id = payload.get("sub")
    if user_id is None:
        raise credentials_exception
    
    user = db.query(UserModel).filter(UserModel.id == int(user_id)).first()
    if user is None:
        raise credentials_exception
    
    # Sécurité supplémentaire : si le compte est désactivé, on bloque tout
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Compte inactif. Contactez l'administrateur.")
        
    return user


def get_current_admin(current_user: UserModel = Depends(get_current_user)) -> UserModel:
    # C'est ce check qui empêche un apprenant d'entrer
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Accès réservé aux administrateurs."
        )
    return current_user

# --- ROUTES D'AUTHENTIFICATION ---

@router.post("/register", response_model=Token)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(UserModel).filter(UserModel.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Cet email est déjà utilisé")
    
    hashed_password = get_password_hash(user_data.password)
    db_user = UserModel(
        email=user_data.email,
        hashed_password=hashed_password,
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        phone=user_data.phone,
        is_admin=False, # Toujours False par défaut
        is_active=False  # Recommandé : demande une validation admin après inscription
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    access_token = create_access_token(
        data={"sub": str(db_user.id)}, 
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return {"access_token": access_token, "token_type": "bearer", "user": db_user}


@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")
    
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Votre compte n'est pas encore activé par un administrateur.")

    access_token = create_access_token(
        data={"sub": str(user.id)}, 
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return {"access_token": access_token, "token_type": "bearer", "user": user}

@router.get("/me", response_model=UserSchema)
def get_me(current_user: UserModel = Depends(get_current_user)):
    return current_user

# --- ROUTES DE GESTION ADMIN (Indispensables pour votre Frontend) ---

@router.post("/toggle-status/{user_id}")
def toggle_user_status(user_id: int, db: Session = Depends(get_db), admin: UserModel = Depends(get_current_admin)):
    """Active ou désactive l'accès d'un utilisateur (Apprenant)"""
    target_user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    
    target_user.is_active = not target_user.is_active
    db.commit()
    return {"message": f"Statut mis à jour : active={target_user.is_active}"}


@router.post("/toggle-admin/{user_id}")
def toggle_user_admin(user_id: int, db: Session = Depends(get_db), admin: UserModel = Depends(get_current_admin)):
    """Donne ou retire les droits admin"""
    # Protection : un admin ne peut pas se retirer ses propres droits (pour éviter de se bloquer)
    if user_id == admin.id:
        raise HTTPException(status_code=400, detail="Vous ne pouvez pas modifier vos propres droits admin.")
        
    target_user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    
    target_user.is_admin = not target_user.is_admin
    db.commit()
    return {"message": f"Droits admin mis à jour : admin={target_user.is_admin}"}