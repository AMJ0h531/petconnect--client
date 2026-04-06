import { useState } from "react";
import api from "../services/api";
import { useState } from "react";
import { View, TextInput, Button } from "react-native";
import api from "./api";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
  };

  return (
    <div>
      <input onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" onChange={e => setPassword(e.target.value)} />
      <button onClick={login}>Login</button>
    </div>
  );
}

export default function Login(){
 const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const res = await api.post("/auth/login", { email, password });
    console.log(res.data.token);
  };

  return (
    <View>
      <TextInput placeholder="Email" onChangeText={setEmail} />
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} />
      <Button title="Login" onPress={login} />
    </View>
  );
}
   