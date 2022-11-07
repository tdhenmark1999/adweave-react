import React, { useState, useEffect } from 'react';
import TextTransition, { presets } from 'react-text-transition';

import { styled } from '@mui/material/styles';

import { useDispatch, useSelector } from 'react-redux';

import {
  getTickets,
  getTicketCount,
  getTicketOptions,
} from 'store/reducers/support';

// global components
import GlobalDrawer from 'components/Common/Drawer';
import NewTicket from 'components/Support';

// Components
import Header from 'pages/Support/Components/Header';
import Table from 'pages/Support/Components/Table';

import {
  Stack,
  Box,
  Typography,
  Button,
  IconButton,
  Grid,
  Paper,
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';

import support from 'assets/support.svg';

import { counters, tableHeader } from 'pages/Support/constant';

const TEXTS = [
  'Ad-Lib Platform issues?',
  'Escalate?',
  'Ad-Weave concerns?',
  'Integration?',
];

const StyledTypography = styled(Typography)`
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export default function Support() {
  const dispatch = useDispatch();
  const [index, setIndex] = useState(0);
  const [hover, setHover] = useState(null);
  const [open, setOpen] = useState(false);

  const {
    data: tickets,
    count: ticketCount,
    options: ticketOptions,
    fetching,
  } = useSelector((state) => state.support);
  const { data: user } = useSelector((state) => state.user);

  useEffect(() => {
    const intervalId = setInterval(
      () => setIndex((index) => index + 1),
      3000 // every 3 seconds
    );
    return () => clearTimeout(intervalId);
  }, []);

  useEffect(() => {
    dispatch(getTickets(user?.id));
    dispatch(getTicketOptions());
    dispatch(getTicketCount(user?.id));
  }, []);

  function handleClick() {
    setOpen((prev) => !prev);
  }

  return (
    <Stack>
      {/* Header */}
      <Header />

      <Box>
        {/* Banner & Counter */}
        <Box mx={3} mt={4} mb={2}>
          <Grid
            container
            sx={{ margin: '1.5em 0' }}
            columnSpacing={{ sx: 0, md: 2 }}
            rowSpacing={{ sx: 2, md: 0 }}
            alignItems="center"
          >
            <Grid item xs={12} md={7} sx={{ marginBottom: '1em' }}>
              <Paper
                variant="outlined"
                sx={{
                  background:
                    'linear-gradient(346deg, rgba(19,6,42,1) 0%, rgba(88,13,92,1) 46%, rgba(235,30,115,1) 100%)',
                  padding: '2em 3em',
                  borderRadius: '1em',
                  border: 0,
                }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={8}>
                    <Box>
                      <Typography variant="h4" fontWeight={700} color="#fff">
                        <TextTransition springConfig={presets.gentle}>
                          {TEXTS[index % TEXTS.length]}
                        </TextTransition>
                      </Typography>
                      <Typography variant="h5" color="#fff" gutterBottom mb={2}>
                        We can help you with that!
                      </Typography>

                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        color="secondary"
                        onClick={handleClick}
                      >
                        File a support ticket
                      </Button>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <img src={support} alt="support" />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12} md={5} sx={{ marginBottom: '1em' }}>
              <Grid container spacing={2} alignItems="center">
                {counters?.map((data, index) => (
                  <Grid item xs={12} md={3} key={index}>
                    <Paper
                      sx={{
                        padding: '1em 1em',
                        boxShadow:
                          'rgb(50 50 93 / 25%) 0px 6px 12px -2px, rgb(0 0 0 / 30%) 0px 3px 7px -3px',
                        borderRadius: '0.5em',
                        backgroundColor: '#2a1e44',
                        backgroundImage:
                          'linear-gradient(294deg, #1d0831 0%, #490b51 100%)',
                        borderLeft: `6px solid ${data?.color}`,
                      }}
                    >
                      <Stack>
                        <Box>
                          <StyledTypography
                            color="#fff"
                            fontWeight={800}
                            variant="button"
                          >
                            {data?.name}
                          </StyledTypography>
                        </Box>
                        <Box>
                          <Typography
                            fontWeight={800}
                            variant="h3"
                            color="#fff"
                          >
                            {ticketCount[data?.slug] || 0}
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Box>
        {/* Table */}
        <Box m={3}>
          <Table
            tickets={tickets}
            hover={hover}
            setHover={setHover}
            tableHeader={tableHeader}
          />
        </Box>
      </Box>

      <GlobalDrawer
        content={<NewTicket options={ticketOptions} />}
        disableEnforceFocus
        transitionDuration={{ enter: 300, exit: 400 }}
        name="new-ticket"
        width={700}
        isOpen={open}
        anchor="right"
        BackdropProps={{
          invisible: false,
          sx: { backgroundColor: '#1a1627a3' },
        }}
        hideBackdrop={false}
        onClose={handleClick}
      />
    </Stack>
  );
}
