import React from 'react';

import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

import { Paper, Grid, Typography, Divider, styled } from '@mui/material';

const StyledTypography = styled(Typography)`
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const StyledPaper = styled(Paper)`
  box-shadow: rgba(0, 0, 0, 0.09) 0px 3px 12px;
  border: 1px solid rgba(0, 0, 0, 0.12);
`;

export default function Table({ tickets, hover, setHover, tableHeader }) {
  return (
    <StyledPaper>
      <Grid container sx={{ padding: '0.5em 1em' }}>
        {tableHeader?.map((data, index) => (
          <Grid item xs={data?.size} key={index}>
            <StyledTypography color="#707575" variant="button" fontWeight={800}>
              {data?.name}
            </StyledTypography>
          </Grid>
        ))}
      </Grid>
      <Divider />

      {tickets?.data?.map((ticket, index) => (
        <Grid
          container
          sx={{
            padding: '0.5em 1em',
            borderBottom: '1px solid #ececec75',
            boxShadow: hover === index && 'rgb(0 0 0 / 45%) 0px 23px 8px -22px',
          }}
          key={index}
          spacing={1}
          onMouseOver={() => setHover(index)}
          onMouseOut={() => setHover(null)}
        >
          {tableHeader?.map((data, index) => {
            switch (data.name.toLowerCase()) {
              case 'subject':
                return (
                  <Grid item xs={data?.size} key={index}>
                    <StyledTypography
                      color="#707575"
                      component={Link}
                      to={{
                        pathname: `https://ad-weave.io/crm/forms/tickets/${ticket?.ticketkey}`,
                      }}
                      target="_blank"
                      sx={{
                        textDecoration: 'none',
                        ':hover': {
                          color: '#F22076',
                        },
                      }}
                    >
                      {ticket[data?.key]}
                    </StyledTypography>
                  </Grid>
                );
              default:
                return (
                  <Grid item xs={data?.size} key={index}>
                    <StyledTypography color="#707575">
                      {ticket[data?.key]}
                    </StyledTypography>
                  </Grid>
                );
            }
          })}
        </Grid>
      ))}
    </StyledPaper>
  );
}

Table.propTypes = {
  tickets: PropTypes.any,
  hover: PropTypes.any,
  setHover: PropTypes.func,
  tableHeader: PropTypes.array,
};
