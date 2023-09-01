import React from 'react';
import { Container, TextField, Button} from "@mui/material"
import { createTheme, ThemeProvider } from '@mui/material/styles';
import sendEmailGif from '../../img/ref.png'
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

	async function VerifyToken() {
		try {
			const response = await axios.get("https://kenzoback.onrender.com/request-reset", {
				params: {
					email: sendEmail,
				},
				headers: {
				'Content-Type': 'application/json'
				}
			});
			console.log("MESSAGE RESPONSE SEND TO MAIL: ", response);
		}
		catch (err) {
			console.log("SEND MESSAGE ERROR: ", err);
		}
	}

	return (
		<>
		<Container disableGutters maxWidth={false}>
			<div className='resend-wrapper'>
				<div className='resetLogo'>
					<div className="signin_logo" style={{marginTop: '25px'}}>
						<img className="reg_logo" src={logoImage} alt="logo"  />	
					</div>	
					<h2>Please, write your email, and take a recovery link from email</h2>
				</div>
					<div style={{marginBottom: 'auto'}}>
						<img className='resetImg1' src={sendEmailGif} alt=""/>
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

			</div>


		</Container>
		
		
		</>
	)
}

export default ResetSendLink;






