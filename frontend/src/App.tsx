import { Navigate, Route, Routes } from "react-router-dom";
import { Appointments } from "./screens/Appointments";
import { AuthPick } from "./screens/AuthPick";
import { Booked } from "./screens/Booked";
import { Home } from "./screens/Home";
import { Login } from "./screens/Login";
import { NaviIntro } from "./screens/NaviIntro";
import { NaviOverlay } from "./screens/NaviOverlay";
import { Onboarding } from "./screens/Onboarding";
import { Privacy } from "./screens/Privacy";
import { Register } from "./screens/Register";
import { Schedule } from "./screens/Schedule";
import { Splash } from "./screens/Splash";
import { VisitDetail } from "./screens/VisitDetail";

export default function App() {
  return (
    <div style={{ minHeight: "100vh", background: "#0b1220" }}>
      <Routes>
        <Route path="/" element={<Navigate to="/splash" replace />} />
        <Route path="/splash" element={<Splash />} />
        <Route path="/onboarding/:step" element={<Onboarding />} />
        <Route path="/auth" element={<AuthPick />} />
        <Route path="/login/:role" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/navi-intro" element={<NaviIntro />} />
        <Route path="/home" element={<Home />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/booked" element={<Booked />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/visit/:id" element={<VisitDetail />} />
        <Route path="/navi" element={<NaviOverlay />} />
        <Route path="*" element={<Navigate to="/splash" replace />} />
      </Routes>
    </div>
  );
}
