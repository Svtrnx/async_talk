import React, { useState, useRef, useEffect } from 'react';
import { Container, TextField, Button, Box, Snackbar, Stack, Autocomplete, Radio, InputAdornment,
		FormControlLabel ,RadioGroup, FormLabel, FormControl, IconButton, Avatar} from "@mui/material"
import { createTheme, ThemeProvider } from '@mui/material/styles';
import logoImage from '../../img/logo2.png';
import imgDone from '../../img/leftside_reg_done.png';
import imgActive from '../../img/leftside_reg_active.png';
import imgWaiting from '../../img/leftside_reg_waiting.png';
import imgBack from '../../img/back.png';
import imgOTP from '../../img/otp_verif.png';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/Visibility';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MuiOtpInput } from 'mui-one-time-password-input';
import MuiAlert from '@mui/material/Alert';
import axios from "axios"
import dayjs from 'dayjs';
import { Link, useNavigate  } from 'react-router-dom';
import "./signup.css";


	// Field Text settings
	const styles = {
		root: {
		  "& label.Mui-focused": {
			color: "#e0dfe7",
		  },
		  "& .MuiInput-underline:after": {
			borderBottomColor: "#e0dfe7",
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

	  

	  const themeGetStarted = createTheme({
		typography: {
			fontFamily: 'Montserrat',
			fontSize: 15,
			fontWeightBold: 300
		},
		});
	
	const buttonStyleGetStarted = {
		backgroundColor: '#333438',
		color: '#e0dfe7',
	};

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

	  const otpTheme = createTheme({
		typography: {
			fontFamily: 'Montserrat',
			fontSize: 30,
		},
	  });

	  const buttonStyle = {
		backgroundColor: '#7f56da',
		color: '#e0dfe7',
	  };


	const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
	});

function Signup() {

	//Signup user information
	const [fName, setFName] = useState('')
	const [lName, setLName] = useState('')
	const [country, setCountry] = useState({ code: '', label: '', phone: '' })
	const [date, setDate] = useState(null)
	const [gender, setGender] = useState('')
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [email, setEmail] = useState('');
	const [otpEmail, setOtpEmail] = useState(0);
	// SnackBar
	const [open, setOpen] = React.useState(false);
	// OTP
	const [otp, setOtp] = useState('');
	const [checked, setChecked] = React.useState(true);
	const [showPassword, setShowPassword] = React.useState(false);
	const [toSignin, setToSignin] = useState(true);
	const navigate = useNavigate();
	const [hasError, setHasError] = useState(false);
	const [errorSnackBar, setErrorSnackBar] = useState(false);
	const [errorSnackBarText, setErrorSnackBarText] = useState('Please, complete all inputs!');
	const [headerButton, setHeaderButton] = useState('SIGN IN');
	const [selectedAvatar, setSelectedAvatar] = useState('');

	const isValidUsername = /^[A-Za-z]{5,}[A-Za-z0-9]*$/.test(username);

	const urlAvatars = [
		"https://res.cloudinary.com/dlwuhl9ez/image/upload/v1693168301/original-623f94255643870746b3c5cc9814ad97_ehra7z.png",
		"https://res.cloudinary.com/dlwuhl9ez/image/upload/v1693168301/original-ad24384bd09ca9d244b8a42e25abaa9d_ofgm46.png",
		"https://res.cloudinary.com/dlwuhl9ez/image/upload/v1693063251/12_xwcbr4.png",
		"https://res.cloudinary.com/dlwuhl9ez/image/upload/v1693063252/15_sskykz.jpg",
		"https://res.cloudinary.com/dlwuhl9ez/image/upload/v1693059799/a6c53e3fe6bf4ceeb35d81c8f0549368_u769g8.png",
		"https://res.cloudinary.com/dlwuhl9ez/image/upload/v1693059799/b29cd0217558567b7cb547ceef16e0e6_co2pgt.png",
		"https://res.cloudinary.com/dlwuhl9ez/image/upload/v1693059799/619313245c10e3cad2f43f3eb41d9b31_fi1svs.png",
		"https://res.cloudinary.com/dlwuhl9ez/image/upload/v1693168300/original-a019f343b7674d1e9111d0f39aedfcdc_cwfe0b.jpg",
		"https://res.cloudinary.com/dlwuhl9ez/image/upload/v1693059799/7209a5de1fe5e279a1e98036a0aa54f2_zy8n6i.png",
		"https://res.cloudinary.com/dlwuhl9ez/image/upload/v1693059799/6557815968da333d992476b7a86b3353_ugt1dd.png",
		"https://res.cloudinary.com/dlwuhl9ez/image/upload/v1693168301/original-f53d3ce5cba80906902cee1f12733e51_metfgm.png",
		"https://res.cloudinary.com/dlwuhl9ez/image/upload/v1693059799/771f7cadf000c98b33056b3b4a805a7e_wjhe7i.png",
		"https://res.cloudinary.com/dlwuhl9ez/image/upload/v1693059799/22501d6aaae1e40bce7cc9b96c295dc7_idi7mq.png",
		"https://res.cloudinary.com/dlwuhl9ez/image/upload/v1693059799/3bee99575b38607e3d0c66e3c5c03a71_wwgklc.png",
		"https://res.cloudinary.com/dlwuhl9ez/image/upload/v1693059665/932b59873a384f535dbd21e511a56c6b_x20pkq.png",
		"https://res.cloudinary.com/dlwuhl9ez/image/upload/v1693059665/9bff7242a29e355c48f05e32307704a4_zydugm.png",
		"https://res.cloudinary.com/dlwuhl9ez/image/upload/v1693059592/e15f7aace64583063055eaf558dc8c6d_higrct.png",
		"https://res.cloudinary.com/dlwuhl9ez/image/upload/v1693059592/characters-01_oxpc1k.png",
		"https://res.cloudinary.com/dlwuhl9ez/image/upload/v1693063252/17_hss0yt.png",
		"https://res.cloudinary.com/dlwuhl9ez/image/upload/v1693059592/222f90e6b6299dae44dcec722a433875_mglozp.png",
		"https://res.cloudinary.com/dlwuhl9ez/image/upload/v1693059800/maintaco-03_ckud8a.png",
		"https://res.cloudinary.com/dlwuhl9ez/image/upload/v1693059592/91cb9dbe93a56078f25384bfab476335_pkbgb8.png",
		"https://res.cloudinary.com/dlwuhl9ez/image/upload/v1693168301/original-e312a23e7092797dde6ca8a66b0a5e85_ou34p0.png",
		"https://res.cloudinary.com/dlwuhl9ez/image/upload/v1693059539/33a724da873d79d3ab2ce735a2aec7f2_esezxm.png",
		"https://res.cloudinary.com/dlwuhl9ez/image/upload/v1693063471/1_whl3sd.jpg",
		"https://res.cloudinary.com/dlwuhl9ez/image/upload/v1693059799/d6bc47035a7b5717db697ff8dbcf825c_xcwira.png",
		"https://res.cloudinary.com/dlwuhl9ez/image/upload/v1693063251/13_nxppfm.png",
		"https://res.cloudinary.com/dlwuhl9ez/image/upload/v1693063251/14_vyytkh.png",
		"https://res.cloudinary.com/dlwuhl9ez/image/upload/v1693063471/2_oszmyn.png",
	]

	console.log(selectedAvatar)


	const handleAvatarClick = (avatarUrl) => {
		if (selectedAvatar === avatarUrl) {
		  setSelectedAvatar(null); // Если аватар уже был выбран, снимаем выбор
		} else {
		  setSelectedAvatar(avatarUrl); // Иначе выбираем аватар
		}
	  };

	const handleSubmit = async (event) => {
		event.preventDefault();
		console.log('email: ' + email);
		console.log('username: ' + username);
		console.log('password: ' + password);
		
		const dayjsValue = dayjs(date);
		
		const formattedMonth = dayjsValue.format('MMMM');
		const formattedDay = dayjsValue.format('D');
		const formattedYear = dayjsValue.format('YYYY');
		
		let formData = formattedMonth + ' ' + formattedDay;
		formData += ' ' + formattedYear
		
		setToSignin(true);
		
		try {
			const response = await axios.post("https://asynctalk-production.up.railway.app/signup", {
				grant_type: 'password',
				email: email,
				username: username,
				password: password,
				first_name: fName,
				last_name: lName,
				avatar: selectedAvatar,
				gender: gender,
				country: country.label,
				date: formData,
				scope: '',
				client_id: '',
				client_secret: ''
			}, {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			});
			console.log("SIGNUP RESPONSE: ", response.data);
			navigate("/signin");
		} catch (err) {
		  console.log("ERROR: ", err);
		}
	}
	  
	const handleOpenSnackbar = () => {
		setOpen(true);
	  };

	  const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
		  return;
		}
	
		setErrorSnackBar(false);
	  };

	function handleLevel3() {
		setLevel(3);
		handleContinueClick();
	}

	const handleChangeOTPEmail = (value) => {
		setOtpEmail(value)
	}

	const handleChangeOTP = (newValue) => {
		setOtp(newValue)
	}

	const handleChange = () => {
	  setChecked((prev) => !prev);
	};

	const handleClickShowPassword = () => setShowPassword((show) => !show);

	const handleMouseDownPassword = (event) => {
	  event.preventDefault();
	};

	const [level, setLevel] = useState(0);
	const [progress, setProgress] = useState({
		level1: 0,
		level2: 0,
		level3: 0,
	  });
	console.log(level)
  	const handleContinueClick = () => {

		// if (fName.length < 5 || fName.length > 15 
		// 	|| lName.length < 5 || lName.length > 15 || country === null) {
		// 	if (fName.length > 15 || lName.length > 15) {
		// 		console.log('2')
		// 		setErrorSnackBarText('Your text input is too long! Max length is 15 chars');
		// 		setErrorSnackBar(true);
		// 		setHasError(true);
		// 	}
		//   } else {
			
			setHasError(false);
			if (level === 0) {
				if (fName.length < 5 || fName.length > 15 
					|| lName.length < 5 || lName.length > 15 || country === null || country.label === '') {
						console.log('w')
						if (fName.length > 15 || lName.length > 15) {
						setErrorSnackBarText('Your text input is too long! Max length is 15 chars');
						setErrorSnackBar(true);
						setHasError(true);
						}
						else {
							setErrorSnackBarText('Please complete all inputs!');
							setErrorSnackBar(true);
							setHasError(true);
						}
						// if (fName.length < 5 || lName.length < 5) {
						// }

					console.log('w')
				}
				else {
					setProgress((prevState) => ({ ...prevState, level1: 100 }));
					setLevel(1);
					setHeaderButton('SIGN IN');
				}
			} else if (level === 1) {
				if (username.length < 5 || username.length > 15 
					|| password.length < 5 || password.length > 15 || confirmPassword !== password) {
					if (username.length > 15 || password.length > 15) {
						console.log('2')
						setErrorSnackBar(true);
						setErrorSnackBarText('Your text input is too long! Max length is 15 chars');
						setHasError(true);
					}
					else if (confirmPassword !== password) {
						setErrorSnackBar(true);
						setErrorSnackBarText('Passwords do not match');
						setHasError(true);
					}
				}
				else {
					setProgress((prevState) => ({ ...prevState, level2: 100 }));
					setLevel(2);
					setHeaderButton('SKIP');
				}
			} else if (level === 2) {
			  setProgress((prevState) => ({ ...prevState, level3: 100 }));
			  setLevel(3);
			  setHeaderButton('SIGN IN');
			} else if (level === 3) {
			  setHeaderButton('SIGN IN');
			  console.log('333')
			}
		//   }
		  

	};
	  
  	const handleBackClick = () => {
		if (level === 1) {
		  setProgress((prevState) => ({ ...prevState, level1: 0 }));
		  setLevel(0);
		  setHeaderButton('SIGN IN');
		} else if (level === 2) {
		  setProgress((prevState) => ({ ...prevState, level2: 0 }));
		  setLevel(1);
		  setHeaderButton('SIGN IN');
		} else if (level === 3) {
		  setProgress((prevState) => ({ ...prevState, level3: 0 }));
		  setLevel(2);
		  setHeaderButton('SKIP');
		}
	  };
	  

  	const getProgressImage = (index) => {
		if (level === index) {
		  return imgActive;
		} else if (level > index) {
		  return imgDone;
		} else {
		  return imgWaiting;
		}
	  };

	const handleClickOTPVerification = () => {
		handleContinueClick();
		handleOpenSnackbar(true);
	  };

	  console.log(toSignin)
  return (
    <Container disableGutters maxWidth={false} sx={{height: "100vh"}}>
		<div className="sginup_wrapper">
			<div className="leftside_reg">
				<div className="leftside_reg_logo">
					<img className="leftside_reg_img" src={logoImage} alt="" />
					<h2>ASYNC TALK</h2>
				</div>
					<div className="left_wrapper">
					<div className="main_progress">
						<h2>User information</h2>
						<h3>Write your personal information</h3>
						<img src={getProgressImage(0)} alt="img" />
						<div className="progress">
							<div className={`bar1 level-${level}`} style={{ height: `${progress.level1}%` }}></div>
						</div>
						<h2>Choose a password</h2>
						<h3>Choose a secure password</h3>
						<img src={getProgressImage(1)} alt="img" />
						<div className="progress">
							<div className={`bar2 level-${level}`} style={{ height: `${progress.level2}%` }}></div>
						</div>
						<h2>Verification</h2>
						<h3>Please provide your emai</h3>
						<img src={getProgressImage(2)} alt="img" />
						<div className="progress">
							<div className={`bar3 level-${level}`} style={{ height: `${progress.level3}%` }}></div>
						</div>
						<h2>Finish registration</h2>
						<h3>Confirm your data and finish registration </h3>
						<img src={getProgressImage(3)} alt="img" />
					</div>
				</div>
				<div className='leftside_reg_footer'>
					<h2>© ASYNC TALK</h2>
					<div>
						<MailOutlineIcon sx={{ fontSize: 18 ,color: "#43444D" }}/>
						<h3>asynctalk@gmail.com</h3>
					</div>
				</div>
			</div>
			<div className="rightside_reg_wrapper">
			{ headerButton === 'SIGN IN' ?
			(<Button 
				variant="contained" 
				sx={{width: 130, height: 50, boxShadow: 2, borderRadius: '4px', 
					position: 'absolute',
					top: 0,
					marginTop: '5px',
					right: 0,
					marginRight: '10px'
				}} 
				style={buttonStyleGetStarted} 
				theme={themeGetStarted}
				component={Link}
				to="/signin"
				>
				SIGN IN
			</Button>) : 
			(<Button 
				variant="contained" 
				sx={{width: 130, height: 50, boxShadow: 2, borderRadius: '4px', 
					position: 'absolute',
					top: 0,
					marginTop: '5px',
					right: 0,
					marginRight: '10px'
				}} 
				style={buttonStyleGetStarted} 
				theme={themeGetStarted}
				onClick={() => handleLevel3()}
				>
				SKIP
			</Button>)
			}
				{level > 0 &&
				<div className="backButton" onClick={handleBackClick}>
					<img src={imgBack} alt="backBtn" />
					<h2>BACK</h2>
				</div>
				}
				{/* USER INFORMATION */}
				{ level === 0 &&
					<div className="rightside_reg_information" style={{ display: level === 0 ? 'block' : 'none' }}>
						<div className="rightside_logo">
							<img className="reg_logo" src={logoImage} alt="logo" />	
						</div>
						<div className="rightside_reg_text">
							<h1>Personal information</h1>
							<h2>This data can be changed later</h2>
						</div>
						<div className='rightside_reg_information_fieldtext'>
							<ThemeProvider theme={theme}>
								<TextField 
								value={fName}
								onChange={(event) => setFName(event.target.value)}
								id="outlined-basic" 
								label="First Name"
								variant="outlined" 
								InputLabelProps={{style: { color: '#e0dfe7' },}} 
								InputProps={{style: { color: '#e0dfe7' },}} 
								sx={{...TextFieldStyles, mt: 2, width: 400, boxShadow: 2}}
								error={fName.length > 0 && fName.length < 5}
  								helperText={fName.length > 0 && fName.length < 5 && "First Name should be at least 5 characters"}
								autoFocus
								/>
								<TextField 
								value={lName}
								onChange={(event) => setLName(event.target.value)}
								id="outlined-basic" 
								label="Last Name" 
								variant="outlined" 
								InputLabelProps={{style: { color: '#e0dfe7' },}} 
								InputProps={{style: { color: '#e0dfe7' },}} 
								sx={{...TextFieldStyles, mt: 3, width: 400, boxShadow: 2}}
								error={lName.length > 0 && lName.length < 5}
  								helperText={lName.length > 0 && lName.length < 5 && "Last Name should be at least 5 characters"}
								autoFocus
								/>
							</ThemeProvider>
						</div>
						<div className='rightside_reg_information_radio'>
						<ThemeProvider theme={theme}>
							<FormControl>
								<FormLabel id="demo-row-radio-buttons-group-label" 
								sx={{color: "#e0dfe7", '&.Mui-focused': {color: "#e0dfe7",}, display: "flex"}}>Gender</FormLabel>
								<RadioGroup
									row
									aria-labelledby="demo-controlled-radio-buttons-group"
									name="controlled-radio-buttons-group"
									value={gender}
									
									onChange={(event) => setGender(event.target.value)}
									>
									<FormControlLabel value="Female" control={<Radio 
																			sx={{color: "#e0dfe7",
																			'&.Mui-checked': {
																			color: "#7f56da",},}}  
																			/>} label="Female"/>
									<FormControlLabel value="Male" control={<Radio 
																			sx={{color: "#e0dfe7",
																			'&.Mui-checked': {
																			color: "#7f56da",},}}  
																			/>} label="Male" />
								</RadioGroup>
							</FormControl>
						</ThemeProvider>
						</div>
						<div className='rightside_reg_information_country'>
						<ThemeProvider theme={theme}>
							<Autocomplete
								value={country}
								onChange={(event, newValue) => {
									setCountry(newValue);
								  }}
								id="country-select-demo"
								sx={{ width: 400, mt: 2 }}
								
								autoFocus
								options={countries}
								autoHighlight
								getOptionLabel={(option) => option.label}
								renderOption={(props, option) => (
									<Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 }, color: "black"}} {...props}>
									<img
										loading="lazy"
										width="20"
										src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
										srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
										alt=""
										
									/>
									{option.label} ({option.code}) +{option.phone}
									</Box>
								)}
								renderInput={(params) => (
									<TextField
									{...params}
									label="Choose a country"
									error={country === null}
  									helperText={country === null && "Choose a country"}
									inputProps={{
										...params.inputProps,
										autoComplete: 'new-password', 
									  }}
									sx={{...TextFieldStyles, width: 400, boxShadow: 2}}
									/>
								)}
								/>
						</ThemeProvider>
						</div>
						<div className='rightside_reg_information_date'>
							<ThemeProvider theme={theme}>
								<LocalizationProvider dateAdapter={AdapterDayjs}>
									<DatePicker
									sx={{...TextFieldStyles, width: 400, boxShadow: 2}}
									value={date}
									onChange={(newValue) => setDate(newValue)}
									renderInput={(props) => (
										<TextField
										  {...props}
										  label="Choose a date"
										  color="#e0dfe7" // Измените цвет текста в поле для ввода
										  variant="outlined"
										/>
									  )}
									/>
								</LocalizationProvider>
							</ThemeProvider>
						</div>
						<div className="rightside_reg_information_button">
							{level === 0 && <Button 
							variant="contained" 
							sx={{mt: 4, width: 400, height: 50, boxShadow: 2, borderRadius: '8px' }} 
							style={buttonStyle} 
							onClick={handleContinueClick}
							theme={theme}>
							Continue
							</Button>}
						</div>
					</div>
				}
				{/* PASSWORD */}
				{ level === 1 &&
				<div className="rightside_reg_password" style={{ display: level === 1 ? 'block' : 'none' }}>
					<div className="rightside_logo">
						<img className="reg_logo" src={logoImage} alt="logo" />	
					</div>
					<div className="rightside_reg_text">
						<h1>Choose a password</h1>
						<h2>Must be at least 8 characters</h2>
					</div>
					<div className="rightside_fieldtext">
						<ThemeProvider theme={theme}>
						<TextField 
							value={username}
							onChange={(event) => setUsername(event.target.value)}
							id="outlined-basic" 
							label="Username"
							variant="outlined" 
							InputLabelProps={{style: { color: '#e0dfe7' },}} 
							InputProps={{style: { color: '#e0dfe7' },}} 
							sx={{...TextFieldStyles, mt: 3, width: 400, boxShadow: 2}}
							error={!isValidUsername}
							helperText={!isValidUsername && "Username should contain at least 5 letters, numbers should be only in the end"}


							autoFocus
						/>
						<TextField
							type={showPassword ? "text" : "password"}
							label="Password"
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
									label="Confirm password"
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
								label="Confirm password"
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
					</div>
					<div className="rightside_button">
						{level === 1 && <Button 
						variant="contained" 
						sx={{mt: 4, width: 400, height: 50, boxShadow: 2, borderRadius: '8px' }} 
						style={buttonStyle} 
						onClick={handleContinueClick}
						theme={theme}>
						Continue
						</Button>}
					</div>
				</div>
				}
				{/* DETAILS */}
				{ level === 2 &&
					<div className="rightside_reg_details" style={{ display: level === 2 ? 'block' : 'none' }}>
					<div className="rightside_logo">
						<img className="reg_logo" src={logoImage} alt="logo" />	
					</div>
					<div className="rightside_reg_text">
						<h1>Provide your email</h1>
						<h2>Enter a valid email address and OTP code</h2>
					</div>
					{ otpEmail === 0 &&
						<>
						<div className='rightside_details_fieldtext'>
							<ThemeProvider theme={theme}>
									<TextField 
									value={email}
									onChange={(event) => setEmail(event.target.value)}
									id="outlined-basic" 
									label="Email" 
									variant="outlined" 
									InputLabelProps={{style: { color: '#e0dfe7' },}} 
									InputProps={{style: { color: '#e0dfe7' },}} 
									sx={{...TextFieldStyles, mt: 2, width: 400, boxShadow: 2}}
									/>
								</ThemeProvider>
								<div className="rightside_button">
									{
									<Button 
									checked={checked} 
									onChange={handleChange}
									variant="contained" 
									sx={{mt: 5, width: 310, height: 50, boxShadow: 2, borderRadius: '8px', fontSize: 18 }} 
									style={buttonStyle} 
									onClick={() => handleChangeOTPEmail(1)}
									theme={theme}>
									Send OTP
									</Button>
									}
								</div>
						</div>
						</>
						}
						{ otpEmail === 1 &&
						<>
						<div className="rightside_details_OTP">
							<header>
								<img src={imgOTP} alt="" />
							</header>
							<h4>We've sent OTP Code on Email: {email}</h4>
							<form action='#' className='rightside_reg_details_form'>
								<ThemeProvider theme={otpTheme}>
									<Box
									sx={{
										"& label.Mui-focused": {
										color: "#e0dfe7",
										},
										"& .MuiInput-underline:after": {
										borderBottomColor: "#e0dfe7",
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
									}}
									>
									<MuiOtpInput
										value={otp}
										onChange={handleChangeOTP}
										inputprops={{ style: { color: '#e0dfe7', textAlign: 'center' } }} // Замените inputProps на inputprops
										TextFieldsProps={{ disabled: false, size: 'small', placeholder: '-' }}
										separator={<span>-</span>}
										sx={{ gap: 1, width: '500px' }}
										length={4}
									/>
									</Box>
								</ThemeProvider>
								<div className="rightside_button">
									{
									<Button 
									checked={checked} 
									onChange={handleChange}
									variant="contained" 
									sx={{mt: 5, width: 310, height: 50, boxShadow: 2, borderRadius: '8px', fontSize: 18 }} 
									style={buttonStyle} 
									onClick={handleClickOTPVerification}
									theme={theme}>
									Verify OTP
									</Button>
									}
								</div>
								<div className='rightside_button_change_email_container'>
									<div className='rightside_button_change_email'>
										<h2 onClick={() => handleChangeOTPEmail(0)}>Change Email</h2>
									</div>
								</div>
							</form>
						</div>
					</>
				}
				</div>
				}
				{/* FINISH REGISTRATION */}
				{ level === 3 &&
					<div className='rightside_reg_finish'>
						<div className='rightside-reg-finish-wrapper'>
							<div className="rightside_logo">
								<img className="reg_logo" src={logoImage} alt="logo" />	
							</div>
							<div className="rightside_reg_text">
								<h1>Complete Registration</h1>
								<h2>Choose an avatar, or upload your own</h2>
							</div>
						</div>

						<div className='avatars-wrapper'>
							<div className='avatars-box'>
							{urlAvatars.map((avatar, index) => (
								<label key={index} 
								htmlFor={`signupAvatarId-${index}`} 
								className={`avatarLabel ${selectedAvatar === avatar ? 'clicked' : ''}`}>
									<input
									type="checkbox"
									id={`signupAvatarId-${index}`}
									className="avatarCheckbox"
									checked={selectedAvatar === avatar}
									onChange={() => handleAvatarClick(avatar)}
									/>
									<Avatar
									className="signupAvatar"
									sx={{ width: 100, height: 100, ml: 2, mb: 2, mt: 2, mr: 2 }}
									alt=""
									src={avatar}
									/>
								</label>
								))}

							</div>
						</div>



						<div className='rightside_reg_finish_data'>
						{
							<Button 
								variant="contained" 
								type="submit" 
								sx={{mt: 4, width: 400, height: 50, boxShadow: 2, borderRadius: '8px' }} 
								style={buttonStyle}
								theme={theme}
								onClick={handleSubmit}
								component={Link}
								to="/signin"
								>
								Complete Registration
							</Button>
						}

						</div>
					</div>
				}

				
				<div className='rightside_reg_level'>
					<div className="progress_level_footer" style={{marginLeft: '-3px'}}>
					<div className={`bar1_footer level-${level}`}></div>
					</div>
					<div className="progress_level_footer">
					<div className={`bar2_footer level-${level}`}></div>
					</div>
					<div className="progress_level_footer">
					<div className={`bar3_footer level-${level}`}></div>
					</div>
					<div className="progress_level_footer">
					<div className={`bar4_footer level-${level}`}></div>
					</div>
				</div>
			</div>
			<Snackbar open={errorSnackBar} autoHideDuration={8000} onClose={handleClose}>
				<Alert onClose={handleClose} severity="error" sx={{ width: 'auto' }}>
					{errorSnackBarText}
				</Alert>
			</Snackbar>
		</div>
    </Container>
  );
}

