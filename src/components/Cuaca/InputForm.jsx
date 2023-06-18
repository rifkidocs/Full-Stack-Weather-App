import React from "react";

const InputFrom = ({
  searchCity,
  handleCityChange,
  handleSearch,
  handleAutoSearch,
  setForecast,
}) => {
  return (
    <div className='mb-4 flex'>
      <input
        type='text'
        placeholder='Cari Kota'
        value={searchCity}
        onChange={handleCityChange}
        className='input input-bordered input-secondary w-full max-w-xs'
      />
      <button
        onClick={() => {
          handleSearch();
          setForecast(false);
        }}
        className='px-4 py-2 ml-2 rounded-lg btn btn-primary normal-case'>
        Cari
      </button>
      <button
        onClick={() => {
          handleAutoSearch();
          setForecast(false);
        }}
        className='px-4 py-2 ml-2 rounded-lg btn btn-secondary normal-case'>
        Otomatis
      </button>
    </div>
  );
};

export default InputFrom;
