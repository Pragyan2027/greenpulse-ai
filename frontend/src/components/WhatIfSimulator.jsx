import { useState } from "react";
import api from "../api";

function WhatIfSimulator({ analysisData }) {

  const appliances = Object.keys(
    analysisData.appliance_usage
  );

  const [appliance, setAppliance] = useState(
    appliances[0]
  );

  const [reduction, setReduction] = useState(20);

  const [simulation, setSimulation] = useState(null);

  const [loading, setLoading] = useState(false);


  const runSimulation = async () => {

    try {

      setLoading(true);

      const response = await api.post(
        "/api/simulate",
        {
          appliance: appliance,
          reduction_percent: Number(reduction),
          analysis_data: analysisData
        }
      );

      setSimulation(
        response.data
      );

    } catch (error) {

      console.error(error);

      alert(
        "Unable to run simulation."
      );

    } finally {

      setLoading(false);

    }
  };


  return (

    <section className="what-if-card">

      <div className="what-if-header">

        <span className="what-if-label">
          🔥 WHAT-IF ANALYSIS
        </span>

        <h3>
          Energy Saving Simulator
        </h3>

        <p>
          Explore how reducing appliance usage
          could affect your energy footprint.
        </p>

      </div>


      <div className="simulator-controls">

        <div className="simulator-field">

          <label>
            Appliance
          </label>

          <select
            value={appliance}
            onChange={(e) =>
              setAppliance(e.target.value)
            }
          >

            {appliances.map(
              (item) => (

                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>

              )
            )}

          </select>

        </div>


        <div className="simulator-field">

          <label>
            Reduction
          </label>

          <div className="range-wrapper">

            <input
              type="range"
              min="0"
              max="100"
              value={reduction}
              onChange={(e) =>
                setReduction(e.target.value)
              }
            />

            <strong>
              {reduction}%
            </strong>

          </div>

        </div>


        <button
          onClick={runSimulation}
          disabled={loading}
        >

          {loading
            ? "Calculating..."
            : "Simulate"}

        </button>

      </div>


      {simulation && (

        <div className="simulation-result">

          <div className="simulation-title">

            If you reduce{" "}

            <strong>
              {simulation.appliance}
            </strong>

            {" "}usage by{" "}

            <strong>
              {simulation.reduction_percent}%
            </strong>

          </div>


          <div className="simulation-metrics">

            <div>

              <span>
                Energy Saved
              </span>

              <strong>
                {simulation.energy_saved} kWh
              </strong>

            </div>


            <div>

              <span>
                New Total Usage
              </span>

              <strong>
                {simulation.new_total_energy} kWh
              </strong>

            </div>


            <div>

              <span>
                CO₂ Saved
              </span>

              <strong>
                {simulation.co2_saved} kg
              </strong>

            </div>


            <div>

              <span>
                New CO₂
              </span>

              <strong>
                {simulation.new_co2} kg
              </strong>

            </div>

          </div>

        </div>

      )}

    </section>

  );
}

export default WhatIfSimulator;