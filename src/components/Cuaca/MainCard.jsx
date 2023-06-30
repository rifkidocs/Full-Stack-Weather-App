import React, { useRef } from "react";

const MainCard = ({ weather, forecast, setForecast, weatherTranslations }) => {
  const modalRef = useRef(null);

  const handleShowModal = () => {
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  };

  const handleCloseModal = () => {
    if (modalRef.current) {
      modalRef.current.close();
    }
  };

  return (
    <div className='card bg-base-200 shadow-md w-full sm:w-auto'>
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

        {/* Open the modal using ref */}
        <button className='btn btn-info normal-case' onClick={handleShowModal}>
          Tampilkan Detail
        </button>
        <dialog ref={modalRef} className='modal modal-bottom sm:modal-middle'>
          <form method='dialog' className='modal-box'>
            <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>
              ✕
            </button>
            <h3 className='font-bold text-lg'>Detail Cuaca</h3>
            {weather &&
              weather.forecast.forecastday[0].hour.map((hour) => (
                <div key={hour.time_epoch} className='text-left'>
                  <figure>
                    <img
                      src={hour.condition.icon}
                      alt={hour.condition.text}
                      className='w-10 h-10'
                    />
                  </figure>
                  <p className='font-bold'>{hour.time.split(" ")[1]}</p>
                  <p className='text-left'>
                    {weatherTranslations[hour.condition.text]}
                  </p>
                  <p className='text-left'>Suhu: {hour.temp_c}°C</p>
                  <div className='divider'></div>
                </div>
              ))}
            <div className='modal-action'>
              <button className='btn' onClick={handleCloseModal}>
                Close
              </button>
            </div>
          </form>
        </dialog>
      </div>
    </div>
  );
};

export default MainCard;
