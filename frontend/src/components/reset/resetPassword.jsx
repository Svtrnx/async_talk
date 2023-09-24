import React, { useState, useRef, useEffect } from 'react';
import { Container, TextField, Button, InputAdornment, IconButton, Snackbar} from "@mui/material"
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MuiAlert from '@mui/material/Alert';
import logoImage from '../../img/logo2.png';
import Visibility from '@mui/icons-material/Visibility';
import { Link, useNavigate, useLocation  } from 'react-router-dom';
import VisibilityOff from '@mui/icons-material/Visibility';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import securityGif from '../../img/securityGif.gif'
import axios from 'axios';
import './resetPassword.css'

// Field Text settings
const theme = createTheme({
	typography: {
		fontFamily: 'Montserrat',
		fontSize: 13,
	},
	palette: {
		text: {
			primary: '#7f56da',
		},
		},
	});

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
	
const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const buttonStyleUploadImg = {
	borderColor: '#5d38b1',
	color: '#e0dfe7'
  };

function ResetPassword() {
	const [isAuthorized, setIsAuthorized] = React.useState(false);
	const [password, setPassword] = React.useState('');

	const [confirmPassword, setConfirmPassword] = React.useState('');
	const [isError, setIsError] = React.useState(false);
	const [showPassword, setShowPassword] = React.useState(false);
	const [errorSnackBar, setErrorSnackBar] = useState(false);
	const [successSnackBar, setSuccessSnackBar] = useState(false);
	const [errorSnackBarText, setErrorSnackBarText] = useState('Please, complete all inputs!');

	const navigate = useNavigate();
	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const token_verif = searchParams.get('token');
	const email_verif = searchParams.get('email');
	
	useEffect(() => {
		async function VerifyToken() {
			try {
				const currentDate = new Date();
				const response = await axios.get("https://kenzoback.onrender.com//reset-password-verify", {
					params: {
						token: token_verif,
						email: email_verif,
					},
					headers: {
					'Content-Type': 'application/json'
					}
				});
				console.log("MESSAGE RESPONSE: ", response.data.status);
				setIsAuthorized(true);
			}
			catch (err) {
				setIsAuthorized(false);
				navigate('/', { replace: true });
				console.log("SEND MESSAGE ERROR: ", err);
			}
		}
		VerifyToken()
	}, [])

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
		  return;
		}
		setErrorSnackBar(false);
	};
	
	const handleClickShowPassword = () => setShowPassword((show) => !show);

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};
	function verifPasswords() {
		if (confirmPassword !== password) {
			setErrorSnackBar(true);
			setErrorSnackBarText('Passwords do not match');
			setIsError(true);
			return
		}
		else if (password.length > 15) {
			setErrorSnackBar(true);
			setErrorSnackBarText('Password are too long!');
			setIsError(true);
			return
		}
		else if (password.length < 5) {
			setErrorSnackBar(true);
			setErrorSnackBarText('Password are too short!');
			setIsError(true);
			return
		}
		else {
			setErrorSnackBar(false);
		}
	}

	const handleChangePassword = async () => {
        try {
			verifPasswords();
			if (isError === true) {
				return
			}
			else {
				const response = await axios.post('https://kenzoback.onrender.com//change-password', 
				{	token: token_verif,
					email: email_verif, 
					new_password: password,
				});
				setSuccessSnackBar(true)
				setTimeout(() => {
					navigate('/', { replace: true });
				  }, 3000);
				console.log(response.data);
			}
        } catch (error) {
            console.error(error);
        }
    };


	return (
		isAuthorized === true ? 
		<>
		<Container disableGutters maxWidth={false} sx={{height: "100vh"}}>
			<div className='reset-password-wrapper'>
				<div className='securityGif-wrapper'>
					<img src={securityGif} alt="" />
				</div>
				<div className='reset-password-container'>
				<div className='rightside-reg-finish-wrapper'>
					<div className="rightside_logo">
						<img className="reg_logo" src={logoImage} alt="logo" />	
						</div>
						<div className="rightside_reg_text">
							<h1>Please, write a new password</h1>
							<h2>The password must contain at least 6 characters</h2>
						</div>
					</div>

					<ThemeProvider theme={theme}>
						<TextField
							type={showPassword ? "text" : "password"}
							label="New password"
							variant="outlined"
							value={password}
							onChange={(event) => setPassword(event.target.value)}
							InputLabelProps={{ style: { color: "#e0dfe7" } }}
							error={password.length > 0 && password.length < 6}
							helperText={password.length > 0 && password.length < 6 && "Username should be at least 6 characters"}
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
							/>
							{confirmPassword.length > 0 && (
								<TextField
									type={showPassword ? "text" : "password"}
									label="Confirm new password"
									value={confirmPassword}
									onChange={(event) => setConfirmPassword(event.target.value)}
									variant="outlined"
									InputLabelProps={{ style: { color: "#e0dfe7" } }}
									InputProps={{
									style: { color: "#e0dfe7" },
									endAdornment: (
										<InputAdornment position="end">
										<IconButton
											sx={{ color: "#32333A" }}
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
									sx={{...TextFieldStyles, mt: 2, width: 400, boxShadow: 2}}
									error={confirmPassword !== password}
									helperText={confirmPassword !== password && "Passwords do not match"}
									autoFocus
								/>
								)}

							{confirmPassword.length === 0 && (
							<TextField
								type={showPassword ? "text" : "password"}
								label="Confirm new password"
								value={confirmPassword}
								onChange={(event) => setConfirmPassword(event.target.value)}
								variant="outlined"
								InputLabelProps={{ style: { color: "#e0dfe7" } }}
								InputProps={{
								style: { color: "#e0dfe7" },
								endAdornment: (
									<InputAdornment position="end">
									<IconButton
										sx={{ color: "#32333A" }}
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
								autoFocus
								/>
								)}
					</ThemeProvider>
						<Button 
							variant="outlined" 
							type="submit" 
							sx={{mt: 5, width: '100%', height: 50, boxShadow: 5, borderRadius: '8px' }} 
							style={buttonStyleUploadImg}
							theme={theme}
							onClick={() => handleChangePassword()}
							>
							Save new password
						</Button>
				</div>
				<Snackbar open={errorSnackBar} autoHideDuration={8000} onClose={handleClose}>
					<Alert onClose={handleClose} severity="error" sx={{ width: 'auto' }}>
						{errorSnackBarText}
					</Alert>
				</Snackbar>
				<Snackbar open={successSnackBar} autoHideDuration={8000} onClose={handleClose}>
					<Alert onClose={handleClose} severity="success" sx={{ width: 'auto' }}>
						Successfully changed password!
					</Alert>
				</Snackbar>
			</div>
		</Container>
		</>
		: null
	)
}


export default ResetPassword;




