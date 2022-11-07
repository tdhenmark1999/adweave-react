import { memo, useState } from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import useRouteGuard from 'hooks/useRouteGuard';

// MUI Components
import { Modal, Zoom, Box } from '@mui/material';

// Components
import Sidebar from 'components/Common/Sidebar';

//styles
import { sidebarWidth } from 'theme/variables';
import { useStyles } from 'app/styles';
import Support from 'components/Support';

//Authenticated Width
const initialPageBodyWidth = 'calc(100% - 50px)';

const AuthenticatedRoutes = ({ component: Component, ...rest }) => {
  const classes = useStyles();
  // const { pathname } = useLocation();
  useRouteGuard();
  const [isModelOpen, setIsModalOpen] = useState(false);

  return (
    <Box width="100%" className={classes.overflowHiddenX} height="100vh">
      <Sidebar setIsModalOpen={setIsModalOpen} />
      <Route
        {...rest}
        render={(props) => {
          // return pathname === '/team' ? (
          //   <Component {...props} />
          // ) : (
          return (
            <Box
              width={initialPageBodyWidth}
              style={{ marginLeft: sidebarWidth }}
            >
              <Box>
                <Component {...props} />
              </Box>
            </Box>
          );
        }}
      />
      <Modal
        keepMounted
        open={isModelOpen}
        onClose={() => setIsModalOpen(false)}
        className={classes.modal}
        closeAfterTransition
        BackdropProps={{
          sx: { backgroundColor: '#1a1627a3' },
        }}
      >
        <Zoom in={isModelOpen}>
          <Box className={classes.paper}>
            <Support />
          </Box>
        </Zoom>
      </Modal>
    </Box>
  );
};

AuthenticatedRoutes.propTypes = {
  component: PropTypes.elementType.isRequired,
};

export default memo(AuthenticatedRoutes);
