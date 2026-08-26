import { useState } from "react";
import api from "./api";

import EnergyCart from "./components/EnergyCart";
import MetricCard from "./components/MetricCard";
import ApplianceChart from "./components/ApplianceChart";
import SustainabilityCard from "./components/SustainabilityCard";
import AIInsightCard from "./components/AIInsightCard";
import AIChat from "./components/AIChat";
import WhatIfSimulator from "./components/WhatIfSimulator";
import ForecastChart from "./components/ForecastChart";
import ForecastInsight from "./components/ForecastInsight";

import "./App.css";


function App() {

  const [file, setFile] = useState(null);

  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);

  const [aiInsights, setAiInsights] = useState(null);

  const [aiLoading, setAiLoading] = useState(false);

  const [forecast, setForecast] = useState(null);

  const [forecastLoading, setForecastLoading] = useState(false);

  const [forecastMethod, setForecastMethod] = useState(null);

  const [forecastInsight, setForecastInsight] = useState(null);

  const [forecastInsightLoading, setForecastInsightLoading] =
    useState(false);

  const [error, setError] = useState(null);


  // ==========================================
  // ANALYZE ENERGY
  // ==========================================

  const handleAnalyze = async () => {

    console.log("ANALYZE BUTTON CLICKED");


    if (!file) {

      setError(
        "Please select a CSV file before analyzing."
      );

      return;

    }


    // Clear previous error

    setError(null);


    // Reset previous results

    setResult(null);

    setAiInsights(null);

    setForecast(null);

    setForecastMethod(null);

    setForecastInsight(null);


    try {

      // ==========================================
      // STEP 1: ANALYZE CSV
      // ==========================================

      setLoading(true);


      const formData = new FormData();

      formData.append(
        "file",
        file
      );


      console.log(
        "Sending CSV to FastAPI..."
      );


      const response = await api.post(
        "/api/analyze",
        formData
      );


      console.log(
        "ANALYZE RESPONSE:",
        response.data
      );


      const analysis = response.data;


      setResult(analysis);

      setLoading(false);


      // ==========================================
      // STEP 2: GENERATE FORECAST
      // ==========================================

      setForecastLoading(true);


      console.log(
        "Generating energy forecast..."
      );


      const forecastResponse = await api.post(
        "/api/forecast",
        {
          time_series: analysis.time_series
        }
      );


      console.log(
        "FORECAST RESPONSE:",
        forecastResponse.data
      );


      setForecast(
        forecastResponse.data.forecast
      );


      setForecastMethod(
        forecastResponse.data.method
      );


      setForecastLoading(false);


      // ==========================================
      // STEP 3: EXPLAIN FORECAST
      // ==========================================

      setForecastInsightLoading(true);


      console.log(
        "Generating forecast explanation..."
      );


      const forecastInsightResponse = await api.post(
        "/api/forecast-insight",
        {
          historical_data: analysis.time_series,

          forecast_data:
            forecastResponse.data.forecast,

          analysis_data: analysis
        }
      );


      console.log(
        "FORECAST INSIGHT RESPONSE:",
        forecastInsightResponse.data
      );


      setForecastInsight(
        forecastInsightResponse.data
      );


      setForecastInsightLoading(false);


      // ==========================================
      // STEP 4: ASK GEMINI
      // ==========================================

      setAiLoading(true);


      console.log(
        "Sending analysis to Gemini..."
      );


      const aiResponse = await api.post(
        "/api/ai-insights",
        analysis
      );


      console.log(
        "AI RESPONSE:",
        aiResponse.data
      );


      setAiInsights(
        aiResponse.data
      );


      setAiLoading(false);


    } catch (error) {

      console.error(
        "ANALYSIS ERROR:",
        error
      );


      // ==========================================
      // HANDLE BACKEND ERROR
      // ==========================================

      let message =
        "Something went wrong while analyzing your data.";


      if (error.response) {

  console.error(
    "Backend response:",
    error.response.data
  );

  const detail =
    error.response.data?.detail;

  if (typeof detail === "string") {

    message = detail;

  } else if (Array.isArray(detail)) {

    message = detail
      .map((item) => item.msg)
      .filter(Boolean)
      .join(", ");

  } else {

    message =
      "The server rejected the request.";

  }
}


      // ==========================================
      // HANDLE CONNECTION ERROR
      // ==========================================

      else if (error.request) {

        message =
          "Unable to connect to the GreenPulse backend. " +
          "Make sure the backend server is running.";

      }


      // ==========================================
      // SHOW ERROR
      // ==========================================

      setError(message);


      // ==========================================
      // RESET LOADING STATES
      // ==========================================

      setLoading(false);

      setAiLoading(false);

      setForecastLoading(false);

      setForecastInsightLoading(false);

    }

  };


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="app">


      {/* ==========================================
          HEADER
      ========================================== */}

      <header className="header">

        <div className="brand">

          <div className="logo">
            🌱
          </div>


          <div>

            <h1>
              GreenPulse AI
            </h1>

            <p>
              Intelligent Energy Analytics
            </p>

          </div>

        </div>


        <div className="status">

          ● System Online

        </div>

      </header>


      {/* ==========================================
          MAIN
      ========================================== */}

      <main className="main">


        {/* ==========================================
            HERO
        ========================================== */}

        <section className="hero">

          <div>

            <h2>
              Energy Intelligence Dashboard
            </h2>

            <p>

              Upload your energy data and discover
              consumption patterns, inefficiencies
              and anomalies.

            </p>

          </div>

        </section>


        {/* ==========================================
            UPLOAD
        ========================================== */}

        <section className="upload-section">

          <div className="upload-box">


            <div>

              <h3>
                Analyze Energy Data
              </h3>

              <p>

                Upload a CSV file containing your
                energy consumption data.

              </p>

            </div>


            <div className="upload-controls">


              <input
                type="file"
                accept=".csv"
                onChange={(e) => {

                  setFile(
                    e.target.files[0]
                  );

                  setError(null);

                }}
              />


              <button
                onClick={handleAnalyze}
                disabled={loading}
              >

                {loading
                  ? "Analyzing..."
                  : "Analyze Energy"}

              </button>


            </div>

          </div>

        </section>


        {/* ==========================================
            ERROR MESSAGE
        ========================================== */}

        {error && (

          <div className="error-message">

            <strong>
              ⚠️ Something went wrong
            </strong>

            <p>
              {error}
            </p>

          </div>

        )}


        {/* ==========================================
            RESULTS
        ========================================== */}

        {result && (

          <>


            {/* ==========================================
                METRICS
            ========================================== */}

            <section className="metrics-grid">


              <MetricCard
                title="Total Energy"
                value={`${result.total_energy} kWh`}
                subtitle="Overall consumption"
                icon="⚡"
              />


              <MetricCard
                title="Average Usage"
                value={`${result.average_energy} kWh`}
                subtitle="Average per reading"
                icon="📊"
              />


              <MetricCard
                title="Efficiency Score"
                value={`${result.efficiency_score}/100`}
                subtitle="Energy efficiency"
                icon="🌱"
              />


              <MetricCard
                title="Anomalies"
                value={result.anomaly_count}
                subtitle="Unusual consumption"
                icon="🚨"
              />


            </section>


            {/* ==========================================
                CHARTS
            ========================================== */}

            <section className="charts-grid">


              <div className="panel">

                <EnergyCart
                  data={result.time_series}
                />

              </div>


              <div className="panel">

                <ApplianceChart
                  data={result.appliance_usage}
                />

              </div>


            </section>


            {/* ==========================================
                CARBON FOOTPRINT
            ========================================== */}

            <SustainabilityCard
              data={result.carbon_footprint}
            />


            {/* ==========================================
                WHAT-IF SIMULATOR
            ========================================== */}

            <WhatIfSimulator
              analysisData={result}
            />


            {/* ==========================================
                FORECAST
            ========================================== */}

            {forecastLoading && (

              <section className="panel">

                <p>
                  🔮 Generating energy forecast...
                </p>

              </section>

            )}


            {forecast && (

              <section className="panel">

                <div className="forecast-badge">
                  🔮 Energy Forecast
                </div>


                <p className="forecast-method">

                  Forecast method:{" "}

                  {forecastMethod}

                </p>


                <ForecastChart
                  historicalData={result.time_series}
                  forecastData={forecast}
                />


                {forecastInsightLoading && (

                  <div className="ai-loading">

                    🤖 Gemini is interpreting
                    the forecast...

                  </div>

                )}


                {forecastInsight && (

                  <ForecastInsight
                    insight={forecastInsight}
                  />

                )}

              </section>

            )}


            {/* ==========================================
                AI LOADING
            ========================================== */}

            {aiLoading && (

              <section className="ai-loading">

                🤖 GreenPulse AI is analyzing
                your energy data...

              </section>

            )}


            {/* ==========================================
                AI INSIGHTS
            ========================================== */}

            {aiInsights && (

              <AIInsightCard
                insights={aiInsights}
              />

            )}


            {/* ==========================================
                AI CHAT
            ========================================== */}

            <AIChat
              analysisData={result}
            />


            {/* ==========================================
                HIGHEST CONSUMPTION
            ========================================== */}

            <section className="panel">


              <div className="panel-header">


                <div>

                  <h3>
                    Highest Consumption
                  </h3>

                  <p>
                    Your largest recorded
                    energy usage
                  </p>

                </div>


                <span className="warning-badge">

                  High Usage

                </span>


              </div>


              <div className="highest-consumption">


                <div>

                  <span>
                    Appliance
                  </span>

                  <strong>

                    {
                      result
                        .highest_consumption
                        .appliance
                    }

                  </strong>

                </div>


                <div>

                  <span>
                    Energy
                  </span>

                  <strong>

                    {
                      result
                        .highest_consumption
                        .energy
                    }{" "}
                    kWh

                  </strong>

                </div>


                <div>

                  <span>
                    Time
                  </span>

                  <strong>

                    {
                      result
                        .highest_consumption
                        .timestamp
                    }

                  </strong>

                </div>


              </div>

            </section>


            {/* ==========================================
                ANOMALY
            ========================================== */}

            {result.anomaly_count > 0 && (

              <section className="anomaly-card">


                <div className="anomaly-icon">
                  🚨
                </div>


                <div>

                  <h3>
                    Energy Anomaly Detected
                  </h3>


                  <p>

                    An unusually high consumption
                    was detected for{" "}

                    <strong>

                      {
                        result
                          .anomalies[0]
                          .appliance
                      }

                    </strong>

                    {" "}at{" "}

                    <strong>

                      {
                        result
                          .anomalies[0]
                          .energy
                      }{" "}
                      kWh

                    </strong>.

                  </p>

                </div>


              </section>

            )}


          </>

        )}


      </main>

    </div>

  );

}


export default App;