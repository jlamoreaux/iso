import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/api";
import {
  TextInput,
  Button,
  PasswordInput,
  Text,
  Group,
  Stack,
  Title,
  Container,
  Anchor,
  Space,
} from "@mantine/core";

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
    <Container>
      <Title>Log In</Title>
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
        <Space h="xl" />
        <Space h="xl" />
        <Stack align="center" spacing="xs">
          <Button type="submit" disabled={!username || !password}>
            Login
          </Button>
          <Anchor variant="link" href="/forgot-password">
            Forgot your password?
          </Anchor>
          <Space h="xl" />
          <Space h="xl" />
          <Text>Don't have an account? No problem!</Text>
          <Button onClick={() => navigate("/register")} variant="subtle">
            Sign Up
          </Button>
        </Stack>
      </form>
    </Container>
  );
};

export default Login;
