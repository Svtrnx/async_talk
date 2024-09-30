import React, {useEffect, useState, useRef} from 'react';
import { useNavigate } from "react-router-dom";
import { Button, Avatar} from "@mui/material"
import {theme, buttonStyleUploadImg} from '../utils/utils';
import SettingsProfile from './tabs/settingsProfile/settingsProfile';
import SettingsSecurity from './tabs/settingsSecurity/settingsSecurity';
import { motion } from 'framer-motion';
import { randomizeHeaderImg } from '../utils/utils';
import axios from 'axios';
import './settings.css'



function Settings() {
	const [headerImg, setHeaderImg] = React.useState('');
	const [formData2, setFormData2] = React.useState('');
	const [formDataHeaderImg, setFormDataHeaderImg] = React.useState('');
	const [userIn, setUserIn] = useState('');
	const [selectedMenu, setSelectedMenu] = useState('My Profile');
	const [selectedAvatar, setSelectedAvatar] = useState('');
	const [selectedHeaderImg, setSelectedHeaderImg] = useState('');
	const [fileToUpload, setFileToUpload] = useState('');
	// const [fileToUploadHeaderImg, setFileToUploadHeaderImg] = useState('');
	const fileInputRef = useRef(null);
	const fileInputRefHeader = useRef(null);

	const navigate = useNavigate();



	useEffect(() => {
		const fetchData = async () => {
		axios.defaults.withCredentials = true;
		  try {
			const response = await axios.get('http://localhost:8000/api/check_verification', {
			  withCredentials: true,
			});
			setSelectedAvatar(response.data.user.avatar);
			setSelectedHeaderImg(response.data.user.headerImg)
			setUserIn(response.data.user)
			console.log(response.data.user)
  
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


	const menuItems = [
	  { id: 1, name: 'My Profile' },
	  { id: 2, name: 'Security' },
	  { id: 3, name: 'Notifications' },
	];
  
	const handleMenuClick = (menuName) => {
	  setSelectedMenu(menuName);
	};


	const openFileInput = () => {
        fileInputRef.current.click();
    };
	const openFileInputHeaderImg = () => {
        fileInputRefHeader.current.click();
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

			
			setFileToUpload(fileToUpload);
			
			const imageUrl = URL.createObjectURL(fileToUpload);
			setSelectedAvatar(imageUrl)
			
			fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, {
				method: 'POST',
				body: formData,
			})
			.then(response => response.json())
			.then(data => {
				console.log('Cloudinary response:', data);
				setFormData2(data)
			})
			.catch(error => {
				console.error('Error uploading file:', error);
			});
		}
		
    };

	const handleFileUploadHeader = (event) => {
        const file = event.target.files;
		
		if (file.length > 0) {
			const fileToUpload = file[0];
			
			const cloud_name = 'dlwuhl9ez';
			
			const formData = new FormData();
			formData.append('file', fileToUpload);
			formData.append("cloud_name", cloud_name);
			formData.append("upload_preset", "aecdrcq4");

			
			// setFileToUploadHeaderImg(fileToUpload);
			
			const imageUrl = URL.createObjectURL(fileToUpload);
			setSelectedHeaderImg(imageUrl)
			
			fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, {
				method: 'POST',
				body: formData,
			})
			.then(response => response.json())
			.then(data => {
				setFormDataHeaderImg(data)
			})
			.catch(error => {
				console.error('Error uploading file:', error);
			});
		}
		
    };

	
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
							<div style={{position: 'absolute', right: 0}}>
								{/* <Button 
									variant="outlined" 
									type="submit" 
									sx={{mt: 1, mr: 4, width: '100px', height: 30, boxShadow: 5, borderRadius: '8px' }} 
									style={buttonStyleUploadImg}
									theme={theme}
									onClick={() => call()}
									>
									RANDOMIZE
								</Button> */}
								<Button 
									variant="outlined" 
									type="submit" 
									sx={{mt: 1, mr: 4, width: '100px', height: 30, boxShadow: 5, borderRadius: '8px' }} 
									style={buttonStyleUploadImg}
									theme={theme}
									onClick={openFileInputHeaderImg}
									>
									EDIT
								</Button>
							</div>
							<img src={selectedHeaderImg} alt=""/>
							<input
							type="file"
							accept="image/*"
							onChange={handleFileUploadHeader}
							style={{ display: 'none' }}
							ref={fileInputRefHeader}
							/>
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
								<h2>{userIn.username}</h2>
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
					{userIn && <SettingsProfile userInInfo={userIn} formData={formData2} formDataHeaderImg={formDataHeaderImg}
					fileToUpload={fileToUpload} onDataFromChild={handleDataFromChild}/>}
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