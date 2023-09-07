import React, {useEffect, useState} from 'react';
import { Container, TextField, Button, Alert, Avatar, Autocomplete, Box, InputAdornment, IconButton
} from "@mui/material"
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { MuiOtpInput } from 'mui-one-time-password-input';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/Visibility';
import './settingsSecurity.css';
import closeImg from '../../../../img/close1.svg';
import { motion, useAnimation } from 'framer-motion';
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

const otpTheme = createTheme({
typography: {
	fontFamily: 'Montserrat',
	fontSize: 30,
},
});

const buttonStyle = {
	backgroundColor: '#5d38b1',
	color: '#e0dfe7'
  };
const buttonStyle3 = {
	borderColor: '#5d38b1',
	color: '#e0dfe7'
  };
const buttonStyle2 = {
	backgroundColor: 'rgb(51, 52, 56)',
	color: '#e0dfe7'
  };

function SettingsSecurity({userInInfo, onDataFromChild}) {
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [oldPassword, setOldPassword] = useState('');
	const [showPassword, setShowPassword] = React.useState(false);
	const [primaryEmail, setPrimaryEmail] = useState('');
	const [email, setEmail] = useState('');
	const [otp2Step, setOtp2Step] = useState('');
	const [otpPassword, setOtpPassword] = useState('');
	const [isChecked, setIsChecked] = useState(false);
	const [isSendedCode, setIsSendedCode] = useState(false);
	const [isChangeMenuOpen, setIsChangeMenuOpen] = useState(false);
	const [is2AuthEnable, setIs2AuthEnable] = useState(false);
	const [haveChanges, setHaveChanges] = useState(false);
	const [dataToSend, setDataToSend] = useState('zzzzzzzz');
	const [sendLoader, setSendLoader] = React.useState('none');
	const [checkCode, setCheckCode] = useState("");
	const controls = useAnimation();

	const messageTime = new Date(userInInfo.date_reg);
	const options = {day: '2-digit', month: '2-digit', year: '2-digit' };
	const formattedDate = messageTime.toLocaleDateString(undefined, options).replace(/\./g, '/');

	console.log(isChecked)


	async function sendOTPCode() {
		try {
			setSendLoader('')
			const response = await axios.post("http://localhost:8000/send-otp-code", {
					email: email,
					code_length: 4,
					email_message: 'OTP Registration code',
					email_subject: "ASYNC TALK REGISTRATION",
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			});
			setSendLoader('none')

			setCheckCode(response.data.check)
			
		}
		catch (err) {
			setSendLoader('none')
			// setErrorSnackBar(true);
			// setErrorSnackBarText("ERROR: " + err.message);
			console.log("SEND MESSAGE ERROR: ", err);
		}
	}

	const handleClickShowPassword = () => setShowPassword((show) => !show);

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	  };

	const handleChangeOTP2Step = (newValue2Step) => {
		setOtp2Step(newValue2Step)
	}
	const handleChangeOTPPassword = (newValuePassword) => {
		setOtpPassword(newValuePassword)
	}

	return (
		<div className='setting-security-main-container'>
			<div className='setting-main-container-header'>
				<div>
					<h2>Security Settings</h2>
					<h2 style={{fontSize: '15px', color: 'rgb(159 159 159 / 61%)', marginTop: '3px'}}>Here ou can change your account security settings</h2>
				</div>
					{ haveChanges === true && is2AuthEnable === true ?
				<div style={{marginInlineStart: 'auto'}}>
						<Button 
						variant="outlined" 
						type="submit" 
						color='success'
						sx={{mt: 1, width: '150px', height: 30, boxShadow: 5, borderRadius: '8px' }} 
						// style={buttonStyleUploadImg}
						theme={theme}
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
						// onClick={sendDataToParent}
						>
						CANCEL
					</Button>
				</div>
					: null }
			</div>
			<div className='setting-security-main-container-body'>
				<div style={{borderTop: '1px solid #3334384f', paddingTop: '5px'}}>
					<h2 style={{marginTop: '15px', fontSize: '19px', }}>Change your current Password</h2>
					<div style={{display: 'flex', alignItems: 'center', marginTop: '15px', paddingBottom: '25px', borderBottom: '1px solid #3334384f'}}>
						<Button 
							variant="contained" 
							type="submit" 
							sx={{mt: 0, ml: 3, mr: 3, width: '150px', height: 35, boxShadow: 5, borderRadius: '8px' }} 
							style={buttonStyle}
							theme={theme}
							onClick={() => setIsChangeMenuOpen(true)}
							>
							CHANGE NOW
						</Button>
						
						<h2 style={{fontSize: '14px', color: 'rgb(211, 47, 47)'}}>Last Updated: {formattedDate}</h2>
					</div>
					<div style={{paddingBottom: '25px'}}>
						<div style={{marginTop: '25px'}}>
							<div style={{display: 'flex', marginBottom: '10px', alignItems: 'center'}}>
								<h2 style={{fontSize: '19px'}}>2-Step Verification</h2>
								<div style={{marginInlineStart: 'auto', marginRight: '15px'}}>

									{ is2AuthEnable === false ?
									<Button 
										variant="outlined" 
										type="submit" 
										sx={{mt: 0, ml: 3, mr: 3, width: '90px', height: 27, boxShadow: 5, borderRadius: '20px' }} 
										color='error'
										theme={theme}
										>
										DISABLED
									</Button>
									:
									<Button 
										variant="outlined" 
										type="submit" 
										sx={{mt: 0, ml: 3, mr: 3, width: '90px', height: 27, boxShadow: 5, borderRadius: '20px' }} 
										color='success'
										theme={theme}
										>
										ENABLED
									</Button>
									}

								</div>
							</div>
							<h2 style={{color: 'rgb(159 159 159 / 61%)', fontSize: '15px'}}>The two-step verification method will help you protect your 
							account at the best level, we will send a security code to your primary e-mail address.
							</h2>
						</div>
						<div>
							<h2 style={{marginTop: '20px', marginLeft: '10px'}}>Primary Email</h2>
							<ThemeProvider theme={theme}>
								<TextField 
									value={primaryEmail}
									onChange={(event) => setPrimaryEmail(event.target.value)}
									id="outlined-basic" 
									label={userInInfo.email}
									variant="outlined" 
									size='small'
									InputLabelProps={{style: { color: '#8d8d8d' },}} 
									InputProps={{style: { color: '#e0dfe7' },}} 
									sx={{...TextFieldStyles, mt: 1, width: 400, boxShadow: 2}}
									// error={!isValidUsername}
									// helperText={!isValidUsername && "Username should contain at least 5 letters, numbers should be only in the end"}
									
								/>
							</ThemeProvider>
						</div>
						<div style={{display: 'flex', alignItems: 'center', marginTop: '25px', width: '392px',  marginBottom: '25px'}}>
							<h2 style={{fontSize: '16px'}}>Enable</h2>
							<div style={{marginLeft: 280}}>
								<label className="switch">
									<input type="checkbox" checked={isChecked && is2AuthEnable} onChange={() => {setIsChecked(!isChecked); setIs2AuthEnable(!is2AuthEnable);}}/>
									<span className="slider"></span>
								</label>
							</div>
						</div>

						{ isChecked === true ?
						
						<div style={{borderTop: '1px solid #3334384f', borderBottom: '1px solid #3334384f', padding: '10px 0px 10px 0px'}}>
							
							<div style={{display: 'flex', alignItems: 'center', marginBottom: '15px'}}>
								{ isSendedCode === true ?
									<motion.div
										initial={{ y: 10, opacity: 0 }}
										animate={{ y: 0, opacity: 1 }}
										exit={{ y: -10, opacity: 0 }}
										transition={{ duration: 0.2 }}
									>
									<h2 style={{color: '#8d8d8d', marginRight: '20px'}}>We've sent a verification code to {userInInfo.email}</h2>
									</motion.div>
								: null }
								<Button 
									variant="outlined" 
									type="submit" 
									sx={{mr: 3, width: '150px', height: 27, boxShadow: 5, borderRadius: '20px' }} 
									style={buttonStyle3}
									// color='success'
									theme={theme}
									onClick={() => {setIsSendedCode(true); setHaveChanges(true); sendOTPCode();}}
									>
									SEND OTP CODE
								</Button>
							</div>
							<div style={{display: 'flex', paddingBottom: '5px'}}>
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
										value={otp2Step}
										onChange={handleChangeOTP2Step}
										inputprops={{ style: { color: '#e0dfe7', textAlign: 'center' } }}
										TextFieldsProps={{ disabled: false, size: 'small', placeholder: '-' }}
										separator={<span>-</span>}
										sx={{ gap: 1, width: '350px' }}
										length={5}
									/>
									</Box>
									<span className={`loaderOTP2Verif${sendLoader}`}></span>
								</ThemeProvider>
								<div style={{marginBlockStart: 'auto'}}>
									{ otp2Step.length === 5 ?
										<motion.div
											initial={{ y: 10, opacity: 0 }}
											animate={{ y: 0, opacity: 1 }}
											exit={{ y: -10, opacity: 0 }}
											transition={{ duration: 0.2 }}
										>
										<Button 
											variant="contained" 
											type="submit" 
											sx={{mt: 0, ml: 3, mr: 3, width: '90px', height: 35, boxShadow: 5, borderRadius: '8px' }} 
											style={buttonStyle2}
											theme={theme}
											>
											APPLY
										</Button>
										</motion.div>
									: null 
									}
								</div>
							</div>
						</div>
						: null}
					</div>
				</div>
			</div>
			{/*  */}
			{ isChangeMenuOpen === true ?
			<motion.div
				// initial={{ y: -1, opacity: 0 }}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
			>
			<div className='settings-secure-password-menu-wrapper'>
				<div style={{display: 'flex', alignItems: 'center', marginBottom: '10px', justifyContent: 'space-between'}}>
					<h2 style={{fontSize: '20px'}}>Change Password</h2>
					<img style={{width: 16, height: 16, cursor: 'pointer'}} onClick={() => setIsChangeMenuOpen(false)} src={closeImg} alt="" />
				</div>
				<ThemeProvider theme={theme}>
					<div>
						<div style={{display: 'flex', marginTop: '15px'}}>
							<h2>Old Password</h2>
							<h2 id='menuForgot' style={{color: 'rgb(211, 47, 47)', marginInlineStart: 'auto', cursor: 'pointer'}}>Forgot Password?</h2>
						</div>
						<TextField
							type={showPassword ? "text" : "password"}
							label="Old Password"
							variant="outlined"
							value={oldPassword}
							onChange={(event) => setOldPassword(event.target.value)}
							InputLabelProps={{ style: { color: "#8d8d8d" } }}
							error={oldPassword.length > 0 && oldPassword.length < 6}
							helperText={oldPassword.length > 0 && oldPassword.length < 6 && "Old Password should be at least 6 characters"}

							InputProps={{
								style: { color: "#e0dfe7", borderRadius: '7px' },
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
							sx={{...TextFieldStyles, mt: 1.5, width: 400, boxShadow: 2}}
						/>
					</div>
					
					<div>
					<h2 style={{marginTop: '20px'}}>New Password</h2>
					<TextField
						type={showPassword ? "text" : "password"}
						label="Password"
						variant="outlined"
						value={password}
						onChange={(event) => setPassword(event.target.value)}
						InputLabelProps={{ style: { color: "#8d8d8d" } }}
						error={password.length > 0 && password.length < 6}
						helperText={password.length > 0 && password.length < 6 && "Password should be at least 6 characters"}

						InputProps={{
							style: { color: "#e0dfe7", borderRadius: '7px'  },
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
						sx={{...TextFieldStyles, mt: 1.5, width: 400, boxShadow: 2}}
						/>
					</div>
					<div>
						<h2 style={{marginTop: '20px'}}>Confrirm New Password</h2>
						{confirmPassword.length > 0 && (
							<TextField
								type={showPassword ? "text" : "password"}
								label="Confirm new password"
								value={confirmPassword}
								onChange={(event) => setConfirmPassword(event.target.value)}
								variant="outlined"
								InputLabelProps={{ style: { color: "#8d8d8d" } }}
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
								sx={{...TextFieldStyles, mt: 1.5, width: 400, boxShadow: 2}}
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
								size='medium'
								onChange={(event) => setConfirmPassword(event.target.value)}
								variant="outlined"
								InputLabelProps={{ style: { color: "#8d8d8d" } }}
								InputProps={{
								style: { color: "#e0dfe7", borderRadius: '7px'  },
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
								sx={{...TextFieldStyles, mt: 1.5, width: '100%', boxShadow: 2}}
								autoFocus
							/>
						)}
					</div>
				</ThemeProvider>
				<div style={{marginTop: 25}}>
					<h2 style={{display: 'grid', textAlign: 'center', marginBottom: 15}}>To secure your account, Enter the 6 digit code we sent to {userInInfo.email}</h2>
					<div>
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
							value={otpPassword}
							onChange={handleChangeOTPPassword}
							inputprops={{ style: { color: '#e0dfe7', textAlign: 'center' } }} // Замените inputProps на inputprops
							TextFieldsProps={{ disabled: false, size: 'small', placeholder: '-' }}
							separator={<span>-</span>}
							sx={{ gap: 1, width: '100%' }}
							length={6}
						/>
						</Box>
					</ThemeProvider>
					</div>
					<div>
					{ otpPassword.length === 6 ?
						<Button 
							variant="contained" 
							type="submit" 
							sx={{mt: 4, width: '100%', height: 40, boxShadow: 5, borderRadius: '10px' }} 
							style={buttonStyle}
							theme={theme}
							// color='error'
							// onClick={sendDataToParent}
							>
							Confirm
						</Button>
						: null }
					</div>
				</div>
			</div>
			</motion.div>
			: null}

		</div>
	)
}

export default SettingsSecurity;