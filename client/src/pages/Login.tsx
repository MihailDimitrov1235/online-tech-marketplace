import { NavLink } from "react-router";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { TextField } from "../components/Textfield";
import { useState } from "react";

export default function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = () => {
    console.log(username)
    console.log(password)
  }
  return (  
    <Card size="lg" className="flex flex-col gap-12 items-center mx-auto mt-32">
        <div className="text-2xl">Login</div>
        
        <div className="flex flex-col gap-2">
          <TextField label="Username" value={username} onChange={(e) => {setUsername(e.target.value)}}/>
          <TextField label="Password" type="password" value={password} onChange={(e) => {setPassword(e.target.value)}}/>
        </div>
        <div className="flex flex-col items-center gap-1">
          <p>Don't have an account? </p>
          <NavLink className={"text-primary hover:underline"} to={"/signup"}>Sign up</NavLink>
        </div>
        
        <Button className="ml-auto" onClick={handleSubmit}>Submit</Button>
    </Card>
  )
}
