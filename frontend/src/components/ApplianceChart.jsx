import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

function ApplianceChart({ data }) {

  const chartData = Object.entries(data).map(
    ([name, value]) => ({
      name,
      value
    })
  );

  const colors = [
    "#0c5b31",
    "#2e8b53",
    "#538969",
    "#b7d9c2",
    "#d5e8da"
  ];

  return (
    <div className="chart-container">

      <div className="chart-header">

        <div>
          <h3>Appliance Consumption</h3>

          <p>
            Energy usage by appliance
          </p>
        </div>

      </div>

      <ResponsiveContainer
        width="100%"
        height={320}
      >

        <PieChart>

          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="45%"
            outerRadius={105}
            innerRadius={60}
            label
          >

            {chartData.map(
              (entry, index) => (

                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />

              )
            )}

          </Pie>

          <Tooltip />

          <Legend />

        </PieChart>

      </ResponsiveContainer>

    </div>
  );
}

export default ApplianceChart;