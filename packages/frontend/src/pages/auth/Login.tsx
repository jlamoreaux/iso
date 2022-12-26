import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/api";
import { TextInput, Button, PasswordInput } from "@mantine/core";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const response = await login(username, password);
      navigate(`/photographer/${response.id}`);
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="login-container">
      <h1>ISO</h1>
      <form onSubmit={handleLogin}>
        {error && <p className="error">{error}</p>}
        <TextInput
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          label="Username"
        />
        <PasswordInput
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" disabled={!username || !password}>
          Login
        </Button>
        <Button onClick={() => navigate("/register")} variant="subtle">
          Register
        </Button>
      </form>
    </div>
  );
};

export default Login;
