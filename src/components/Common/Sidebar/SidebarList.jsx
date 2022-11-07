import React, { useState, Fragment } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
// constant
import { upperNavigation, lowerNavigation } from 'constants/sidebarItems';

// MUI Components
import { List, Grid } from '@mui/material';

// components
import SidebarItem from './SidebarItem';

import GlobalDrawer from 'components/Common/Drawer';
import GlobalPopper from 'components/Common/Popper';
import Notification from 'components/Notification';

// Pages
import Search from 'pages/Search';
import HelpCenter from 'pages/HelpCenter';

// styles
import { useStyles } from './styles';

import 'assets/global.css';

const SidebarList = ({ setIsModalOpen, count }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [activeNav, setActiveNav] = useState(null);
  const [isSearchActive, setSearchActive] = useState(false);
  const [isHelpCenterActive, setHelpCenterActive] = useState(false);
  const [isNotificationActive, setNotificationActive] = useState(false);
  const [drawerWidth, setDrawerWidth] = useState(null);

  const { data: user } = useSelector((state) => state.user);

  const onItemClick = (index) => (event) => {
    if (!user.first_login) {
      switch (index) {
        case 4:
          setHelpCenterActive(false);
          setSearchActive(false);
          //popover notification
          setAnchorEl(event.currentTarget);
          setTimeout(() => {
            setNotificationActive((prevOpen) => !prevOpen);
            activeNav !== 4 ? setActiveNav(index) : setActiveNav(null);
            clearTimeout();
          }, 500);
          break;
        case 5:
          setHelpCenterActive(false);
          setNotificationActive(false);
          //search
          setTimeout(() => {
            setDrawerWidth('calc(100%)');
            setSearchActive(!isSearchActive);
            activeNav !== 5 ? setActiveNav(index) : setActiveNav(null);
            clearTimeout();
          }, 500);
          break;
        case 6:
          setSearchActive(false);
          setNotificationActive(false);
          // help center
          setTimeout(() => {
            setDrawerWidth(600);
            setHelpCenterActive(!isHelpCenterActive);
            activeNav !== 6 ? setActiveNav(index) : setActiveNav(null);
            clearTimeout();
          }, 500);
          break;
        default:
          // add condition for non-static navigation
          handleClose();
          break;
      }
    }
  };

  const handleClose = () => {
    setHelpCenterActive(false);
    setSearchActive(false);
    setActiveNav(null);
    setNotificationActive(false);
  };

  return (
    <Fragment>
      {/* Navigations */}
      <List className={classes.list}>
        <Grid
          container
          direction="column"
          justifyContent="space-between"
          alignItems="center"
          className={classes.nav}
        >
          <Grid item className={classes.grid}>
            {upperNavigation.map((items, index) => (
              <SidebarItem
                {...items}
                key={index}
                onItemClick={() => onItemClick(items.index)}
                isFirstLogin={user.first_login}
              />
            ))}
          </Grid>

          <Grid item className={classes.grid}>
            {lowerNavigation.map((items, index) => (
              <SidebarItem
                {...items}
                key={index}
                activeNav={activeNav}
                index={items.index}
                onItemClick={() => onItemClick(items.index)}
                isFirstLogin={user.first_login}
                count={count}
              />
            ))}
          </Grid>
        </Grid>
      </List>
      {/* Drawers & popovers */}
      <GlobalDrawer
        content={<Search onClose={handleClose} />}
        name="search"
        width={drawerWidth}
        isOpen={isSearchActive}
        className={classes.drawer}
        anchor="left"
        BackdropProps={{ invisible: true }}
        hideBackdrop={false}
        onClose={handleClose}
        PaperProps={{ sx: { marginLeft: '50px' } }}
      />

      <GlobalDrawer
        content={
          <HelpCenter
            setIsModalOpen={setIsModalOpen}
            onSelect={handleClose}
            user={user?.admin_role}
          />
        }
        name="help-center"
        width={drawerWidth}
        isOpen={isHelpCenterActive}
        className={classes.drawer}
        anchor="left"
        BackdropProps={{ invisible: true }}
        hideBackdrop={false}
        onClose={handleClose}
        PaperProps={{ sx: { marginLeft: '50px' } }}
      />

      <GlobalPopper
        isOpen={isNotificationActive}
        anchorEl={anchorEl}
        placement="right-end"
        content={<Notification />}
        onClose={handleClose}
        className={classes.popper}
      />
    </Fragment>
  );
};

SidebarList.propTypes = {
  setIsModalOpen: PropTypes.func,
  count: PropTypes.any,
};

export default SidebarList;
