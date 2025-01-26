import 'src/global.css';

import Fab from '@mui/material/Fab';

import { Router } from 'src/routes/sections';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import { ThemeProvider } from 'src/theme/theme-provider';

import { useState, useEffect } from 'react';

import axios from 'axios';

// ----------------------------------------------------------------------

export default function App() {
  const [user, setUser] = useState<any>();
  let url = 'ws://127.0.0.1:8000/ws/socket-server/';

  const chatSocket = new WebSocket(url);

  chatSocket.onopen = () => {
    console.log('WebSocket connection established');
  };

  chatSocket.onclose = (e) => {
    console.log(`WebSocket closed: ${e.code}`);
  };

  chatSocket.onerror = (e) => {
    console.log('WebSocket error: ', e);
  };

  chatSocket.onmessage = (e) => {
    let data = JSON.parse(e.data);
    console.log(data);
  };

  const getUser = async () => {
    try {
      const response = await axios.get('/api/v1/user');
      setUser(response);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!user) {
      getUser();
    }
  }, [user]);

  useScrollToTop();

  return (
    <ThemeProvider>
      <Router />
    </ThemeProvider>
  );
}
