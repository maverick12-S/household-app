import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';

import IconButton from '@mui/material/IconButton';

import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Outlet } from 'react-router-dom';
import SideBar from '../common/SideBar';
import { useAppContext } from '../../context/AppContext';
import { fetchTransactionFormServer} from '../../api/transactionApi';

import { getUserEmail } from '../../auth/keycloak';
import { registerEmailNotification } from '../../api/notifications';


const drawerWidth = 240;

export default function AppLayout() {
  
  const {setTransactions,setIsLoading,accessToken,setError} = useAppContext();


    React.useEffect(() => {
      const token = accessToken;
      const email = getUserEmail();
      const fetchTransactions = async () => {
        try {
          const transactionsData = await fetchTransactionFormServer(token);

          const transactionsWithId = transactionsData.map((t: any, idx: number) => ({
            id: t.id ?? `${t.date}-${t.type}-${t.amount}-${idx}`,
            ...t,
          }));
          setTransactions(transactionsWithId);
          registerEmailNotification(token,email);
        } catch (error : any) {
          setError(error.message);
        }finally{
          setIsLoading(false);
        }
      }
      
      fetchTransactions();
    }, [accessToken]);

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  

  return (
    <Box sx={{ display: { md: "flex"}, bgcolor: (theme) => theme.palette.grey[100], minHeight: "100vh" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            家計簿アプリ
          </Typography>
        </Toolbar>
      </AppBar>

      <SideBar
        drawerWidth={drawerWidth}
        mobileOpen={mobileOpen}
        handleDrawerClose={handleDrawerClose}
        handleDrawerTransitionEnd={handleDrawerTransitionEnd}
      />

      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
