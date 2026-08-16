// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { AuthProvider } from "./context/AuthContext";
// import { ThemeProvider } from "./context/ThemeContext";
// import MainLayout from "./layouts/MainLayout";

// // Pages
// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Dashboard from "./pages/Dashboard";
// import Sports from "./pages/Sports";
// import Matches from "./pages/Matches";
// import Announcements from "./pages/Announcements";
// import Gallery from "./pages/Gallery";
// import About from "./pages/About";

// function App() {
//   return (
//     <AuthProvider>
//       <ThemeProvider>
//         <Router>
//           <MainLayout>
//             <Routes>
//               <Route path="/" element={<Home />} />
//               <Route path="/login" element={<Login />} />
//               <Route path="/register" element={<Register />} />
//               <Route path="/dashboard" element={<Dashboard />} />
//               <Route path="/sports" element={<Sports />} />
//               <Route path="/matches" element={<Matches />} />
//               <Route path="/announcements" element={<Announcements />} />
//               <Route path="/gallery" element={<Gallery />} />
//               <Route path="/about" element={<About />} />
//             </Routes>
//           </MainLayout>
//         </Router>
//       </ThemeProvider>
//     </AuthProvider>
//   );
// }

// export default App;
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import MainLayout from "./layouts/MainLayout";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import PlayerStats from "./pages/PlayerStats";
import Sports from "./pages/Sports";
import TeamDetails from "./pages/TeamDetails";
import Matches from "./pages/Matches";
import Announcements from "./pages/Announcements";
import Gallery from "./pages/Gallery";
import About from "./pages/About";

// Providers are handled in main.jsx
function App() {
  return (
    <MainLayout>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/stats" element={<PlayerStats />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sports" element={<Sports />} />
        <Route path="/sports/:id" element={<TeamDetails />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
