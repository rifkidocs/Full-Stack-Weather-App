import React from "react";

const InputFrom = ({
  searchCity,
  handleCityChange,
  handleSearch,
  handleAutoSearch,
  setForecast,
}) => {
  return (
    <div className='mb-4 flex flex-col w-full max-w-md'>
      <input
        type='text'
        placeholder='Cari Kota'
        value={searchCity}
        onChange={handleCityChange}
        className='input input-bordered rounded w-ful leading-tight focus:outline-none focus:shadow-outline'
      />
      <button
        onClick={() => {
          handleSearch();
          setForecast(false);
        }}
        className='rounded-lg btn btn-primary my-2'>
        Cari
      </button>
      <button
        onClick={() => {
          handleAutoSearch();
          setForecast(false);
        }}
        className='rounded-lg btn btn-secondary'>
        Otomatis
      </button>
    </div>
  );
};

export default InputFrom;
