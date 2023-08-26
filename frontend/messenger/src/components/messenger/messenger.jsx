import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, TextField, Button, Box, Typography, Menu, MenuItem, Tooltip, Avatar, Badge, IconButton, styled} from "@mui/material"
import { withStyles } from "@mui/styles";
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

import './messenger.css';


// Создаем пользовательские стили для Menu
const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiMenuItem-root': {
    color: '#e0dfe7', // Цвет шрифта
    fontFamily: 'Exo', // Шрифт
    '&:hover': {
      color: '#ffffff', // Цвет шрифта при наведении
      backgroundColor: '#222328', // Цвет фона при наведении
     },
  },
  '& .MuiPaper-root': {
    backgroundColor: '#1c1d21', // Цвет фона
  },
}));


// Field Text settings
const styles = {
    root: {
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
    },
};

const CSSTextField = withStyles(styles)(TextField);

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


const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];




function Messenger() {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [userInfo, setUserInfo] = React.useState([]);

  const [textOption, setTextOption] = React.useState('Messages');
  console.log(textOption)
  
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };


  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };


  const CustomMenuContainer = withStyles({
    paper: {
      borderRadius: '15px',
    },
  })(StyledMenu);

    const navigate = useNavigate();

    // useEffect(() => {
    //   const checkAuthentication = async () => {
    //     try {
    //       const cookieValue = document.cookie;
    //       const cookieParts = cookieValue.split(';');
    //       let data = null;
    
    //       for (let i = 0; i < cookieParts.length; i++) {
    //         const cookie = cookieParts[i].trim();
    //         if (cookie.startsWith('data=')) {
    //           const startIndex = cookie.indexOf('=') + 1;
    //           const jsonSubstring = cookie.substring(startIndex);
    //           data = JSON.parse(jsonSubstring);
    //           break;
    //         }
    //       }
    
    //       if (data) {
    //         const username = data.username;
    //         console.log(username); // Вывод значения username
    
    //         try {
    //           const response = await axios.get(`http://localhost:8000/api/messenger/${username}`, {
    //             withCredentials: true,
    //           });
    //           console.log(response.data);
    //         } catch (error) {
    //           console.error(error);
    //           navigate('/signin');
    //         }
    //       } else {
    //         // Куки "data" не найдены
    //       }
    //     } catch (error) {
    //       // Обработка ошибок
    //       navigate('/signin');
    //     }
    //   };
    //   checkAuthentication();
    // }, []);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get('http://localhost:8000/api/check_verification', {
            withCredentials: true,
          });
          console.log("RESPONSE HEADER:-", response.data);
          setUserInfo(response.data.user);
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
                  <CSSTextField
                    type="search"
                    size="small"
                    id="outlined-basic" 
                    label="Search"
                    variant="outlined" 
                    InputLabelProps={{style: { color: '#e0dfe7' },}} 
                    InputProps={{style: { color: '#e0dfe7' },}} 
                    sx={{width: 250, boxShadow: 3}}
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
                          sx={{ mt: 5, ml: 5 }}
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
                            <MenuItem key={setting} onClick={handleCloseUserMenu}>
                              <Typography  textAlign="center">{setting}</Typography>
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
                <li className="list" onClick={() => setTextOption('Messages')}>
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
             <Messages/>
              

            </div>

          </div>
		    </Container>
        
        </>
    );
}

export default Messenger;
