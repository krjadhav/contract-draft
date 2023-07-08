import * as React from "react";
import { TextField, DefaultButton } from "@fluentui/react";

interface LoginProps {
  email: string;
  password: string;
  handleEmailChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handlePasswordChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSignIn: () => void;
}

const Login: React.FC<LoginProps> = ({ email, password, handleEmailChange, handlePasswordChange, handleSignIn }) => {
  return (
    <>
      <TextField className="ms-font-l inputFields" label="Email" value={email} onChange={handleEmailChange} required />
      <TextField className="ms-font-l inputFields" label="Password" type="password" value={password} onChange={handlePasswordChange} required />
      <DefaultButton className="ms-font-l ms-welcome__action buttonStyles" iconProps={{ iconName: "ChevronRight" }} text="Sign In" onClick={handleSignIn} />
    </>
  )
}

export default Login;
