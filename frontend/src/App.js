import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

function App() {

  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  useEffect(() => {
    fetch("http://localhost:8000/api/hello")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error("Error fetching message:", error));
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/users");
        const data = await res.json();
        setUsers(data);
      }catch (error){
        console.error("Error fetching users:", error);
      }
    }
    fetchUsers();
  }, []);

  const handSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
      })
      const data = await res.json()
      setUsers([...users, data]);
      setForm({ username: "", email: "", password: "" });
    }catch (error){
      console.error("Error adding user:", error);
    }
      
  };

  const handDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?"))
      return;
    try {
      const res = await fetch(`http://localhost:8000/api/users/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      console.log(data);
      setUsers(users.filter((user) => user.id !== id));
    }catch (error){
      console.error("Error deleting user:", error);
    }
  }

  return (
    <div className="App">
      <h1>{message}</h1>

      <div>
        <h2>Add New User</h2>
        <form onSubmit={handSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button type="submit">Add User</button>
        </form>

        <h2>Users List</h2>
        <ul>
          {users.map((user, index) => (
            <li key={user.id || index}>
              {user.username} - {user.email}
              <button onClick={() => handDelete(user.id)}>Delete</button>
            </li>
          ))
          }
        </ul>
      </div>
    </div>

  );
}

export default App;
