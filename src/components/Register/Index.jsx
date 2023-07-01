import { useState } from "react";
import { auth } from "../../config/firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";

const Index = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleSubmit = async (values) => {
    try {
      const { fullName, email, password } = values;
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(user, { displayName: fullName });

      // Kirim email verifikasi
      await sendEmailVerification(auth.currentUser);

      setRegistrationSuccess(true);
      // Lakukan sesuatu setelah pembuatan pengguna berhasil
    } catch (error) {
      console.log("Error creating user:", error.message);
      setErrorMessage(error.message);
    }
  };

  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required("Nama lengkap harus diisi"),
    email: Yup.string()
      .email("Email harus valid")
      .required("Email harus diisi"),
    password: Yup.string()
      .required("Password harus diisi")
      .min(8, "Password harus terdiri dari setidaknya 8 karakter"),
  });

  return (
    <div className='h-screen w-full flex justify-center items-center'>
      <Formik
        initialValues={{ fullName: "", email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}>
        <Form className='max-w-md w-full bg-base-200 p-8 rounded-lg shadow-lg mx-3 sm:mx-0'>
          <p className='text-2xl mb-4 text-center font-semibold'>
            Pendaftaran Akun
          </p>
          <div className='mb-4'>
            <label className='block font-bold mb-2' htmlFor='fullName'>
              Nama Lengkap
            </label>
            <Field
              type='text'
              id='fullName'
              name='fullName'
              className='input input-bordered border-white w-full mr-2 focus:outline-none'
            />
            <ErrorMessage
              name='fullName'
              component='div'
              className='text-red-500 text-xs italic py-2'
            />
          </div>
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
          {registrationSuccess && (
            <div className='text-green-500 text-xs italic my-2'>
              Pendaftaran Anda berhasil! Silakan klik tautan verifikasi yang
              telah dikirimkan ke alamat email Anda.
            </div>
          )}
          <p className='text-sm my-2 text-right'>
            Sudah Punya Akun?{" "}
            <Link to='/login' className='underline'>
              Login Sekarang.
            </Link>
          </p>
          <button
            type='submit'
            className='btn btn-primary rounded-xl focus:outline-none focus:shadow-outline normal-case'>
            Daftar
          </button>
          {errorMessage && (
            <div className='text-red-500 text-xs italic mt-2'>
              {errorMessage}
            </div>
          )}
        </Form>
      </Formik>
    </div>
  );
};

export default Index;
