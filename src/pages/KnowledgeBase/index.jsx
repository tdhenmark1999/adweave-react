import React, { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

// Components
import Header from 'pages/KnowledgeBase/Components/Header';
import ListCards from 'pages/KnowledgeBase/Components/ListCards';
import Filters from 'pages/KnowledgeBase/Components/Filters';

import {
  Stack,
  Box,
  Grid,
  styled,
} from '@mui/material';


export default function KnowledgeBase() {
  const dispatch = useDispatch();

  useEffect(() => {

  }, []);


  return (
    <Stack>
      <Header />

      <Box>
        <Box mx={3} mt={4} mb={2}>

        </Box>
        <Box m={3}>

          <Grid container spacing={3}>
            <Grid item xs={3}>
              <Filters />
            </Grid>
            <Grid item xs={9}>
              <ListCards />
            </Grid>

          </Grid>
        </Box>
      </Box>


    </Stack>
  );
}
