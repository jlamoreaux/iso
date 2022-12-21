import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/api";
import { TextInput, Button } from "@mantine/core";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="login-container">
      <h1>ISO</h1>
      <form onSubmit={handleLogin}>
        {error && <p className="error">{error}</p>}
        <TextInput value={email} onChange={(e) => setEmail(e.target.value)} label="Email Address" />
        <TextInput
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" disabled={!email || !password}>
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
