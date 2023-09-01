import React from 'react';
import { Container, TextField, Button, Alert} from "@mui/material"
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Snackbar from '@mui/material/Snackbar';
import sendEmail1 from '../../img/ref.png'
import sendEmail2 from '../../img/send_email.png'
import logoImage from '../../img/logo2.png';
import axios from 'axios';

import './resetSendLink.css'


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

const theme = createTheme({
	typography: {
		fontFamily: 'Montserrat',
		fontSize: 13,
	},
});

const buttonStyleUploadImg = {
	borderColor: '#5d38b1',
	color: '#e0dfe7'
  };


function ResetSendLink() {
	const [sendEmail, setSendEmail] = React.useState('');
	const [isSended, setIsSended] = React.useState('1');
	const [errorSnackBar, setErrorSnackBar] = React.useState(false);
	const [errorSnackBarText, setErrorSnackBarText] = React.useState('');
	const [sendLoader, setSendLoader] = React.useState('none');
	const handleCloseSnack = (event, reason) => {
		if (reason === 'clickaway') {
		  return;
		}
		setErrorSnackBar(false);
		setErrorSnackBarText("")
	}
	
	async function VerifyToken() {
		try {
			if (sendEmail.length < 5 || sendEmail.length > 50) {
				setErrorSnackBar(true);
				setErrorSnackBarText("INVALID INPUT!");
			}
			else {
				setSendLoader('')
				const response = await axios.post("https://kenzoback.onrender.com/request-reset", {
						email: sendEmail,
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				});
				console.log("MESSAGE RESPONSE SEND TO MAIL: ", response);
				setSendLoader('none')
				setIsSended('2');
			}
		}
		catch (err) {
			setSendLoader('none')
			setErrorSnackBar(true);
			setErrorSnackBarText("ERROR: " + err.message);
			console.log("SEND MESSAGE ERROR: ", err);
		}
	}



	return (
		<>
		<Container disableGutters maxWidth={false}>
			<div className='resend-wrapper'>
				{isSended === '1' ?
					<>
					<div className='resetLogo'>
						<div className="signin_logo" style={{marginTop: '25px'}}>
							<img className="reg_logo" src={logoImage} alt="logo"  />	
						</div>	
						<h2>Please, write your email, and take a recovery link from email</h2>
					</div>
						<div style={{marginBottom: 'auto'}}>
							<img className='resetImg1' src={sendEmail1} alt=""/>
						</div>
					<div className='resend-body' style={{display: 'inline-grid', marginBottom: '50px'}}>
						<ThemeProvider theme={theme}>
							<TextField 
							value={sendEmail}
							onChange={(event) => setSendEmail(event.target.value)}
							id="outlined-basic" 
							label="Enter valid email address" 
							variant="outlined" 
							InputLabelProps={{style: { color: '#e0dfe7' },}} 
							InputProps={{style: { color: '#e0dfe7' },}} 
							sx={{...TextFieldStyles, mt: 0, width: 350, boxShadow: 2}}
							error={sendEmail.length > 0 && sendEmail.length < 5}
							helperText={sendEmail.length > 0 && sendEmail.length < 5 && "Email should be at least 5 characters"}
							/>
						</ThemeProvider>
						<Button 
							variant="outlined" 
							type="submit" 
							sx={{mt: 5, width: '100%', height: 50, boxShadow: 5, borderRadius: '8px' }} 
							style={buttonStyleUploadImg}
							theme={theme}
							onClick={() => VerifyToken()}
							>
							Send reset link
						</Button>
					</div>
					</>
					:
					<>
						<div className='resetLogo'>
							<div className="signin_logo" style={{marginTop: '25px'}}>
								<img className="reg_logo" src={logoImage} alt="logo"  />	
							</div>	
							<h2>We've sent recovery link to your email: {sendEmail} </h2>
							<h2>The recovery link will expire after 20 minutes!</h2>
						</div>
						<div style={{display: 'flex', marginBottom: 'auto'}}>
							<img className='sendEmailImg2' src={sendEmail2} alt="" />

						</div>
					</> 
				}
				<span className={`loader5${sendLoader}`}></span>
			</div>

				<Snackbar open={errorSnackBar} autoHideDuration={6000} onClose={handleCloseSnack}>
					<Alert onClose={handleCloseSnack} severity="error" 
						sx={{ width: 'auto', backgroundColor: "#d32f2f", color: '#fff' }}>
						{errorSnackBarText}
					</Alert>
				</Snackbar>
		</Container>
		
		
		</>
	)
}

export default ResetSendLink;






