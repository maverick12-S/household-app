import { Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import React, { CSSProperties } from 'react';
import MailIcon from '@mui/icons-material/Mail';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import HomeIcon from '@mui/icons-material/Home';
import BarChartIcon from '@mui/icons-material/BarChart';
import { NavLink } from 'react-router-dom';
import { red } from '@mui/material/colors';

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
    const MenuItems: menuItem[] = [
        {text: "HOME", path: "/", icon: HomeIcon},
        {text: "Report", path: "/report", icon: BarChartIcon}
    ]

    const drawer = (
        <div>
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
                    {/* {index % 2 === 0 ? <InboxIcon
                     /> : <MailIcon />} */}

                     <item.icon />
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
              </NavLink>
            ))}

          </List>
          
        </div>
      );
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
