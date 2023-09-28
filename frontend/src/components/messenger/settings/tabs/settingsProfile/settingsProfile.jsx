import React, {useEffect, useState} from 'react';
import { TextField, Button, Autocomplete, Box, Snackbar, Alert} from "@mui/material"
import { ThemeProvider } from '@mui/material/styles';
import {buttonStyleUploadImg, TextFieldStyles, theme, buttonStyle, otpTheme} from '../../../utils/utils';
import {countries} from '../../../../signup/signup';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { MuiOtpInput } from 'mui-one-time-password-input';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { motion, useAnimation } from 'framer-motion';
import axios from 'axios';
import dayjs from 'dayjs';

import './settingsProfile.css';



function SettingsProfile({userInInfo, formData, onDataFromChild, formDataHeaderImg}) {
	const [fName, setFName] = useState('')
	const [lName, setLName] = useState('')
	const [username, setUsername] = useState('');
	const [aboutMe, setAboutMe] = useState('');
	const [otpFirstEmail, setOtpFirstEmail] = useState('');
	const [otpSecondEmail, setOtpSecondEmail] = useState('');
	const [showFirstOTP, setShowFirstOTP] = useState(false);
	const [showSecondOTP, setShowSecondOTP] = useState(false);
	const [email, setEmail] = useState('');
	const [newEmail, setNewEmail] = useState('');
	const [country, setCountry] = useState({ code: '', label: '', phone: '' });
	const [date, setDate] = useState(null);
	const [dataToSend, setDataToSend] = useState('zzzzzzzz');
	const [sendLoader, setSendLoader] = React.useState('none');
	const [sendLoader3, setSendLoader3] = React.useState('none');
	const [checkCodeFirst, setCheckCodeFirst] = useState("");
	const [checkCodeSecond, setCheckCodeSecond] = useState("");
	const [isDisabledInput, setIsDisabledInput] = useState(false);
	const [changeEmailStep, setChangeEmailStep] = useState(0);
	const [errorSnackBar, setErrorSnackBar] = useState(false);
	const [isEmailNew, setIsEmailNew] = useState(true);
	const [verifNewEmail, setVerifNewEmail] = useState(false);
	const [errorSnackBarText, setErrorSnackBarText] = useState('');
	const [snackBarColor, setSnackBarColor] = React.useState('');
	const [isHeaderImgRepeated, setIsHeaderImgRepeated] = React.useState(false);

	const sendDataToParent = () => {
		onDataFromChild(dataToSend);
	};

	useEffect(() => {

		axios.defaults.withCredentials = true;
	  
		const fetchData = async () => {
		  try {
			const response = await axios.get('http://localhost:8000/api/check_verification', {
			  headers: {
				'Content-Type': 'application/json',
			  }
			});
	  
		  } catch (error) {
			console.error(error);
		  }
		};
	  
		fetchData();
	}, []);

	
	function maskEmail(email) {
		const atIndex = email.indexOf('@');
		if (atIndex >= 0) {
		const visiblePart = email.charAt(0) + '*'.repeat(atIndex - 2) + email.charAt(atIndex - 1);
		return visiblePart + email.slice(atIndex);
		}
		return email;
	}
	const maskedEmail = maskEmail(userInInfo.email);


	async function saveChangedUserData() {
		try {
			if (email.length > 3 && isEmailNew === true) {
				setVerifNewEmail(true);
				return
			}
			if (email.length > 3){
				if (email !== newEmail) {
						setErrorSnackBarText(`ERROR: You are trying to connect this email: ${email}, but you added ${newEmail}`);
						setErrorSnackBar(true);
						setSnackBarColor('#d32f2f');
						return
					}
				}
			if (fName.length > 15 || lName.length > 15 || country === null || country.label === '') {
				if (fName.length > 15 || lName.length > 15) {
					setErrorSnackBarText('Your text input is too long! Max length is 15 chars');
					setErrorSnackBar(true);
					setSnackBarColor('#d32f2f');
					return
				}
			}
			const dayjsValue = dayjs(date);
			
			const formattedMonth = dayjsValue.format('MMMM');
			const formattedDay = dayjsValue.format('D');
			const formattedYear = dayjsValue.format('YYYY');

			let formDataDate = formattedMonth + ' ' + formattedDay;
			formDataDate += ' ' + formattedYear

			setSendLoader('')
			await axios.patch('http://localhost:8000/settings/update_user_data', {
				email: email,
				username: username,
				first_name: fName,
				last_name: lName,
				avatar: formData.secure_url,
				headerImg: formDataHeaderImg.secure_url,
				gender: '',
				country: country.label,
				date: formDataDate,
				}, {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
				});
			setSendLoader('none');
			setErrorSnackBar(true);
			setSnackBarColor('#388e3c');
			setErrorSnackBarText("You've successfully modified your data!");
			// formData.JSON.stringify(formData);
			// console.log('formDataformData',formData)
			
		}
		catch (err) {
			setSendLoader('none')
			setErrorSnackBar(true);
			setSnackBarColor('#d32f2f');
			setErrorSnackBarText("ERROR: " + err.response.data.detail);
			console.log("SEND MESSAGE ERROR: ", err);
			}
		}

	const handleChangeOTPFEmail = (newValueFEmail) => {
		setOtpFirstEmail(newValueFEmail)
	}

	const handleChangeOTPSEmail = (newValueSEmail) => {
		setOtpSecondEmail(newValueSEmail)
	}

	async function sendOTPCodeFirstEmail() {
		try {
			setSendLoader3('')
			const response = await axios.post("http://localhost:8000/send-otp-code", {
					email: userInInfo.email,
					code_length: 5,
					email_message: 'OTP Code to unlink your email',
					email_subject: "ASYNC TALK 2-AUTH CODE",
					condition: 'not_exists',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			});
			setSendLoader3('none')
			setErrorSnackBar(true);
			setSnackBarColor('#388e3c');
			setErrorSnackBarText("OTP code was sended successfully!");
			setCheckCodeFirst(response.data.check)
			setShowFirstOTP(true);
			
		}
		catch (err) {
			setSendLoader3('none')
			setErrorSnackBar(true);
			setSnackBarColor('#d32f2f');
			setErrorSnackBarText("ERROR: " + err.response.data.detail);
			console.log("SEND MESSAGE ERROR: ", err);
		}
	}

	async function sendOTPCodeSecondEmail() {
		try {
			setSendLoader3('')
			const response = await axios.post("http://localhost:8000/send-otp-code", {
					email: newEmail,
					code_length: 5,
					email_message: 'OTP Code to link your email',
					email_subject: "ASYNC TALK 2-AUTH CODE",
					condition: 'exists',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			});
			setSendLoader3('none')
			setErrorSnackBar(true);
			setSnackBarColor('#388e3c');
			setErrorSnackBarText("OTP code to new email was sended successfully!");
			setCheckCodeSecond(response.data.check)
			setShowSecondOTP(true);
			
		}
		catch (err) {
			setSendLoader3('none')
			setErrorSnackBar(true);
			setSnackBarColor('#d32f2f');
			setErrorSnackBarText("ERROR: " + err.response.data.detail);
			console.log("SEND MESSAGE ERROR: ", err);
		}
	}

	function compareOTPCodesFirst() {
		if (checkCodeFirst === otpFirstEmail) {
			setChangeEmailStep(1);
		}
		else {
			setSendLoader3('none')
			setErrorSnackBar(true);
			setSnackBarColor('#d32f2f');
			setErrorSnackBarText("INVALID OTP CODE!");
		}
	}

	function compareOTPCodesSecond() {
		if (checkCodeSecond === otpSecondEmail) {
			setErrorSnackBar(true);
			setSnackBarColor('#388e3c');
			setErrorSnackBarText("You have been updated your email, now save the changes!");
			setIsEmailNew(false);
			setEmail(newEmail);
			setTimeout(() => {
				setVerifNewEmail(false);
			}, 2000);
		}
		else {
			setSendLoader3('none')
			setErrorSnackBar(true);
			setSnackBarColor('#d32f2f');
			setErrorSnackBarText("INVALID OTP CODE!");
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


	console.log(formData)
	console.log('1',typeof(formData))

	return (
		<div className='setting-main-container'>
			<div className='setting-main-container-header'>
				<div>
					<h2>Account Settings</h2>
					<h2 style={{fontSize: '15px', color: 'rgb(159 159 159 / 61%)', marginTop: '3px'}}>Here you can change your account information</h2>
				</div>
					{ fName.length > 3 || lName.length > 3 || username.length > 3 || 
					aboutMe.length > 3 || email.length > 3 || typeof formData === 'object' || typeof formDataHeaderImg === 'object' ||
					((country && country.label) && country.label.length > 2)  || date !== null?
					
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
								disabled
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
								label={maskedEmail}
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
									if (newValue === undefined || newValue === null) {
										setCountry('');
									  }
								}}
								id="country-select-demo"
								sx={{ width: 400, mt: 1 }}
								
								options={countries}
								autoHighlight
								getOptionLabel={(option) => (option ? option.label : '')}
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
			{ verifNewEmail === true ?
			<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			>
			<div className='settings-profile-confirm-email'>
				{ changeEmailStep === 0 ?
					<>
					<div style={{borderBottom: '1px solid rgb(51 52 56 / 70%)', paddingBottom: '5px', width: '100%', display: 'flex', height: 30, justifyContent: 'center', borderRadius: '2px'}}>
						<h2 style={{fontSize: '20px', fontWeight: 'bold'}}>STEP I</h2>
					</div>
					<h2 style={{fontSize: '18px', marginTop: '20px', marginBottom: '10px'}}>We will send you an OTP code, it's necessary to protect your account</h2>
					<div style={{display: 'flex'}}>
					<Button 
						variant="outlined" 
						type="submit" 
						color='success'
						sx={{mt: 2, width: '200px', height: 40, boxShadow: 5, borderRadius: '8px' }} 
						// style={buttonStyleUploadImg}
						theme={theme}
						onClick={() => sendOTPCodeFirstEmail()}
						>
						CONFIRM
					</Button>
					<Button 
						variant="outlined" 
						type="submit" 
						sx={{mt: 2, mb: 2, ml: 3, width: '200px', height: 40, boxShadow: 5, borderRadius: '8px' }} 
						// style={buttonStyleUploadImg}
						theme={theme}
						color='error'
						onClick={() => {setVerifNewEmail(false)}}
						>
						CANCEL
					</Button>
					</div>
					<span className={`loaderSendRecoveryLink${sendLoader3}`}></span>

					{ showFirstOTP === true ?
					<div style={{paddingTop: '20px', marginTop: '10px', borderTop: '1px solid rgb(51 52 56 / 70%)'}}>
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
								value={otpFirstEmail}
								onChange={handleChangeOTPFEmail}
								inputprops={{ style: { color: '#e0dfe7', textAlign: 'center' } }}
								TextFieldsProps={{ disabled: false, size: 'small', placeholder: '-' }}
								separator={<span>-</span>}
								sx={{ gap: 1, width: '100%' }}
								length={5}
							/>
							</Box>
						</ThemeProvider>
					</div>
					: null
					}
					<div style={{width: '100%'}}>
					{ otpFirstEmail.length === 5 ?
						<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						>
							<Button 
								variant="contained" 
								type="submit" 
								sx={{mt: 5, width: '100%', height: 40, boxShadow: 5, borderRadius: '10px' }} 
								style={buttonStyle}
								theme={theme}
								// color='error'
								onClick={() => compareOTPCodesFirst()}
								>
								Confirm
							</Button>
						</motion.div>
					: null }
					</div>
					</>
				:		
					<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					>
						<>
						<div style={{borderBottom: '1px solid rgb(51 52 56 / 70%)', paddingBottom: '5px', width: '100%', display: 'flex', height: 30, justifyContent: 'center', borderRadius: '2px'}}>
							<h2 style={{fontSize: '20px', fontWeight: 'bold'}}>STEP II</h2>
						</div>
						<h2 style={{fontSize: '18px', marginTop: '20px', marginBottom: '10px'}}>Now write your new <span style={{ color: 'red', textDecoration: 'underline'}}>unused</span> email below</h2>
						<div>
							<ThemeProvider theme={theme}>
								<TextField 
								value={newEmail}
								aria-describedby="none"
								onChange={(event) => setNewEmail(event.target.value)}
								id="outlined-basic" 
								label='New Email'
								variant="outlined" 
								size='small'
								InputLabelProps={{style: { color: '#8d8d8d' },}} 
								InputProps={{style: { color: '#e0dfe7' },}} 
								sx={{...TextFieldStyles, mt: 2, width: 400, boxShadow: 2}}
								disabled={isDisabledInput}
								/>
								<div style={{width: 'fit-content', float: 'right'}}>
									<h2 id='change' onClick={() => setIsDisabledInput(false)}
									style={{cursor: 'pointer', textDecoration: 'underline', marginRight: '10px', marginTop: '5px'}}>Change</h2>
								</div>
							</ThemeProvider>
						</div>
						<div style={{paddingBottom: '10px'}}>
							<Button 
								variant="outlined" 
								type="submit" 
								sx={{mt: 2, width: '100%', height: 40, boxShadow: 5, borderRadius: '10px' }} 
								style={buttonStyleUploadImg}
								theme={theme}
								// color='success'
								onClick={() => {setIsDisabledInput(true); sendOTPCodeSecondEmail();}}
								>
								SEND OTP CODE
							</Button>
							<span className={`loaderSendRecoveryLink${sendLoader3}`}></span>
						</div>
						<div>
							{ showSecondOTP === true ?
							<div style={{paddingTop: '20px', marginTop: '10px', borderTop: '1px solid rgb(51 52 56 / 70%)'}}>
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
										value={otpSecondEmail}
										onChange={handleChangeOTPSEmail}
										inputprops={{ style: { color: '#e0dfe7', textAlign: 'center' } }}
										TextFieldsProps={{ disabled: false, size: 'small', placeholder: '-' }}
										separator={<span>-</span>}
										sx={{ gap: 1, width: '100%' }}
										length={5}
									/>
									</Box>
								</ThemeProvider>
								{ otpSecondEmail.length === 5 ?
									<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									>
										<Button 
											variant="contained" 
											type="submit" 
											sx={{mt: 5, width: '100%', height: 40, boxShadow: 5, borderRadius: '10px' }} 
											// style={buttonStyle}
											theme={theme}
											color='success'
											onClick={() => compareOTPCodesSecond()}
											>
											SAVE THIS EMAIL
										</Button>
									</motion.div>
								: null }
							</div>
							: null
							}
						</div>
						</>
					</motion.div>
				
				}
			</div>
			</motion.div>
			: null }
		</div>
	)
}

export default SettingsProfile;





