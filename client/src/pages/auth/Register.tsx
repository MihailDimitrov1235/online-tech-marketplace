import { useState } from "react";
import { NavLink } from "react-router";

import { paths } from "@/router";

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { TextField } from '@/components/Textfield';

export default function Register() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = () => {
    console.log(username)
    console.log(password)
  }

  return (
    <Card size="lg" className="flex flex-col gap-6 m-auto px-6 w-125">
      <div className="text-2xl text-center">Register</div>

      <div className="flex flex-col gap-2 w-full">
        <TextField
          label="Username"
          fullWidth
          value={username}
          onChange={(e) => { setUsername(e.target.value) }}
        />

        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="First name"
            fullWidth
            value={username}
            onChange={(e) => { setUsername(e.target.value) }}
          />

          <TextField
            label="Last name"
            fullWidth
            value={username}
            onChange={(e) => { setUsername(e.target.value) }}
          />
        </div>

        <TextField
          label="Password"
          fullWidth
          type="password"
          value={password}
          onChange={(e) => { setPassword(e.target.value) }}
        />
        <TextField
          label="Confirm password"
          fullWidth
          type="password"
          value={password}
          onChange={(e) => { setPassword(e.target.value) }}
        />
      </div>

      <div className="text-end">
        <span>Already have an account?</span>
        <NavLink className="text-primary hover:underline ml-1" to={paths.auth.login}>Sign in</NavLink>
      </div>

      <Button className="ml-auto" onClick={handleSubmit}>Submit</Button>
    </Card>
  )
}
