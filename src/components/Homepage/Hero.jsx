import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <div className='hero min-h-screen bg-base-200'>
      <div className='hero-content text-center'>
        <div className='max-w-md'>
          <h1 className='text-5xl font-bold'>Hello.</h1>
          <p className='py-6'>
            Selamat datang di website aplikasi prakiraan cuaca saya! ini adalah
            sebuah platform fullstack yang memberikan informasi cuaca terkini
            secara akurat dan terpercaya. Dibangun dengan menggunakan API dari
            wheaterapi.com untuk menyajikan data cuaca terupdate dengan cepat.
          </p>
          <button
            onClick={() => navigate("/cuaca")}
            className='btn btn-primary'>
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
