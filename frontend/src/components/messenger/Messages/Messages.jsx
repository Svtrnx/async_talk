import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, TextField, Button, Box, Typography, Menu, MenuItem, Tooltip, Avatar, Badge, IconButton, styled} from "@mui/material"
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
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
// import { makeStyles } from '@mui/styles';
import axios from "axios";
import { Image } from '@cloudinary/react';

import './Messages.css';
// import { display } from "@mui/system";

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

// const CSSTextField = withStyles(styles)(TextField);


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

const themeGetStarted = createTheme({
  typography: {
    fontFamily: 'Montserrat',
    fontSize: 13,
    fontWeightBold: 300
  },
  });

const buttonStyleGetStarted = {
  backgroundColor: '#333438',
  color: '#e0dfe7',
};
  
// export const cloudinary = new Cloudinary({
//   cloud: {
//     cloudName: 'dlwuhl9ez',
//   },
// });


function Messages() {
  const moment = require('moment');

  const [userId, setUserId] = useState(0);
  const [websocketUserId, setWebsocketUserId] = useState(0);
  const [ws, setWs] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [messageValue, setMessageValue] = useState('');
  const [chatsDialogUsername, setChatsDialogUsername] = useState('');
  const [username, setUsername] = useState('');
  const [user_Id, setUser_Id] = useState(0);
  const [chatId, setChatId] = useState(0);
  const [userMessageId, setUserMessageId] = useState(0);
  const [partnerUsername, setPartnerUsername] = useState(0);
  const [partnerUserId, setPartnerUserId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [dataUsername, setDataUsername] = useState([]);
  const [displayNoneAddChat, setDisplayNoneAddChat] = useState('none');
  const [displayNoneChats, setDisplayNoneChats] = useState('grid');
  const [leftsideButton, setLeftsideButton] = useState(plusImg);
  const [leftsideButtonChat, setLeftsideButtonChat] = useState(doneImg);
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
  const [sortedMessages, setSortedMessages] = useState([]);
  const [isClearingChat, setIsClearingChat] = useState(false);
  const [chatCleared, setChatCleared] = useState(false); // Изначально считаем, что чат очищен





  async function clearChatFunction() {
    setChatMessages([]);
  }




  useEffect(() => {
    console.log('userAvatarChat:---', chats);

  }, [])

  useEffect(() => {
    // Замените на свой public_id и cloud_name
    const publicId = '825156941529614';
    const cloudName = 'dlwuhl9ez';

    const imageUrl = `https://res.cloudinary.com/dlwuhl9ez/image/upload/v1692995033/samples/woman-on-a-football-field.jpg`;
    const imageUrl2 = `https://res.cloudinary.com/dlwuhl9ez/image/upload/v1692995029/samples/outdoor-woman.jpg`;
    setImageUrl(imageUrl);
    setImageUrl2(imageUrl2);
  }, []);
  

  
  // console.log("USERNANNNNNNNNNNNNNNNNNNNNN:", dataUsername.avatar )

  useEffect(() => {
    const newUserId = generateUserId();
    setUserId(newUserId);
  
    if (chatId && dataUsername.username) {
      // Проверяем, есть ли уже открытое соединение для данного chatId
      if (!ws) {
        const newWs = new WebSocket(`wss://asynctalk-production.up.railway.app/ws/${chatId}/${dataUsername.username}`);
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
          const timestamp = new Date(); // Текущая временная метка
          const websocketMessage = {
            text: receivedMessage,
            date_message: timestamp.toISOString(), // Преобразование времени в формат ISO строки
            message_sender: chatUsername, // Предполагается, что отправитель - текущий пользователь
            current_user_id: userId, // Предполагается, что userId - это идентификатор пользователя
          };
          setChatMessages(prevMessages => [...prevMessages, websocketMessage]);
        };
  
        newWs.onclose = () => {
          console.log("WebSocket disconnected");
          setWs(null);
        };
      }
  
      // Закрытие соединения при размонтировании компонента
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
    // Ваша логика для создания комнаты
    // Например, отправка запроса на сервер
    console.log('Create room');
  };
  
  
  const handleSendMessage = () => {
    if (messageValue) {
      if (messageValue.trim() !== '') { // Проверяем, что сообщение не пустое после удаления лишних пробелов
        
      
      // Отправка сообщения или выполнение другой логики
      console.log('Отправлено сообщение:', messageValue);

      async function sendMessage() {
        try {
          const response = await axios.post("https://asynctalk-production.up.railway.app/api/messages/send_message", {
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
      


      // Очистка поля ввода
      setMessageValue('');
    }
    }
  };


  

  // USE EFFECT FOR CHATS QUERY
  useEffect(() => {

      // Устанавливаем глобально credentials для axios
  axios.defaults.withCredentials = true;

  const fetchData = async () => {
    try {
      const response = await axios.get('https://asynctalk-production.up.railway.app/api/check_verification', {
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
    await axios.get('https://asynctalk-production.up.railway.app/api/messages/users_list', {
      withCredentials: true,
    })
    .then(response => {
      const users = response.data;
      console.log(users.users);
      setUsers(users.users)
    })
    .catch(error => {
      console.error(error);
      });
    }
    fetchUsers();

    const fetchChats = async () => {
      try {
        const response = await axios.get('https://asynctalk-production.up.railway.app/api/messages/chats_list', {
          withCredentials: true,
        })
        .then(response => {
          const chatsData = response.data[0].chats;
          setChats(chatsData);
          console.log(chatsData);
        })
      } catch (error) {
        console.error(error);
      }
    };
    
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


//   useEffect(() => {
//   async function sortAndProcessMessages() {
//     const sortedMessages = await Promise.all(
//       messagesData
//         .concat(chatMessages)
//         .sort((a, b) => moment(b.date_message).valueOf() - moment(a.date_message).valueOf())
//         .map((message, index, array) => {
//           const nextMessageSender = index < array.length - 1 ? array[index + 1].message_sender : null;
//           const isCurrentUser = dataUsername.id === message.message_sender;
//           const showAvatar = message.message_sender !== nextMessageSender;
//           const isWebSocketMessage = chatMessages.includes(message);
  
//           const displayedAvatar = isCurrentUser ? dataUsername.avatar : currentUserAvatar;
  
//           return (
//             <div className={`rightside-messages-main-message${isWebSocketMessage ? " webSocketMessage" : ""}`} key={message.id}>
//               <div className="rightside-messages-main-avatar">
//                 {showAvatar && (
//                   <Avatar
//                     sx={{ width: 25, height: 25 }}
//                     alt=""
//                     src={displayedAvatar}
//                   />
//                 )}
//               </div>
//               <div className="rightside-messages-main-message-text">
//                 <div className="rightside-messages-main-message-text-container">
//                   <h2>
//                     {message.text}
//                   </h2>
//                 </div>
//               </div>
//             </div>
//           );
//         })
//     );

//     setSortedMessages(sortedMessages);
//   }

//   sortAndProcessMessages();
// }, [messagesData, chatMessages]);



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
      setSelectedUsers([userId]); // Показываем только выбранного пользователя
    } else {
      setSelectedUsers([userId]); // Показываем только выбранного пользователя
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
      // Очистка успешно завершена, теперь можно открыть чат
      
    } catch (error) {
      // Обработка ошибок очистки чата, если необходимо
      console.error("Error clearing chat:", error);
      setIsClearingChat(false); // Возвращаем обратно, чтобы можно было попробовать снова
    }
  
    try {
      const response = await axios.get(`https://asynctalk-production.up.railway.app/api/messages/messages_list/${chat_Id}`, {
        withCredentials: true,
      });
  
      console.log(response.data);
      setMessagesData(response.data.messages);
      console.log(messagesData.text);
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
      const requestData = {
        partner_user_id: user_Id,
        partner_username: username,
        partner_user_avatar: userAvatarChat
      };
      const response = await axios.post(
        'https://asynctalk-production.up.railway.app/api/messages/create_chat/',
        requestData,
        {
          withCredentials: true,
          headers: {'Content-Type': 'application/json'}
        }
      );
    
      console.log(response.data);
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

  function getDisplayedAvatar(chat, dataAvatarChats) {
    if (dataAvatarChats === chat.user_avatar) {
      return chat.partner_user_avatar;
    } else if (dataAvatarChats === chat.partner_user_avatar) {
      return chat.user_avatar;
    } else {
      return '...';
    }
  }

  function getInfoOnChats(username, avatar) {
    console.log("CHSSSSSSSS:", username);
    setChatUsername(username);
    setCurrentUserAvatar(avatar);
  }


  useEffect(() => {
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!CHSSSSSSSS:", chatUsername);
  }, [chatUsername])






  
	return (
    
		<>
		<div className="messages">
			<div className="leftside-messages">
				<div className="leftside-messages-info">
				  <div className="leftside-messages-info-search">
            <img className="leftside-messages-info-search-searchImg" src={searchImg} alt="" />
            <input type="text" placeholder="Search people" />
            </div>
            <img className="leftside-messages-info-search-plusImg" src={leftsideButton} alt="" onClick={handleFindUsers}/>
				  </div>
          <div style={{display: displayNoneAddChat, overflow: 'auto'}}>
            <div className="leftside-messages-header-text">
              <h2 className="leftside-messages-header-text-h2">Create Chat</h2>
            </div>
              { users.map(user => (
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

          
          {chats.map(chat => {
          const hasMatchingChat = chats.some(chatItem => (
            chatItem.user_id === dataUsername.id ||
            chatItem.partner_user_id === dataUsername.id 
          ));
          const displayedUsername = getDisplayedUsername(chat, dataUsername.username);
          const displayedAvatar = getDisplayedAvatar(chat, dataUsername.avatar);
          

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
                  <h2>{displayedUsername}</h2>
                </div>
                <div className="leftside-messages-users-info-message">
                  <h2>Привет, как дела?</h2>
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
                  sx={{width: 150, height: 50, boxShadow: 2, borderRadius: '4px', ml: 1 }} 
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
                  sx={{width: 80, height: 50, boxShadow: 2, borderRadius: '4px', ml: 1, alignItems: 'center' }} 
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
              <Avatar sx={{width: 40, height: 40}} alt={chatUsername} src={currentUserAvatar} />
              <h2>{partnerUsername}</h2>
            </div>
            <div className="rightside-messages-header-info-buttons">
              <img src={infoImg} alt=""/>

            </div>

          </div>
           
          { chatCleared ? (
            <div className="rightside-messages-main"> {/* Это div где появляются сообщения */} 
            
            {messagesData
        .concat(chatMessages)
        .sort((a, b) => moment(b.date_message).valueOf() - moment(a.date_message).valueOf())
        .map((message, index, array) => {
          const nextMessageSender = index < array.length - 1 ? array[index + 1].message_sender : null;
          const isCurrentUser = dataUsername.id === message.message_sender;
          const showAvatar = message.message_sender !== nextMessageSender;
          const isWebSocketMessage = chatMessages.includes(message);
  
          const displayedAvatar = isCurrentUser ? dataUsername.avatar : currentUserAvatar;
  
          return (
            <div className={`rightside-messages-main-message${isWebSocketMessage ? " webSocketMessage" : ""}`} key={message.id}>
              <div className="rightside-messages-main-avatar">
                {showAvatar && (
                  <Avatar
                    sx={{ width: 25, height: 25 }}
                    alt=""
                    src={displayedAvatar}
                  />
                )}
              </div>
              <div className="rightside-messages-main-message-text">
                <div className="rightside-messages-main-message-text-container">
                  <h2>
                    {message.text}
                  </h2>
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
                    event.preventDefault(); // Предотвращаем перенос строки
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
		
		</>
)
}

export default Messages;










