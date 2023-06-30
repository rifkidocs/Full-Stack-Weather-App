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
  const [locations, setLocations] = useState([]); // Menyimpan data array location
  const [maxError, setMaxError] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null); // Menyimpan indeks lokasi yang dipilih
  const [shouldFetchData, setShouldFetchData] = useState(true);
  const [weatherData, setWeatherData] = useState([]); // Menyimpan data cuaca

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Pengguna telah masuk, dapatkan alamat email pengguna
        const userEmail = user.email;
        // Lakukan tindakan sesuai kebutuhan
        fetchData(userEmail);
      } else {
        // Pengguna belum masuk, arahkan kembali ke halaman login
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, []); // Gunakan dependensi kosong agar pemanggilan hanya dilakukan saat komponen dipasang

  const fetchData = async (userEmail) => {
    try {
      const userDocRef = doc(db, "Favlocations", userEmail);
      const docSnapshot = await getDoc(userDocRef);

      if (docSnapshot.exists()) {
        const { location } = docSnapshot.data();
        setLocations(location);
        setShouldFetchData(true); // Mengatur shouldFetchData ke true untuk memicu pemanggilan fetchWeatherData
      } else {
        setLocations([]);
        setWeatherData([]); // Mengatur weatherData ke array kosong ketika tidak ada lokasi
      }
    } catch (err) {
      console.error("Error mengambil data lokasi:", err);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Ubah huruf pertama menjadi huruf besar
    const formattedCityName =
      cityName.charAt(0).toUpperCase() + cityName.slice(1);

    // Simpan nama kota ke Firestore
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

    // Reset nilai input
    setCityName("");
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
      setSelectedLocation(null); // Menutup ForecastCard jika lokasi yang sama diaktifkan kembali
    } else {
      setSelectedLocation(index); // Membuka ForecastCard untuk lokasi yang dipilih
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
        {maxError ? <span>Batas maksimal 5 field telah tercapai</span> : null}
        <button type='submit'>Tambahkan</button>
      </form>

      {locations.length > 0 ? (
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
      ) : (
        <p>Data tidak tersedia</p>
      )}

      <div>
        <p>Data Lokasi Cuaca</p>
        {weatherData.length > 0 ? (
          weatherData.map((weather, index) => (
            <div key={index}>
              <MainCard
                weather={weather}
                forecast={selectedLocation === index} // Menyediakan nilai boolean yang menentukan apakah ForecastCard harus ditampilkan
                setForecast={() => handleSetForecast(index)} // Menyediakan fungsi untuk mengubah status ForecastCard
                weatherTranslations={weatherTranslations}
              />
              {selectedLocation === index ? (
                <ForecastCard
                  weather={weather}
                  weatherTranslations={weatherTranslations}
                />
              ) : null}
            </div>
          ))
        ) : (
          <p>Data prakiraan cuaca tidak tersedia</p>
        )}
      </div>
    </div>
  );
};

export default Index;
