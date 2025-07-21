import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Outlet } from 'react-router-dom';
import SideBar from '../common/SideBar';
import { useAppContext } from '../../context/AppContext';
import { collection, getDocs } from 'firebase/firestore';
import { Transaction } from '../../types';
import { db } from '../../firebase';
import { isFireStoreError } from '../../utils/errorHandling';

const drawerWidth = 240;

export default function AppLayout() {
  
  const {setTransactions,setIsLoading} = useAppContext();


    React.useEffect(() => {
      const fetchTransactions = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, 'Transactions'));
          console.log('取得件数:', querySnapshot.size);
  
          if (querySnapshot.empty) {
            console.warn('⚠ Firestoreにデータは存在しますが、クエリ結果は0件です。');
          }
  
          querySnapshot.forEach((doc) => {
            console.log('📄 ドキュメントID:', doc.id);
            console.log('📦 データ内容:', doc.data());
          });
  
          const transactionsData = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              ...data,
              id: doc.id,
            } as Transaction;
          });
  
          setTransactions(transactionsData);
        } catch (error) {
          if (isFireStoreError(error)) {
            console.error('🔥 Firestoreエラー:', error.message);
          } else {
            console.error('🛑 一般的なエラー:', error);
          }
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchTransactions();
    }, []);

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
            Responsive drawer
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
