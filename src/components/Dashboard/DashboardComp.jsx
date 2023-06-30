import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { auth, db } from "../../config/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import weatherTranslations from "../../constants";
import MainCard from "../Cuaca/MainCard";
import ForecastCard from "../Cuaca/ForecastCard";

const Index = () => {
  const navigate = useNavigate();
  const [cityName, setCityName] = useState("");
  const [locations, setLocations] = useState([]);
  const [maxError, setMaxError] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [shouldFetchData, setShouldFetchData] = useState(true);
  const [weatherData, setWeatherData] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, handleAuthStateChanged);

    return () => unsubscribe();
  }, []);

  const handleAuthStateChanged = (user) => {
    if (user) {
      fetchData(user.email);
    } else {
      navigate("/login");
    }
  };

  const fetchData = async (userEmail) => {
    try {
      const userDocRef = doc(db, "Favlocations", userEmail);
      const docSnapshot = await getDoc(userDocRef);

      if (docSnapshot.exists()) {
        const { location } = docSnapshot.data();
        setLocations(location);
        setShouldFetchData(true);
      } else {
        setLocations([]);
        setWeatherData([]);
      }
    } catch (err) {
      console.error("Error mengambil data lokasi:", err);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formattedCityName = capitalizeFirstLetter(cityName);

    const userDocRef = doc(db, "Favlocations", auth.currentUser.email);
    const docSnapshot = await getDoc(userDocRef);

    if (docSnapshot.exists()) {
      const { location } = docSnapshot.data();

      if (location.length < 5) {
        location.push(formattedCityName);
        await setDoc(userDocRef, { location }, { merge: true });
        setLocations([...location]);
      } else {
        setMaxError(true);
      }
    } else {
      const locationData = {
        location: [formattedCityName],
      };
      await setDoc(userDocRef, locationData);
      setLocations([formattedCityName]);
    }

    setCityName("");
  };

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  useEffect(() => {
    if (shouldFetchData) {
      fetchWeatherData();
      setShouldFetchData(false);
    }
  }, [shouldFetchData]);

  const fetchWeatherData = async () => {
    try {
      const weatherPromises = locations.map(async (location) => {
        const response = await axios.get(
          `https://api.weatherapi.com/v1/forecast.json?key=f5099561e5ca4e09851145358231006&q=${location}&days=9`
        );
        return response.data;
      });

      const weatherResults = await Promise.all(weatherPromises);
      setWeatherData(weatherResults);
    } catch (error) {
      console.error("Error mengambil data cuaca:", error);
    }
  };

  const handleSetForecast = (index) => {
    if (selectedLocation === index) {
      setSelectedLocation(null);
    } else {
      setSelectedLocation(index);
    }
  };

  const handleShowDetail = () => {
    // Handle logic for showing the detail modal here
    // For example, set a state variable to control the modal visibility
  };

  const closeModal = () => {
    // Handle logic for closing the detail modal here
    // For example, set the state variable to control the modal visibility to false
  };

  const renderLocationTable = () => {
    if (locations.length > 0) {
      return (
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Kota</th>
            </tr>
          </thead>
          <tbody>
            {locations.map((location, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    } else {
      return <p>Data tidak tersedia</p>;
    }
  };

  const renderWeatherCards = () => {
    if (weatherData.length > 0) {
      return weatherData.map((weather, index) => (
        <div key={index}>
          <MainCard
            weather={weather}
            forecast={selectedLocation === index}
            setForecast={() => handleSetForecast(index)}
            weatherTranslations={weatherTranslations}
            showDetail={handleShowDetail}
          />
          {selectedLocation === index ? (
            <ForecastCard
              weather={weather}
              weatherTranslations={weatherTranslations}
            />
          ) : null}
        </div>
      ));
    } else {
      return <p>Data prakiraan cuaca tidak tersedia</p>;
    }
  };

  return (
    <div>
      <h2>Dashboard</h2>

      <form onSubmit={handleFormSubmit}>
        <label>
          Nama Kota:
          <input
            type='text'
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
            required
          />
        </label>
        {maxError && <span>Batas maksimal 5 field telah tercapai</span>}
        <button type='submit'>Tambahkan</button>
      </form>

      {renderLocationTable()}

      <div>
        <p>Data Lokasi Cuaca</p>
        {renderWeatherCards()}
      </div>
    </div>
  );
};

export default Index;
