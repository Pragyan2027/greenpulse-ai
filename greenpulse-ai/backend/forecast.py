import numpy as np
from sklearn.linear_model import LinearRegression


def generate_forecast(time_series, periods=5):

    if len(time_series) < 3:
        raise ValueError(
            "At least 3 readings are required for forecasting."
        )

    energy_values = np.array([
        float(item["energy"])
        for item in time_series
    ])

    # --------------------------------
    # SMALL DATASET
    # --------------------------------

    if len(energy_values) < 10:

        window = min(
            3,
            len(energy_values)
        )

        average = np.mean(
            energy_values[-window:]
        )

        predictions = np.repeat(
            average,
            periods
        )

        method = "Moving Average"

    # --------------------------------
    # LARGER DATASET
    # --------------------------------

    else:

        X = np.arange(
            len(energy_values)
        ).reshape(-1, 1)

        y = energy_values

        model = LinearRegression()

        model.fit(X, y)

        future_indexes = np.arange(
            len(energy_values),
            len(energy_values) + periods
        ).reshape(-1, 1)

        predictions = model.predict(
            future_indexes
        )

        method = "Linear Regression"

    # --------------------------------
    # PREVENT NEGATIVE VALUES
    # --------------------------------

    predictions = np.maximum(
        predictions,
        0
    )

    # --------------------------------
    # BUILD RESPONSE
    # --------------------------------

    forecast = []

    for index, prediction in enumerate(
        predictions,
        start=1
    ):

        forecast.append({

            "period": f"Next {index}",

            "energy": round(
                float(prediction),
                2
            )

        })

    return {
        "method": method,
        "forecast": forecast
    }