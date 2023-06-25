import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Periksa apakah pengguna telah masuk
    const loggedInUser = Cookies.get("loggedInUser");

    if (!loggedInUser) {
      // Pengguna belum masuk, arahkan kembali ke halaman login
      navigate("/login");
    }
  }, [history]);

  return <div>Dashboard Content</div>;
};

export default Dashboard;
