import React, { Component, useState, useEffect } from "react";
import "./signin.css"
import { Container, Typography, TextField, Button, Box, Alert } from "@mui/material"
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import Snackbar from '@mui/material/Snackbar';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import logoImage from '../../img/logo2.png';
// import Signup from '../signup/signup.jsx';
import {Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
// import messenger from '../messenger/messenger.jsx'


// Field Text settings



const TextFieldStyles = {
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
	}},
}


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
	const [errorSnackBar, setErrorSnackBar] = useState(false);
	const [errorSnackBarText, setErrorSnackBarText] = useState('');
	const navigate = useNavigate()
	
	const handleCloseSnack = (event, reason) => {
		if (reason === 'clickaway') {
		  return;
		}
		setErrorSnackBar(false);
		setErrorSnackBarText("")
	}

	const HandleSigninLocalStorage = async (event) => {
		event.preventDefault();
		try {
		  const response = await axios.post("http://localhost:8000/signin", {
			grant_type: 'password',
			username: username,
			password: password,
			scope: '',
			client_id: '',
			client_secret: ''
		  	}, {
			withCredentials: true,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		  	});
		  	console.log(response.data);


			navigate('/messenger');
		} catch (error) {
		  console.log("SIGN IN ERROR:", error);
		  if (error.response.status === 301) {
			setErrorSnackBar(true);
			setErrorSnackBarText('INVALID USERNAME OR PASSWORD!')
		  }
		  else if (error.response.status !== 303 && error.response.status !==301) {
			setErrorSnackBar(true);
			setErrorSnackBarText(`STATUS: ${error.response.status} ERROR!`)
		  }
		}
	  };
	  

	const fetchData = async () => {
		try {
		  const response = await axios.get('https://kenzoback.onrender.com/api/check_verification', {
			withCredentials: true,
		  });
		  console.log(response.data);
		} catch (error) {
		  console.log("ERROR:", error);
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
							<TextField 
							value={username}
							onChange={(event) => setUsername(event.target.value)}
							id="outlined-basic" 
							label="Enter username" 
							variant="outlined" 
							InputLabelProps={{style: { color: '#e0dfe7' },}} 
							InputProps={{style: { color: '#e0dfe7' },}} 
							sx={{...TextFieldStyles, mt: 3, width: 400, boxShadow: 2}}
							error={errorSnackBar === true}
							/>
							<TextField
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
							sx={{...TextFieldStyles, mt: 3, width: 400, boxShadow: 2}}
							error={errorSnackBar === true}
							
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
				<Snackbar open={errorSnackBar} autoHideDuration={6000} onClose={handleCloseSnack}>
					<Alert onClose={handleCloseSnack} severity="error" 
						sx={{ width: 'auto', backgroundColor: "#d32f2f", color: '#fff' }}>
						{errorSnackBarText}
					</Alert>
				</Snackbar>
			</div>
		 </Container>
		</>
	);
}

export default Signin;




















