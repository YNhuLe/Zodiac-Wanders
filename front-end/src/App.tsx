import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { UserProvider } from "./context/UserContext";
import { ToastProvider } from "./context/ToastContext";
import { CommunityProvider } from "./context/CommunityContext";
import Layout from "./components/layout/Layout/Layout";
import Homepage from "./pages/Homepage/Homepage";
import CardPage from "./pages/CardPage/CardPage";
import Community from "./pages/Community/Community";
import Login from "./pages/Auth/Login";
import ProfileCreate from "./pages/Profile/ProfileCreate";
import ProfilePage from "./pages/Profile/ProfilePage";
import ProfileEdit from "./pages/Profile/ProfileEdit";
import Compatibility from "./pages/Compatibility/Compatibility";
import CosmicConnections from "./pages/CosmicConnections/CosmicConnections";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <UserProvider>
          <ToastProvider>
            <CommunityProvider>
              <Layout>
                <Routes>
                  <Route path="/" element={<Homepage />} />
                  <Route path="/photos/:id" element={<CardPage />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/compatibility" element={<Compatibility />} />
                  <Route path="/cosmic-connections" element={<CosmicConnections />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/profile/create" element={<ProfileCreate />} />
                  <Route path="/profile/edit" element={<ProfileEdit />} />
                  <Route path="/profile/:id" element={<ProfilePage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                </Routes>
              </Layout>
            </CommunityProvider>
          </ToastProvider>
        </UserProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
