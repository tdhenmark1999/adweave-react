import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: '#25175a12',
    minHeight: '100vh',
    padding: 0,
  },
  header: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '0.2em 2em',
    alignItems: 'center',
  },
  content: {
    padding: '0.2em 2em 1em',
    minHeight: '100vh',
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '1em 0',
  },
  counter: {
    height: '8em',
    padding: '1em',
    display: 'flex',
    justifyContent: 'space-evenly',
  },
  listFiler: {
    height: '8em',
  },
  multiLineEllipsis: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    '-webkit-line-clamp': 1,
    '-webkit-box-orient': 'vertical',
  },
}));

export { useStyles };
