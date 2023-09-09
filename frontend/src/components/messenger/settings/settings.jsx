import React, {useEffect, useState, useRef} from 'react';
import { useNavigate } from "react-router-dom";
import { Container, TextField, Button, Alert, Avatar, Autocomplete, Box} from "@mui/material"
import { createTheme, ThemeProvider } from '@mui/material/styles';
import test from '../../../img/shapes/stacked-waves-haikei (35).png';
import {countries} from '../../signup/signup';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import SettingsProfile from './tabs/settingsProfile/settingsProfile';
import SettingsSecurity from './tabs/settingsSecurity/settingsSecurity';
import { motion, useAnimation } from 'framer-motion';

import axios from 'axios';
import './settings.css'


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

function Settings() {
	const [headerImg, setHeaderImg] = React.useState(null);
	const [fName, setFName] = useState('')
	const [lName, setLName] = useState('')
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [aboutMe, setAboutMe] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [email, setEmail] = useState('');
	const [country, setCountry] = useState({ code: '', label: '', phone: '' });
	const [date, setDate] = useState(null);
	const [userIn, setUserIn] = useState('');
	const [boldText, setBoldText] = useState('bold');
	const [selectedMenuText, setSelectedMenuText] = useState('bold');
	const [selectedMenu, setSelectedMenu] = useState('My Profile');
	const [selectedAvatar, setSelectedAvatar] = useState('');
	const fileInputRef = useRef(null);

	const navigate = useNavigate();


	useEffect(() => {
		const fetchData = async () => {
			axios.defaults.withCredentials = true;
		  try {
			const response = await axios.get('https://kenzoback.onrender.com/api/check_verification', {
			  withCredentials: true,
			});
			setSelectedAvatar(response.data.user.avatar);
			setUserIn(response.data.user)
  
		  } catch (error) {
			navigate('/signin');
			console.error(error);
		  }
		};
	  
		fetchData();
	}, []);

	const [dataFromChild, setDataFromChild] = useState('');

	const handleDataFromChild = (data) => {
	  setDataFromChild(data);
	};

	console.log(userIn)
	console.log(userIn.avatar)
	console.log(selectedAvatar)

	const menuItems = [
	  { id: 1, name: 'My Profile' },
	  { id: 2, name: 'Security' },
	  { id: 3, name: 'Notifications' },
	];
  
	const handleMenuClick = (menuName) => {
	  setSelectedMenu(menuName);
	};

	console.log(selectedMenu)

	const openFileInput = () => {
        fileInputRef.current.click();
    };

	const handleFileUpload = (event) => {
        const file = event.target.files;
		
		if (file.length > 0) {
			const fileToUpload = file[0];
	
			const cloud_name = 'dlwuhl9ez';

			const formData = new FormData();
			formData.append('file', fileToUpload);
			formData.append("cloud_name", cloud_name);
			formData.append("upload_preset", "aecdrcq4");

	
			fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, {
				method: 'POST',
				body: formData,
			})
			.then(response => response.json())
			.then(data => {
				console.log('Cloudinary response:', data);
				setSelectedAvatar(data.secure_url)
			})
			.catch(error => {
				console.error('Error uploading file:', error);
			});
		}
		
    };

	
	function call() {

		const photos = require.context(`./${'../../../img/shapes'}`, false, /\.(jpg|jpeg|png|gif|bmp)$/);
		const photoArray = photos.keys().map(photos);
		
		const randomIndex = Math.floor(Math.random() * photoArray.length);
		const selectedPhoto = photoArray[randomIndex];
		
		setHeaderImg(selectedPhoto);
		console.log(selectedPhoto)
	}

		
	
	return (
		<>
		{ userIn ?
			<motion.div
				initial={{ y: 10, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				exit={{ y: -10, opacity: 0 }}
				transition={{ duration: 0.3 }}
			>
			<div className='settings-wrapper'>
				<div className='settings-header-container'>
					<div className='settings-header'>
							<div style={{position: 'absolute'}}>
								<Button 
									variant="outlined" 
									type="submit" 
									sx={{mt: 2, width: '150px', height: 30, boxShadow: 5, borderRadius: '8px' }} 
									style={buttonStyleUploadImg}
									theme={theme}
									onClick={() => call()}
									>
									EDIT
								</Button>
							</div>
							<img src={test} alt="" />
							<Avatar onClick={openFileInput} className="headerAvatarSettings" alt={userIn.username} src={selectedAvatar} />
							<input
							type="file"
							accept="image/*"
							onChange={handleFileUpload}
							style={{ display: 'none' }}
							ref={fileInputRef}
						/>
						</div>
						<div className='settings-header-info'>
							<h2 style={{marginTop: '10px', marginBottom: '10px'}}>{userIn.first_name} {userIn.last_name}</h2>
							<div style={{display: 'flex', alignItems: 'center'}}>
								<h2 style={{color: 'gray', fontSize: '18px ', marginTop: '3px'}}>Username:&nbsp;&nbsp;</h2>
								<h2>{userIn.last_name}</h2>
							</div>
						</div>
					</div>
					<div className='setting-main-container-bar'>
					{menuItems.map((menuItem) => (
					<div
					key={menuItem.id}
					className={`setting-main-container-bar-menu ${selectedMenu === menuItem.name ? 'selected' : ''}`}
					style={{
						color: selectedMenu === menuItem.name ? '#724acb' : '#fff',
						marginTop: selectedMenu === menuItem.name ? '0' : '15px',
					}}
					onClick={() => handleMenuClick(menuItem.name)}
					>
					<h2 style={{fontWeight: selectedMenu === menuItem.name ? 'bold' : '400'}}>{menuItem.name}</h2>
					</div>
					))}
						<div className='setting-main-container-bar-menu' style={{marginTop: '15px', display: 'flex', width: '110px', justifySelf: 'right', marginRight: '30px', border: '1px solid rgba(211, 47, 47, 0.5)', borderBottom: 'none'}}>
							<h2 style={{fontWeight: 'bold', color: '#d32f2f'}}>Delete Account</h2>
						</div>
				</div>

				{ selectedMenu === 'My Profile' ?
					<motion.div
						initial={{ y: 10, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: -10, opacity: 0 }}
						transition={{ duration: 0.3 }}
					>
					{userIn && <SettingsProfile userInInfo={userIn} onDataFromChild={handleDataFromChild}/>}
					</motion.div>
				: null }
				{ selectedMenu === 'Security' ?
					<motion.div
						initial={{ y: 10, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: -10, opacity: 0 }}
						transition={{ duration: 0.3 }}
					>
					{userIn && <SettingsSecurity userInInfo={userIn} onDataFromChild={handleDataFromChild}/>}
					</motion.div>
				: null }
				{ selectedMenu === 'Notifications' ?
					<motion.div
						initial={{ y: 10, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: -10, opacity: 0 }}
						transition={{ duration: 0.3 }}
					>
					<SettingsProfile userInInfo={userIn} onDataFromChild={handleDataFromChild}/>
					</motion.div>
				: null }
			</div>
			</motion.div>
			: null
			}
			</>
		)
		
}


export default Settings;