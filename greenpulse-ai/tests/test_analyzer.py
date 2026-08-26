import sys
from pathlib import Path

import pandas as pd

sys.path.insert(
    0,
    str(
        Path(__file__).resolve().parents[1] / "backend"
    )
)

from analyzer import analyze_energy_data


def create_test_csv(tmp_path):

    data = {
        "timestamp": [
            "2026-07-01 08:00:00",
            "2026-07-01 09:00:00",
            "2026-07-01 10:00:00",
            "2026-07-01 11:00:00",
        ],

        "appliance": [
            "AC",
            "Computer",
            "Lights",
            "AC",
        ],

        "energy_kwh": [
            2.0,
            1.0,
            0.5,
            3.0,
        ],
    }

    df = pd.DataFrame(data)

    file_path = tmp_path / "test_energy.csv"

    df.to_csv(
        file_path,
        index=False
    )

    return file_path


def test_total_energy(tmp_path):

    file_path = create_test_csv(tmp_path)

    result = analyze_energy_data(
        file_path
    )

    assert result["total_energy"] == 6.5


def test_average_energy(tmp_path):

    file_path = create_test_csv(tmp_path)

    result = analyze_energy_data(
        file_path
    )

    assert result["average_energy"] == 1.62


def test_highest_consumption(tmp_path):

    file_path = create_test_csv(tmp_path)

    result = analyze_energy_data(
        file_path
    )

    highest = result[
        "highest_consumption"
    ]

    assert highest["energy"] == 3.0

    assert highest["appliance"] == "AC"


def test_appliance_usage(tmp_path):

    file_path = create_test_csv(tmp_path)

    result = analyze_energy_data(
        file_path
    )

    usage = result[
        "appliance_usage"
    ]

    assert usage["AC"] == 5.0

    assert usage["Computer"] == 1.0

    assert usage["Lights"] == 0.5


def test_time_series_length(tmp_path):

    file_path = create_test_csv(tmp_path)

    result = analyze_energy_data(
        file_path
    )

    assert len(
        result["time_series"]
    ) == 4