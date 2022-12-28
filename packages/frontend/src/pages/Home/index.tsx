import React from "react";
import { Anchor } from "@mantine/core";
import { PrimaryLink } from "../../components/buttons";

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <h1>ISO</h1>
      <p>The best platform for photographers to find and hire other photographers.</p>
      <div className="actions">
        <PrimaryLink href="/login">Login</PrimaryLink>
        <Anchor href="/register" className="register-button">
          Register
        </Anchor>
      </div>
    </div>
  );
};

export default Home;
