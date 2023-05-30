import React, { useContext } from "react";
import { Navigate, Outlet, useNavigate} from "react-router-dom";
import { AuthContext } from "./AuthContext";
import "./Home.css";


const Home = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleSignIn = () => {
    navigate('/Login');
  };

  const handleSignUp = () => {
    navigate('/Register');
  };
  return isAuthenticated ? (
    <Navigate to="/Shop" replace />
  ) : (
    <div className="home">
    <h2 className="title">Welcome to FamiHelp!</h2>
    <div className="button-container">
    <a href="#" className="button" onClick={handleSignIn}>
      <span className="button-line button-line-top"></span>
      <span className="button-line button-line-right"></span>
      <span className="button-line button-line-bottom"></span>
      <span className="button-line button-line-left"></span>
    if you are a child or a parent:<br />
    Sign in
        
    </a>
    <a href="#" className="button" onClick={handleSignUp}>
      <span className="button-line button-line-top"></span>
      <span className="button-line button-line-right"></span>
      <span className="button-line button-line-bottom"></span>
      <span className="button-line button-line-left"></span>
    If you are parent:<br />
    Sign up
        
    </a>

    </div>
    
   
    
  </div>
  );
};

export default Home;
