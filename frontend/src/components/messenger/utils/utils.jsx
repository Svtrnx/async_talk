import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, TextField, Button, Box, Typography, Menu, MenuItem, Tooltip,
   Avatar, Badge, IconButton, styled, Alert} from "@mui/material"
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Snackbar from '@mui/material/Snackbar';

// Field Text settings
export const styles = {
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

export const TextFieldStyles = {
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
export const theme = createTheme({
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

export const searchTheme = createTheme({
  typography: {
      fontFamily: 'Montserrat',
      fontSize: 11,
  },
  });

export const themeGetStarted = createTheme({
  typography: {
    fontFamily: 'Montserrat',
    fontSize: 13,
    fontWeightBold: 300
  },
  });

export const buttonStyleGetStarted = {
  backgroundColor: '#333438',
  color: '#e0dfe7',
};

export const otpTheme = createTheme({
		typography: {
			fontFamily: 'Montserrat',
			fontSize: 30,
		},
});

export const buttonStyle = {
		backgroundColor: '#673EC2',
		color: '#e0dfe7',
};
	  
export const buttonStyleUploadImg = {
		borderColor: '#5d38b1',
		color: '#e0dfe7'
};

export const StyledMenu = styled(Menu)(({ theme }) => ({
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

export const buttonStyle3 = {
	borderColor: '#5d38b1',
	color: '#e0dfe7'
  };
export const buttonStyle2 = {
	backgroundColor: 'rgb(51, 52, 56)',
	color: '#e0dfe7'
  };