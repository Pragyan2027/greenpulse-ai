from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from ai_analyzer import generate_ai_insights
from analyzer import analyze_energy_data
from ai_chat import ask_greenpulse
from forecast import generate_forecast
from forecast_ai import explain_forecast

from dotenv import load_dotenv

import os
import shutil


# ============================================================
# ENVIRONMENT VARIABLES
# ============================================================

load_dotenv()


FRONTEND_URL = os.getenv(
    "FRONTEND_URL",
    "http://localhost:5173"
)


print(
    ">>> FRONTEND_URL:",
    FRONTEND_URL
)


# ============================================================
# FASTAPI APP
# ============================================================

app = FastAPI(
    title="GreenPulse AI API"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        FRONTEND_URL,
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# ============================================================
# UPLOAD FOLDER
# ============================================================

UPLOAD_FOLDER = "uploads"

os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
)


# ============================================================
# HOME
# ============================================================

@app.get("/")
def home():

    return {
        "message": "GreenPulse AI backend running 🌱"
    }


# ============================================================
# ANALYZE CSV
# ============================================================

@app.post("/api/analyze")
async def analyze_file(
    file: UploadFile = File(...)
):

    try:

        file_path = os.path.join(
            UPLOAD_FOLDER,
            file.filename
        )

        with open(
            file_path,
            "wb"
        ) as buffer:

            shutil.copyfileobj(
                file.file,
                buffer
            )

        results = analyze_energy_data(
            file_path
        )

        return results


    except Exception as e:

        print(
            "ANALYZE ERROR:",
            str(e)
        )

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# ============================================================
# GEMINI AI CHAT
# ============================================================

@app.post("/api/chat")
async def chat(
    data: dict
):

    try:

        question = data.get(
            "question"
        )

        analysis_data = data.get(
            "analysis_data"
        )


        if not question:

            raise HTTPException(
                status_code=400,
                detail="Question is required."
            )


        if not analysis_data:

            raise HTTPException(
                status_code=400,
                detail="Energy analysis data is required."
            )


        answer = ask_greenpulse(
            question,
            analysis_data
        )


        return {
            "answer": answer
        }


    except HTTPException:

        raise


    except Exception as e:

        print(
            "CHAT ERROR:",
            str(e)
        )

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# ============================================================
# GEMINI AI INSIGHTS
# ============================================================

@app.post("/api/ai-insights")
async def ai_insights(
    data: dict
):

    try:

        insights = generate_ai_insights(
            data
        )

        return insights


    except Exception as e:

        print(
            "AI ERROR:",
            str(e)
        )

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# ============================================================
# WHAT-IF SIMULATOR
# ============================================================

@app.post("/api/simulate")
async def simulate_energy(
    data: dict
):

    try:

        analysis_data = data.get(
            "analysis_data"
        )

        appliance = data.get(
            "appliance"
        )

        reduction_percent = data.get(
            "reduction_percent"
        )


        # ----------------------------------------
        # VALIDATION
        # ----------------------------------------

        if not analysis_data:

            raise HTTPException(
                status_code=400,
                detail="Analysis data is required."
            )


        if not appliance:

            raise HTTPException(
                status_code=400,
                detail="Appliance is required."
            )


        if reduction_percent is None:

            raise HTTPException(
                status_code=400,
                detail="Reduction percentage is required."
            )


        reduction_percent = float(
            reduction_percent
        )


        if (
            reduction_percent < 0
            or reduction_percent > 100
        ):

            raise HTTPException(
                status_code=400,
                detail="Reduction must be between 0 and 100."
            )


        # ----------------------------------------
        # APPLIANCE DATA
        # ----------------------------------------

        appliance_usage = analysis_data.get(
            "appliance_usage",
            {}
        )


        if appliance not in appliance_usage:

            raise HTTPException(
                status_code=404,
                detail="Appliance not found."
            )


        current_appliance_energy = float(
            appliance_usage[appliance]
        )


        total_energy = float(
            analysis_data["total_energy"]
        )


        # ----------------------------------------
        # CARBON DATA
        # ----------------------------------------

        carbon_footprint = analysis_data.get(
            "carbon_footprint",
            {}
        )


        emission_factor = (

            float(
                carbon_footprint.get(
                    "co2_kg",
                    0
                )
            )
            / total_energy

            if total_energy > 0

            else 0
        )


        # ----------------------------------------
        # CALCULATIONS
        # ----------------------------------------

        energy_saved = (

            current_appliance_energy
            * reduction_percent
            / 100
        )


        new_appliance_energy = (

            current_appliance_energy
            - energy_saved
        )


        new_total_energy = (

            total_energy
            - energy_saved
        )


        co2_saved = (

            energy_saved
            * emission_factor
        )


        new_co2 = (

            new_total_energy
            * emission_factor
        )


        # ----------------------------------------
        # RESPONSE
        # ----------------------------------------

        return {

            "appliance":
                appliance,

            "reduction_percent":
                reduction_percent,

            "current_appliance_energy":
                round(
                    current_appliance_energy,
                    2
                ),

            "new_appliance_energy":
                round(
                    new_appliance_energy,
                    2
                ),

            "energy_saved":
                round(
                    energy_saved,
                    2
                ),

            "current_total_energy":
                round(
                    total_energy,
                    2
                ),

            "new_total_energy":
                round(
                    new_total_energy,
                    2
                ),

            "co2_saved":
                round(
                    co2_saved,
                    2
                ),

            "new_co2":
                round(
                    new_co2,
                    2
                )
        }


    except HTTPException:

        raise


    except Exception as e:

        print(
            "SIMULATION ERROR:",
            str(e)
        )

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# ============================================================
# ENERGY FORECAST
# ============================================================

@app.post("/api/forecast")
async def forecast_energy(
    data: dict
):

    try:

        time_series = data.get(
            "time_series"
        )


        if not time_series:

            raise HTTPException(
                status_code=400,
                detail="Time-series data is required."
            )


        forecast_result = generate_forecast(
            time_series
        )


        return forecast_result


    except HTTPException:

        raise


    except Exception as e:

        print(
            "FORECAST ERROR:",
            str(e)
        )

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# ============================================================
# FORECAST AI INSIGHT
# ============================================================

@app.post("/api/forecast-insight")
async def forecast_insight(
    data: dict
):

    try:

        historical_data = data.get(
            "historical_data"
        )

        forecast_data = data.get(
            "forecast_data"
        )

        analysis_data = data.get(
            "analysis_data"
        )


        # ----------------------------------------
        # VALIDATION
        # ----------------------------------------

        if not historical_data:

            raise HTTPException(
                status_code=400,
                detail="Historical data is required."
            )


        if not forecast_data:

            raise HTTPException(
                status_code=400,
                detail="Forecast data is required."
            )


        # ----------------------------------------
        # GEMINI FORECAST EXPLANATION
        # ----------------------------------------

        insight = explain_forecast(
            historical_data,
            forecast_data,
            analysis_data
        )


        return insight


    except HTTPException:

        raise


    except Exception as e:

        print(
            "FORECAST AI ERROR:",
            str(e)
        )

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )