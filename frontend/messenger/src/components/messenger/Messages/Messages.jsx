import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, TextField, Button, Box, Typography, Menu, MenuItem, Tooltip, Avatar, Badge, IconButton, styled} from "@mui/material"
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import { withStyles } from "@mui/styles";
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
import { makeStyles } from '@mui/styles';
import axios from "axios";

import './Messages.css';
import { display } from "@mui/system";

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
  

function Messages() {

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
  const [displayNone, setDisplayNone] = useState('none');
  const [displayNoneChats, setDisplayNoneChats] = useState('grid');
  // const [displayNone2, setDisplayNone2] = useState('grid');
  const [leftsideButton, setLeftsideButton] = useState(plusImg);
  const [leftsideButtonChat, setLeftsideButtonChat] = useState(doneImg);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showRightsideChat, setShowRightsideChat] = useState(false);
  const [messagesData, setMessagesData] = useState([]);
  const [shouldHideBefore , setShouldHideBefore ] = useState(false);
  const [newWs, setNewWs] = useState(null);
  const [showRightside, setShowRightside] = useState('none')
  const [chatUsername, setChatUsername] = useState('')



  useEffect(() => {
    const newUserId = generateUserId();
    setUserId(newUserId);

    const newWs = new WebSocket(`ws://localhost:8000/ws/${username}`);
    setWs(newWs);
    console.log("WWWWWWWWW",username);

    newWs.onopen = () => {
      console.log("WebSocket connected");
    };

    newWs.onmessage = (event) => {
      const receivedMessage = event.data;
      setChatMessages(prevMessages => [...prevMessages, receivedMessage]);
    };

    newWs.onclose = () => {
      console.log("WebSocket disconnected");
      setWs(null);
    };

    // Закрытие соединения при размонтировании компонента
    return () => {
      newWs.close();
    };
  }, []);

  const generateUserId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  const sendMessage = () => {
    if (ws) {
      console.log("RESCIPIENT:", recipient)
      console.log("MESSAGE:", messageValue)
      ws.send(`${chatUsername}:${message}`);
      console.log("partnerUSERNAME:", chatUsername)
      setMessage('');
    }
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
      sendMessage()
      // Отправка сообщения или выполнение другой логики
      console.log('Отправлено сообщение:', messageValue);

      async function sendMessage() {
        try {
          const response = await axios.post("http://localhost:8000/api/messages/send_message", {
            text: messageValue,
            chat_id: chatId,
            message_sender:  userId.id,
            current_user_id: currentUserId,
            partner_user_id: partnerUserId,
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
      
      if (ws) {
        ws.send(`${partnerUsername}:${messageValue}`);
      }


      // Очистка поля ввода
      setMessageValue('');
    }
  };


  // USE EFFECT FOR CHATS QUERY
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/check_verification', {
          withCredentials: true,
        });
        setDataUsername(response.data.user)
        setUserId(response.data.user)

      } catch (error) {
        console.error(error);
      }
    };
  
    fetchData();

    const fetchUsers = async () => {
    await axios.get('http://localhost:8000/api/messages/users_list', {
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
        const response = await axios.get('http://localhost:8000/api/messages/chats_list', {
          withCredentials: true,
        })
        .then(response => {
          const chatsData = response.data[0].chats;
          setChats(chatsData);
          console.log(chatsData); // Проверьте содержимое response.data.chats
        })
      } catch (error) {
        console.error(error);
      }
    };
    
    // Вызовите функцию fetchChats для получения списка чатов при монтировании компонента или в нужном месте в коде.
    fetchChats();
    
    }, []);

  function handleFindUsers() {
    if (displayNone === 'none') {
      setDisplayNone('');
      setLeftsideButton(closeImg)
    } else {
      setDisplayNone('none');
      setLeftsideButton(plusImg)
    }
    
    if (displayNoneChats === 'grid') {
      setDisplayNoneChats('none');
    } else {
      setDisplayNoneChats('grid');
    }
  }


  // console.log('CHATS: ', chats)

  const handleUserClickCreateChat = (userId, username, event) => {
    const isSelected = selectedUsers.includes(userId);
    setUser_Id(userId);
    setUsername(username);
    console.log(user_Id, username);

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

  const handleOpenChat = async (chat_Id, username, partner_Username, user_id, partner_user_id, event) => {
    setShowRightside('')
    setChatId(chat_Id);
    setUsername(username);
    setPartnerUsername(partner_Username);
    setPartnerUserId(partner_user_id);
    setCurrentUserId(user_id);
  
    try {
      const response = await axios.get(`http://localhost:8000/api/messages/messages_list/${chat_Id}`, {
        withCredentials: true,
      });
  
      console.log(response.data);
      setMessagesData(response.data.messages);
      console.log(messagesData.text);
      setShowRightsideChat(true);
    } catch (error) {
      console.log(error);
    }

    const generateUserId = () => {
      return Math.random().toString(36).substr(2, 9);
    };

    const newUserId = generateUserId();
    setWebsocketUserId(dataUsername.username);
    console.log('WebsocketUserId:', websocketUserId);


    const newWs = new WebSocket(`ws://localhost:8000/ws/${dataUsername.username}`);
    setWs(newWs);
    console.log('WEBSOCKET USERNAME:', newWs);

    newWs.onopen = () => {
      console.log("WebSocket connected");
    };

    newWs.onmessage = (event) => {
      const receivedMessage = event.data;
      setChatMessages(prevMessages => [...prevMessages, receivedMessage]);
    };

    newWs.onclose = () => {
      console.log("WebSocket disconnected");
      setWs(null);
    };

    // Закрытие соединения при размонтировании компонента
    return () => {
      newWs.close();
    };



    // const newWs = new WebSocket(`ws://localhost:8000/ws/${partner_Username}`);
    // setNewWs(newWs);

    // newWs.onopen = () => {
    //   console.log("WebSocket connected");
    // };

    // newWs.onmessage = (event) => {
    //   const receivedMessage = event.data;
    //   // setChatMessages(prevMessages => [...prevMessages, receivedMessage]);
    //   console.log("Received message:", receivedMessage);
    //   // Обработка полученного сообщения
    // };

    // newWs.onclose = () => {
    //   console.log("WebSocket disconnected");
    //   setWs(null);
    // };

    // // Закрытие соединения при размонтировании компонента
    // return () => {
    //   newWs.close();
    // };


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
		  const response = await axios.post(`http://localhost:8000/api/messages/create_chat/${user_Id}/${username}`, {
		  	}, {
			withCredentials: true,
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		  	});
		  	console.log(response.data);
		} catch (error) {
		  console.log("ERROR:", error);
		}
  }

  function getDisplayedUsername(chat, dataUsernameChats) {
    if (dataUsernameChats === chat.username) {
      return chat.partner_username;
    } else {
      return chat.username;
    }
  }

  function getUsernameOnChats(username) {
    console.log("CHSSSSSSSS:", username);
    setChatUsername(username);
  }


  useEffect(() => {
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!CHSSSSSSSS:", chatUsername);
  }, [chatUsername])

  // console.log(chats.partner_username)

  // const hasMatchingValues = chats.some(
  //     // chats.map(chat => (
  //     item => item.username === dataUsername.username && item.partner_username === 'zzzzzzzzzz'
  //   // )
  // );
	return (
		<>
    {/*  */}
      {/* <div>
        <h1>Chat</h1>
        <div>
          <button onClick={createRoom}>Create Room</button>
        </div>
        <div id="chat">
          {chatMessages.map((message, index) => (
            <p key={index}>{message}</p>
          ))}
        </div>
        <div>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Recipient User ID"
          />
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message"
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div> */}
      {/*  */}
		<div className="messages">
			<div className="leftside-messages">
				<div className="leftside-messages-info">
				  <div className="leftside-messages-info-search">
            <img className="leftside-messages-info-search-searchImg" src={searchImg} alt="" />
            <input type="text" placeholder="Search people" />
            </div>
            <img className="leftside-messages-info-search-plusImg" src={leftsideButton} alt="" onClick={handleFindUsers}/>
				  </div>
          <div style={{display: displayNone}}>
            <div className="leftside-messages-header-text">
              <h2 className="leftside-messages-header-text-h2">Create Chat</h2>
            </div>
              { users.map(user => (
                    <div
                      className={`leftside-messages-create-chat-users ${selectedUsers.includes(user.id) ? 'selected' : ''}`}
                      key={user.id}
                      onClick={(event) => handleUserClickCreateChat(user.id, user.username, event)}
                    >
                      <div className="leftside-messages-create-chat-users-avatar">
                        <Avatar sx={{width: 42, height: 42, ml: 1}} alt="Remy Sharp" src="..." />
                      </div>
                      <div className="leftside-messages-create-chat-users-fullname">
                        <h2>{user.first_name}</h2>
                        <h2>{user.last_name}</h2>
                      </div>
                      <img className="leftside-messages-create-chat-users-img" src={isUserSelected(user.id) ? close2Img : doneImg} alt="" />
                    </div>
              ))}
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
                onClick={() => setDisplayNone('none') || setDisplayNoneChats('grid') || setLeftsideButton(plusImg)}
								>
								Cancel
							</Button>

              </div>
          </div>
          {chats.map(chat => {
          const hasMatchingChat = chats.some(chatItem => (
            chatItem.user_id === dataUsername.id ||
            chatItem.partner_user_id === dataUsername.id 
          ));
          const displayedUsername = getDisplayedUsername(chat, dataUsername.username);
          

          return hasMatchingChat && (
            <div className="leftside-messages-users" style={{display: displayNoneChats}} key={chat.id}
              onClick={(event) => handleOpenChat(
                chat.chat_id, chat.username, chat.partner_username, 
                chat.user_id, chat.partner_user_id, event)}
              >
              <div className="leftside-messages-users-avatar">
                <Avatar sx={{width: 50, height: 50}} alt="Remy Sharp" src="..." />
              </div>
              <div className="leftside-messages-users-info">
                <div className="leftside-messages-users-info-username">
                  <h2 onClick={() => getUsernameOnChats(displayedUsername)}>{displayedUsername}</h2>
                </div>
                <div className="leftside-messages-users-info-message">
                  <h2>Привет, как дела?</h2>
                </div>
              </div>
            </div>
          );
        })}
			</div>
      <div className="rightside-wrapper">
        <div className="rightside-messages" style={{display: showRightside}}>
          <div className="rightside-messages-header">
            <div className="rightside-messages-header-user-info">
              <Avatar sx={{width: 40, height: 40}} alt="" src="..." />
              <h2>{partnerUsername}</h2>
            </div>
            <div className="rightside-messages-header-info-buttons">
              <img src={infoImg} alt=""/>

            </div>

          </div>
          {/* LAST 28.06.23 */}
          {/* DISABLE BEFORE */}
          {showRightsideChat === true ? (
            <div className="rightside-messages-main"> {/* Это div где появляются сообщения */} 
            {/*            
            {chatMessages.slice().reverse().map((message, index) => (
              <div className="rightside-messages-main-message" key={index}>
                <div className="rightside-messages-main-avatar">
                  {message.message_sender === message.current_user_id ? (
                    <Avatar sx={{ width: 25, height: 25 }} alt="Pula" src="avatar" />
                  ) : (
                    <Avatar sx={{ width: 25, height: 25 }} alt="Pula" src="avatar" />
                  )} 
                </div>
                <div className="rightside-messages-main-message-text">
                  <div className="rightside-messages-main-message-text-container">
                    <h2>{message}</h2>
                  </div>
                </div>
              </div>
            ))}
          */}
          <>
		<div>
        <h1>Chat</h1>
        <div>
          <button onClick={createRoom}>Create Room</button>
        </div>
        <div id="chat">
          {chatMessages.map((message, index) => (
            <p key={index}>{message}</p>
          ))}
        </div>
        <div>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Recipient User ID"
          />
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message"
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>

		</>

{messagesData
  .concat(chatMessages) // Объединяем оба массива сообщений
  .sort((a, b) => new Date(b.date_message) - new Date(a.date_message))
  .map((message, index, array) => {
    const lastMessageSender = index > 0 ? array[index - 1].message_sender : null;
    const isCurrentUser = message.current_user_id === message.message_sender;
    const showAvatar = index === 0 || message.message_sender !== lastMessageSender;

    return (
      <div className="rightside-messages-main-message" key={message.id}>
        <div className="rightside-messages-main-avatar">
          {showAvatar && (
            <Avatar
              sx={{ width: 25, height: 25 }}
              alt={isCurrentUser ? "Pula" : "Rula"}
              src="avatar"
            />
          )}
        </div>
        <div className="rightside-messages-main-message-text">
          <div className="rightside-messages-main-message-text-container">
            <h2>{message.text}</h2>
          </div>
        </div>
      </div>
    );
  })}




            </div>
          ) : 
          <div>
            {/* WRITE AN MESSAGE */}
            WRITE AN MESSAGE
          </div>
        
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
                  size="small"
                  label="Write a message"
                  variant="outlined"
                  InputLabelProps={{ style: { color: '#e0dfe7' } }}
                  InputProps={{ style: { color: '#e0dfe7', height: 'auto', maxHeight: 'auto', maxLines: 4 }, classes: { focused: 'focused-input',}, }}
                  sx={{ mx: 'auto', width: '100%', display: 'flex', mt: 2, mb: 2 }}
                />
                <span></span>
              </ThemeProvider>
              </div>
              {/* <div className="rightside-messages-footer-wrapper-upload-picture">
                <img src={picturesImg} alt="" />
              </div> */}
              <div className="rightside-messages-footer-wrapper-group">
                { messageValue == '' &&
                  <img className="rightside-messages-footer-wrapper-group-audio-message" src={micImg} alt="" />
                }
                { messageValue != '' &&
                  <img className="rightside-messages-footer-wrapper-group-send-message" onClick={sendMessage} src={sendImg} alt="" />
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










