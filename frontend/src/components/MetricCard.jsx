function MetricCard({ title, value, subtitle, icon }) {
  return (
    <div className="metric-card">
      <div className="metric-icon">
        {icon}
      </div>

      <div>
        <p className="metric-title">{title}</p>

        <h2>{value}</h2>

        <p className="metric-subtitle">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

export default MetricCard;