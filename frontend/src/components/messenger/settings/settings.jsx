import React from 'react';
import { Container, TextField, Button, Alert} from "@mui/material"
import { createTheme, ThemeProvider } from '@mui/material/styles';
import test from '../../../img/test3.png';


import axios from 'axios';
import './settings.css'



function Settings() {
	const [headerImg, setHeaderImg] = React.useState('');


	const randomImageUrl = `https://res.cloudinary.com/dlwuhl9ez/image/fetch/shapes/?api_key=825156941529614&fetch_format=auto`;

	console.log(randomImageUrl);


	function call() {
		fetch(randomImageUrl)
		.then(response => response)
		.then(data => {
		  // data.resources 
		//   const images = data.resources;
		  
		//   const randomImage = images[Math.floor(Math.random() * images.length)];
		  
		//   // randomImage.url 
		//   console.log(randomImage.url);
		})
		.catch(error => console.error(error));
		// fetch(cloudinaryUrl)
		// .then(response => {
		//   if (!response.ok) {
		// 	throw new Error('Error to take img');
		//   }
		//   return response;
		// })
		// .then(data => {
		//   // Success
		// })
		// .catch(error => {
		//   console.error(error.message);
		// });
	  
	}
		
	return (
		<>
		<div className='settings-wrapper'>
			<div className='settings-header'>
				<img src={headerImg} alt="" />

			</div>
			<button onClick={() => call()}>test</button>

		</div>
		
		</>
	)
}


export default Settings;