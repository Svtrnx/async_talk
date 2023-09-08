import React, {useEffect, useState} from 'react';
import { TextField, Button, Avatar, Autocomplete, Box, Snackbar, Alert} from "@mui/material"
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {countries} from '../../../signup/signup';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { motion, useAnimation } from 'framer-motion';
import './settingsProfile.css';
import axios from 'axios';

const TextFieldStyles = {
	"& label.Mui-focused": {
	color: "orange",
	},
	"& .MuiInput-underline:after": {
	borderBottomColor: "orange",
	},
	"& .MuiOutlinedInput-root": {
	"& fieldset": {
		borderColor: "#8d8d8d",
	},
	"&:hover fieldset": {
		borderColor: "#946cdc",
	},
	"&.Mui-focused fieldset": {
		borderColor: "#7f56da",
	}},
}



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

const buttonStyleUploadImg = {
	borderColor: '#5d38b1',
	color: '#e0dfe7'
  };

function SettingsProfile({userInInfo, onDataFromChild}) {
	const [fName, setFName] = useState('')
	const [lName, setLName] = useState('')
	const [username, setUsername] = useState('');
	const [aboutMe, setAboutMe] = useState('');
	const [email, setEmail] = useState('');
	const [country, setCountry] = useState({ code: '', label: '', phone: '' });
	const [date, setDate] = useState(null);
	const [dataToSend, setDataToSend] = useState('zzzzzzzz');
	const [sendLoader, setSendLoader] = React.useState('none');
	const [checkCode, setCheckCode] = useState("");
	const [errorSnackBar, setErrorSnackBar] = useState(false);
	const [errorSnackBarText, setErrorSnackBarText] = useState('');
	const [snackBarColor, setSnackBarColor] = React.useState('');

  const sendDataToParent = () => {
    onDataFromChild(dataToSend);
  };

	async function saveChangedUserData() {
	try {
		if (fName.length > 15 || lName.length > 15 || country === null || country.label === '') {
			if (fName.length > 15 || lName.length > 15) {
				setErrorSnackBarText('Your text input is too long! Max length is 15 chars');
				setErrorSnackBar(true);
				setSnackBarColor('#d32f2f');
				return
			}
		}
		setSendLoader('')
		const response = await axios.patch('http://localhost:8000/settings/update_user_data', {
				email: email,
				username: username,
				first_name: fName,
				last_name: lName,
				avatar: '',
				gender: '',
				country: country,
				date: date,
			  }, {
				headers: {
				  'Content-Type': 'application/x-www-form-urlencoded'
				}
			  });
		setSendLoader('none');
		setErrorSnackBar(true);
		setSnackBarColor('#388e3c');
		setErrorSnackBarText("You've successfully modified your data!");

		setCheckCode(response)
		console.log(response);
		
	}
	catch (err) {
		setSendLoader('none')
		setErrorSnackBar(true);
		setSnackBarColor('#d32f2f');
		setErrorSnackBarText("ERROR: " + err.response.data.detail);
		console.log("SEND MESSAGE ERROR: ", err);
		}
	}

	function cancelAll() {
		setFName('');
		setLName('');
		setUsername('');
		setAboutMe('');
		setEmail('');
		setCountry({ code: '', label: '', phone: '' });
		setDate(null);

	}

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
		  return;
		}
	
		setErrorSnackBar(false);
	};



	return (
		<div className='setting-main-container'>
			<div className='setting-main-container-header'>
				<div>
					<h2>Account Settings</h2>
					<h2 style={{fontSize: '15px', color: 'rgb(159 159 159 / 61%)', marginTop: '3px'}}>Here you can change your account information</h2>
				</div>
					{ fName.length > 3 || lName.length > 3 || username.length > 3 || 
					aboutMe.length > 3 || email.length > 3 ?
					
				<div style={{marginInlineStart: 'auto'}}>
					<motion.div
					initial={{ y: 10, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					exit={{ y: -10, opacity: 0 }}
					transition={{ duration: 0.3 }}
				>
					<Button 
						variant="outlined" 
						type="submit" 
						color='success'
						sx={{mt: 1, width: '150px', height: 30, boxShadow: 5, borderRadius: '8px' }} 
						// style={buttonStyleUploadImg}
						theme={theme}
						onClick={() => saveChangedUserData()}
						>
						SAVE CHANGES
					</Button>
					<Button 
						variant="outlined" 
						type="submit" 
						sx={{mt: 1, ml: 3, mr: 3, width: '150px', height: 30, boxShadow: 5, borderRadius: '8px' }} 
						// style={buttonStyleUploadImg}
						theme={theme}
						color='error'
						onClick={() => cancelAll()}
						>
						CANCEL
					</Button>
					<span className={`loaderOTP2Verif${sendLoader}`}></span>
				</motion.div>
				</div>
				: null}
			</div>
			<div className='setting-main-container-body'>
				<div className='setting-main-container-body-first-block'>
					<div style={{display: 'flex', justifyContent: 'space-between'}}>
						<div>
							<h2 style={{marginLeft: '10px'}}>Username</h2>
							<ThemeProvider theme={theme}>
								<TextField 
								value={username}
								onChange={(event) => setUsername(event.target.value)}
								id="outlined-basic" 
								label={userInInfo.username}
								variant="outlined" 
								size='small'
								InputLabelProps={{style: { color: '#8d8d8d' },}} 
								InputProps={{style: { color: '#e0dfe7' },}} 
								sx={{...TextFieldStyles, mt: 1, width: 400, boxShadow: 2}}
								/>
							</ThemeProvider>
						</div>
						<div>
							<h2 style={{marginLeft: '10px'}}>Email Address</h2>
							<ThemeProvider theme={theme}>
								<TextField 
								value={email}
								aria-describedby="none"
								onChange={(event) => setEmail(event.target.value)}
								id="outlined-hidden-label-basic" 
								label={userInInfo.email}
								variant="outlined" 
								size='small'
								InputLabelProps={{style: { color: '#8d8d8d' },}} 
								InputProps={{style: { color: '#e0dfe7' },}} 
								sx={{...TextFieldStyles, mt: 1, width: 400, boxShadow: 2}}
								/>
							</ThemeProvider>
						</div>
					</div>
					<div style={{display: 'flex', justifyContent: 'space-between', marginTop: '35px'}}>
						<div>
							<h2 style={{marginLeft: '10px'}}>First Name</h2>
							<ThemeProvider theme={theme}>
								<TextField 
								value={fName}
								onChange={(event) => setFName(event.target.value)}
								id="outlined-basic" 
								label={userInInfo.first_name}
								variant="outlined" 
								size='small'
								InputLabelProps={{style: { color: '#8d8d8d' },}} 
								InputProps={{style: { color: '#e0dfe7' },}} 
								sx={{...TextFieldStyles, mt: 1, width: 400, boxShadow: 2}}
								/>
							</ThemeProvider>
						</div>
						<div>
							<h2 style={{marginLeft: '10px'}}>Last Name</h2>
							<ThemeProvider theme={theme}>
								<TextField 
								value={lName}
								aria-describedby="none"
								onChange={(event) => setLName(event.target.value)}
								id="outlined-basic" 
								label={userInInfo.last_name}
								variant="outlined" 
								size='small'
								InputLabelProps={{style: { color: '#8d8d8d' },}} 
								InputProps={{style: { color: '#e0dfe7' },}} 
								sx={{...TextFieldStyles, mt: 1, width: 400, boxShadow: 2}}
								/>
							</ThemeProvider>
						</div>
					</div>
					<div style={{display: 'flex', justifyContent: 'space-between', marginTop: '25px', alignItems: 'center'}}>
						<div>
							<h2 style={{marginLeft: '10px'}}>Country</h2>
							<ThemeProvider theme={theme}>
							<Autocomplete
								value={country}
								onChange={(event, newValue) => {
									setCountry(newValue);
								}}
								id="country-select-demo"
								sx={{ width: 400, mt: 1 }}
								
								options={countries}
								autoHighlight
								getOptionLabel={(option) => option.label}
								renderOption={(props, option) => (
									<Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 }, color: "#8d8d8d"}} {...props}>
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
									size='small'
									label={userInInfo.country}
									InputLabelProps={{style: { color: '#8d8d8d' },}} 
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
						<div>
							<h2 style={{marginLeft: '10px'}}>Date</h2>
							<ThemeProvider theme={theme}>
								
								<LocalizationProvider dateAdapter={AdapterDayjs}>
									
									<DatePicker
									className='sw'
									sx={{...TextFieldStyles, mt: 1, width: 400, boxShadow: 2}}
									value={date}
									onChange={(newValue) => setDate(newValue)}
									slotProps={{ textField: { size: 'small' } }}
									renderInput={(props) => (
										<TextField
										{...props}
										label="Date"
										color="#e0dfe7" 
										variant="outlined"
										/>
									)}
									/>
								</LocalizationProvider>
							</ThemeProvider>
						</div>
					</div>
						<div style={{marginTop: '25px'}}>
							<h2 style={{marginLeft: '10px'}}>About Me</h2>
							<ThemeProvider theme={theme}>
								<TextField
								// noValidate
								autoComplete="off"
								id="outlined-basic"
								maxRows={4}
								minRows={4}
								multiline
								value={aboutMe}
								onChange={(event) => setAboutMe(event.target.value)}
								size="small"
								label="Tell about yourself in 150 characters"
								variant="outlined"
								InputLabelProps={{ style: { color: '#8d8d8d' } }}
								InputProps={{ style: { color: '#e0dfe7', height: 'auto', maxHeight: 'auto', maxLines: 4 }, classes: { focused: 'focused-input',}, }}
								sx={{...TextFieldStyles, mx: 'auto',
								width: '100%', display: 'flex', mt: 1, mb: 2}}
								/>
								<span></span>
							</ThemeProvider>
						</div>
					</div>
			</div>
			<Snackbar open={errorSnackBar} autoHideDuration={8000} onClose={handleClose}>
				<Alert onClose={handleClose} severity="error"
				sx={{ width: 'auto', backgroundColor: snackBarColor, color: '#fff' }}>
					{errorSnackBarText}
				</Alert>
			</Snackbar>
		</div>
	)
}

export default SettingsProfile;





