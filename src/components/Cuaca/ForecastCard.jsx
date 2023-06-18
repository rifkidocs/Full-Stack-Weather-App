import React from "react";

const Forecast = ({ weather, weatherTranslations }) => {
  return (
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
  );
};

export default Forecast;
