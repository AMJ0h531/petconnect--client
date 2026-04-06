import { useEffect, useState } from "react";
import api from "../services/api";

export default function Pets() {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    api.get("/pets").then(res => setPets(res.data));
  }, []);

  return (
    <div>
      {pets.map(p => (
        <div key={p.id}>
          <h3>{p.name}</h3>
          <p>{p.breed}</p>
        </div>
      ))}
    </div>
  );
}

import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import api from "./api";

export default function Pets() {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    api.get("/pets").then(res => setPets(res.data));
  }, []);

  return (
    <View>
      {pets.map(p => (
        <Text key={p.id}>{p.name}</Text>
      ))}
    </View>
  );
}
