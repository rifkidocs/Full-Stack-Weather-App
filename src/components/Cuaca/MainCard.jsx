import React from "react";

const MainCard = ({ weather, forecast, setForecast, weatherTranslations }) => {
  return (
    <div className='card bg-base-100 shadow-md w-full sm:w-auto'>
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

        {/* Open the modal using ID.showModal() method */}
        <button
          className='btn normal-case'
          onClick={() => window.my_modal_5.showModal()}>
          Tampilkan Detail
        </button>
        <dialog id='my_modal_5' className='modal modal-bottom sm:modal-middle'>
          <form method='dialog' className='modal-box'>
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
              <button className='btn'>Close</button>
            </div>
          </form>
        </dialog>
      </div>
    </div>
  );
};

export default MainCard;
