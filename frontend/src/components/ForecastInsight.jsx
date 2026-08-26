function ForecastInsight({ insight }) {

  if (!insight) {
    return null;
  }

  return (
    <div className="forecast-insight">

      <div className="forecast-insight-title">
        🤖 Forecast Insight
      </div>

      <div className="forecast-trend">

        <span>
          Trend
        </span>

        <strong>
          {insight.trend}
        </strong>

      </div>

      <p>
        {insight.summary}
      </p>

      <div className="forecast-detail">

        <strong>
          📈 Expected Change
        </strong>

        <p>
          {insight.change}
        </p>

      </div>

      <div className="forecast-detail">

        <strong>
          👀 Monitor
        </strong>

        <p>
          {insight.monitor}
        </p>

      </div>

      <div className="forecast-action">

        <strong>
          💡 Recommended Action
        </strong>

        <p>
          {insight.action}
        </p>

      </div>

    </div>
  );
}

export default ForecastInsight;