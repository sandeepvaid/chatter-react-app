import { useEffect , useState } from "react";

import { Home,Login,Settings,UserProfile } from '../pages';
import {Loader,Navbar} from './';
import { BrowserRouter as Router, Routes,Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks";
import Signup from "../pages/Signup";

function PrivateRoute({ children }) {
  const auth = useAuth();
  console.log("Auth", auth);
  return auth.user ? children : <Navigate to="/login" />;
}
function App() {
  const auth = useAuth();

  const Page404 = () => {
    return <h1>404 Not found</h1>;
  };

  const About = () => {
    return <h1>About</h1>;
  };

  if (auth.loading) {
    return <Loader />;
  }
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/about" element={<About />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Signup />} />
          <Route
            exact
            path="/settings"
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            }
          />

          <Route
            exact
            path="/user/:userId"
            element={
              <PrivateRoute>
                <UserProfile />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </Router>
    </div>
  );
}
export default App;