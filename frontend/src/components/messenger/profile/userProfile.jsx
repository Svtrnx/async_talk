import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './userProfile.css';
import axios from "axios";
import {styles, TextFieldStyles, theme, themeGetStarted, buttonStyleGetStarted} from '../utils/utils';
import { TextField, Button, Avatar, Alert} from "@mui/material"
import { countries } from "../../signup/signup";


function UserProfile() {
	const [userInfo, setUserInfo] = React.useState([]);
	const [codeCountry, setCodeCountry] = React.useState('');
	const navigate = useNavigate();

	useEffect(() => {
      const fetchData = async () => {
        try {
          axios.defaults.withCredentials = true;
          const response = await axios.get('http://localhost:8000/api/check_verification', {
            withCredentials: true,
          });
          console.log("RESPONSE HEADER:-", response.data);
          setUserInfo(response.data.user);
          console.log("VERIF PASSED");

        } catch (error) {
          navigate('/signin');
          console.error(error);
        }
      };
    
      fetchData();
    }, []);

	useEffect(() => {
		function getCodeByLabel(labelToFind) {
		  const foundCountry = countries.find(country => country.label === labelToFind);
		  return foundCountry ? foundCountry.code : null;
		}
	
		setCodeCountry(getCodeByLabel(userInfo.country));
	  }, []);

	  console.log(codeCountry)

	return (
		<>
		<div className="user-profile-wrapper">
			<div className="user-profile-header">
				<img src={userInfo.headerImg} alt="Header Image"/>
				{ typeof userInfo.avatar === 'string' ?
					<Avatar className="headerAvatarProfile" alt={userInfo.username} src={userInfo.avatar} />
				: null
				}
			</div>
			<div className="user-profile-header-info">
				<div style={{display: 'flex'}}>
					<h2 style={{fontWeight: 'normal', marginLeft: '30px'}}>{userInfo.first_name}</h2>
					<h2 style={{fontWeight: 'normal', marginLeft: '10px'}}>{userInfo.last_name}</h2>
				</div>
				<div>
					<img src={`https://flagcdn.com/w20/${codeCountry.toLowerCase()}.png`} alt="" style={{width: '20px', marginLeft: '30px'}} />
				</div>

			</div>

		</div>

		</>
	)
}

export default UserProfile;





