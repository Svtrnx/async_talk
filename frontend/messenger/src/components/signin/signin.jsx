import React, { Component, useState, useEffect } from "react";
import "./signin.css"
import { Container, Typography, TextField, Button, Box  } from "@mui/material"
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { withStyles } from "@mui/styles";
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import logoImage from '../../img/logo2.png';
import Signup from '../signup/signup.jsx';
import {Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import messenger from '../messenger/messenger.jsx'


// Field Text settings
const styles = {
	root: {
		"& label.Mui-focused": {
		color: "orange",
		},
		"& .MuiInput-underline:after": {
		borderBottomColor: "orange",
		},
		"& .MuiOutlinedInput-root": {
		"& fieldset": {
			borderColor: "#e0dfe7",
		},
		"&:hover fieldset": {
			borderColor: "#946cdc",
		},
		"&.Mui-focused fieldset": {
			borderColor: "#7f56da",
		},
		},
	},
	};

const CSSTextField = withStyles(styles)(TextField);


// Field Text settings
const theme = createTheme({
	typography: {
		fontFamily: 'Montserrat',
		fontSize: 13,
	},
	});
	
const themeGetStarted = createTheme({
	typography: {
		fontFamily: 'Montserrat',
		fontSize: 13,
		fontWeightBold: 300
	},
	});

	// Button settings
const buttonStyle = {
	backgroundColor: '#5D38B1',
	color: '#e0dfe7',
};

const buttonStyleGetStarted = {
	backgroundColor: '#333438',
	color: '#e0dfe7',
};


function Signin() {

	

	const [showPassword, setShowPassword] = React.useState(false);
	const [username, setUsername] = React.useState('');
	const [password, setPassword] = React.useState('');
	const navigate = useNavigate()
	


	const HandleSigninLocalStorage = async (event) => {
		event.preventDefault();
		try {
		  const response = await axios.post("https://asynctalk-production.up.railway.app/signin", {
			grant_type: 'password',
			username: username,
			password: password,
			scope: '',
			client_id: '',
			client_secret: ''
		  	}, {
			withCredentials: true,
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		  	});
		  	console.log(response.data);

			//   // Установка cookies
		  	// const expirationTime = 7 * 24 * 60 * 60 * 1000; // 1 неделя в миллисекундах
			// const currentTime = new Date().getTime();
			// const expirationDate = new Date(currentTime + expirationTime);

			// const data = { username, timestamp: currentTime }; // Создание объекта data

			// document.cookie = `data=${JSON.stringify(data)}; expires=${expirationDate.toUTCString()}`;

			// // Получение cookies
			// const cookies = document.cookie.split(';');
			// let storedData = null;

			// for (let i = 0; i < cookies.length; i++) {
			// const cookie = cookies[i].trim();
			
			// if (cookie.startsWith('data=')) {
			// 	storedData = cookie.substring('data='.length, cookie.length);
			// 	break;
			// }
			// }

			// if (storedData) {
			// 	const parsedData = JSON.parse(storedData);
			// 	const { username, timestamp } = parsedData;

			// 	if (currentTime - timestamp > expirationTime) {
			// 		// Удаление cookies
			// 		document.cookie = 'data=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
			// 		// Дополнительные действия при удалении данных
			// 	} 
			// }
			
			navigate('/messenger');
		} catch (error) {
		  console.log("ERROR:", error);
		}
	  };
	  

	const fetchData = async () => {
		try {
		  const response = await axios.get('https://asynctalk-production.up.railway.app/api/check_verification', {
			withCredentials: true,
		  });
		  console.log(response.data);
		} catch (error) {
		  console.error(error);
		}
	  };
	  
	  const handleButtonClick = () => {
		fetchData();
	  };


	const handleClickShowPassword = () => setShowPassword((show) => !show);

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	
	return (
		<>
		 <Container disableGutters maxWidth={false} sx={{height: "100vh"}}>
			<div className="sginin_wrapper">
				<div className="signin_logo">

				</div>
				<div className="signin_wrapper">
					<div className="signin_logo">
						<img className="reg_logo" src={logoImage} alt="logo" />	
					</div>
					<div className="signin_text">
						<h2>SIGN IN ASYNC TALK</h2>
						<h3>Enter your account details below</h3>
					</div>
					<div className="signin_text_area">
						<ThemeProvider theme={theme}>
							<CSSTextField 
							value={username}
							onChange={(event) => setUsername(event.target.value)}
							id="outlined-basic" 
							label="Enter username" 
							variant="outlined" 
							InputLabelProps={{style: { color: '#e0dfe7' },}} 
							InputProps={{style: { color: '#e0dfe7' },}} 
							sx={{mt: 3, width: 400, boxShadow: 2}}
							/>
							<CSSTextField
							type={showPassword ? "text" : "password"}
							value={password}
							onChange={(event) => setPassword(event.target.value)}
							label="Password"
							variant="outlined"
							InputLabelProps={{ style: { color: "#e0dfe7" } }}
							InputProps={{
								style: { color: "#e0dfe7" },
								endAdornment: (
									<InputAdornment position="end">
										<IconButton sx={{ color: "#32333A" }}
										aria-label="toggle password visibility"
										onClick={handleClickShowPassword}
										onMouseDown={handleMouseDownPassword}
										edge="end"
										>
										{showPassword ? <VisibilityOff /> : <Visibility />}
										</IconButton>
									</InputAdornment>
								),
							}}
							sx={{ mt: 3, width: 400, boxShadow: 2 }}
							/>
						</ThemeProvider>
					</div>
					<div className="signin_login">
					<Button 
						variant="contained" 
						sx={{mt: 4, width: 400, height: 50, boxShadow: 2, borderRadius: '6px' }} 
						style={buttonStyle}
						theme={theme}
						onClick={HandleSigninLocalStorage}
						>
						Sign In
					</Button>
					</div>
					<div className="sigin_forgot_password-container">
						<div className="sigin_forgot_password">
							<h2 onClick={handleButtonClick}>Forgot your password?</h2>
							</div>
						</div>
						<Box sx={{mt: 3, borderBottom: 1, color: '#32333A' }}></Box>
					<div className="signin_registration">
						<h2>Dont have an account?</h2>
						<div className="signin_registration_btn">
							<Button 
								variant="contained" 
								sx={{width: 150, height: 50, boxShadow: 2, borderRadius: '4px' }} 
								style={buttonStyleGetStarted} 
								theme={themeGetStarted}
								component={Link}
     							to="/signup"
								>
								Get Started
							</Button>
						</div>
					</div>
				</div>
			
			</div>
		 </Container>
		</>
	);
}

export default Signin;




