export default Signup;

const countries = [
	{ code: 'AD', label: 'Andorra', phone: '376' },
	{
	  code: 'AE',
	  label: 'United Arab Emirates',
	  phone: '971',
	},
	{ code: 'AF', label: 'Afghanistan', phone: '93' },
	{
	  code: 'AG',
	  label: 'Antigua and Barbuda',
	  phone: '1-268',
	},
	{ code: 'AI', label: 'Anguilla', phone: '1-264' },
	{ code: 'AL', label: 'Albania', phone: '355' },
	{ code: 'AM', label: 'Armenia', phone: '374' },
	{ code: 'AO', label: 'Angola', phone: '244' },
	{ code: 'AQ', label: 'Antarctica', phone: '672' },
	{ code: 'AR', label: 'Argentina', phone: '54' },
	{ code: 'AS', label: 'American Samoa', phone: '1-684' },
	{ code: 'AT', label: 'Austria', phone: '43' },
	{
	  code: 'AU',
	  label: 'Australia',
	  phone: '61',
	  suggested: true,
	},
	{ code: 'AW', label: 'Aruba', phone: '297' },
	{ code: 'AX', label: 'Alland Islands', phone: '358' },
	{ code: 'AZ', label: 'Azerbaijan', phone: '994' },
	{
	  code: 'BA',
	  label: 'Bosnia and Herzegovina',
	  phone: '387',
	},
	{ code: 'BB', label: 'Barbados', phone: '1-246' },
	{ code: 'BD', label: 'Bangladesh', phone: '880' },
	{ code: 'BE', label: 'Belgium', phone: '32' },
	{ code: 'BF', label: 'Burkina Faso', phone: '226' },
	{ code: 'BG', label: 'Bulgaria', phone: '359' },
	{ code: 'BO', label: 'Bolivia', phone: '591' },
	{ code: 'BR', label: 'Brazil', phone: '55' },
	{ code: 'BS', label: 'Bahamas', phone: '1-242' },
	{ code: 'BT', label: 'Bhutan', phone: '975' },
	{ code: 'BV', label: 'Bouvet Island', phone: '47' },
	{ code: 'BW', label: 'Botswana', phone: '267' },
	{ code: 'BY', label: 'Belarus', phone: '375' },
	{ code: 'BZ', label: 'Belize', phone: '501' },
	{
	  code: 'CA',
	  label: 'Canada',
	  phone: '1',
	  suggested: true,
	},
	{
	  code: 'CC',
	  label: 'Cocos (Keeling) Islands',
	  phone: '61',
	},
	{
	  code: 'CD',
	  label: 'Congo, Democratic Republic of the',
	  phone: '243',
	},
	{
	  code: 'CF',
	  label: 'Central African Republic',
	  phone: '236',
	},
	{
	  code: 'CG',
	  label: 'Congo, Republic of the',
	  phone: '242',
	},
	{ code: 'CH', label: 'Switzerland', phone: '41' },
	{ code: 'CI', label: "Cote d'Ivoire", phone: '225' },
	{ code: 'CK', label: 'Cook Islands', phone: '682' },
	{ code: 'CL', label: 'Chile', phone: '56' },
	{ code: 'CM', label: 'Cameroon', phone: '237' },
	{ code: 'CN', label: 'China', phone: '86' },
	{ code: 'CO', label: 'Colombia', phone: '57' },
	{ code: 'CR', label: 'Costa Rica', phone: '506' },
	{ code: 'CU', label: 'Cuba', phone: '53' },
	{ code: 'CV', label: 'Cape Verde', phone: '238' },
	{ code: 'CW', label: 'Curacao', phone: '599' },
	{ code: 'CX', label: 'Christmas Island', phone: '61' },
	{ code: 'CY', label: 'Cyprus', phone: '357' },
	{ code: 'CZ', label: 'Czech Republic', phone: '420' },
	{
	  code: 'DE',
	  label: 'Germany',
	  phone: '49',
	  suggested: true,
	},
	{ code: 'DJ', label: 'Djibouti', phone: '253' },
	{ code: 'DK', label: 'Denmark', phone: '45' },
	{ code: 'DM', label: 'Dominica', phone: '1-767' },
	{
	  code: 'DO',
	  label: 'Dominican Republic',
	  phone: '1-809',
	},
	{ code: 'DZ', label: 'Algeria', phone: '213' },
	{ code: 'EC', label: 'Ecuador', phone: '593' },
	{ code: 'EE', label: 'Estonia', phone: '372' },
	{ code: 'EG', label: 'Egypt', phone: '20' },
	{ code: 'EH', label: 'Western Sahara', phone: '212' },
	{ code: 'ER', label: 'Eritrea', phone: '291' },
	{ code: 'ES', label: 'Spain', phone: '34' },
	{ code: 'ET', label: 'Ethiopia', phone: '251' },
	{ code: 'FI', label: 'Finland', phone: '358' },
	{ code: 'FJ', label: 'Fiji', phone: '679' },
	{
	  code: 'FK',
	  label: 'Falkland Islands (Malvinas)',
	  phone: '500',
	},
	{
	  code: 'FM',
	  label: 'Micronesia, Federated States of',
	  phone: '691',
	},
	{ code: 'FO', label: 'Faroe Islands', phone: '298' },
	{
	  code: 'FR',
	  label: 'France',
	  phone: '33',
	  suggested: true,
	},
	{ code: 'GA', label: 'Gabon', phone: '241' },
	{ code: 'GB', label: 'United Kingdom', phone: '44' },
	{ code: 'GD', label: 'Grenada', phone: '1-473' },
	{ code: 'GE', label: 'Georgia', phone: '995' },
	{ code: 'GF', label: 'French Guiana', phone: '594' },
	{ code: 'GG', label: 'Guernsey', phone: '44' },
	{ code: 'GH', label: 'Ghana', phone: '233' },
	{ code: 'GI', label: 'Gibraltar', phone: '350' },
	{ code: 'GL', label: 'Greenland', phone: '299' },
	{ code: 'GM', label: 'Gambia', phone: '220' },
	{ code: 'GN', label: 'Guinea', phone: '224' },
	{ code: 'GP', label: 'Guadeloupe', phone: '590' },
	{ code: 'GQ', label: 'Equatorial Guinea', phone: '240' },
	{ code: 'GR', label: 'Greece', phone: '30' },
	{
	  code: 'GS',
	  label: 'South Georgia and the South Sandwich Islands',
	  phone: '500',
	},
	{ code: 'GT', label: 'Guatemala', phone: '502' },
	{ code: 'GU', label: 'Guam', phone: '1-671' },
	{ code: 'GW', label: 'Guinea-Bissau', phone: '245' },
	{ code: 'GY', label: 'Guyana', phone: '592' },
	{ code: 'HK', label: 'Hong Kong', phone: '852' },
	{
	  code: 'HM',
	  label: 'Heard Island and McDonald Islands',
	  phone: '672',
	},
	{ code: 'HN', label: 'Honduras', phone: '504' },
	{ code: 'HR', label: 'Croatia', phone: '385' },
	{ code: 'HT', label: 'Haiti', phone: '509' },
	{ code: 'HU', label: 'Hungary', phone: '36' },
	{ code: 'ID', label: 'Indonesia', phone: '62' },
	{ code: 'IE', label: 'Ireland', phone: '353' },
	{ code: 'IL', label: 'Israel', phone: '972' },
	{ code: 'IM', label: 'Isle of Man', phone: '44' },
	{ code: 'IN', label: 'India', phone: '91' },
	{
	  code: 'IO',
	  label: 'British Indian Ocean Territory',
	  phone: '246',
	},
	{ code: 'IQ', label: 'Iraq', phone: '964' },
	{
	  code: 'IR',
	  label: 'Iran, Islamic Republic of',
	  phone: '98',
	},
	{ code: 'IS', label: 'Iceland', phone: '354' },
	{ code: 'IT', label: 'Italy', phone: '39' },
	{ code: 'JE', label: 'Jersey', phone: '44' },
	{ code: 'JM', label: 'Jamaica', phone: '1-876' },
	{ code: 'JO', label: 'Jordan', phone: '962' },
	{
	  code: 'JP',
	  label: 'Japan',
	  phone: '81',
	  suggested: true,
	},
	{ code: 'KE', label: 'Kenya', phone: '254' },
	{ code: 'KG', label: 'Kyrgyzstan', phone: '996' },
	{ code: 'KH', label: 'Cambodia', phone: '855' },
	{ code: 'KI', label: 'Kiribati', phone: '686' },
	{ code: 'KM', label: 'Comoros', phone: '269' },
	{
	  code: 'KN',
	  label: 'Saint Kitts and Nevis',
	  phone: '1-869',
	},
	{
	  code: 'KP',
	  label: "Korea, Democratic People's Republic of",
	  phone: '850',
	},
	{ code: 'KR', label: 'Korea, Republic of', phone: '82' },
	{ code: 'KW', label: 'Kuwait', phone: '965' },
	{ code: 'KY', label: 'Cayman Islands', phone: '1-345' },
	{ code: 'KZ', label: 'Kazakhstan', phone: '7' },
	{
	  code: 'LA',
	  label: "Lao People's Democratic Republic",
	  phone: '856',
	},
	{ code: 'LB', label: 'Lebanon', phone: '961' },
	{ code: 'LC', label: 'Saint Lucia', phone: '1-758' },
	{ code: 'LI', label: 'Liechtenstein', phone: '423' },
	{ code: 'LK', label: 'Sri Lanka', phone: '94' },
	{ code: 'LR', label: 'Liberia', phone: '231' },
	{ code: 'LS', label: 'Lesotho', phone: '266' },
	{ code: 'LT', label: 'Lithuania', phone: '370' },
	{ code: 'LU', label: 'Luxembourg', phone: '352' },
	{ code: 'LV', label: 'Latvia', phone: '371' },
	{ code: 'LY', label: 'Libya', phone: '218' },
	{ code: 'MA', label: 'Morocco', phone: '212' },
	{ code: 'MC', label: 'Monaco', phone: '377' },
	{
	  code: 'MD',
	  label: 'Moldova, Republic of',
	  phone: '373',
	},
	{ code: 'ME', label: 'Montenegro', phone: '382' },
	{
	  code: 'MF',
	  label: 'Saint Martin (French part)',
	  phone: '590',
	},
	{ code: 'MG', label: 'Madagascar', phone: '261' },
	{ code: 'MH', label: 'Marshall Islands', phone: '692' },
	{
	  code: 'MK',
	  label: 'Macedonia, the Former Yugoslav Republic of',
	  phone: '389',
	},
	{ code: 'ML', label: 'Mali', phone: '223' },
	{ code: 'MM', label: 'Myanmar', phone: '95' },
	{ code: 'MN', label: 'Mongolia', phone: '976' },
	{ code: 'MO', label: 'Macao', phone: '853' },
	{
	  code: 'MP',
	  label: 'Northern Mariana Islands',
	  phone: '1-670',
	},
	{ code: 'MQ', label: 'Martinique', phone: '596' },
	{ code: 'MR', label: 'Mauritania', phone: '222' },
	{ code: 'MS', label: 'Montserrat', phone: '1-664' },
	{ code: 'MT', label: 'Malta', phone: '356' },
	{ code: 'MU', label: 'Mauritius', phone: '230' },
	{ code: 'MV', label: 'Maldives', phone: '960' },
	{ code: 'MW', label: 'Malawi', phone: '265' },
	{ code: 'MX', label: 'Mexico', phone: '52' },
	{ code: 'MY', label: 'Malaysia', phone: '60' },
	{ code: 'MZ', label: 'Mozambique', phone: '258' },
	{ code: 'NA', label: 'Namibia', phone: '264' },
	{ code: 'NC', label: 'New Caledonia', phone: '687' },
	{ code: 'NE', label: 'НИГЕРЫ ЕБАНЫЕ', phone: '227' },
	{ code: 'NF', label: 'Norfolk Island', phone: '672' },
	{ code: 'NG', label: 'Nigeria', phone: '234' },
	{ code: 'NI', label: 'Nicaragua', phone: '505' },
	{ code: 'NL', label: 'Netherlands', phone: '31' },
	{ code: 'NO', label: 'Norway', phone: '47' },
	{ code: 'NP', label: 'Nepal', phone: '977' },
	{ code: 'NR', label: 'Nauru', phone: '674' },
	{ code: 'NU', label: 'Niue', phone: '683' },
	{ code: 'NZ', label: 'New Zealand', phone: '64' },
	{ code: 'OM', label: 'Oman', phone: '968' },
	{ code: 'PA', label: 'Panama', phone: '507' },
	{ code: 'PE', label: 'Peru', phone: '51' },
	{ code: 'PF', label: 'French Polynesia', phone: '689' },
	{ code: 'PG', label: 'Papua New Guinea', phone: '675' },
	{ code: 'PH', label: 'Philippines', phone: '63' },
	{ code: 'PK', label: 'Pakistan', phone: '92' },
	{ code: 'PL', label: 'Poland', phone: '48' },
	{
	  code: 'PM',
	  label: 'Saint Pierre and Miquelon',
	  phone: '508',
	},
	{ code: 'PN', label: 'Pitcairn', phone: '870' },
	{ code: 'PR', label: 'Puerto Rico', phone: '1' },
	{
	  code: 'PS',
	  label: 'Palestine, State of',
	  phone: '970',
	},
	{ code: 'PT', label: 'Portugal', phone: '351' },
	{ code: 'PW', label: 'Palau', phone: '680' },
	{ code: 'PY', label: 'Paraguay', phone: '595' },
	{ code: 'QA', label: 'Qatar', phone: '974' },
	{ code: 'RE', label: 'Reunion', phone: '262' },
	{ code: 'RO', label: 'Romania', phone: '40' },
	{ code: 'RS', label: 'Serbia', phone: '381' },
	{ code: 'RU', label: 'Russian Federation', phone: '7' },
	{ code: 'RW', label: 'Rwanda', phone: '250' },
	{ code: 'SA', label: 'Saudi Arabia', phone: '966' },
	{ code: 'SB', label: 'Solomon Islands', phone: '677' },
	{ code: 'SC', label: 'Seychelles', phone: '248' },
	{ code: 'SD', label: 'Sudan', phone: '249' },
	{ code: 'SE', label: 'Sweden', phone: '46' },
	{ code: 'SG', label: 'Singapore', phone: '65' },
	{ code: 'SH', label: 'Saint Helena', phone: '290' },
	{ code: 'SI', label: 'Slovenia', phone: '386' },
	{
	  code: 'SJ',
	  label: 'Svalbard and Jan Mayen',
	  phone: '47',
	},
	{ code: 'SK', label: 'Slovakia', phone: '421' },
	{ code: 'SL', label: 'Sierra Leone', phone: '232' },
	{ code: 'SM', label: 'San Marino', phone: '378' },
	{ code: 'SN', label: 'Senegal', phone: '221' },
	{ code: 'SO', label: 'Somalia', phone: '252' },
	{ code: 'SR', label: 'Suriname', phone: '597' },
	{ code: 'SS', label: 'South Sudan', phone: '211' },
	{
	  code: 'ST',
	  label: 'Sao Tome and Principe',
	  phone: '239',
	},
	{ code: 'SV', label: 'El Salvador', phone: '503' },
	{
	  code: 'SX',
	  label: 'Sint Maarten (Dutch part)',
	  phone: '1-721',
	},
	{
	  code: 'SY',
	  label: 'Syrian Arab Republic',
	  phone: '963',
	},
	{ code: 'SZ', label: 'Swaziland', phone: '268' },
	{
	  code: 'TC',
	  label: 'Turks and Caicos Islands',
	  phone: '1-649',
	},
	{ code: 'TD', label: 'Chad', phone: '235' },
	{
	  code: 'TF',
	  label: 'French Southern Territories',
	  phone: '262',
	},
	{ code: 'TG', label: 'Togo', phone: '228' },
	{ code: 'TH', label: 'Thailand', phone: '66' },
	{ code: 'TJ', label: 'Tajikistan', phone: '992' },
	{ code: 'TK', label: 'Tokelau', phone: '690' },
	{ code: 'TL', label: 'Timor-Leste', phone: '670' },
	{ code: 'TM', label: 'Turkmenistan', phone: '993' },
	{ code: 'TN', label: 'Tunisia', phone: '216' },
	{ code: 'TO', label: 'Tonga', phone: '676' },
	{ code: 'TR', label: 'Turkey', phone: '90' },
	{
	  code: 'TT',
	  label: 'Trinidad and Tobago',
	  phone: '1-868',
	},
	{ code: 'TV', label: 'Tuvalu', phone: '688' },
	{
	  code: 'TW',
	  label: 'Taiwan, Republic of China',
	  phone: '886',
	},
	{
	  code: 'TZ',
	  label: 'United Republic of Tanzania',
	  phone: '255',
	},
	{ code: 'UA', label: 'Ukraine', phone: '380' },
	{ code: 'UG', label: 'Uganda', phone: '256' },
	{
	  code: 'US',
	  label: 'United States',
	  phone: '1',
	  suggested: true,
	},
	{ code: 'UY', label: 'Uruguay', phone: '598' },
	{ code: 'UZ', label: 'Uzbekistan', phone: '998' },
	{
	  code: 'VA',
	  label: 'Holy See (Vatican City State)',
	  phone: '379',
	},
	{
	  code: 'VC',
	  label: 'Saint Vincent and the Grenadines',
	  phone: '1-784',
	},
	{ code: 'VE', label: 'Venezuela', phone: '58' },
	{
	  code: 'VG',
	  label: 'British Virgin Islands',
	  phone: '1-284',
	},
	{
	  code: 'VI',
	  label: 'US Virgin Islands',
	  phone: '1-340',
	},
	{ code: 'VN', label: 'Vietnam', phone: '84' },
	{ code: 'VU', label: 'Vanuatu', phone: '678' },
	{ code: 'WF', label: 'Wallis and Futuna', phone: '681' },
	{ code: 'WS', label: 'Samoa', phone: '685' },
	{ code: 'XK', label: 'Kosovo', phone: '383' },
	{ code: 'YE', label: 'Yemen', phone: '967' },
	{ code: 'YT', label: 'Mayotte', phone: '262' },
	{ code: 'ZA', label: 'South Africa', phone: '27' },
	{ code: 'ZM', label: 'Zambia', phone: '260' },
	{ code: 'ZW', label: 'Zimbabwe', phone: '263' },
  ];