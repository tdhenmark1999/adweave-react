import React from 'react';

import _ from 'lodash';

import PropTypes from 'prop-types';

import {
  AppBar,
  Box,
  Stack,
  TextField,
  Avatar,
  IconButton,
  styled,
  Typography,
} from '@mui/material';

import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

import logo from 'assets/adLibLogo.svg';

const Header = ({ user, handleClick }) => {
  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: '#ffffff',
        zIndex: 2,
        border: 0,
        borderBottom: '1px solid #ececec',
      }}
      elevation={0}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        px={3}
        py={1}
      >
        <Box sx={{ display: 'flex' }}>
          <img src={logo} alt="ad-lib-logo" />
        </Box>

        <Box>
          {!_.isEmpty(user?.profile_picture) &&
          user?.profile_picture?.split('/').pop() !== 'thumb_' ? (
            <Avatar
              alt={user?.fullname}
              src={user?.profile_picture}
              sx={{ border: '2px solid #25165b', cursor: 'pointer' }}
              onClick={(e) => handleClick(e, 'profile')}
            />
          ) : (
            <Avatar
              sx={{
                border: '2px solid #25165b',
                cursor: 'pointer',
              }}
              onClick={(e) => handleClick(e, 'profile')}
            >
              {`${user?.fullname.split(' ')[0][0]}${
                !_.isEmpty(user?.fullname.split(' ')[1][0])
                  ? user?.fullname.split(' ')[1][0]
                  : ''
              }`}
            </Avatar>
          )}

          <Box
            position="absolute"
            backgroundColor="#5025c4"
            mt={1}
            px={2}
            py={0.5}
            right="55px"
            borderRadius="0 0 0.4em 0.4em"
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <SettingsOutlinedIcon />
              <Typography variant="body2" fontWeight={600}>
                Settings
              </Typography>
            </Stack>
          </Box>
        </Box>
      </Stack>
    </AppBar>
  );
};

Header.propTypes = {
  user: PropTypes.any,
  handleClick: PropTypes.func,
};

export default Header;
