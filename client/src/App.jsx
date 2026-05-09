import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Activities from "./pages/Activities";
import GoodDeeds from "./pages/GoodDeeds";
import Leaderboard from "./pages/Leaderboard";
import Clubs from "./pages/Clubs";
import ClubDetails from "./pages/ClubDetails";
import Login from "./pages/Login";
import ActivityDetails from "./pages/ActivityDetails";
import Account from "./pages/Account";
import Profile from "./pages/Profile";
import Management from "./pages/Management";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar>
          <main className="app-main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/activities" element={<Activities />} />
              <Route path="/good-deeds" element={<GoodDeeds />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/clubs" element={<Clubs />} />
              <Route path="/clubs/:clubId" element={<ClubDetails />} />
              <Route path="/manage" element={<Management />} />
              <Route path="/login" element={<Login />} />
              <Route path="/account" element={<Account />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/activities/:id" element={<ActivityDetails />} />
            </Routes>
          </main>
        </Navbar>
      </Router>
    </AuthProvider>
  );
}

export default App;
