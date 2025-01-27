import 'src/global.css';

import axios from 'axios';
import { useState, useEffect } from 'react';

import { Router } from 'src/routes/sections';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import { ThemeProvider } from 'src/theme/theme-provider';

// ----------------------------------------------------------------------

export default function App() {
  const [user, setUser] = useState<any>();

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
