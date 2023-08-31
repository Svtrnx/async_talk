import {Routes, Route, useNavigate  } from 'react-router-dom';
import Signup from './components/signup/signup';
import Signin from './components/signin/signin';
import Messenger from './components/messenger/messenger';
import ResetPassword from './components/reset/resetPassword';
import React, { useEffect } from 'react';
import axios from 'axios';
import './App.css'



function App() {
  const [isAuthorized, setIsAuthorized] = React.useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.defaults.withCredentials = true;
    const fetchData = async () => {
      try {
        const response = await axios.get('https://kenzoback.onrender.com/api/check_verification', {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        navigate('/messenger', { replace: true });

      } catch (error) {
        setIsAuthorized(false);
        console.error(error);
      }
    };

    fetchData();
  }, [navigate]);

  // if (isLoading === null) {
  //   return <div style={{display: 'flex', justifyContent: 'center', marginTop: '50vh'}}><span className="loaderApp" style={{display: 'flex'}}></span></div>
    
  // }
    
    return (
      <Routes>
      <Route path="/signin" element={<Signin />} />
      <Route path="/" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/messenger" element={<Messenger />} />
      <Route path="/reset-password/" element={<ResetPassword />} />
    </Routes>
  );
  
}


export default App;
