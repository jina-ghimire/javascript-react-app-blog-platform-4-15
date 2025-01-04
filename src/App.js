import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Profile from "./components/Profile";
import PostList from "./components/PostList";
import PostDetail from "./components/PostDetail";
import NewPost from "./components/NewPost";
import EditPost from "./components/EditPost";
import "./styles/App.css";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const PrivateRoute = ({ children }) => {
    return user ? children : <Navigate to="/sign-in" />;
  };

  return (
    <Router>
      <header>
        <nav className="nav-container">
          <div className="nav-left">
            <Link to="/posts" className="nav-link">Realworld Blog</Link>
          </div>
          <div className="nav-right">
            {!user ? (
              <>
                <Link to="/sign-in" className="nav-link">Sign In</Link>
                <Link to="/sign-up" className="nav-signup">Sign Up</Link>
              </>
            ) : (
              <>
              <Link to="/new-post" className="create-article-btn">Create article</Link>
               <Link to="/profile" className="nav-link">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt="User Avatar"
                className="avatar"
              />
            ) : null}
            {user.username || "Profile"}
          </Link>
                <button onClick={handleLogout} className="nav-button">Log Out</button>
              </>
            )}
          </div>
        </nav>
      </header>
      <Routes>
        <Route path="/posts" element={<PostList />} />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route path="/posts/:id/edit" element={<PrivateRoute><EditPost /></PrivateRoute>} />
        <Route path="/new-post" element={<PrivateRoute><NewPost /></PrivateRoute>} />
        <Route path="/sign-in" element={!user ? <SignIn setUser={setUser} /> : <Navigate to="/posts" />} />
        <Route path="/sign-up" element={!user ? <SignUp /> : <Navigate to="/posts" />} />
        <Route path="/profile" element={user ? <Profile user={user} setUser={setUser} /> : <Navigate to="/sign-in" />} />
      </Routes>
    </Router>
  );
}

export default App;
