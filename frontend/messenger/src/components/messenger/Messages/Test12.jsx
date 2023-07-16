import { useEffect, useState } from "react";
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







function Test12() {
  const [userId, setUserId2] = useState(0);
  const [ws2, setWs2] = useState(null);
  const [chatMessages2, setChatMessages2] = useState([]);
  const [recipient2, setRecipient2] = useState('');
  const [message2, setMessage2] = useState('');


  useEffect(() => {
  
  
      const newUserId = generateUserId();
      setUserId2(newUserId);
  
      const newWs = new WebSocket(`ws://localhost:8000/ws/${newUserId}`);
      setWs2(newWs);
      console.log("WWWWWWWWW",newWs);
  
      newWs.onopen = () => {
        console.log("WebSocket connected");
      };
  
      newWs.onmessage = (event) => {
        const receivedMessage = event.data;
        setChatMessages2(prevMessages => [...prevMessages, receivedMessage]);
        console.log('chatMessages:', chatMessages2)
        
      };
  
      newWs.onclose = () => {
        console.log("WebSocket disconnected");
        setWs2(null);
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
      if (ws2) {
        ws2.send(`${recipient2}:${message2}`);
      }
    };
  
    const createRoom = () => {
      // Ваша логика для создания комнаты
      // Например, отправка запроса на сервер
      console.log('Create room');
    };
	return (
		<>
		<div>
        <h1>Chat</h1>
        <div>
          <button onClick={createRoom}>Create Room</button>
        </div>
        <div id="chat">
          {chatMessages2.map((message2, index) => (
            <p key={index}>{message2}</p>
          ))}
        </div>
        <div>
          <input
            type="text"
            value={recipient2}
            onChange={(e) => setRecipient2(e.target.value)}
            placeholder="Recipient User ID"
          />
          <input
            type="text"
            value={message2}
            onChange={(e) => setMessage2(e.target.value)}
            placeholder="Message"
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>

		</>
	)
}


export default Test12