from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base, SessionLocal
from models import User
from analysis_model import AnalysisHistory

from pydantic import BaseModel
from sqlalchemy.orm import Session

import bcrypt

from google import genai
from dotenv import load_dotenv
import os
import json

from fastapi import UploadFile, File
from PyPDF2 import PdfReader

from fastapi.responses import FileResponse
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
import tempfile

Base.metadata.create_all(bind=engine)

app = FastAPI()

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

# =========================
# REQUEST MODELS
# =========================

class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


class SaveAnalysisRequest(BaseModel):
    user_id: int
    original_text: str
    detected_bias: str
    severity: str
    rewritten_text: str

class ChangePasswordRequest(BaseModel):

    user_id: int
    current_password: str
    new_password: str

class ExportPdfRequest(BaseModel):

    detected_bias: str
    severity: str
    rewritten_text: str    

# =========================
# CORS
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# REGISTER API
# =========================

@app.post("/register")
def register(user: RegisterRequest):

    db: Session = SessionLocal()

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:
        db.close()

        return {
            "message": "Email already exists"
        }

    hashed_password = bcrypt.hashpw(
        user.password.encode("utf-8"),
        bcrypt.gensalt()
    )

    new_user = User(
        username=user.username,
        email=user.email,
        password=hashed_password.decode("utf-8")
    )

    db.add(new_user)
    db.commit()

    db.close()

    return {
        "message": "User registered successfully"
    }


# =========================
# LOGIN API
# =========================

@app.post("/login")
def login(user: LoginRequest):

    db: Session = SessionLocal()

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if not existing_user:

        db.close()

        return {
            "message": "Invalid email"
        }

    password_match = bcrypt.checkpw(
        user.password.encode("utf-8"),
        existing_user.password.encode("utf-8")
    )

    if not password_match:

        db.close()

        return {
            "message": "Invalid password"
        }

    db.close()

    return {
        "message": "Login successful",
        "user_id": existing_user.id,
        "username": existing_user.username,
        "email": existing_user.email
    }

@app.post("/change-password")
def change_password(data: ChangePasswordRequest):

    db: Session = SessionLocal()

    user = db.query(User).filter(
        User.id == data.user_id
    ).first()

    if not user:

        db.close()

        return {
            "message": "User not found"
        }

    password_match = bcrypt.checkpw(
        data.current_password.encode("utf-8"),
        user.password.encode("utf-8")
    )

    if not password_match:

        db.close()

        return {
            "message": "Current password incorrect"
        }

    hashed_password = bcrypt.hashpw(
        data.new_password.encode("utf-8"),
        bcrypt.gensalt()
    )

    user.password = hashed_password.decode("utf-8")

    db.commit()

    db.close()

    return {
        "message": "Password updated successfully"
    }

# =========================
# HOME API
# =========================

@app.get("/")
def home():

    return {
        "message": "EquityAI Backend Running Successfully"
    }


# =========================
# BIAS DETECTION DATA
# =========================

bias_words = {
    "salesman": "sales professional",
    "aggressive": "motivated",
    "dominant": "confident",
    "young": "skilled professional",
    "manpower": "workforce",
    "chairman": "chairperson",
}


# =========================
# ANALYZE API
# =========================

@app.post("/analyze")
async def analyze(data: dict):

    text = data.get("text", "")

    prompt = f"""
    Analyze the following job description or news article for bias.

    Return ONLY valid JSON in this exact format:

    {{
      "detected_bias": ["bias type"],
      "severity": "Low",
      "suggestions": [
        {{
          "biased_word": "example",
          "inclusive_alternative": "example"
        }}
      ],
      "rewritten_text": "inclusive rewritten version"
    }}

    Text:
    {text}
    """

    try:

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        result_text = response.text.strip()

        if result_text.startswith("```json"):
            result_text = result_text.replace("```json", "").replace("```", "").strip()

        return json.loads(result_text)

    except Exception as e:

        return {
            "detected_bias": [],
            "severity": "Error",
            "suggestions": [],
            "rewritten_text": str(e)
        }

# =========================
# SAVE ANALYSIS API
# =========================

