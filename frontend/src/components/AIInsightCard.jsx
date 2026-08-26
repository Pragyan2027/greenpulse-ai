function AIInsightCard({ insights }) {

  if (!insights) {
    return null;
  }

  return (
    <section className="ai-insight-card">

      <div className="ai-header">

        <div>

          <span className="ai-label">
            🤖 GREENPULSE AI
          </span>

          <h3>
            AI Sustainability Analyst
          </h3>

          <p>
            Personalized analysis generated from your
            energy consumption data.
          </p>

        </div>

      </div>


      <div className="ai-summary">

        <h4>
          Overall Analysis
        </h4>

        <p>
          {insights.summary}
        </p>

      </div>


      <div className="ai-finding">

        <span>
          🔎
        </span>

        <div>

          <strong>
            Key Finding
          </strong>

          <p>
            {insights.key_finding}
          </p>

        </div>

      </div>


      <div className="ai-recommendations">

        <h4>
          Recommended Actions
        </h4>

        {insights.recommendations?.map(
          (recommendation, index) => (

            <div
              className="ai-recommendation"
              key={index}
            >

              <span>
                💡
              </span>

              <div>

                <strong>
                  {recommendation.title}
                </strong>

                <p>
                  {recommendation.reason}
                </p>

              </div>

            </div>

          )
        )}

      </div>


      <div className="ai-environment">

        <span>
          🌱
        </span>

        <div>

          <strong>
            Environmental Insight
          </strong>

          <p>
            {insights.environmental_insight}
          </p>

        </div>

      </div>


      <div className="ai-priority">

        <strong>
          Priority Action
        </strong>

        <p>
          {insights.priority_action}
        </p>

      </div>

    </section>
  );
}

export default AIInsightCard;