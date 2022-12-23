import { useState } from "react";
import { useForm } from "@mantine/form";
import {
  Stepper,
  Button,
  Title,
  TextInput,
  Group,
  Code,
  PasswordInput,
  Select,
} from "@mantine/core";
import { redirect, useNavigate } from "react-router-dom";
import { states } from "../../utils/geography";
import { register } from "../../services/api";

type FormData = {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  company: string;
  city: string;
  state: string;
};

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);

  const form = useForm<FormData>({
    initialValues: {
      email: "",
      username: "",
      password: "",
      firstName: "",
      lastName: "",
      company: "",
      city: "",
      state: "",
    },

    validate: (values) => {
      if (active === 0) {
        return {
          email: !/^\S+@\S+$/.test(values.email) ? "Invalid email" : null,
          username:
            values.username.trim().length < 4
              ? "Username must include at least 4 characters"
              : null,
          password:
            values.password.length < 6 ? "Password must include at least 6 characters" : null,
        };
      }

      if (active === 1) {
        return {
          firstName:
            values.firstName.trim().length < 2
              ? "First name must include at least 2 characters"
              : null,
          lastName:
            values.lastName.trim().length < 2
              ? "Last name must include at least 2 characters"
              : null,
          company:
            values.company.trim().length < 2 ? "Company must include at least 2 characters" : null,
        };
      }

      return {};
    },
  });

  const nextStep = () =>
    setActive((current) => {
      if (form.validate().hasErrors) {
        return current;
      }
      return current < 2 ? current + 1 : current;
    });

  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  const handleSubmit = async () => {
    try {
      const { userId } = await register(form.values);
      navigate(`/photographer/${userId}`);
    } catch (err) {
      redirect("/register");
    }
  };

  return (
    <>
      <Stepper
        active={active}
        breakpoint="sm"
        styles={{
          steps: {
            display: "none",
          },
          separator: {
            display: "none",
          },
        }}
      >
        <Stepper.Step withIcon={false}>
          <Title order={2}>Sign Up</Title>
          <TextInput
            label="Username"
            placeholder="Username"
            name="username"
            {...form.getInputProps("username")}
          />
          <TextInput
            label="Email"
            placeholder="Email"
            name="email"
            {...form.getInputProps("email")}
          />
          <PasswordInput
            label="Password"
            placeholder="Password"
            name="password"
            {...form.getInputProps("password")}
          />
        </Stepper.Step>
        <Stepper.Step withIcon={false}>
          <Title order={2}>Can we get to know you a little better?</Title>
          <TextInput
            label="First name"
            placeholder="First name"
            name="firstName"
            {...form.getInputProps("firstName")}
          />
          <TextInput
            label="Last name"
            placeholder="Last name"
            name="lastName"
            {...form.getInputProps("lastName")}
          />
          <TextInput
            label="Company"
            placeholder="Company"
            name="company"
            {...form.getInputProps("company")}
          />
          <TextInput label="City" placeholder="City" name="city" {...form.getInputProps("city")} />
          <Select
            label="State"
            placeholder="State"
            name="state"
            searchable
            {...form.getInputProps("state")}
            data={states.map(({ abbreviation, name }) => ({ label: name, value: abbreviation }))}
          />
        </Stepper.Step>
        <Stepper.Completed>
          Completed! Form values:
          <Code block mt="xl">
            {JSON.stringify(form.values, null, 2)}
          </Code>
        </Stepper.Completed>
      </Stepper>
      <Group position="right" mt="xl">
        {active !== 0 && (
          <Button variant="default" onClick={prevStep}>
            Back
          </Button>
        )}
        {active !== 2 && <Button onClick={nextStep}>Next step</Button>}
        {active === 2 && (
          <Button
            onClick={() => {
              handleSubmit();
            }}
          >
            Submit
          </Button>
        )}
      </Group>
    </>
  );
};

export default Register;
