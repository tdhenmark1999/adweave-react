import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import {
  Stack,
  Box,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Typography,
  Avatar,
  IconButton,
  Button,
} from '@mui/material';
import SkeletonLoader from 'components/Project/Header/skeleton';
import Fade from 'components/Common/Fade';
import PropTypes from 'prop-types';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import Dashboard from '../../index';
// local component
import VirtualList from 'pages/Dashboard/Components/VirtualList';

import { appColors } from 'theme/variables';

function stringAvatar(name, color) {
  return {
    sx: {
      width: 24,
      height: 24,
      color: appColors.dashboard[color],
      border: `1px solid ${appColors.dashboard[color]}`,
      background: 'transparent',
      fontSize: '12px',
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}

const List = ({
  type,
  options,
  optionsColor,
  name,
  nameInput,
  nameColor,
  subheader,
  data,
  allData,
  onClick,
}) => {
  const [filteredButtons, setFilteredButtons] = useState('');

  const handleClick = (e) => {
    setFilteredButtons(e.target.value);
  };

  return data == null ? (
    <SkeletonLoader />
  ) : (
    <Fade in={data != null}>
      <Card variant="outlined" sx={{ borderRadius: '9px' }}>
        <CardHeader
          avatar={
            type !== 'button' ? null : (
              <Avatar variant="rounded" {...stringAvatar(name, nameColor)} />
            )
          }
          action={
            type !== 'button' ? (
              <IconButton aria-label="settings">
                <MoreVertIcon />
              </IconButton>
            ) : (
              options.map((data, index) => (
                <Button
                  size="small"
                  key={index}
                  value={data}
                  sx={{
                    textTransform: 'capitalize',
                    color: '#fff',
                    padding: 0,
                    backgroundColor:
                      appColors.dashboard[`${optionsColor[index]}`],
                    marginLeft: '0.5em',
                    '&:hover': {
                      backgroundColor:
                        appColors.dashboard[`${optionsColor[index]}`],
                    },
                  }}
                  onClick={(e) => handleClick(e, 'value')}
                >
                  {data}
                </Button>
              ))
            )
          }
          title={
            <Typography
              variant="body1"
              fontWeight={700}
              color={appColors.dashboard[nameColor]}
            >
              {name}
            </Typography>
          }
          subheader={
            _.isEmpty(data) ? null : (
              <Typography variant="caption">{subheader}</Typography>
            )
          }
          sx={{
            '.MuiCardHeader-action': {
              marginTop: 0,
              marginBottom: 0,
            },
          }}
        />
        <Divider />
        <CardContent sx={{ padding: '0 !important' }}>
          <VirtualList
            filteredButtons={filteredButtons}
            allData={allData}
            data={data}
            name={name}
            nameInput={nameInput}
            onClick={onClick}
          />
        </CardContent>
      </Card>
    </Fade>
  );
};

List.propTypes = {
  type: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.string),
  optionsColor: PropTypes.arrayOf(PropTypes.string),
  name: PropTypes.string,
  nameInput: PropTypes.string,
  nameColor: PropTypes.string,
  subheader: PropTypes.string,
  data: PropTypes.array,
  allData: PropTypes.array,
  filteredButtons: PropTypes.string,
  onClick: PropTypes.func,
};

export default List;
