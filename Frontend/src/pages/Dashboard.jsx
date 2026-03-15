import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Dashboard() {

  const [balance, setBalance] = useState(0);

  useEffect(() => {

    const fetchBalance = async () => {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/account/balance",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setBalance(res.data.balance);

    };

    fetchBalance();

  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (

    <div className="dashboard">

      <h1>Dashboard</h1>

      <h2 className="balance">₹ {balance}</h2>

      <div className="actions">

        <Link to="/send-money">
          Send Money
        </Link>

        <Link to="/statement">
          View Statement
        </Link>

      </div>

      <button onClick={logout}>
        Logout
      </button>

    </div>

  );

}

export default Dashboard;