import React, { useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import './userProfile.css';
import axios from "axios";
import {styles, TextFieldStyles, theme, buttonStyleGraphitBorder, buttonStyleOutlined} from '../utils/utils';
import { TextField, Button, Avatar, Alert, Snackbar, ThemeProvider} from "@mui/material"
import closeBtn from '../../../img/close1.svg';
import uploadImg from '../../../img/upload.png';
import { motion } from 'framer-motion';
import { countries } from "../../signup/signup";


function UserProfile() {
	const [userInfo, setUserInfo] = React.useState([]);
	const [userSelected, setUserSelected] = React.useState([]);
	const [pictures, setPictures] = React.useState([]);
	const [searchLike, setSearchLike] = React.useState([]);
	const [uploadPicture, setUploadPicture] = React.useState('');
	const [profileUsername, setProfileUsername] = React.useState('');
	const [postTextField, setPostTextField] = React.useState('');
	const [isPageLoaded, setIsPageLoaded] = React.useState(false);
	const [overlayState, setOverlayState] = React.useState('none');
	const [selectedImage, setSelectedImage] = React.useState(null);
	const [snackBarColor, setSnackBarColor] = React.useState('');
	const [snackBarText, setSnackBarText] = React.useState('');
	const [snackBar, setSnackBar] = React.useState(false);
	const [updateDataUserSelected, setUpdateDataUserSelected] = React.useState(1);
	const [updateDataPictures, setUpdateDataPictures] = React.useState(1);
	const navigate = useNavigate();
	const fileInputRef = useRef(null);
	
	const currentUrl = window.location.href;
	const segments = currentUrl.split('/');
	const lastSegment = segments[segments.length - 1];
	console.log('userInfo', userInfo)
	console.log('userSelected', userSelected)
	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
		  return;
		}
	
		setSnackBar(false);
	};

	useEffect(() => {
      const fetchData = async () => {
        try {
          axios.defaults.withCredentials = true;
          const response = await axios.get('http://localhost:8000/api/check_verification', {
            withCredentials: true,
          });
          setUserInfo(response.data.user);

        } catch (error) {
          navigate('/signin');
          console.error(error);
        }
      };
    
      fetchData();
    }, []);

	useEffect(() => {
		const fetchPictures = async () => {
			try {
			  const response = await axios.get('http://localhost:8000/api/get_picture',{
				params: {
					username: lastSegment
				}
			}, );
			  console.log("RESPONSE:", response.data.Pictures);
			  const pictureUrlsWithDate = response.data.Pictures.map((picture) => ({
				picture_url: picture.picture_url,
				date_picture: picture.date_picture,
				username: picture.username,
				first_name: picture.first_name,
				last_name: picture.last_name,
				avatar: picture.avatar,
				likes: picture.likes,
				id: picture.id,
			  }));
			  setPictures(pictureUrlsWithDate);
	
			} catch (error) {
				setSnackBar(true);
				setSnackBarColor('#d32f2f');
				setSnackBarText(error);
			}
		  };
		
		  fetchPictures();
	}, [userSelected, selectedImage, updateDataPictures]);

	useEffect(() => {
	  const fetchSelectedUser = async () => {
        try {
          const response = await axios.get('http://localhost:8000/api/get_selected_user',{
			params: {
				username: lastSegment,
			},
		}, {
			withCredentials: true,
			headers: {
				'Content-Type': 'application/json'
			}
		});
          setUserSelected(response.data.selected_user);
          setIsPageLoaded(true);

        } catch (error) {
			setSnackBar(true);
			setSnackBarColor('#d32f2f');
			setSnackBarText(error);
        }
      };
    
      fetchSelectedUser();

    }, [lastSegment, updateDataUserSelected]);

	const matchingPicture = pictures.find((picture) => picture.picture_url === userSelected.avatar);

	const handleImageLike = (id, action) => {
		const updatedPictures = [...pictures];
		
		const index = updatedPictures.findIndex((picture) => picture.id === id);
	  
		if (index !== -1) {
		  if (action === 'increase') {
			updatedPictures[index].likes += 1;
			setSelectedImage((prevImage) => ({
				...prevImage,
				likes: prevImage.likes + 1,
			  }));
				createLike()
				pictureLike(true);
		  } else if (action === 'decrease') {
			updatedPictures[index].likes -= 1;
			setSelectedImage((prevImage) => ({
				...prevImage,
				likes: prevImage.likes - 1,
			  }));
				createLike()
				pictureLike(false);
		  }

		  setPictures(updatedPictures);
		}
	};

	async function uploadPictureFunc(url) {
		try {
			await axios.post("http://localhost:8000/api/upload_picture", {
				username: userInfo.username,
				picture_url: url
			}, {
				withCredentials: true,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			});
				setSnackBar(true);
				setSnackBarColor('#388e3c');
				setSnackBarText("Successfully uploaded picture!");
				setUpdateDataPictures((prevData) => prevData + 1);
			} catch (error) {
				setSnackBar(true);
				setSnackBarColor('#d32f2f');
				setSnackBarText(error);
		  }
	};

	async function searchPictureLike(id) {
		try {
			const responseLike = await axios.get("http://localhost:8000/api/search_like", {
				params: {
					post_id: id
				}
			}, {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			});
			setSearchLike(responseLike.data.message);
			console.log('responseLike.data.message', responseLike.data.message)
			} catch (error) {
				setSnackBar(true);
				setSnackBarColor('#d32f2f');
				setSnackBarText(error);
		  }
	};

	async function pictureLike(boolLike) {
		try {
			await axios.post("http://localhost:8000/api/like_picture", {
				
				picture_id: selectedImage.id,
				like: boolLike
				
			}, {
				headers: {
					'Content-Type': 'application/json'
				}
			});
			} catch (error) {
				setSnackBar(true);
				setSnackBarColor('#d32f2f');
				setSnackBarText(error);
		  }
	};

	async function changeAvatar() {
		try {
			await axios.patch('http://localhost:8000/settings/update_user_data', {
				avatar: selectedImage.picture_url,
				}, {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			});
			setSnackBar(true);
			setSnackBarColor('#388e3c');
			setSnackBarText("Successfully changed profile avatar!");
			setUpdateDataUserSelected((prevData) => prevData + 1);
		} catch (err) {
			setSnackBar(true);
			setSnackBarColor('#d32f2f');
			setSnackBarText(err);
		}
	}
	
	async function createLike() {
		try {
			const responseLike = await axios.post("http://localhost:8000/api/create_like", {
				
				type_like: 'picture',
				post_id: selectedImage.id,
				like: 1,
				owner_username: selectedImage.username,
				
			}, {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			});
			console.log('CREATE LIKE:', responseLike);
			} catch (error) {
			console.error(error);
		  }
	};
	

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
				console.log('Cloudinary response:', data.secure_url);
				uploadPictureFunc(data.secure_url)
				setUploadPicture(data.secure_url)
			})
			.catch(error => {
				console.error('Error uploading file:', error);
			});
		}
		
    };

	function getCodeByLabel(labelToFind) {
		const foundCountry = countries.find(country => country.label === labelToFind);
		return foundCountry ? foundCountry.code : null;
	}
  
	let codeCountry = getCodeByLabel(userSelected.country);

	const sortedChats = pictures.sort((a, b) => {
		const timestampA = new Date(a.date_picture).getTime();
		const timestampB = new Date(b.date_picture).getTime();
	  
		return timestampB - timestampA;
	}).slice(0, 4);

	const messageTime = selectedImage ? (selectedImage.date_picture ? new Date(selectedImage.date_picture) : null) : null;
	const options = { day: '2-digit', month: 'short', hour: 'numeric', minute: 'numeric', hour12: false };
	const formatter = new Intl.DateTimeFormat('en-MD', options);
	const formattedTime = formatter.format(messageTime);


	return (
		<>
		{isPageLoaded ? 
		<motion.div initial={{ y: 10, opacity: 0 }}animate={{ y: 0, opacity: 1 }}exit={{ y: -10, opacity: 0 }}transition={{ duration: 0.3 }}>
		<>
		<div className="user-profile-wrapper">
			<div className="user-profile-header">
				<img src={userSelected.headerImg} alt="Header Image"/>
				{ typeof userSelected.avatar === 'string' ?
					<Avatar className="headerAvatarProfile" onClick={async () => {setProfileUsername(userSelected.username); setOverlayState(''); 
						setSearchLike(null); await searchPictureLike(matchingPicture.id); setSelectedImage(matchingPicture);}} alt={userSelected.username} src={userSelected.avatar} />
				: null
				}
			</div>
			<div className="user-profile-header-info">
				<div className="user-profile-status">
				<h2 style={{fontWeight: '300', marginLeft: '200px', fontSize: '15px', marginTop: '10px'}}>{userSelected.user_status}</h2>
				
					
				</div>
				<div style={userSelected.user_status === null ? {display:'flex', paddingTop: '33px'} : {display:'flex'}}>
					<h2 style={{fontWeight: 'normal', marginLeft: '30px'}}>{userSelected.first_name}</h2>
					<h2 style={{fontWeight: 'normal', marginLeft: '10px'}}>{userSelected.last_name}</h2>
				</div>
				<div>
				{ codeCountry !== null ?
				<div style={{display: 'inline-flex', alignItems: 'center', marginTop: '-15px'}}>
					<img src={`https://flagcdn.com/48x36/${codeCountry.toLowerCase()}.png`} alt="" style={{width: '21px', height: '14px', marginLeft: '30px'}} />
					<h2 style={{fontWeight: 'normal', marginLeft: 10, fontSize: '15px', color: '#a19f9f'}}>{userSelected.country}{userSelected.city !== null ? ',' : null}</h2>
					<h2 style={{fontWeight: 'normal', marginLeft: 5, fontSize: '15px', color: '#a19f9f'}}>{userSelected.city}</h2>
				</div>
				: null }
				<div style={{fontWeight: 'normal', marginLeft: '30px', marginTop: '-10px'}}>
					<div style={{display: 'inline-flex', justifyContent: 'center'}}>
						<h2 style={{fontWeight: 'normal', fontSize: '15px'}}>@{userSelected.username}</h2>
						<div className="center-dot"></div>
						<h2 style={{fontWeight: 'normal', fontSize: '15px'}}>{userSelected.gender}</h2>
						{ userSelected.date !== 'Invalid Date Invalid Date Invalid Date' ?
							<>
							<div className="center-dot"></div>
							<h2 style={{fontWeight: 'normal', fontSize: '15px'}}>{userSelected.date}</h2>
							</>
						: null 
						}
					</div>
				</div>
				</div>

			</div>
			<div className="user-profile-pictures">
				<div className="user-profile-pictures-header">
					<h2>Photos</h2>
					{ userInfo.username === userSelected.username ?
						<Button 
						variant="outlined" 
						type="submit" 
						sx={{mt: 0, ml: 3, mr: 2, width: '190px', height: 27, boxShadow: 5, borderRadius: '10px' }} 
						style={buttonStyleOutlined}
						theme={theme}
						onClick={openFileInput}
						>
						Upload picture
					</Button> : null}
					<input
						type="file"
						accept="image/*"
						onChange={handleFileUpload}
						style={{ display: 'none' }}
						ref={fileInputRef}
					/>
					{/* <Button 
						variant="outlined" 
						type="submit" 
						sx={{mt: 0, ml: 1, mr: 3, width: '190px', height: 27, boxShadow: 5, borderRadius: '10px' }} 
						style={buttonStyleOutlined}
						theme={theme}
						>
						View all pictures
					</Button> */}
				</div>
				<div className="user-profile-pictures-container">
					{sortedChats.map((picture) => (
						<img
						key={picture.id}
						src={picture.picture_url}
						alt=""
						width={300}
						onClick={async () => {setProfileUsername(picture.username); setOverlayState(''); 
						setSearchLike(null); await searchPictureLike(picture.id); setSelectedImage(picture);}}
						/>
					))}
					{pictures.length > 4 && <div className="overlay">+{pictures.length - 4}</div>}
				</div>
				{selectedImage && (
					<div className="view-picture">
						<div className="leftside-picture">
							<img src={selectedImage.picture_url} alt="" />
							<div className="leftside-picture-footer">
								{
									profileUsername === userInfo.username ? <h2 className="leftside-picture-footer-h2" onClick={() => changeAvatar()}>Set as a profile picture</h2> : null
								}
							</div>
						</div>
						<div className="rightside-picture-wrapper">
							<div className="rightside-picture-container">
								<div className="rightside-picture-header">
									<div className="rightside-picture-header-info">
										<div style={{display:'flex', borderBottom: '1px solid #3334384f'}}>
											<div style={{display:'flex', alignItems: 'center', margin: '10px 10px'}}>
												{ typeof selectedImage.avatar === 'string' ?
													<Link to={`/async/profile/${profileUsername}`}>
														<Avatar className="pictureAvatarProfile" alt={selectedImage.username} src={selectedImage.avatar} />
													</Link>
												: null
												}
												<div style={{display: 'grid'}}>
													<a className="picture-header-h2" style={{fontWeight: 'normal', fontSize: 14, marginLeft: '10px'}} href={`/async/profile/${profileUsername}`}>{selectedImage.first_name} {selectedImage.last_name}</a>
													<h2 style={{fontWeight: 'normal', fontSize: 12, margin: 0, marginLeft: '10px', marginTop: 3, color: 'gray'}}>{formattedTime}</h2>
												</div>
											</div>
										</div>
										<div className="rightside-picture-header-buttons">
											<div style={{display: 'flex', alignItems: 'center'}}>
													{/* { searchLike === null ? */}
												<div>
													<input type="checkbox" id="checkbox" defaultChecked={searchLike !== null}/>
													<label for="checkbox">
														<svg id="heart-svg" viewBox="467 392 58 57" xmlns="http://www.w3.org/2000/svg"><g id="Group" fill="none" fill-rule="evenodd" transform="translate(467 392)">
															<path onClick={() => handleImageLike(selectedImage.id, 'increase')} d="M29.144 20.773c-.063-.13-4.227-8.67-11.44-2.59C7.63 28.795 28.94 43.256 29.143 43.394c.204-.138 21.513-14.6 11.44-25.213-7.214-6.08-11.377 2.46-11.44 2.59z" id="heart" fill="#AAB8C2"/>
															<circle onClick={() => handleImageLike(selectedImage.id, 'decrease')} id="main-circ" fill="#E2264D" opacity="0" cx="29.5" cy="29.5" r="1.5"/><g id="grp7" opacity="0" transform="translate(7 6)"><circle id="oval1" fill="#9CD8C3" cx="2" cy="6" r="2"/><circle id="oval2" fill="#8CE8C3" cx="5" cy="2" r="2"/></g><g id="grp6" opacity="0" transform="translate(0 28)"><circle id="oval1" fill="#CC8EF5" cx="2" cy="7" r="2"/><circle id="oval2" fill="#91D2FA" cx="3" cy="2" r="2"/></g><g id="grp3" opacity="0" transform="translate(52 28)"><circle id="oval2" fill="#9CD8C3" cx="2" cy="7" r="2"/><circle id="oval1" fill="#8CE8C3" cx="4" cy="2" r="2"/></g><g id="grp2" opacity="0" transform="translate(44 6)"><circle id="oval2" fill="#CC8EF5" cx="5" cy="6" r="2"/><circle id="oval1" fill="#CC8EF5" cx="2" cy="2" r="2"/></g><g id="grp5" opacity="0" transform="translate(14 50)"><circle id="oval1" fill="#91D2FA" cx="6" cy="5" r="2"/><circle id="oval2" fill="#91D2FA" cx="2" cy="2" r="2"/></g><g id="grp4" opacity="0" transform="translate(35 50)"><circle id="oval1" fill="#F48EA7" cx="6" cy="5" r="2"/><circle id="oval2" fill="#F48EA7" cx="2" cy="2" r="2"/></g><g id="grp1" opacity="0" transform="translate(24)"><circle id="oval1" fill="#9FC7FA" cx="2.5" cy="3" r="2"/><circle id="oval2" fill="#9FC7FA" cx="7.5" cy="2" r="2"/></g></g>
														</svg>
													</label>
												</div>
													
												<h2>{selectedImage.likes}</h2>
											</div>

										</div>

									</div>
									<div className="rightside-picture-body">

									</div>
									<div className="rightside-picture-textfield">

									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
			<div className="modal" onClick={() => {setSelectedImage(null); setOverlayState('none')}} style={{display: overlayState}}>
				<button onClick={() => {setSelectedImage(null); setOverlayState('none')}}><img src={closeBtn} alt="" width={20}/></button>
				
			</div>

			{userInfo.username === userSelected.username ?
				<div className="user-profile-create-post">
				<div style={{padding: 15}}>
					<div className="user-profile-create-post-container">
						{ typeof userSelected.avatar === 'string' ?
							<Link to={`/async/profile/${userSelected.username}`}>
								<Avatar sx={{width: 38, height: 38}} alt={userSelected.username} src={userSelected.avatar} />
							</Link>
						: null}					
						<ThemeProvider theme={theme}>
							<TextField 
								value={postTextField}
								onChange={(event) => setPostTextField(event.target.value)}
								autoComplete="off"
								maxRows={5}
								minRows={1}
								multiline
								onKeyDown={(event) => {
								if (event.key === 'Enter' && !event.shiftKey) {
									event.preventDefault();
									// handleSendMessage();
								}}}
								id="outlined-basic" 
								label='Write something...'
								variant="standard" 
								size='small'
								InputLabelProps={{style: { color: '#8d8d8d' },}} 
								InputProps={{style: { color: '#e0dfe7' },}} 
								sx={{...TextFieldStyles, ml: 1, mr: 2, width: 400, boxShadow: 1}}
							/>
						</ThemeProvider>
						<img style={{justifyContent: "right"}} className="user-profile-create-post-upload-icon" src={uploadImg} alt="" />
					</div>
					<Button 
						variant="outlined" 
						type="submit" 
						sx={{mt: 2, mb: 3, width: '50%', height: 27, boxShadow: 5, borderRadius: '20px' }} 
						style={buttonStyleGraphitBorder}
						theme={theme}
						>
						Create post
					</Button>
				</div>
			</div> : null}
			<div className="user-profile-feed">
				<div className="user-profile-feed-header">
					<h2 id="user-profile-feed-notes">Notes</h2>
				</div>
				<div className="user-profile-feed-post">
					<div className="user-profile-feed-post-header">
						<div style={{display:'flex', alignItems: 'center', margin: '10px 10px'}}>
							{ typeof userSelected.avatar === 'string' ?
								<Link to={`/async/profile/${userSelected.username}`}>
									<Avatar className="pictureAvatarProfile" alt={userSelected.username} src={userSelected.avatar} />
								</Link>
							: null
							}
							<div style={{display: 'grid'}}>
								<a className="picture-header-h2" style={{fontWeight: 'normal', fontSize: 14, marginLeft: '10px'}} href={`/async/profile/${userSelected.username}`}>{userSelected.first_name} {userSelected.last_name}</a>
								<h2 style={{fontWeight: 'normal', fontSize: 12, margin: 0, marginLeft: '10px', marginTop: 3, color: 'gray'}}>{formattedTime}</h2>
							</div>
						</div>
					</div>
				</div>

			</div>
			<Snackbar open={snackBar} autoHideDuration={8000} onClose={handleClose}>
				<Alert onClose={handleClose} severity="error"
				sx={{ width: 'auto', backgroundColor: snackBarColor, color: '#fff' }}>
					{snackBarText}
				</Alert>
			</Snackbar>
		</div>
		</>
		</motion.div>
		: null}

		</> 
	)
}

export default UserProfile;





