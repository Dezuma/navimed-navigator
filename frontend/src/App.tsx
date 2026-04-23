import { Navigate, Route, Routes } from "react-router-dom";
import { Appointments } from "./screens/Appointments";
import { AuthPick } from "./screens/AuthPick";
import { Booked } from "./screens/Booked";
import { DemoScenes } from "./screens/DemoScenes";
import { Home } from "./screens/Home";
import { Login } from "./screens/Login";
import { NaviIntro } from "./screens/NaviIntro";
import { NaviOverlay } from "./screens/NaviOverlay";
import { OverlayStates } from "./screens/OverlayStates";
import { Onboarding } from "./screens/Onboarding";
import { CheckIn } from "./screens/CheckIn";
import { PatientConcerns } from "./screens/PatientConcerns";
import { PatientHistory } from "./screens/PatientHistory";
import { Privacy } from "./screens/Privacy";
import { Register } from "./screens/Register";
import { ReviewSummary } from "./screens/ReviewSummary";
import { Schedule } from "./screens/Schedule";
import { Splash } from "./screens/Splash";
import { SplashLogo } from "./screens/SplashLogo";
import { PostVisitSummary } from "./screens/PostVisitSummary";
import { TestResults } from "./screens/TestResults";
import { VisitDetail } from "./screens/VisitDetail";
import {
  AdminDashboardDesktop,
  ProviderDashboardMobile,
  ProviderDashboardTablet,
} from "./screens/Dashboards";

export default function App() {
  return (
    <div style={{ minHeight: "100vh", background: "#0b1220" }}>
      <Routes>
        <Route path="/" element={<Navigate to="/splash" replace />} />
        <Route path="/splash" element={<Splash />} />
        <Route path="/splash-logo" element={<SplashLogo />} />
        <Route path="/onboarding/:step" element={<Onboarding />} />
        <Route path="/auth" element={<AuthPick />} />
        <Route path="/login/:role" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/navi-intro" element={<NaviIntro />} />
        <Route path="/home" element={<Home />} />
        <Route path="/home/:state" element={<Home />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/schedule/:mode" element={<Schedule />} />
        <Route path="/check-in" element={<CheckIn />} />
        <Route path="/previsit/concerns" element={<PatientConcerns />} />
        <Route path="/previsit/history" element={<PatientHistory />} />
        <Route path="/previsit/review" element={<ReviewSummary />} />
        <Route path="/postvisit/summary" element={<PostVisitSummary />} />
        <Route path="/postvisit/test-results" element={<TestResults />} />
        <Route path="/booked" element={<Booked />} />
        <Route path="/demo-scenes" element={<DemoScenes />} />
        <Route path="/overlay/:kind" element={<OverlayStates />} />
        <Route path="/provider/mobile" element={<ProviderDashboardMobile />} />
        <Route path="/provider/tablet" element={<ProviderDashboardTablet />} />
        <Route path="/admin" element={<AdminDashboardDesktop />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/visit/:id" element={<VisitDetail />} />
        <Route path="/navi" element={<NaviOverlay />} />
        <Route path="*" element={<Navigate to="/splash" replace />} />
      </Routes>
    </div>
  );
}
