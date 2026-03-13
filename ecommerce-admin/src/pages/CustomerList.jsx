import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../components/AdminLayout";
import "./Customer.css";

export default function CustomerList() {

  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("adminToken");

  const fetchCustomers = async () => {

    const { data } = await axios.get(
      "http://localhost:5000/api/users/customers",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setCustomers(data);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (

    <AdminLayout>

      <div className="customer-header">

        <h2>Customers</h2>

        <input
          type="text"
          placeholder="Search customer..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          className="customer-search"
        />

      </div>

      <div className="customer-table">

        <table>

          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
            </tr>
          </thead>

          <tbody>

            {filteredCustomers.map((user)=> (

              <tr key={user._id}>

                <td>{user.name}</td>

                <td>{user.email}</td>

                <td>{user.role}</td>

                <td>
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </AdminLayout>

  );
}