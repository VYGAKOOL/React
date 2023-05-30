import React from 'react';
import { Route, Routes, Navigate, Redirect } from 'react-router-dom';
import Home from './Components/Home';
import Login from './Components/Login';
import Register from './Components/Register';
import Shop from './Components/Shop';
import Tasks from './Components/Tasks';
import { Layout } from './Components/Layout';
import { AuthProvider, useContext, AuthContext, useAuth } from './Components/AuthContext';
import PrivateRoute from './Components/PrivateRoute';
import Notification from './Components/Notification'



export default function App() {

  return (
    <div className="App">
      <AuthProvider>
      <Routes>
      <Route path="/" element={<Navigate to="/Home" />} />
      <Route element={<Layout />}>
          <Route path='Notification' element={<Notification/>}/>
          <Route element={<PrivateRoute />}>
          <Route path="Shop" element={<Shop /> } />
        </Route>
          <Route element={<PrivateRoute />}>
          <Route path="Tasks" element={<Tasks /> } />
        </Route>
        </Route>
        <Route path="/Home" element={<Home />} />
        <Route path="Login" element={<Login />} />
        <Route path="Register" element={<Register />} />
      </Routes>
      </AuthProvider>
    </div>
  );
}
