import React, { useEffect, useState } from "react";
import axios from "axios";
import InputFrom from "./InputForm";
import MainCard from "./MainCard";
import Forecast from "./ForecastCard";

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
      <InputFrom
        searchCity={searchCity}
        handleCityChange={handleCityChange}
        handleSearch={handleSearch}
        handleAutoSearch={handleAutoSearch}
        setForecast={setForecast}
      />

      {weather ? (
        <MainCard
          weather={weather}
          forecast={forecast}
          setForecast={setForecast}
          weatherTranslations={weatherTranslations}
        />
      ) : null}

      {forecast ? (
        <Forecast weather={weather} weatherTranslations={weatherTranslations} />
      ) : null}
    </div>
  );
};

export default Weather;
