import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Container, TextField, Button, Box, Typography, Menu, MenuItem, Tooltip, Avatar, Badge, IconButton, styled} from "@mui/material"
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from "axios";
import logoImage from '../../img/logo2.png';
import feedImg from '../../img/feed.png';
import picturesImg from '../../img/pictures.png';
import videosImg from '../../img/videos.png';
import friendsImg from '../../img/friends.png';
import favoritesImg from '../../img/favorites.png';
import messagesImg from '../../img/messages.png';
import userPageImg from '../../img/userpage.png';
import communityImg from '../../img/community.png';
import notificationImg from '../../img/notification.png';

import Messages from './Messages/Messages.jsx';
import Settings from "./settings/settings";

import './messenger.css';


const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiMenuItem-root': {
    color: '#e0dfe7', 
    fontFamily: 'Exo', 
    '&:hover': {
      color: '#ffffff',
      backgroundColor: '#222328',
     },
  },
  '& .MuiPaper-root': {
    backgroundColor: '#1c1d21',
  },
}));



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

// Field Text settings
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

const searchTheme = createTheme({
    typography: {
        fontFamily: 'Montserrat',
        fontSize: 11,
    },
    });


    
    
    




function Messenger() {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [userInfo, setUserInfo] = React.useState([]);

  const [textOption, setTextOption] = React.useState('Messages');
  const navigate = useNavigate();
  
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const settings = ['Profile', 'Account', 'Settings', 'Logout'];

  async function handleMenuItemSettingsClick(setting) {
    if (setting === 'Logout') {
      try {
        const response = await axios.post(
          "https://kenzoback.onrender.com/logout",
          {},
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log("SIGNUP RESPONSE: ", response.data);
        console.log("User logged out");
        navigate('/signin');
      } catch (err) {
        console.log("ERROR: ", err);
      }
      
      setAnchorElUser(null);
    } 
    else if (setting === 'Profile'){
      console.log(`Clicked on ${setting}`);
    }
    else if (setting === 'Account'){
      console.log(`Clicked on ${setting}`);
    }
    else if (setting === 'Settings'){
      console.log(`Clicked on ${setting}`);
      navigate('settings')
    }
  };


  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const CustomMenuContainer = styled(StyledMenu)({
    '& .MuiMenuItem-root': {
      color: '#e0dfe7',
      fontFamily: 'Exo',
      '&:hover': {
        color: '#ffffff',
        backgroundColor: '#222328',
      },
    },
    '& .MuiPaper-root': {
      backgroundColor: '#1c1d21',
    },
  });


    

    useEffect(() => {
      const fetchData = async () => {
        try {
          axios.defaults.withCredentials = true;
          const response = await axios.get('https://kenzoback.onrender.com/api/check_verification', {
            withCredentials: true,
          });
          console.log("RESPONSE HEADER:-", response.data);
          setUserInfo(response.data.user);
          console.log("VERIF PASSED");

        } catch (error) {
          navigate('/signin');
          console.error(error);
        }
      };
    
      fetchData();
    }, []);
   
    

    function notificationsLabel(count) {
        if (count === 0) {
          return 'no notifications';
        }
        if (count > 99) {
          return 'more than 99 notifications';
        }
        return `${count} notifications`;
    }


    return (
        <>
        <Container sx={{minWidth: "1200px",  mx: 'auto'}}>	
          <div className="wrapper">
            <div className="navbar">
              <div className="messenger-reg-logo">
                  <img className="messenger-reg-img" src={logoImage} alt="" />
                  <h2>ASYNC TALK</h2>
              </div>
              <div className="sidebar-option">
                  <h2>{textOption}</h2>
              </div>
              <div className="search-field">
                <ThemeProvider theme={searchTheme}>
                  <TextField
                    type="search"
                    size="small"
                    id="outlined-basic" 
                    label="Search"
                    variant="outlined" 
                    InputLabelProps={{style: { color: '#e0dfe7' },}} 
                    InputProps={{style: { color: '#e0dfe7' },}} 
                    sx={{...TextFieldStyles, mt: 2, width: 250, boxShadow: 3}}
                  />
                </ThemeProvider>
              </div>
              <div className="info-area">
                  <IconButton aria-label={notificationsLabel(100)} sx={{mt: 1}}>
                      <Badge badgeContent={1} sx={{ "& .MuiBadge-badge": { fontFamily: 'Montserrat' }}} classes={{ badge: 'custom-badge' }}>
                          <img className="badgeHeader" src={notificationImg} alt="" />
                      </Badge>
                  </IconButton>
                  <div>
                    <Box sx={{ flexGrow: 0, ml: 5 }}>
                      <Tooltip title="Open settings">
                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                          <Avatar className="headerAvatar" alt={userInfo.username} src={userInfo.avatar} />
                        </IconButton>
                      </Tooltip>
                      <ThemeProvider theme={theme}>
                      <CustomMenuContainer 
                        sx={{ mt: 5, ml: 3.4 }}
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                      >
                        {settings.map((setting) => (
                          <MenuItem key={setting} onClick={() => handleMenuItemSettingsClick(setting)}>
                            <Typography textAlign="center">{setting}</Typography>
                          </MenuItem>
                        ))}
                      </CustomMenuContainer>

                      </ThemeProvider>
                    </Box>  
                  </div>
                  

              </div>
            </div>

            <div className="sidebar">
              <ul>
                <li 
                  className="list" onClick={() => setTextOption('Profile')}>
                  <img src={userPageImg} alt="" />
                  <h2>Profile</h2>
                </li>
                <li className="list" onClick={() => {setTextOption('Messages'); navigate('messages')}}>
                  <img src={messagesImg} alt="" />
                  <h2>Messages</h2>
                </li>
                <li className="list" onClick={() => setTextOption('Feed')}>
                  <img src={feedImg} alt="" />
                  <h2>Feed</h2>
                </li>
                <li className="list" onClick={() => setTextOption('Friends')}>
                  <img className="friendsImg" src={friendsImg} alt="" />
                  <h2>Friends</h2>
                </li>
                <li className="list" onClick={() => setTextOption('Community')}>
                  <img src={communityImg} alt="" />
                  <h2>Community</h2>
                </li>
                <li className="list" onClick={() => setTextOption('Pictures')}>
                  <img src={picturesImg} alt="" />
                  <h2>Pictures</h2>
                </li>
                <li className="list" onClick={() => setTextOption('Videos')}>
                  <img src={videosImg} alt="" />
                  <h2>Videos</h2>
                </li>
                <li className="list" onClick={() => setTextOption('Favorites')}>
                  <img className="favoritesImg" src={favoritesImg} alt="" />
                  <h2>Favorites</h2>
                </li>
              </ul>
            </div>
                              
            <div className="main-wrapper">
              <Routes>
                <Route path="/messages" element={<Messages />} />
                <Route path="/settings" element={<Settings userIn={userInfo} />} />
              </Routes>
              

            </div>

          </div>
		    </Container>
        
        </>
    );
}

export default Messenger;
