import { useState, useEffect } from "react";
import { auth } from "../../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Login = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loggedInUser = Cookies.get("auth-token");

    if (loggedInUser && loggedInUser === "true") {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, []);

  const handleSubmit = async (values) => {
    try {
      const { email, password } = values;
      const { user } = await signInWithEmailAndPassword(auth, email, password);

      // Periksa apakah email telah diverifikasi
      if (!user.emailVerified) {
        setErrorMessage(
          "Email belum terverifikasi. Silahkan periksa email Anda dan verifikasi akun Anda."
        );
        // Tambahkan kode di sini untuk menangani tindakan selanjutnya jika email belum terverifikasi
        return;
      }

      Cookies.set("auth-token", user.refreshToken);
      Cookies.set("displayUser", auth.currentUser.displayName);
      Cookies.set("emailUser", auth.currentUser.email);
      navigate("/dashboard");
    } catch (error) {
      console.log("Error signing in:", error.message);
      setErrorMessage(error.message);
    }
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Email harus valid")
      .required("Email harus diisi"),
    password: Yup.string().required("Password harus diisi"),
  });

  return (
    <div className='h-screen w-full flex justify-center items-center'>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}>
        <Form className='max-w-md w-full bg-base-200 p-8 rounded-lg shadow-lg mx-3 sm:mx'>
          <p className='text-2xl mb-4 text-center font-semibold'>Login Akun</p>
          <div className='mb-4'>
            <label className='block font-bold mb-2' htmlFor='email'>
              Email
            </label>
            <Field
              type='email'
              id='email'
              name='email'
              className='input input-bordered border-white w-full mr-2 focus:outline-none'
            />
            <ErrorMessage
              name='email'
              component='div'
              className='text-red-500 text-xs italic py-2'
            />
          </div>
          <div className='mb-4'>
            <label className='block font-bold mb-2' htmlFor='password'>
              Password
            </label>
            <Field
              type='password'
              id='password'
              name='password'
              className='input input-bordered border-white w-full mr-2 focus:outline-none'
            />
            <ErrorMessage
              name='password'
              component='div'
              className='text-red-500 text-xs italic py-2'
            />
          </div>
          {errorMessage && (
            <div className='text-red-500 text-xs italic my-2'>
              {errorMessage}
            </div>
          )}
          <p className='text-sm my-2 text-right'>
            Belum Punya Akun?{" "}
            <Link to='/register' className='underline'>
              Daftar Sekarang.
            </Link>
          </p>
          <button
            type='submit'
            className='btn btn-primary rounded-xl focus:outline-none focus:shadow-outline normal-case'>
            Login
          </button>
        </Form>
      </Formik>
    </div>
  );
};

export default Login;
