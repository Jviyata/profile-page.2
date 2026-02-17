import { Outlet } from "react-router-dom";

export default function ProfileLayout() {
  return (
    <div className="profile-layout">
      <Outlet />
    </div>
  );
}
