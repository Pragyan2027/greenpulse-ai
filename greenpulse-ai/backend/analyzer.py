import pandas as pd
import numpy as np


def analyze_energy_data(file_path):

    # ---------------------------
    # READ CSV
    # ---------------------------

    try:
        df = pd.read_csv(file_path)

    except Exception as e:
        raise ValueError(
            f"Could not read CSV file: {str(e)}"
        )

    # ---------------------------
    # NORMALIZE COLUMN NAMES
    # ---------------------------

    df.columns = (
        df.columns
        .str.strip()
        .str.lower()
    )

    # ---------------------------
    # VALIDATE REQUIRED COLUMNS
    # ---------------------------

    required_columns = [
        "timestamp",
        "appliance",
        "energy_kwh"
    ]

    for column in required_columns:

        if column not in df.columns:

            raise ValueError(
                f"Missing required column: {column}"
            )

    # ---------------------------
    # CHECK EMPTY DATASET
    # ---------------------------

    if df.empty:

        raise ValueError(
            "The uploaded CSV is empty."
        )

    # ---------------------------
    # VALIDATE ENERGY VALUES
    # ---------------------------

    df["energy_kwh"] = pd.to_numeric(
        df["energy_kwh"],
        errors="coerce"
    )

    if df["energy_kwh"].isna().any():

        raise ValueError(
            "energy_kwh contains invalid "
            "or missing values."
        )

    if (df["energy_kwh"] < 0).any():

        raise ValueError(
            "energy_kwh cannot contain "
            "negative values."
        )

    # ---------------------------
    # VALIDATE TIMESTAMP
    # ---------------------------

    df["timestamp"] = pd.to_datetime(
        df["timestamp"],
        errors="coerce"
    )

    if df["timestamp"].isna().any():

        raise ValueError(
            "timestamp contains invalid "
            "date/time values."
        )

    # ---------------------------
    # VALIDATE APPLIANCE
    # ---------------------------

    if df["appliance"].isna().any():

        raise ValueError(
            "appliance contains missing values."
        )

    df["appliance"] = (
        df["appliance"]
        .astype(str)
        .str.strip()
    )

    if (df["appliance"] == "").any():

        raise ValueError(
            "appliance contains empty values."
        )

    # ---------------------------
    # BASIC METRICS
    # ---------------------------

    total_energy = (
        df["energy_kwh"].sum()
    )

    average_energy = (
        df["energy_kwh"].mean()
    )

    highest_row = df.loc[
        df["energy_kwh"].idxmax()
    ]

    # ---------------------------
    # APPLIANCE USAGE
    # ---------------------------

    appliance_usage = (
        df.groupby("appliance")["energy_kwh"]
        .sum()
        .sort_values(ascending=False)
    )

    # ---------------------------
    # ANOMALY DETECTION
    # ---------------------------

    # ---------------------------
# ANOMALY DETECTION (per-appliance baseline)
# ---------------------------

    df["z_score"] = df.groupby("appliance")["energy_kwh"].transform(
    lambda x: (x - x.mean()) / x.std() if x.std() > 0 else 0
    )

    anomalies = df[
    np.abs(df["z_score"]) > 2
        ]
    # ---------------------------
    # EFFICIENCY SCORE
    # ---------------------------

    anomaly_ratio = (
        len(anomalies) / len(df)
    )

    efficiency_score = (
        100 - (anomaly_ratio * 100)
    )

    efficiency_score = max(
        0,
        min(100, efficiency_score)
    )

    # ---------------------------
    # TIME SERIES DATA
    # ---------------------------

    time_series = [

        {
            "timestamp": str(
                row["timestamp"]
            ),

            "energy": round(
                float(row["energy_kwh"]),
                2
            )
        }

        for _, row in df.iterrows()
    ]

    # ---------------------------
    # CARBON FOOTPRINT
    # ---------------------------

    # Estimated grid emission factor
    # kg CO2 per kWh

    EMISSION_FACTOR = 0.7

    carbon_footprint = (
        total_energy * EMISSION_FACTOR
    )

    # Approximate car emission
    # kg CO2 per km

    CAR_KG_CO2_PER_KM = 0.17

    # Approximate annual CO2 absorption
    # per tree

    TREE_ANNUAL_CO2_ABSORPTION = 21

    driving_equivalent = (
        carbon_footprint
        / CAR_KG_CO2_PER_KM
    )

    trees_equivalent = (
        carbon_footprint
        / TREE_ANNUAL_CO2_ABSORPTION
    )

    # ---------------------------
    # RETURN RESULTS
    # ---------------------------

    return {

        "total_energy": round(
            float(total_energy),
            2
        ),

        "average_energy": round(
            float(average_energy),
            2
        ),

        "highest_consumption": {

            "timestamp": str(
                highest_row["timestamp"]
            ),

            "energy": round(
                float(
                    highest_row["energy_kwh"]
                ),
                2
            ),

            "appliance": str(
                highest_row["appliance"]
            )
        },

        "efficiency_score": round(
            float(efficiency_score),
            2
        ),

        "carbon_footprint": {

            "co2_kg": round(
                float(carbon_footprint),
                2
            ),

            "driving_km": round(
                float(driving_equivalent),
                1
            ),

            "trees_needed": round(
                float(trees_equivalent),
                2
            )
        },

        "anomaly_count": len(
            anomalies
        ),

        "appliance_usage": {

            str(key): round(
                float(value),
                2
            )

            for key, value
            in appliance_usage.items()
        },

        "anomalies": [

            {
                "timestamp": str(
                    row["timestamp"]
                ),

                "energy": round(
                    float(
                        row["energy_kwh"]
                    ),
                    2
                ),

                "appliance": str(
                    row["appliance"]
                )
            }

            for _, row
            in anomalies.iterrows()
        ],

        "time_series": time_series
    }