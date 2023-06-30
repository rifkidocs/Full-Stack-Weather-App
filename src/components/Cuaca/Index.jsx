import React, { useEffect, useState } from "react";
import axios from "axios";
import InputFrom from "./InputForm";
import MainCard from "./MainCard";
import Forecast from "./ForecastCard";
import weatherTranslations from "../../constants";

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [searchCity, setSearchCity] = useState("");
  const [autoCity, setAutoCity] = useState("");
  const [forecast, setForecast] = useState(false);
  const [shouldFetchData, setShouldFetchData] = useState(false);

  useEffect(() => {
    if (shouldFetchData) {
      fetchWeatherData();
      setShouldFetchData(false);
    }
  }, [shouldFetchData]);

  const fetchWeatherData = async () => {
    try {
      const response = await axios.get(
        `https://api.weatherapi.com/v1/forecast.json?key=f5099561e5ca4e09851145358231006&q=${
          searchCity ? searchCity : autoCity
        }&days=9`
      );
      setWeather(response.data);
      setSearchCity("");
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const handleCityChange = (event) => {
    setSearchCity(event.target.value);
  };

  const handleSearch = () => {
    setShouldFetchData(true); // Set shouldFetchData ke true saat tombol pencarian ditekan
  };

  const handleAutoSearch = () => {
    setAutoCity("auto:ip");
    setShouldFetchData(true); // Set shouldFetchData ke true saat tombol pencarian otomatis ditekan
  };

  return (
    <div className='flex flex-col items-center min-h-screen place-items-center justify-center py-3 px-3 bg-base-200'>
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
