from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.db.database import get_db

# --- CORRECTION DES IMPORTS ---
from app.models.models import News as NewsModel
from app.schemas.schemas import NewsCreate, NewsUpdate, News as NewsSchema
# ------------------------------

from app.api.auth import get_current_admin

router = APIRouter(prefix="/news", tags=["News"])


@router.get("/", response_model=List[NewsSchema])
def get_news(db: Session = Depends(get_db)):
    # ✅ Utilisation de NewsModel
    news = db.query(NewsModel).filter(
        NewsModel.is_published == True,
        NewsModel.published_at <= datetime.utcnow()
    ).order_by(NewsModel.published_at.desc()).all()
    return news


@router.get("/all", response_model=List[NewsSchema])
def get_all_news(admin=Depends(get_current_admin), db: Session = Depends(get_db)):
    # ✅ Utilisation de NewsModel
    news = db.query(NewsModel).order_by(NewsModel.created_at.desc()).all()
    return news


@router.get("/{slug}", response_model=NewsSchema)
def get_news_by_slug(slug: str, db: Session = Depends(get_db)):
    # ✅ Réparé : NewsModel (Pour que le bouton "En savoir plus" fonctionne)
    news_item = db.query(NewsModel).filter(NewsModel.slug == slug).first()
    if not news_item:
        raise HTTPException(status_code=404, detail="News not found")
    return news_item


@router.post("/", response_model=NewsSchema)
def create_news(
    news_data: NewsCreate,
    admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    # ✅ Utilisation de NewsModel
    existing = db.query(NewsModel).filter(NewsModel.slug == news_data.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Slug already exists")
    
    db_news = NewsModel(**news_data.dict())
    if db_news.is_published:
        db_news.published_at = datetime.utcnow()
    
    db.add(db_news)
    db.commit()
    db.refresh(db_news)
    return db_news


@router.put("/{news_id}", response_model=NewsSchema)
def update_news(
    news_id: int,
    news_data: NewsUpdate,
    admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    # ✅ Utilisation de NewsModel
    news_item = db.query(NewsModel).filter(NewsModel.id == news_id).first()
    if not news_item:
        raise HTTPException(status_code=404, detail="News not found")
    
    update_data = news_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(news_item, field, value)
    
    if news_item.is_published and not news_item.published_at:
        news_item.published_at = datetime.utcnow()
    
    db.commit()
    db.refresh(news_item)
    return news_item


@router.delete("/{news_id}")
def delete_news(
    news_id: int,
    admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    # ✅ Utilisation de NewsModel
    news_item = db.query(NewsModel).filter(NewsModel.id == news_id).first()
    if not news_item:
        raise HTTPException(status_code=404, detail="News not found")
    
    db.delete(news_item)
    db.commit()
    return {"message": "News deleted successfully"}