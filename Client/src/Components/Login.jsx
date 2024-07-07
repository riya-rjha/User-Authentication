import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { backendURL } from "./BackendURL";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [logged, setLogged] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${backendURL}auth/login`,
        {
          username,
          password,
        },
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
      setLogged(true);
    } catch (error) {
      console.error("An error occurred while logging in:", error);
    }
  };

  const handleLogout = async () => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <div className="auth-container">
      <form className="auth-form">
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {logged ? (
          <button type="submit" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <button type="submit" onClick={handleLogin}>
            Login
          </button>
        )}
      </form>
    </div>
  );
};

export default Login;
