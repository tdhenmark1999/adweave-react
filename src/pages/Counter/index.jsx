import { Button, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { increment, decrement } from '../../store/reducers/counter';

const Counter = () => {
  const dispatch = useDispatch();
  const { value } = useSelector((state) => state.counter);

  return (
    <div>
      <Typography variant="h3">Counter</Typography>

      <Typography>Temporary Page to test redux</Typography>
      <Typography>
        Counter value: <code>{value}</code>
      </Typography>

      <br />

      <Button
        variant="contained"
        color="primary"
        onClick={() => dispatch(increment())}
      >
        Add
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => dispatch(decrement())}
      >
        Subtract
      </Button>

      <br />

      <Link to="/">Home</Link>
    </div>
  );
};

export default Counter;
