import React, { useState } from "react";
import { useForm } from "@mantine/form";
import { TextInput, Button } from "@mantine/core";

type Props = {
  onSubmit: (values: any) => void;
  children: React.ReactNode;
};

const Form: React.FC<Props> = ({ onSubmit, children }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm({
    initialValues: {
      email: "",
      termsOfService: false,
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  const handleSubmit = (values: any) => {
    setIsSubmitting(true);
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit}>
      {children}
      <Button type="submit" disabled={isSubmitting}>
        Submit
      </Button>
    </form>
  );
};

export default Form;
