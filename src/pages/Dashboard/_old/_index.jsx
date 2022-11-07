// MUI Components
import {
  Container,
  Grid,
  Paper,
  Stack,
  Box,
  Typography,
  IconButton,
  Divider,
  FormControl,
  OutlinedInput,
  InputAdornment,
} from '@mui/material';

// Components
import LineGraph from 'components/Widgets/LineGraph';
import Header from 'components/Dashboard/Header';

// Widgets
import TaskCounter from 'components/Widgets/TaskCounter';
import TableList from 'components/Widgets/TableList';

// MUI Icons
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

// Styles
import { useStyles } from 'pages/Dashboard/styles';

// background
import cover from 'assets/dashboard.svg';
import ListFilter from 'components/Widgets/ListFilter';
import UserList from 'components/Widgets/UserList';

// dumy data
import { taskAssignedFilters, taskAssignedData, userLists } from './dummyData';

const Dashboard = () => {
  const classes = useStyles();

  return (
    <Container className={classes.root}>
      {/* Header */}
      <Header />
      {/* Content */}
      <Stack className={classes.content}>
        {/* Content header  */}
        <Box width="-webkit-fill-available">
          <Stack className={classes.contentHeader}>
            <Box display="flex" alignItems="center">
              <Typography variant="h6" fontWeight="800">
                Dashboard
              </Typography>
            </Box>
            <Box>
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="span"
              >
                <SettingsOutlinedIcon />
              </IconButton>
            </Box>
          </Stack>
        </Box>

        {/* Widgets */}
        <Box>
          <Grid container spacing={2}>
            {/* Counter 1 */}
            <Grid item xs={12} md={2.5}>
              <TaskCounter
                headline="Task with Revision"
                subheading="This week"
                count={5}
                icon={HistoryEduIcon}
                color="#ff002eb8"
              />
            </Grid>
            {/* Counter 2 */}
            <Grid item xs={12} md={2.5}>
              <TaskCounter
                headline="Task Reopened"
                subheading="This week"
                count={2}
                icon={LockOpenOutlinedIcon}
                color="#ff9800d1"
              />
            </Grid>
            {/* Counter 3 */}
            <Grid item xs={12} md={2.5}>
              <TaskCounter
                headline="Task Completed"
                subheading="This week"
                count={10}
                icon={AssignmentTurnedInOutlinedIcon}
                color="#65b12dc7"
              />
            </Grid>

            {/* List with filter */}
            <Grid item xs={12} md={4.5}>
              <ListFilter
                headline="Tasks Assigned"
                filters={taskAssignedFilters}
                dataItem={taskAssignedData}
              />
            </Grid>

            {/* Graph & Tasks */}
            <Grid item xs={12} md={9}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  {/* Task List */}
                  <Paper
                    elevation={0}
                    variant="outlined"
                    sx={{ height: '32em' }}
                  >
                    {/* Tabl Header */}
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      padding="0.5em 1em"
                    >
                      <Box display="flex" alignItems="center">
                        <Typography variant="body1" fontWeight={700}>
                          Active Tasks
                        </Typography>
                      </Box>
                      <Box>
                        <Stack direction="row">
                          <Box display="flex" alignItems="center" mr={0.5}>
                            <IconButton size="small" color="secondary">
                              <FilterAltIcon />
                            </IconButton>
                          </Box>
                          <Box>
                            <FormControl
                              sx={{ width: 'fit-content' }}
                              variant="outlined"
                              size="small"
                            >
                              <OutlinedInput
                                type="text"
                                placeholder="Search..."
                                endAdornment={
                                  <InputAdornment position="end">
                                    <IconButton edge="end">
                                      <SearchOutlinedIcon />
                                    </IconButton>
                                  </InputAdornment>
                                }
                              />
                            </FormControl>
                          </Box>
                        </Stack>
                      </Box>
                    </Stack>

                    <Divider />
                    {/* Filters */}
                    {/* List */}
                    <Stack>
                      {/* table header */}
                      <TableList />
                    </Stack>
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Box overflow="hidden">
                    {/* Graph */}
                    <LineGraph />
                  </Box>
                </Grid>
              </Grid>
            </Grid>

            {/* Status & Resources */}
            <Grid item xs={12} md={3}>
              <Grid container spacing={2}>
                {/* Status */}
                <Grid item xs={12}>
                  <Paper
                    elevation={0}
                    variant="outlined"
                    sx={{
                      height: '20em',
                      background: '#25165B',
                      backgroundImage: `url(${cover})`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'bottom',
                      backgroundPositionY: '10em',
                      backgroundSize: 'cover',
                      color: '#fff',
                    }}
                  >
                    <Stack
                      py={1}
                      px={2}
                      direction="row"
                      justifyContent="space-between"
                    >
                      <Box>In Progress</Box>
                      <Box>+100</Box>
                    </Stack>
                  </Paper>
                </Grid>
                {/* Resources */}
                <Grid item xs={12}>
                  <UserList
                    headline="Resources"
                    subheading="Active"
                    dataList={userLists}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Stack>
    </Container>
  );
};

export default Dashboard;
