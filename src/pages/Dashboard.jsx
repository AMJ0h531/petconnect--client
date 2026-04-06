import { useEffect, useState } from "react";
import api from "../services/api";
import { Bar } from "react-chartjs-2";

export default function AdminDashboard() {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    api.get("/pets").then(res => setPets(res.data));
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>

      {pets.map(p => (
        <div key={p.id}>
          <h3>{p.name}</h3>
          <button>Approve</button>
          <button>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default function Analytics() {
  const [data, setData] = useState({});

  useEffect(() => {
    api.get("/analytics").then(res => setData(res.data));
  }, []);

  return (
    <div>
      <h2>Platform Analytics</h2>
      <Bar
        data={{
          labels: ["Users", "Pets", "Applications", "Adopted"],
          datasets: [{
            label: "Stats",
            data: [
              data.users,
              data.pets,
              data.applications,
              data.adoptedPets
            ]
          }]
        }}
      />
    </div>
  );
}