@app.post("/save-analysis")
def save_analysis(data: SaveAnalysisRequest):

    db: Session = SessionLocal()

    analysis = AnalysisHistory(
        user_id=data.user_id,
        original_text=data.original_text,
        detected_bias=data.detected_bias,
        severity=data.severity,
        rewritten_text=data.rewritten_text
    )

    db.add(analysis)

    db.commit()

    db.close()

    return {
        "message": "Analysis saved successfully"
    }

# =========================
# DASHBOARD STATS API
# =========================

@app.get("/dashboard-stats/{user_id}")
def dashboard_stats(user_id: int):

    db: Session = SessionLocal()

    analyses = db.query(
        AnalysisHistory
    ).filter(
        AnalysisHistory.user_id == user_id
    ).all()

    total_analyses = len(analyses)

    total_bias_detected = 0

    for item in analyses:

        if item.detected_bias:

            total_bias_detected += len(
                item.detected_bias.split(",")
            )

    recent_activity = []

    recent_analyses = analyses[-3:]

    for index, item in enumerate(recent_analyses):

        recent_activity.append({
           "display_number": total_analyses - (len(recent_analyses) - 1 - index),
            "id": item.id,
            "detected_bias": item.detected_bias,
            "severity": item.severity,
            "created_at": str(item.created_at)
    })

    db.close()

    return {
        "total_analyses": total_analyses,
        "total_bias_detected": total_bias_detected,
        "recent_activity": recent_activity
    }


@app.get("/history/{user_id}")
def get_history(user_id: int):

    db: Session = SessionLocal()

    history = db.query(
        AnalysisHistory
    ).filter(
        AnalysisHistory.user_id == user_id
    ).order_by(
        AnalysisHistory.id.desc()
    ).all()

    db.close()

    return history

# =========================
# DELETE ANALYSIS API
# =========================

@app.delete("/delete-analysis/{analysis_id}")
def delete_analysis(analysis_id: int):

    db: Session = SessionLocal()

    analysis = db.query(
        AnalysisHistory
    ).filter(
        AnalysisHistory.id == analysis_id
    ).first()

    if not analysis:

        db.close()

        return {
            "message": "Analysis not found"
        }

    db.delete(analysis)

    db.commit()

    db.close()

    return {
        "message": "Analysis deleted successfully"
    }


@app.get("/gemini-test")
def gemini_test():

    return {
        "message": "Gemini Test Endpoint Working"
    }

@app.get("/ai-test")
def ai_test():

    try:

        print("AI TEST STARTED")

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents="Explain AI in one sentence."
        )

        print("GEMINI RESPONSE RECEIVED")

        return {
            "response": response.text
        }

    except Exception as e:

        print("ERROR:", str(e))

        return {
            "error": str(e)
        }
    
# =========================
# PDF UPLOAD API
# =========================

@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):

    try:

        pdf = PdfReader(file.file)

        extracted_text = ""

        for page in pdf.pages:

            text = page.extract_text()

            if text:

                extracted_text += text + "\n"

        return {
            "text": extracted_text
        }

    except Exception as e:

        return {
            "error": str(e)
        }    
    
@app.post("/export-pdf")
def export_pdf(data: ExportPdfRequest):

    temp_file = tempfile.NamedTemporaryFile(
        delete=False,
        suffix=".pdf"
    )

    doc = SimpleDocTemplate(
        temp_file.name
    )

    styles = getSampleStyleSheet()

    content = [

        Paragraph(
            "EquityAI Analysis Report",
            styles["Title"]
        ),

        Spacer(1, 20),

        Paragraph(
            f"<b>Detected Bias:</b> {data.detected_bias}",
            styles["BodyText"]
        ),

        Spacer(1, 10),

        Paragraph(
            f"<b>Severity:</b> {data.severity}",
            styles["BodyText"]
        ),

        Spacer(1, 10),

        Paragraph(
            "<b>Inclusive Rewrite:</b>",
            styles["BodyText"]
        ),

        Spacer(1, 5),

        Paragraph(
            data.rewritten_text,
            styles["BodyText"]
        )

    ]

    doc.build(content)

    return FileResponse(
        temp_file.name,
        filename="EquityAI_Report.pdf",
        media_type="application/pdf"
    )    