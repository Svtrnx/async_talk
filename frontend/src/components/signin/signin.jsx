import React, { Component, useState, useEffect } from "react";
import "./signin.css"
import { Container, TextField, Button, Box, Alert } from "@mui/material"
import { ThemeProvider } from '@mui/material/styles';
import { TextFieldStyles, theme, themeGetStarted, buttonStyleGetStarted, buttonStyle, otpTheme} from '../messenger/utils/utils'
import Snackbar from '@mui/material/Snackbar';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import logoImage from '../../img/logo2.png';
import ResetSendLink from "../reset/resetSendLink";
import { MuiOtpInput } from 'mui-one-time-password-input';
import {Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import Checkbox from '@mui/material/Checkbox';




function Signin() {

	

	const [showPassword, setShowPassword] = React.useState(false);
	const [username, setUsername] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [errorSnackBar, setErrorSnackBar] = useState(false);
	const [otp, setOtp] = useState('');
	const [checkCode, setCheckCode] = useState('1');
	const [showResetLink, setShowResetLink] = useState(false);
	const [show2Verif, setShow2Verif] = useState(false);
	const [codeSent, setCodeSent] = useState(false);
	const [checkbox, setCheckbox] = useState(false);
	const [errorSnackBarText, setErrorSnackBarText] = useState('');
	const [sendLoader, setSendLoader] = React.useState('none');
	const navigate = useNavigate()
	const location = useLocation();

	const isAuthenticated = localStorage.getItem('authenticated') === 'true';

	
	
	const handleCloseSnack = (event, reason) => {
		if (reason === 'clickaway') {
		  return;
		}
		setErrorSnackBar(false);
		setErrorSnackBarText("")
	}

	const handleChangeOTP = (newValue) => {
		setOtp(newValue)
	}

	function returnMain() {
		setShowResetLink(false);
	}

	const HandleSigninLocalStorage = async (event) => {
		event.preventDefault();
		setSendLoader('')
		try 
		{
			if (isAuthenticated) {
				setSendLoader('')
				const response = await axios.get("https://kenzoback.onrender.com/signin", {
					username: username,
					password: password,
				}, {
					withCredentials: true,
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				});
				console.log(response.data);
				setSendLoader('none')
				navigate('/async/messages');
			}
			axios.defaults.withCredentials = true;
			const responseCheck = await axios.post("https://kenzoback.onrender.com/check-2auth", {
				username: username,
				password: password,
			}, {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			});
			if (responseCheck.data.user2Step === true) {
				if (otp === checkCode.check) {
					setSendLoader('')
					const response = await axios.post("https://kenzoback.onrender.com/signin", {
						username: username,
						password: password,
					}, {
						withCredentials: true,
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
					});
					console.log(response.data);
					if (checkbox === true) { 
						localStorage.setItem('authenticated', 'true');
						setTimeout(() => {
							localStorage.removeItem('authenticated');
						  }, 7 * 24 * 60 * 60 * 1000);
					}
					setSendLoader('none')
					navigate('/async/messages');
				}
				else {
					if (otp.length > 1) {
						setErrorSnackBar(true);
						setErrorSnackBarText('INVALID OTP CODE!')
					}
					if (codeSent === false) {
						const responseOTP = await axios.post("https://kenzoback.onrender.com/send-otp-code", {
							email: responseCheck.data.userEmail,
							code_length: 5,
							email_message: 'OTP SignIn code',
							email_subject: "ASYNC TALK 2 Step Verification",
							condition: 'not_exists',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
						});
						setSendLoader('none')
						setCheckCode(responseOTP.data)
						setCodeSent(true)
						setShow2Verif(true);
					}
					setSendLoader('none')

				}
			}
			else {
				setSendLoader('none')
				setSendLoader('')
				const response = await axios.post("https://kenzoback.onrender.com/signin", {
					username: username,
					password: password,
				}, {
					withCredentials: true,
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				});
				console.log(response.data);
				setSendLoader('none')
				navigate('/async/messages');
			}

			


		} catch (error) {
			setSendLoader('none')
			console.log(error);
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


	const handleClickShowPassword = () => setShowPassword((show) => !show);

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	const handleCheckboxChange = () => {
		setCheckbox(!checkbox);
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
							className="signin_text_area_input1"
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
							className="signin_text_area_input2"
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
					{ show2Verif === true ?
					<motion.div
						initial={{ y: 10, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: -10, opacity: 0 }}
						transition={{ duration: 0.3 }}
					>
					<div className="twoAuthVerif">
						<h2>We've sent OTP two step verification code to your email</h2>
						<ThemeProvider theme={otpTheme}>
							<Box
							sx={{
								"& label.Mui-focused": {
								color: "#e0dfe7",
								},
								"& .MuiOutlinedInput-notchedOutline": {
									borderColor: errorSnackBar ? "#d32f2f" : "#ffffff",
								  },
								"& .MuiInput-underline:after": {
									borderColor: "#946cdc",
								},
								"& .MuiOutlinedInput-root": {
								"& fieldset": {
								},
								"&:hover fieldset": {
									borderColor: "#946cdc",
								},
								"&.Mui-focused fieldset": {
									borderColor: "#946cdc",
								},
								},
							}}
							>
							<MuiOtpInput
								value={otp}
								onChange={handleChangeOTP}
								inputprops={{ style: { color: '#e0dfe7', textAlign: 'center' } }}
								TextFieldsProps={{ disabled: false, size: 'small', placeholder: '-' }}
								separator={<span>-</span>}
								sx={{ gap: 1, width: '400px' }}
								length={5}
								/>
							</Box>
						</ThemeProvider>
					</div>
					<div className="checkbox-area">
						<Checkbox
						checked={checkbox}
						onChange={handleCheckboxChange}
						sx={{
							"&.Mui-checked": {
							color: "rgb(113, 75, 177)",
							},
							"&.MuiCheckbox-colorPrimary": {
								color: "#946cdc !important",
							},
						}}
						/>
						<h2>Remember</h2>
					</div>
					</motion.div>
					: null }
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
					<span className={`loader5${sendLoader}`}></span>
					<div className="sigin_forgot_password-container">
						<div className="sigin_forgot_password">
							<h2 onClick={() => setShowResetLink(true)}>Forgot your password?</h2>
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
			{showResetLink ?
			<>
				<ResetSendLink onClose={returnMain}/>
				<div className='overlay2' onClick={() => setShowResetLink(false)}></div>
			</>
			: null
		}
		 </Container>
		</>
	);
}

export default Signin;




















