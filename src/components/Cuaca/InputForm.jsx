import React from "react";

const InputFrom = ({
  searchCity,
  handleCityChange,
  handleSearch,
  handleAutoSearch,
  setForecast,
}) => {
  return (
    <div className='mb-4 max-w-xs'>
      <div className='flex place-items-center'>
        <input
          type='text'
          placeholder='Cari Kota'
          value={searchCity}
          onChange={handleCityChange}
          className='input input-bordered input-accent  w-full mr-2 focus:outline-none'
        />
        <button
          onClick={() => {
            handleSearch();
            setForecast(false);
          }}
          className='rounded-lg btn btn-primary my-2 normal-case'>
          Cari
        </button>
      </div>
      <button
        onClick={() => {
          handleAutoSearch();
          setForecast(false);
        }}
        className='rounded-lg btn btn-secondary w-full normal-case'>
        Otomatis
      </button>
    </div>
  );
};

export default InputFrom;
