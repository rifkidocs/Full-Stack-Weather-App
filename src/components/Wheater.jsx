import React, { useEffect, useState } from "react";
import axios from "axios";

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [searchCity, setSearchCity] = useState("");
  const [autoCity, setAutoCity] = useState("");
  const [forecast, setForecast] = useState(false);

  const weatherTranslations = {
    // Daftar terjemahan cuaca
    Clear: "Cerah",
    Sunny: "Cerah",
    "Partly cloudy": "Berawan sebagian",
    Cloudy: "Berawan",
    Overcast: "Mendung",
    Mist: "Kabut",
    "Patchy rain possible": "Hujan ringan kemungkinan terjadi",
    "Patchy snow possible": "Salju ringan kemungkinan terjadi",
    "Patchy sleet possible": "Hujan es ringan kemungkinan terjadi",
    "Patchy freezing drizzle possible":
      "Gerimis beku ringan kemungkinan terjadi",
    "Thundery outbreaks possible": "Potensi petir",
    "Blowing snow": "Salju berserakan",
    Blizzard: "Badai salju",
    Fog: "Kabut",
    "Freezing fog": "Kabut beku",
    "Patchy light drizzle": "Gerimis ringan",
    "Light drizzle": "Gerimis ringan",
    "Freezing drizzle": "Gerimis beku",
    "Heavy freezing drizzle": "Gerimis beku yang intens",
    "Patchy light rain": "Hujan ringan",
    "Light rain": "Hujan ringan",
    "Moderate rain at times": "Hujan sedang kadang-kadang",
    "Moderate rain": "Hujan sedang",
    "Heavy rain at times": "Hujan deras kadang-kadang",
    "Heavy rain": "Hujan deras",
    "Light freezing rain": "Hujan beku ringan",
    "Moderate or heavy freezing rain": "Hujan beku sedang atau intens",
    "Light sleet": "Hujan es ringan",
    "Moderate or heavy sleet": "Hujan es sedang atau intens",
    "Patchy light snow": "Salju ringan",
    "Light snow": "Salju ringan",
    "Patchy moderate snow": "Salju sedang",
    "Moderate snow": "Salju sedang",
    "Patchy heavy snow": "Salju intens",
    "Heavy snow": "Salju intens",
    "Ice pellets": "Bijian es",
    "Light rain shower": "Hujan ringan",
    "Moderate or heavy rain shower": "Hujan sedang atau deras",
    "Torrential rain shower": "Hujan lebat",
    "Light sleet showers": "Hujan es ringan",
    "Moderate or heavy sleet showers": "Hujan es sedang atau deras",
    "Light snow showers": "Hujan salju ringan",
    "Moderate or heavy snow showers": "Hujan salju sedang atau deras",
    "Light showers of ice pellets": "Hujan bijian es ringan",
    "Moderate or heavy showers of ice pellets":
      "Hujan bijian es sedang atau deras",
    "Patchy light rain with thunder": "Hujan ringan dengan petir",
    "Moderate or heavy rain with thunder":
      "Hujan sedang atau deras dengan petir",
    "Patchy light snow with thunder": "Salju ringan dengan petir",
    "Moderate or heavy snow with thunder":
      "Salju sedang atau deras dengan petir",
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    try {
      const response = await axios.get(
        `https://api.weatherapi.com/v1/forecast.json?key=f5099561e5ca4e09851145358231006&q=${
          searchCity ? searchCity : autoCity
        }&days=9`
      );
      setWeather(response.data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const handleCityChange = (event) => {
    setSearchCity(event.target.value);
  };

  const handleSearch = () => {
    fetchWeatherData();
    setSearchCity(""); // Reset search city input value
  };

  const handleAutoSearch = () => {
    setAutoCity("auto:ip");
  };

  useEffect(() => {
    if (autoCity === "auto:ip") {
      fetchWeatherData();
      setAutoCity(""); // Reset search city input value
    }
  }, [autoCity]);

  return (
    <div className='flex flex-col items-center min-h-screen place-items-center justify-center py-4 bg-base-200'>
      <div className='mb-4 flex mx-6'>
        <input
          type='text'
          placeholder='Cari Kota'
          value={searchCity}
          onChange={handleCityChange}
          className='input input-bordered input-secondary w-full max-w-xs'
        />
        <button
          onClick={() => {
            handleSearch();
            setForecast(false);
          }}
          className='px-4 py-2 ml-2 rounded-lg btn btn-primary normal-case'>
          Cari
        </button>
        <button
          onClick={() => {
            handleAutoSearch();
            setForecast(false);
          }}
          className='px-4 py-2 ml-2 rounded-lg btn btn-secondary normal-case'>
          Otomatis
        </button>
      </div>

      {weather ? (
        <div className='card bg-base-100 shadow-md mx-5 w-fit'>
          <figure className='px-10 pt-10'>
            <img
              src={weather.current.condition.icon}
              alt={weather.current.condition.text}
              className='w-24 h-24 mx-auto'
            />
          </figure>
          <div className='card-body items-center text-center'>
            <h2 className='card-title'>
              {weather.location.name}, {weather.location.region},{" "}
              {weather.location.country}
            </h2>
            <p className='text-lg font-bold'>
              {weatherTranslations[weather.current.condition.text]}
            </p>
            <p>Suhu Sekarang: {weather.current.temp_c}°C</p>
            <p>Suhu Min: {weather.forecast.forecastday[0].day.mintemp_c}°C</p>
            <p>Suhu Max: {weather.forecast.forecastday[0].day.maxtemp_c}°C</p>
            <p>Kelembapan: {weather.current.humidity}%</p>
            <p>Kecepatan Angin: {weather.current.wind_kph} km/jam</p>
            <p>Arah Angin: {weather.current.wind_dir}</p>
            <p>
              Lokasi: {weather.location.lat}, {weather.location.lon}
            </p>
            <p>Waktu Lokal: {weather.location.localtime}</p>
            <button
              onClick={() => {
                if (forecast) {
                  setForecast(false);
                } else {
                  setForecast(true);
                }
              }}
              className={`btn ${
                forecast ? "btn-secondary" : "btn-primary"
              } normal-case mt-2`}>
              {forecast ? "Tutup Prakiraan" : "Tampilkan Prakiraan"}
            </button>
          </div>
        </div>
      ) : null}

      {forecast ? (
        <div className='mt-4 mx-6'>
          <h3 className='text-lg font-semibold mb-2 text-center'>
            Prakiraan Cuaca
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
            {weather.forecast.forecastday.map((day) => (
              <div key={day.date} className='card bg-base-100 shadow-md p-4'>
                <figure>
                  <img
                    src={day.day.condition.icon}
                    alt={weather.current.condition.text}
                    className='w-14 h-14 mx-auto'
                  />
                </figure>
                <p className='font-bold'>{day.date}</p>
                <p>{weatherTranslations[day.day.condition.text]}</p>
                <p>Suhu Min: {day.day.mintemp_c}°C</p>
                <p>Suhu Max: {day.day.maxtemp_c}°C</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Weather;
