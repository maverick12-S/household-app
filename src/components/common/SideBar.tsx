import { Box, Collapse, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import React, { CSSProperties } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import BarChartIcon from '@mui/icons-material/BarChart';
import { NavLink } from 'react-router-dom';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { accountManagement,logout } from '../../auth/keycloak';

interface SideBarProps  {
  drawerWidth: number;
  mobileOpen: boolean;
  handleDrawerClose: () => void;
  handleDrawerTransitionEnd: () => void;
};

interface menuItem {
    text: string,
    path: string,
    icon: React.ComponentType
}

const baseLinkStyle :CSSProperties = {
    textDecoration: "none",
    color: "inherit",
    display: "block",
} 

const activeLinkStyle: CSSProperties = {
    backgroundColor: "rgba(0,0,0,0.08)"
    
}

const SideBar = ({
  drawerWidth,
  mobileOpen,
  handleDrawerClose,
  handleDrawerTransitionEnd
}: SideBarProps) => {
    const [optionOpenMenu, setOptionOpenMenu] = React.useState(false);

    const MenuItems: menuItem[] = [
        {text: "HOME", path: "/", icon: HomeIcon},
        {text: "Report", path: "/report", icon: BarChartIcon}
    ] 
    const handleOptionToggle = () => {
        setOptionOpenMenu(prev => !prev);
      }
      const handleLogout = () => {
        logout();
      }

    const drawer = (
        <Box display="flex" flexDirection="column" height="100%">
          <Box flex="1 1 auto">
          <Toolbar />
          <Divider />
          <List>
            {MenuItems.map((item, index) => (
            <NavLink key={item.text} to={item.path} style={({isActive}) => {
                return {
                    ...baseLinkStyle,
                    ...(isActive ? activeLinkStyle : {})
                }
            }}>
              <ListItem key={index} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                     <item.icon />
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
              </NavLink>
            ))}
          </List>
            </Box>
            <Box>
            <List>
              <Collapse in={optionOpenMenu} timeout="auto" unmountOnExit>
                <List component="div" disablePadding sx={{ pl:4 }}>
                  <ListItemButton onClick={handleLogout}>
                    <ListItemIcon>
                    <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText primary="ログアウト"/>
                  </ListItemButton>

                  <ListItemButton onClick={accountManagement}>
                    <ListItemIcon>
                    <AccountCircleIcon />
                    </ListItemIcon>
                    <ListItemText primary="アカウント管理"/>
                  </ListItemButton>
                </List>
              </Collapse>
              <ListItem disablePadding>
                <ListItemButton onClick={handleOptionToggle}>
                  <ListItemIcon>
                    <SettingsIcon/>
                  </ListItemIcon>
                  <ListItemText primary="オプション"/>
                  </ListItemButton>
              </ListItem>
          </List>
        </Box>
        </Box>
          
      );
      
      // const handlePasswordChange = () => {
      //   window.location.href = `${keycloak.createAccountUrl({ action: 'UPDATE_PASSWORD'})}`;
      // }
      
  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      aria-label="mailbox folders"
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onTransitionEnd={handleDrawerTransitionEnd}
        onClose={handleDrawerClose}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
      >
        {drawer}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>

      
    </Box>
  );
};

export default SideBar;
