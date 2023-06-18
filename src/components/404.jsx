import React from "react";

const NotFound = () => {
  return (
    <main className='h-screen flex flex-col justify-center items-center'>
      <p className='sm:text-3xl text-2xl font-bold'>
        404 <span className='font-normal'>Not Found</span>
      </p>
      <p className='sm:text-2xl text-xl font-light'>Halaman tidak ditemukan</p>
    </main>
  );
};

export default NotFound;
