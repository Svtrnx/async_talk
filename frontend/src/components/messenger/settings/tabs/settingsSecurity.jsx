import React, {useEffect, useState} from 'react';
import { Container, TextField, Button, Alert, Avatar, Autocomplete, Box} from "@mui/material"
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { MuiOtpInput } from 'mui-one-time-password-input';
import './settingsSecurity.css';

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
const buttonStyle2 = {
	backgroundColor: 'rgb(51, 52, 56)',
	color: '#e0dfe7'
  };

function SettingsSecurity({userInInfo, onDataFromChild}) {
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [primaryEmail, setPrimaryEmail] = useState('');
	const [email, setEmail] = useState('');
	const [otp, setOtp] = useState('');
	const [dataToSend, setDataToSend] = useState('zzzzzzzz');

	const messageTime = new Date(userInInfo.date_reg);
	const options = {day: '2-digit', month: '2-digit', year: '2-digit' };
	const formattedDate = messageTime.toLocaleDateString(undefined, options).replace(/\./g, '/');
  


	const handleChangeOTP = (newValue) => {
		setOtp(newValue)
	}

	return (
		<div className='setting-security-main-container'>
			<div className='setting-main-container-header'>
				<div>
					<h2>Security Settings</h2>
					<h2 style={{fontSize: '15px', color: 'rgb(159 159 159 / 61%)', marginTop: '3px'}}>Here ou can change your account security settings</h2>
				</div>
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
							// onClick={sendDataToParent}
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
									<Button 
										variant="outlined" 
										type="submit" 
										sx={{mt: 0, ml: 3, mr: 3, width: '90px', height: 27, boxShadow: 5, borderRadius: '20px' }} 
										// style={buttonStyle}
										color='error'
										theme={theme}
										// onClick={sendDataToParent}
										>
										DISABLED
									</Button>
									<Button 
										variant="outlined" 
										type="submit" 
										sx={{mt: 0, ml: 3, mr: 3, width: '90px', height: 27, boxShadow: 5, borderRadius: '20px' }} 
										// style={buttonStyle}
										color='success'
										theme={theme}
										// onClick={sendDataToParent}
										>
										ENABLED
									</Button>
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
									autoFocus
								/>
							</ThemeProvider>
						</div>
						<div style={{display: 'flex', alignItems: 'center', marginTop: '25px', width: '392px',  marginBottom: '25px'}}>
							<h2 style={{fontSize: '16px'}}>Enable</h2>
							<div style={{marginLeft: 280}}>
								<label className="switch">
									<input type="checkbox"/>
									<span className="slider"></span>
								</label>
							</div>
						</div>
						<div style={{borderTop: '1px solid #3334384f', borderBottom: '1px solid #3334384f', padding: '10px 0px 10px 0px'}}>
							<h2 style={{marginBottom: '10px', color: '#8d8d8d'}}>We've sent a verification code to {userInInfo.email}</h2>
							<div style={{display: 'flex'}}>
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
										sx={{ gap: 1, width: '350px' }}
										length={5}
									/>
									</Box>
								</ThemeProvider>
								<div style={{marginBlockStart: 'auto'}}>
									<Button 
										variant="contained" 
										type="submit" 
										sx={{mt: 0, ml: 3, mr: 3, width: '90px', height: 35, boxShadow: 5, borderRadius: '8px' }} 
										style={buttonStyle2}
										theme={theme}
										// onClick={sendDataToParent}
										>
										APPLY
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default SettingsSecurity;