import { useEffect, useState } from "react";
import axios from "axios";

function Statement() {

  const [transactions, setTransactions] = useState([]);

  useEffect(() => {

    const fetchTransactions = async () => {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/account/statement",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setTransactions(res.data);

    };

    fetchTransactions();

  }, []);

  return (

    <div className="dashboard">

      <h2>Transaction History</h2>

      {transactions.map((t, i) => (

        <div
          key={i}
          className={`transaction ${
            t.type === "credit" ? "credit" : "debit"
          }`}
        >

          <p>{t.type}</p>

          <p>₹ {t.amount}</p>

        </div>

      ))}

    </div>

  );

}

export default Statement;