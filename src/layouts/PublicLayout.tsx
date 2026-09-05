import { Outlet } from "react-router";

export default function PublicLayout() {
  return (
    <div style={{ minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      <Outlet />
    </div>
  );
}
