import {Routes, Route, useNavigate  } from 'react-router-dom';
import Signup from './components/signup/signup';
import Signin from './components/signin/signin';
import Messenger from './components/messenger/messenger';
import ResetPassword from './components/reset/resetPassword';
import UserProfile from './components/messenger/profile/userProfile';
import Settings from './components/messenger/settings/settings';
import Messages from './components/messenger/Messages/Messages';
import React, { useEffect } from 'react';
import axios from 'axios';
import './App.css'



function App() {
  const [isAuthorized, setIsAuthorized] = React.useState(false);
  const navigate = useNavigate();
    
    return (
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route path="/" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/async/*" element={<Messenger />} />
        <Route path="/reset-password/" element={<ResetPassword />} />
        <Route path="/profile/:username" element={<UserProfile />} />
    </Routes>
  );
  
}


export default App;
