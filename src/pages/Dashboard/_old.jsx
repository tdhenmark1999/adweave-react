import { useSelector } from 'react-redux';

import { Stack } from '@mui/material';

//components
import DevDash from 'pages/Dashboard/views/DevDash';
import DesignQADash from 'pages/Dashboard/views/DesignQADash';
import Header from 'pages/Dashboard/views/Header';

export default function Dashboard() {
  const { data: user, isLoading } = useSelector((state) => state.user);

  return (
    <Stack sx={{ backgroundColor: '#F5F5F5', minHeight: '100vh' }}>
      <Header user={user} />
      {user?.team_name?.toLowerCase().includes('production') ? (
        <DevDash />
      ) : (
        <DesignQADash />
      )}
    </Stack>
  );
}
