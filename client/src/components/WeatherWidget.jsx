import { useEffect, useState } from "react";
import axios from "axios";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area
} from "recharts";

import {
  WiDaySunny,
  WiCloud,
  WiRain
} from "react-icons/wi";

function getIcon(weather) {
  if (weather.includes("rain")) return <WiRain size={30} />;
  if (weather.includes("cloud")) return <WiCloud size={30} />;
  return <WiDaySunny size={30} />;
}

export default function WeatherWidget() {

  const [forecast, setForecast] = useState([]);
  const [current, setCurrent] = useState(null);

  useEffect(() => {

    const fetchWeather = async () => {

      const res = await axios.get(
        "https://api.openweathermap.org/data/2.5/forecast?q=Bangalore&units=metric&appid=8917daa32822f059af9140c076fca86b"
      );

      const data = res.data.list;

      const daily = [];

      const usedDays = new Set();

      data.forEach(item => {

        const date = new Date(item.dt_txt);

        const day = date.toLocaleDateString("en-US", { weekday: "short" });

        if (!usedDays.has(day) && daily.length < 7) {

          usedDays.add(day);

          daily.push({
            day: day,
            high: Math.round(item.main.temp_max),
            low: Math.round(item.main.temp_min),
            rain: Math.round(item.pop * 100),
            weather: item.weather[0].description
          });

        }

      });

      setForecast(daily);

      setCurrent({
        city: res.data.city.name,
        temp: Math.round(data[0].main.temp),
        desc: data[0].weather[0].description,
        feels: Math.round(data[0].main.feels_like),
        visibility: data[0].visibility / 1000
      });

    };

    fetchWeather();

  }, []);

  if (!current || forecast.length === 0) {
    return (
      <div className="bg-gray-900 text-white p-6 rounded-xl">
        Loading weather...
      </div>
    );
  }

  return (

    <div className="bg-gray-900 text-white p-6 rounded-xl">

      {/* Top section */}  

      <div className="flex justify-between items-center mb-1">
 
        <div>
 
          <p className="text-gray-400 text-sm">
            {current.city}
          </p>
     

         <h1 className="text-xl font-bold">
            {current.temp}°C
          </h1>

          <p className="text-gray-400 capitalize">
            {current.desc}
          </p>

        </div>

        {getIcon(current.desc)}

      </div>

      {/* Extra stats */}

      <div className="flex justify-between text-sm text-gray-400 mb-2">

        <span>👁 Visibility: {current.visibility} km</span>
        <span>🌡 Feels like: {current.feels}°C</span>

      </div>

      {/* Forecast row */}

      <div className="flex justify-between mb-2">

        {forecast.map((d,i)=>(

          <div
            key={i}
            className="flex flex-col items-center text-sm text-gray-300"
          >

            <p>{d.day}</p>

            {getIcon(d.weather)}

            <p className="text-yellow-400 font-semibold">
              {d.high}°
            </p>

            <p className="text-gray-500 text-xs">
              {d.low}°
            </p>

          </div>

        ))}

      </div>

      {/* Temperature graph */}

<div className="h-52">

<ResponsiveContainer width="100%" height="100%">

<LineChart data={forecast}>

<XAxis dataKey="day" stroke="#aaa" />

{/* LEFT AXIS - HIGH TEMP */}
<YAxis
  yAxisId="left"
  stroke="#facc15"
  domain={["dataMin - 2", "dataMax + 2"]}
/>

<YAxis
  yAxisId="right"
  orientation="right"
  stroke="#3b82f6"
  domain={["dataMin - 2", "dataMax + 2"]}
/>
<YAxis yAxisId="rain" hide domain={[0, 100]} />

{/* RIGHT AXIS - LOW TEMP */}
<YAxis yAxisId="right" orientation="right" stroke="#3b82f6" />

<Tooltip />

<Legend />

{/* HIGH TEMP */}
<Line
  yAxisId="left"
  type="monotone"
  dataKey="high"
  stroke="#facc15"
  strokeWidth={4}
  dot={{ r:6 }}
  name="High Temp"
/>

{/* LOW TEMP */}
<Line
  yAxisId="right"
  type="monotone"
  dataKey="low"
  stroke="#3b82f6"
  strokeWidth={3}
  strokeDasharray="6 6"
  dot={{ r:5 }}
  name="Low Temp"
/>

{/* RAIN */}
<Area
yAxisId="rain"
  type="monotone"
  dataKey="rain"
  stroke="#22c55e"
  fill="#22c55e"
  fillOpacity={0.3}
  name="Rain"
/>

</LineChart>

</ResponsiveContainer>

</div>

    </div>

  );

}