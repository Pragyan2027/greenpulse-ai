import os
import json

from dotenv import load_dotenv
from google import genai


# ---------------------------
# LOAD ENVIRONMENT VARIABLES
# ---------------------------

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")


if not API_KEY:
    raise ValueError(
        "GEMINI_API_KEY is not configured."
    )


# ---------------------------
# GEMINI CLIENT
# ---------------------------

client = genai.Client(
    api_key=API_KEY
)


# ---------------------------
# GENERATE AI INSIGHTS
# ---------------------------

def generate_ai_insights(analysis_data):

    prompt = f"""
You are GreenPulse AI, an intelligent
sustainability and energy analyst.

Analyze the following verified energy
consumption data.

DATA:

{json.dumps(
    analysis_data,
    indent=2
)}


Your task is to provide useful,
personalized energy and sustainability
insights.

Identify:

1. The biggest energy-consuming appliance.
2. Any unusual consumption patterns.
3. Possible explanations for high consumption.
4. Practical ways to reduce energy usage.
5. The potential environmental impact.
6. The most important action the user should take.


IMPORTANT RULES:

- Base your analysis ONLY on the supplied data.
- Do not invent measurements or facts.
- Do not change numerical values from the data.
- Clearly distinguish observations from suggestions.
- Do not give generic advice unless it relates
  directly to the supplied data.
- Do not claim certainty about the cause of
  an anomaly when the data cannot prove the cause.
- Keep the response concise and useful.
- Use simple language.


Return ONLY valid JSON in exactly this structure:

{{
    "summary": "Short overall analysis",

    "key_finding": "Most important finding",

    "recommendations": [
        {{
            "title": "Recommendation title",
            "reason": "Why this recommendation applies"
        }}
    ],

    "environmental_insight":
        "Short environmental observation",

    "priority_action":
        "The single most important action"
}}
"""


    try:

        response = client.models.generate_content(

            model="gemini-2.5-flash",

            contents=prompt

        )

    except Exception as e:

        raise RuntimeError(
            f"Gemini API request failed: {str(e)}"
        )


    # ---------------------------
    # CLEAN RESPONSE
    # ---------------------------

    text = response.text.strip()


    # Gemini may occasionally return
    # JSON inside markdown code fences.

    if text.startswith("```"):

        text = text.replace(
            "```json",
            ""
        )

        text = text.replace(
            "```",
            ""
        )

        text = text.strip()


    # ---------------------------
    # PARSE JSON
    # ---------------------------

    try:

        result = json.loads(text)

    except json.JSONDecodeError:

        raise RuntimeError(
            "Gemini returned an invalid JSON response."
        )


    # ---------------------------
    # BASIC RESPONSE VALIDATION
    # ---------------------------

    required_fields = [
        "summary",
        "key_finding",
        "recommendations",
        "environmental_insight",
        "priority_action"
    ]


    for field in required_fields:

        if field not in result:

            raise RuntimeError(
                f"Gemini response is missing "
                f"required field: {field}"
            )


    return result