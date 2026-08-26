function SustainabilityCard({ data }) {

  return (
    <section className="sustainability-card">

      <div className="sustainability-header">

        <div>

          <span className="sustainability-label">
            🌱 SUSTAINABILITY
          </span>

          <h3>
            Your Carbon Footprint
          </h3>

          <p>
            Estimated environmental impact of your
            electricity consumption.
          </p>

        </div>

      </div>


      <div className="carbon-main">

        <div className="carbon-value">

          <span>
            Estimated CO₂
          </span>

          <strong>
            {data.co2_kg} kg
          </strong>

        </div>


        <div className="carbon-insights">

          <div className="carbon-insight">

            <span>🚗</span>

            <div>
              <strong>
                {data.driving_km} km
              </strong>

              <p>
                Equivalent driving
              </p>
            </div>

          </div>


          <div className="carbon-insight">

            <span>🌳</span>

            <div>
              <strong>
                {data.trees_needed}
              </strong>

              <p>
                Trees/year equivalent
              </p>
            </div>

          </div>

        </div>

      </div>


      <p className="carbon-note">
        * Carbon values are estimates based on the
        configured electricity emission factor.
      </p>

    </section>
  );
}

export default SustainabilityCard;