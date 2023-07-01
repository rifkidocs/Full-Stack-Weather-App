import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../config/firebase";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayRemove,
} from "firebase/firestore";
import weatherTranslations from "../../constants";
import MainCard from "../Cuaca/MainCard";
import ForecastCard from "../Cuaca/ForecastCard";
import Cookies from "js-cookie";

const Index = () => {
  // Menginisialisasi state dan hooks
  const navigate = useNavigate();
  const [cityName, setCityName] = useState("");
  const [locations, setLocations] = useState([]);
  const [maxError, setMaxError] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [shouldFetchData, setShouldFetchData] = useState(true);
  const [weatherData, setWeatherData] = useState([]);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    const loggedInUser = Cookies.get("loggedInUser");

    if (loggedInUser === "true") {
      fetchData(auth?.currentUser?.email);
    } else {
      navigate("/login");
    }
  }, []);

  const fetchData = async (userEmail) => {
    // Mengambil data lokasi dari Firestore berdasarkan email pengguna
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

      if (location && location.length < 5) {
        location.push(formattedCityName);
        await updateDoc(userDocRef, { location });
        setLocations([...location]);
      } else if (location && location.length >= 5) {
        setMaxError(true);
      } else {
        const locationData = {
          location: [formattedCityName],
        };
        await setDoc(userDocRef, locationData);
        setLocations([formattedCityName]);
      }
    } else {
      const locationData = {
        location: [formattedCityName],
      };
      await setDoc(userDocRef, locationData);
      setLocations([formattedCityName]);
    }

    // Memperbarui data cuaca setelah perubahan database
    fetchWeatherData();
    setShouldFetchData(true);
    setCityName("");
  };

  const capitalizeFirstLetter = (str) => {
    // Mengubah huruf pertama dalam string menjadi huruf besar
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Mengambil data cuaca ketika perubahan pada `shouldFetchData`
  useEffect(() => {
    if (shouldFetchData) {
      fetchWeatherData();
      setShouldFetchData(false);
    }
  }, [shouldFetchData]);

  const fetchWeatherData = async () => {
    // Mengambil data cuaca untuk setiap lokasi menggunakan API weatherapi.com
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
    // Menangani pemilihan prakiraan cuaca untuk lokasi tertentu
    if (selectedLocation === index) {
      setSelectedLocation(null);
    } else {
      setSelectedLocation(index);
    }
  };

  const handleDeleteLocation = async (index) => {
    // Menyiapkan penghapusan lokasi
    setDeleteIndex(index);
    setShowModalDelete(true);
  };

  const handleEditLocation = async (index, value) => {
    // Menyiapkan pengeditan lokasi
    setEditIndex(index);
    setEditValue(value);
    setShowModalEdit(true);
  };

  const confirmDeleteLocation = async () => {
    // Mengkonfirmasi dan menghapus lokasi dari database Firestore
    const userDocRef = doc(db, "Favlocations", auth.currentUser.email);
    await updateDoc(userDocRef, {
      location: arrayRemove(locations[deleteIndex]),
    });
    setLocations((prevLocations) =>
      prevLocations.filter((_, i) => i !== deleteIndex)
    );
    setWeatherData((prevData) => prevData.filter((_, i) => i !== deleteIndex));
    setShowModalDelete(false);
    setDeleteIndex(null);
    setMaxError(false);
  };

  const confirmEditLocation = async () => {
    // Mengkonfirmasi dan mengedit lokasi pada database Firestore
    const userDocRef = doc(db, "Favlocations", auth.currentUser.email);
    const newLocations = [...locations];
    newLocations[editIndex] = capitalizeFirstLetter(editValue);
    await updateDoc(userDocRef, { location: newLocations });
    setLocations(newLocations);
    setShouldFetchData(true);
    setShowModalEdit(false);
  };

  const handleShowDetail = () => {
    // Menangani logika untuk menampilkan detail modal di sini
    // Misalnya, mengatur variabel state untuk mengontrol keterlihatan modal
  };

  const handleShowTable = () => {
    if (showTable) {
      setShowTable(false);
    } else {
      setShowTable(true);
    }
  };

  const closeModal = () => {
    // Menutup modal
    setShowModalDelete(false);
    setShowModalEdit(false);
    setDeleteIndex(null);
  };

  const displayUser = Cookies.get("displayUser");

  const renderLocationTable = () => {
    return (
      <table className='table mt-3 w-full max-w-md text-md text-left'>
        <thead className='text-slate-400 '>
          <tr>
            <th scope='col' className='px-6 py-3'>
              No
            </th>
            <th scope='col' className='px-6 py-3'>
              Kota
            </th>
            <th scope='col' className='px-6 py-3'>
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {locations ? (
            locations.map((location, index) => (
              <tr key={index}>
                <td className='px-6 py-4'>{index + 1}</td>
                <td className='px-6 py-4'>{location}</td>
                <td className='px-6 py-4'>
                  <button
                    className='bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-2 rounded mr-1'
                    onClick={() => handleDeleteLocation(index)}>
                    Delete
                  </button>
                  <button
                    className='bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-2 rounded'
                    onClick={() => handleEditLocation(index, location)}>
                    Edit
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
              <td className='px-6 py-4'></td>
              <td className='px-6 py-4'></td>
              <td className='px-6 py-4'></td>
            </tr>
          )}
        </tbody>
      </table>
    );
  };

  const renderWeatherCards = () => {
    // Render kartu-kartu cuaca
    if (weatherData.length > 0) {
      return weatherData.map((weather, index) => (
        <div
          className='min-w-full flex flex-col place-items-center py-3'
          key={index}>
          <MainCard
            key={index}
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
      return <p className='mt-3'>Data prakiraan cuaca tidak tersedia</p>;
    }
  };

  return (
    <div className='flex flex-col items-center min-h-screen place-items-center justify-center py-3 px-3'>
      <p className='text-xl font-bold px-2 xl:px-28 mb-3'>{`Halo ${displayUser}`}</p>

      <form
        className='flex justify-center place-items-center'
        onSubmit={handleFormSubmit}>
        <input
          className='input input-bordered input-success w-full max-w-xs mr-2 focus:outline-none'
          placeholder='Tambahkan  Kota'
          type='text'
          value={cityName}
          onChange={(e) => {
            setCityName(e.target.value);
            setMaxError(false);
          }}
          required
        />
        <button className='btn btn-primary normal-case' type='submit'>
          Tambahkan
        </button>
      </form>
      {maxError && (
        <span className='mt-2 text-red-500 italic'>
          Batas maksimal 5 field telah tercapai
        </span>
      )}

      {showTable ? (
        <button
          onClick={() => {
            handleShowTable();
            setMaxError(false);
          }}
          className='btn bg-base-200 normal-case mt-3'>
          Sembunyikan Kota
        </button>
      ) : (
        <button
          onClick={handleShowTable}
          className='btn btn-info normal-case mt-3'>
          Tampilkan Kota
        </button>
      )}

      {showTable && renderLocationTable()}

      {renderWeatherCards()}

      {showModalDelete && (
        <dialog
          id='my_modal_5'
          className='modal modal-bottom sm:modal-middle'
          open>
          <form method='dialog' className='modal-box'>
            <h3 className='font-bold text-lg'>Konfirmasi Hapus</h3>
            <p className='py-4'>
              Apakah Anda yakin ingin menghapus lokasi ini?
            </p>
            <div className='modal-action'>
              <button
                className='btn btn-success'
                onClick={confirmDeleteLocation}>
                Hapus
              </button>
              <button className='btn' onClick={closeModal}>
                Batal
              </button>
            </div>
          </form>
        </dialog>
      )}

      {showModalEdit && (
        <dialog
          id='my_modal_5'
          className='modal modal-bottom sm:modal-middle'
          open>
          <form method='dialog' className='modal-box'>
            <h3 className='font-bold text-lg'>Edit Kota</h3>
            <p className='py-4'>Masukkan nama kota yang keinginan anda!</p>
            <input
              className='input input-bordered input-primary w-full'
              type='text'
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
            />
            <div className='modal-action'>
              <button className='btn btn-success' onClick={confirmEditLocation}>
                Update
              </button>
              <button className='btn' onClick={closeModal}>
                Batal
              </button>
            </div>
          </form>
        </dialog>
      )}
    </div>
  );
};

export default Index;
