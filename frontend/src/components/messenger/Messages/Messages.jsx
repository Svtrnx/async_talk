import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TextField, Button, Avatar, Alert} from "@mui/material"
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import { ThemeProvider } from '@mui/material/styles';
import Snackbar from '@mui/material/Snackbar';
import searchImg from '../../../img/search.png';
import plusImg from '../../../img/plus.png';
import closeImg from '../../../img/close.png';
import doneImg from '../../../img/done.png';
import close2Img from '../../../img/close2.png';
import infoImg from '../../../img/info.png';
import uploadImg from '../../../img/upload.png';
import picturesImg from '../../../img/pictures.png';
import micImg from '../../../img/mic.png';
import sendImg from '../../../img/send.png';
import createChat from '../../../img/createChat.png';
import InputAdornment from '@mui/material/InputAdornment';
import {styles, TextFieldStyles, theme, themeGetStarted, buttonStyleGetStarted} from '../utils/utils';
import axios from "axios";
import { Image } from '@cloudinary/react';
import 'intersection-observer';
import { motion } from 'framer-motion';
import './Messages.css';

function Messages() {
  const moment = require('moment');

  const [userId, setUserId] = useState(0);
  const [lastMessageWs, setLastMessageWs] = useState('');
  const [websocketUserId, setWebsocketUserId] = useState(0);
  const [ws, setWs] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [messageValue, setMessageValue] = useState('');
  const [username, setUsername] = useState('');
  const [user_Id, setUser_Id] = useState(0);
  const [chatId, setChatId] = useState(0);
  const [partnerUsername, setPartnerUsername] = useState(0);
  const [partnerUserId, setPartnerUserId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [dataUsername, setDataUsername] = useState([]);
  const [displayNoneAddChat, setDisplayNoneAddChat] = useState('none');
  const [displayNoneChats, setDisplayNoneChats] = useState('grid');
  const [leftsideButton, setLeftsideButton] = useState(plusImg);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showRightsideChat, setShowRightsideChat] = useState(false);
  const [messagesData, setMessagesData] = useState([]);
  const [newWs, setNewWs] = useState(null);
  const [showRightside, setShowRightside] = useState('none')
  const [chatUsername, setChatUsername] = useState('')
  const [imageUrl, setImageUrl] = useState('');
  const [imageUrl2, setImageUrl2] = useState('');
  const [userAvatarChat, setUserAvatarChat] = useState('');
  const [currentUserAvatar, setCurrentUserAvatar] = useState('');
  const [currentUserAvatar5, setCurrentUserAvatar5] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isClearingChat, setIsClearingChat] = useState(false);
  const [chatCleared, setChatCleared] = useState(false);
  const [errorSnackBar, setErrorSnackBar] = useState(false);
  const [errorSnackBarText, setErrorSnackBarText] = useState('');

  const sortedChats = chats.slice().sort((a, b) => {
    const timestampA = new Date(a.last_message_timestamp).getTime();
    const timestampB = new Date(b.last_message_timestamp).getTime();
  
    return timestampB - timestampA;
  });

  useEffect(() => {
    fetchChats()
  }, [chatMessages]);
  


  // useEffect(() => {
  //   if (messagesData.length && chatMessages.length) {
  //     console.log('11111111111111111111111\n\n\n\n')
  //     const allMessages = messagesData
  //       .concat(chatMessages)
  //       .sort((a, b) => moment(b.date_message).valueOf() - moment(a.date_message).valueOf());
  
  //     const lastMessage = allMessages[0]; 
  //     console.log('lastMessage', lastMessage.text)
  
  //     setLastMessageWs(lastMessage.text);
  //   }
  // }, [messagesData, chatMessages]);
  
 
  // console.log('isVisible', isVisible)
  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       const isAnyVisible = entries.some((entry) => entry.isIntersecting);
  //       setIsVisible(isAnyVisible);
  //     },
  //     { threshold: 0.5 }
  //   );
  
  //   targetRefs.current.forEach((ref) => {
  //     if (ref) {
  //       observer.observe(ref);
  //     }
  //   });
  
  //   return () => {
  //     targetRefs.current.forEach((ref) => {
  //       if (ref) {
  //         observer.unobserve(ref);
  //       }
  //     });
  //   };
  // }, [messagesData]);

  async function clearChatFunction() {
    setChatMessages([]);
  }

  const handleCloseSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setErrorSnackBar(false);
  }

  const chatExists = chats.some(chat => chat.user_id === user_Id
    ||chat.partner_user_id === user_Id);

  useEffect(() => {
    console.log('userAvatarChat:---', chats);

  }, [])

  useEffect(() => {
    const publicId = '825156941529614';
    const cloudName = 'dlwuhl9ez';

    const imageUrl = `https://res.cloudinary.com/dlwuhl9ez/image/upload/v1692995033/samples/woman-on-a-football-field.jpg`;
    const imageUrl2 = `https://res.cloudinary.com/dlwuhl9ez/image/upload/v1692995029/samples/outdoor-woman.jpg`;
    setImageUrl(imageUrl);
    setImageUrl2(imageUrl2);
  }, []);
  

  

  useEffect(() => {
    const newUserId = generateUserId();
    setUserId(newUserId);
  
    if (chatId && dataUsername.username) {
      if (!ws) {
        const newWs = new WebSocket(`wss://kenzo-a0ml.onrender.com/ws/${chatId}/${dataUsername.username}`);
        setWs(newWs);
  
        

        newWs.onopen = () => {
          console.log("WebSocket connected");
        };
  
        // newWs.onmessage = (event) => {
        //   const receivedMessage = event.data;
        //   setChatMessages(prevMessages => [...prevMessages, receivedMessage]);
        // };

        newWs.onmessage = (event) => {
          const receivedMessage = event.data;
          const timestamp = new Date(); 
          const websocketMessage = {
            text: receivedMessage,
            date_message: timestamp.toISOString(), 
            message_sender: chatUsername, 
            current_user_id: userId, 
          };
          setChatMessages(prevMessages => [...prevMessages, websocketMessage]);
        };
  
        newWs.onclose = () => {
          console.log("WebSocket disconnected");
          setWs(null);
        };
      }
  
      
      return () => {
        if (ws) {
          ws.close();
        }
      };
    }
  }, [chatId, dataUsername.username, ws]);

  
  
  
  const generateUserId = () => {
    return Math.random().toString(36).substr(2, 9);
  };
  // const sendMessage = () => {
  //   if (ws) {
  //     ws.send(`${recipient}:${message}`);
  //   }
  // };

  const createRoom = () => {
    console.log('Create room');
  };
  
  
  const handleSendMessage = () => {
    if (messageValue) {
      if (messageValue.trim() !== '') {
        if (messageValue.length > 180) {
          setErrorSnackBar(true);
          setErrorSnackBarText('Too much symbols! Max: 180')

        }
        else {
          setErrorSnackBar(false);
      
      console.log('Отправлено сообщение:', messageValue);

      async function sendMessage() {
        try {
          const response = await axios.post("https://kenzoback.onrender.com/api/messages/send_message", {
            text: messageValue,
            chat_id: chatId,
            message_sender:  dataUsername.id,
            current_user_id: currentUserId,
            partner_user_id: partnerUserId
          }, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          });
          console.log("MESSAGE RESPONSE: ", response.data);
          fetchChats()
          setChats((prevChatData) =>
            prevChatData.map((chat) => {
              if (chat.chat_id === chatId) {
                return { ...chat, last_message: messageValue };
              }
              return chat;
            })
          );
          
        }
        catch (err) {
          console.log("SEND MESSAGE ERROR: ", err);
        }
      }
    
      

      sendMessage();
      if (ws && ws.readyState === WebSocket.OPEN) {
      console.log("RESCIPIENT:", recipient)
      console.log("MESSAGE:", messageValue)
      ws.send(`${chatUsername}:${messageValue}`);
      const timestamp = new Date();
      const ownMessage = {
        text: messageValue,
        chat_id: chatId,
        message_sender:  dataUsername.id,
        current_user_id: currentUserId,
        partner_user_id: partnerUserId,
        date_message: timestamp.toISOString(),

      };
      setChatMessages(prevMessages => [...prevMessages, ownMessage]);


      console.log("partnerUSERNAME:", chatUsername)
      setMessage('');
    }
      


      setMessageValue('');
    }
    }
  }
  };

  const fetchChats = async () => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.get('https://kenzoback.onrender.com/api/messages/chats_list', {
        withCredentials: true,
      })
      .then(response => {
        const chatsData = response.data[0].chats;
        setChats(chatsData);
      })
    } catch (error) {
      console.error(error);
    }
  };

  // USE EFFECT FOR CHATS QUERY
  useEffect(() => {
    
      const fetchData = async () => {
        try {
        axios.defaults.withCredentials = true;
        const response = await axios.get('https://kenzoback.onrender.com/api/check_verification', {
          withCredentials: true,
        },{
          headers: {
            'Content-Type': 'application/json',
          }
        });

        setDataUsername(response.data.user);
        setUserId(response.data.user);

      } catch (error) {
        console.error(error);
        console.log(error)
      }
    };

    fetchData();


    const fetchUsers = async () => {
      axios.defaults.withCredentials = true;
      await axios.get('https://kenzoback.onrender.com/api/messages/users_list', {
        withCredentials: true,
      })
      .then(response => {
        const users = response.data[0].users;
        setUsers(users)
      })
      .catch(error => {
        console.error(error);
        });
      }
      fetchUsers();

    
    fetchChats();
    
    }, [selectedUsers]);

  function handleFindUsers() {
    if (displayNoneAddChat === 'none') {
      setDisplayNoneAddChat('');
      setLeftsideButton(closeImg)
    } else {
      setDisplayNoneAddChat('none');
      setLeftsideButton(plusImg)
    }
    
    if (displayNoneChats === 'grid') {
      setDisplayNoneChats('none');
    } else {
      setDisplayNoneChats('grid');
    }
  }



  const handleUserClickCreateChat = (userId, username, avatar, event) => {
    if (avatar === null) {
      setUserAvatarChat(username);
    }
    else {
      setUserAvatarChat(avatar);
    }
    const isSelected = selectedUsers.includes(userId);
    setUser_Id(userId);
    setUsername(username);
    console.log(user_Id, username, avatar);

    chats.map(chat => {
      if (chat.username === username) {
        console.log("TRUE")
      }
    });
  
    if (isSelected) {
      setSelectedUsers([userId]);
    } else {
      setSelectedUsers([userId]); 
    }
  };

  const handleOpenChat = async (chat_Id, username, partner_Username, 
                                user_id, partner_user_id, partner_avatar, avatar, event) => {
                                  setChatCleared(false);
                                  
    setShowRightside('')
    setChatId(chat_Id);
    setUsername(username);
    setPartnerUsername(partner_Username);
    setPartnerUserId(partner_user_id);
    setCurrentUserId(user_id);
    setCurrentUserAvatar5(partner_avatar)
    setUserAvatar(avatar)


    try {
      await clearChatFunction();
      
      
    } catch (error) {
      console.error("Error clearing chat:", error);
      setIsClearingChat(false); 
    }
  
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.get(`https://kenzoback.onrender.com/api/messages/messages_list/${chat_Id}`, {
        withCredentials: true,
      });
      setMessagesData(response.data.messages);
      setShowRightsideChat(true);
    } catch (error) {
      console.log(error);
    }
    setChatCleared(true);
  };
  
  useEffect(() => {
    console.log(user_Id, username);
    console.log("Нажатие на чат:", chatId);
    console.log("Мой username:", dataUsername.username);
    console.log("Партнер username:", partnerUsername);
    console.log(messagesData);
    console.log('USERID:', userId.id)
    console.log('WebsocketUserId:', websocketUserId)
    console.log('newWs:', newWs)
    console.log('chatMessages:', chatMessages)
    
    // if (selectedUsers.length === 1) {
    //   console.log('TRUE');
    // }
  }, [chatMessages,newWs,websocketUserId ,user_Id, chatId, partnerUsername, messagesData, userId]);

  function isUserSelected(userId) {
    return selectedUsers.includes(userId);
  };


  async function handleCreateChat() {
    try {
      if (chatExists) {
          setErrorSnackBar(true);
          setErrorSnackBarText('YOU ALREADY HAVE THIS CHAT!')
        } else {
          setErrorSnackBar(false);
      
      
          const requestData = {
            partner_user_id: user_Id,
            partner_username: username,
            partner_user_avatar: userAvatarChat
          };
          const response = await axios.post(
            'https://kenzoback.onrender.com/api/messages/create_chat/',
            requestData,
            {
              withCredentials: true,
              headers: {'Content-Type': 'application/json'}
            }
          );
        
          console.log(response.data);
      }
    } catch (error) {
      console.log("ERROR:", error);
    }
    setDisplayNoneAddChat('none')
    setDisplayNoneChats('grid')
    setLeftsideButton(plusImg)
    setSelectedUsers([])
    
  }

  function getDisplayedUsername(chat, dataUsernameChats) {
    if (dataUsernameChats === chat.username) {
      return chat.partner_username;
    } else {
      return chat.username;
    }
  }

  function getDisplayedUsernameRightside() {
    if (dataUsername.username === username) {
      return partnerUsername;
    } else {
      return username;
    }
  }

  function getDisplayedAvatar(chat, dataAvatarChats) {
    if (dataAvatarChats === chat.user_avatar) {
      console.log('90', chat.partner_user_avatar)
      return chat.partner_user_avatar;
    } else if (dataAvatarChats === chat.partner_user_avatar) {
      return chat.user_avatar;
    } else {
      // console.log('90', chat.user_avatar)
      return chat.partner_user_avatar;
    }
  }


  function getInfoOnChats(username, avatar) {
    setChatUsername(username);
    setCurrentUserAvatar(avatar);
  }






 console.log('user.iduser.id', users)
  
	return (
		<>
    { users ?
      <motion.div
				initial={{ y: 10, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				exit={{ y: -10, opacity: 0 }}
				transition={{ duration: 0.3 }}
        style={{height: '100%'}}
			>
		<div className="messages">
			<div className="leftside-messages">
				<div className="leftside-messages-info">
				  <div className="leftside-messages-info-search">
            <img className="leftside-messages-info-search-searchImg" src={searchImg} alt="" />
            <input  type="text"
                    placeholder="Search people"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <img className="leftside-messages-info-search-plusImg" src={leftsideButton} alt="" onClick={handleFindUsers}/>
				  </div>
          <div style={{display: displayNoneAddChat, overflow: 'auto'}}>
            <div className="leftside-messages-header-text">
              <h2 className="leftside-messages-header-text-h2">Create Chat</h2>
            </div>
              { users.filter((user) => {
                  const { username, first_name, last_name } = user;
                  const query = searchQuery.toLowerCase();
                  return (
                    username.toLowerCase().includes(query) ||
                    first_name.toLowerCase().includes(query) ||
                    last_name.toLowerCase().includes(query)
                  );
                }
                  ).map(user => (
                    <div
                      className={`leftside-messages-create-chat-users ${selectedUsers.includes(user.id) ? 'selected' : ''}`}
                      key={user.id}
                      onClick={(event) => handleUserClickCreateChat(user.id, user.username, user.avatar, event)}
                    >
                      <div className="leftside-messages-create-chat-users-avatar">
                        <Avatar sx={{width: 42, height: 42, ml: 1}} alt={user.username} src={user.avatar} />
                      </div>
                      <div className="leftside-messages-create-chat-users-fullname">
                        <h2>{user.first_name}</h2>
                        <h2>{user.last_name}</h2>
                      </div>
                      <img className="leftside-messages-create-chat-users-img" src={isUserSelected(user.id) ? close2Img : doneImg} alt="" />
                    </div>
              ))}
              {/*  */}
          </div>
          <div style={{overflow: "auto"}}>

          
          {sortedChats.filter((chat) =>
            chat.partner_username.toLowerCase().includes(searchQuery.toLowerCase())
          ).map(chat => {
            let lastMessage = chat.last_message
            const messageTime = new Date(chat.last_message_timestamp);
            const options = { day: '2-digit', month: 'short' };
            const formatter = new Intl.DateTimeFormat('en-MD', options);
            const formattedTime = formatter.format(messageTime);

          const hasMatchingChat = chats.some(chatItem => (
            chatItem.user_id === dataUsername.id ||
            chatItem.partner_user_id === dataUsername.id 
          ));
          const displayedUsername = getDisplayedUsername(chat, dataUsername.username);
          const displayedAvatar = getDisplayedAvatar(chat, dataUsername.avatar);
          console.log('displayedAvatar', displayedAvatar)

          return hasMatchingChat && (
            <div onClick={() => getInfoOnChats(displayedUsername, displayedAvatar)}>
            <div className="leftside-messages-users" style={{display: displayNoneChats}} key={chat.id}
              onClick={(event) => handleOpenChat(
                chat.chat_id, chat.username, chat.partner_username, 
                chat.user_id, chat.partner_user_id, chat.partner_user_avatar, chat.user_avatar,
                event)}
              >
              <div className="leftside-messages-users-avatar">
                <Avatar sx={{width: 50, height: 50}} alt={chat.partner_username} src={displayedAvatar}/>
              </div>
              <div className="leftside-messages-users-info">
                <div className="leftside-messages-users-info-username">
                  <h2 style={{width: '100%'}}>{displayedUsername}</h2>
                  <h2 style={{display: 'flex', width: '100%', justifyContent: 'right', color: '#939393', fontSize: '13px'}}>{formattedTime}</h2>
                </div>
                <div className="leftside-messages-users-info-message">
                  <h2 style={{color: '#939393', fontSize: '13px', width: '95%'}}>{lastMessage}</h2>
                </div>
              </div>
            </div>
            </div>
          );
        })}
        </div>
			<div style={{position: 'relative', display: 'flex', marginBlockStart: 'auto'}}>
                <div className="leftside-messages-create-chat-footer">
                <Button 
                  variant="contained" 
                  sx={{width: 150, height: 50, boxShadow: 2, borderRadius: '4px', ml: 1, display: displayNoneAddChat}} 
                  style={buttonStyleGetStarted} 
                  theme={themeGetStarted}
                  onClick={handleCreateChat}
                  // component={Link}
                  // to="/signup"
                  >
                  Create Chat
                </Button>
                <Button 
                  variant="contained" 
                  sx={{width: 80, height: 50, boxShadow: 2, borderRadius: '4px', ml: 1,
                   alignItems: 'center', display: displayNoneAddChat }} 
                  style={buttonStyleGetStarted} 
                  theme={themeGetStarted}
                  // component={Link}
                  // to="/signup"
                  onClick={() => setDisplayNoneAddChat('none') || setDisplayNoneChats('grid') || setSelectedUsers([])
                  || setLeftsideButton(plusImg)}
                  >
                  Cancel
                </Button>

                </div>
              </div>
      </div>
      
      <div className="rightside-wrapper">
        
      
         <div className="rightside-messages" style={{display: showRightside}}>
          <div className="rightside-messages-header">
            <div className="rightside-messages-header-user-info">
            <Link to={`/async/profile/${chatUsername}`}>
                <Avatar sx={{width: 40, height: 40}} alt={chatUsername} src={currentUserAvatar} />
            </Link>
              <a className="rightside-messages-header-user-info-a" href={`/async/profile/${chatUsername}`}>{getDisplayedUsernameRightside()}</a>
            </div>
            {/* {isVisible ? (
                <p>Not visible</p>
              ) : (
                <p>Visible</p>
              )} */}
            <div className="rightside-messages-header-info-buttons">
              <img src={infoImg} alt=""/>

            </div>

          </div>
          { chatCleared ? (
            <div className="rightside-messages-main" >
          {messagesData 
          .concat(chatMessages)
          .sort((a, b) => moment(b.date_message).valueOf() - moment(a.date_message).valueOf())
          .map((message, index, array) => {
          {/* setLastMessageWs(message.id) */}
          const nextMessageSender = index < array.length - 1 ? array[index + 1].message_sender : null;
          const isCurrentUser = dataUsername.id === message.message_sender;
          const showAvatar = message.message_sender !== nextMessageSender;
          const isWebSocketMessage = chatMessages.includes(message);
  
          const displayedAvatar = isCurrentUser ? dataUsername.avatar : currentUserAvatar;

          const whoIsAvatar = dataUsername.avatar === displayedAvatar ? dataUsername.username : chatUsername;
          const messageTime = new Date(message.date_message);
          const options = { hour: '2-digit', minute: '2-digit' };
          const formattedTime = messageTime.toLocaleTimeString([], options);

          // if (isVisible) {
          //   if (userId.id === message.message_sender) {
          //     console.log('not me')
          //   }
          //   else {
          //     console.log('not me')
          //   }
          // }

          return ( 
            
            <div className={`rightside-messages-main-message${isWebSocketMessage ? " webSocketMessage" : ""}`} key={message.id}
            >
              <div className="rightside-messages-main-avatar">
                {showAvatar && (
                  <Link to={`/async/profile/${whoIsAvatar}`}>
                    <Avatar
                      sx={{ width: 25, height: 25 }}
                      alt=""
                      src={displayedAvatar}
                    />
                  </Link>
                )}
              </div>
              <div className="rightside-messages-main-message-text" >
                <div className="rightside-messages-main-message-text-container">
                  <div className="message-content">
                    {/* <h2 ref={(el) => {
              if (el) {
                targetRefs.current.push(el);
              }
            }}>{isVisible ? message.text : 'null'}</h2> */}
                  <h2>{message.text}</h2>
                  </div>
                </div>
                  <div className="messageTime">
                    <h2>{formattedTime}</h2>
                  </div>
              </div>
            </div>
          );
        })}




            </div>
          ) : <span class="loader"></span>

          }
          
        
          <div className="rightside-messages-footer">
            <div className="rightside-messages-footer-wrapper">
              <div className="rightside-messages-footer-wrapper-upload-file">
                <img src={uploadImg} alt="" />
              </div>
              <div className="rightside-messages-footer-wrapper-textfield">
              {/* <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Recipient User ID"
            /> */}
              <ThemeProvider theme={theme}>
                <TextField
                  // noValidate
                  autoComplete="off"
                  id="outlined-basic"
                  maxRows={5}
                  minRows={1}
                  multiline
                  value={messageValue}
                  onChange={(event) => setMessageValue(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    handleSendMessage();
                  }}
                }
                  size="small"
                  label="Write a message"
                  variant="outlined"
                  InputLabelProps={{ style: { color: '#e0dfe7' } }}
                  InputProps={{ style: { color: '#e0dfe7', height: 'auto', maxHeight: 'auto', maxLines: 4 }, classes: { focused: 'focused-input',}, }}
                  sx={{...TextFieldStyles, mx: 'auto',
                  width: '100%', display: 'flex', mt: 2, mb: 2}}
                />
                <span></span>
              </ThemeProvider>
              </div>
              <div className="rightside-messages-footer-wrapper-group">
                { messageValue == '' &&
                  <img className="rightside-messages-footer-wrapper-group-audio-message" src={micImg} alt="" />
                }
                { messageValue != '' &&
                  <img className="rightside-messages-footer-wrapper-group-send-message" onClick={handleSendMessage} src={sendImg} alt="" />
                } 
              </div>
            </div>


          </div>
          </div>
          
        
        
      </div>
		</div>
    </motion.div>
    : null
    }
    <Snackbar open={errorSnackBar} autoHideDuration={6000} onClose={handleCloseSnack}>
      <Alert onClose={handleCloseSnack} severity="error" 
        sx={{ width: 'auto', backgroundColor: "#d32f2f", color: '#fff' }}>
        {errorSnackBarText}
      </Alert>
    </Snackbar>
		</>
)
}

export default Messages;










