function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user?.role !== "ADMIN") return <h1>Access Denied</h1>;
  return children;
}
