import React, { useState, useRef, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Container, TextField, Button, Box, Snackbar, Stack, Autocomplete, Radio, InputAdornment,
	FormControlLabel ,RadioGroup, FormLabel, FormControl, IconButton, Avatar} from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';


// async function VerifyToken() {
// 	const location = useLocation();
// 	const searchParams = new URLSearchParams(location.search);
// 	const token = searchParams.get('token');
// 	const email = searchParams.get('email');
// 	try {
// 		axios.defaults.withCredentials = true;
// 		const response = await axios.get('https://localhost:8000/reset-password-verify', {
// 			token: token,
// 			email: email,
// 		}, {
// 			'Content-Type': 'application/json'
// 		})
// 		.then(response => response.json())
// 		.then(data => {
// 			console.log(data);
			
			
// 		})
// 	} catch(err) {
// 		console.error(err);
// 	}
// }




function ResetPassword() {
	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const token_verif = searchParams.get('token');
	const email_verif = searchParams.get('email');
	useEffect(() => {
		async function VerifyToken() {
			try {
				const response = await axios.get("https://kenzoback.onrender.com/reset-password-verify", {
					params: {
						token: token_verif,
						email: email_verif,
					},
					headers: {
					'Content-Type': 'application/json'
					}
				});
				console.log("MESSAGE RESPONSE: ", response);
			}
			catch (err) {
				console.log("SEND MESSAGE ERROR: ", err);
			}
	}
		VerifyToken()
	}, [])
	const [newPassword, setNewPassword] = React.useState('');
	
	


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
	

	return (
	<>
	<Container>
		<div className='reset-password-wrapper'>
		<TextField 
			value={newPassword}
			onChange={(event) => setNewPassword(event.target.value)}
			id="outlined-basic" 
			label="First Name"
			variant="outlined" 
			InputLabelProps={{style: { color: '#e0dfe7' },}} 
			InputProps={{style: { color: '#e0dfe7' },}} 
			sx={{...TextFieldStyles, mt: 2, width: 400, boxShadow: 2}}
			// error={fName.length > 0 && fName.length < 4}
			// helperText={fName.length > 0 && fName.length < 4 && "First Name should be at least 4 characters"}
			autoFocus
			/>

		</div>

	
	</Container>
	</>
)
}


export default ResetPassword;




