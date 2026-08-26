import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function EnergyChart({ data }) {

  return (

    <div className="chart-container">

      <div className="chart-header">

        <div>
          <h3>Energy Consumption</h3>

          <p>
            Consumption over time
          </p>
        </div>

      </div>

      <ResponsiveContainer
        width="100%"
        height={320}
      >

        <LineChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="timestamp"
            tickFormatter={(value) =>
              value.substring(11, 16)
            }
          />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="energy"
            strokeWidth={3}
            dot={{ r: 4 }}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>

  );
}

export default EnergyChart;