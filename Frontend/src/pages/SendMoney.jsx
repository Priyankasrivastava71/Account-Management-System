import { useEffect, useState } from "react";
import axios from "axios";

function SendMoney() {

  const [users, setUsers] = useState([]);
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {

    const fetchUsers = async () => {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/account/users",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setUsers(res.data);

    };

    fetchUsers();

  }, []);

  const sendMoney = async () => {

    const token = localStorage.getItem("token");

    await axios.post(
      "http://localhost:5000/api/account/transfer",
      {
        receiver,
        amount
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    alert("Money sent successfully");

  };

  return (

    <div className="container">

      <h2>Send Money</h2>

      <select onChange={(e) => setReceiver(e.target.value)}>

        <option>Select user</option>

        {users.map((user) => (

          <option key={user.id} value={user.id}>
            {user.name}
          </option>

        ))}

      </select>

      <input
        placeholder="Amount"
        onChange={(e) => setAmount(e.target.value)}
      />

      <button onClick={sendMoney}>
        Send Money
      </button>

    </div>

  );

}

export default SendMoney;