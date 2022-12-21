import React from "react";
import { Input as MUIInput, InputProps as MUIInputProps } from "@mantine/core";

type InputProps = {
  label: string;
  name?: string;
  type: string;
  value: string;
  inputProps: MUIInputProps;
  // onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const Input: React.FC<InputProps> = ({ label, inputProps }) => {
  return (
      <Input.Wrapper label={label}>
      <MUIInput {...inputProps} />
    </Input.Wrapper>
    </div>
  );
};

export default Input;
