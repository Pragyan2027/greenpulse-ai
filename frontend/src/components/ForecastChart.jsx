import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";


function ForecastChart({ historicalData, forecastData }) {

  const combinedData = [
    ...historicalData.map((item) => ({
      period: item.timestamp.substring(11, 16),
      historical: item.energy,
      forecast: null
    })),

    ...forecastData.map((item) => ({
      period: item.period,
      historical: null,
      forecast: item.energy
    }))
  ];


  return (

    <div className="chart-container">

      <div className="chart-header">

        <div>

          <h3>
            Energy Consumption Forecast
          </h3>

          <p>
            Historical consumption and predicted future usage
          </p>

        </div>

      </div>


      <ResponsiveContainer
        width="100%"
        height={340}
      >

        <LineChart data={combinedData}>

          <CartesianGrid
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="period"
          />

          <YAxis
            label={{
              value: "kWh",
              angle: -90,
              position: "insideLeft"
            }}
          />

          <Tooltip />

          <Legend />


          <Line
            type="monotone"
            dataKey="historical"
            name="Historical"
            strokeWidth={3}
            dot={{ r: 3 }}
            connectNulls={false}
          />


          <Line
            type="monotone"
            dataKey="forecast"
            name="Forecast"
            strokeWidth={3}
            strokeDasharray="6 6"
            dot={{ r: 4 }}
            connectNulls={false}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>
  );
}


export default ForecastChart;