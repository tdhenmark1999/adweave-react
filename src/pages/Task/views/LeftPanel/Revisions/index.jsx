import React, { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { getTaskRevisions, requestFetchRevisionList_, requestDeleteRevision_, requestAddSubtaskRevision_, requestChecklistRevision_ } from 'store/reducers/tasks';
import { getData } from 'store/reducers/manualTaskCreation';
import PropTypes from 'prop-types';
import TablePagination from '@mui/material/TablePagination';
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';

import {
  Button,
  Stack,
  Checkbox,
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Menu,
  MenuItem,
  Fade,
  TextField,
} from '@mui/material';

import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';

import { visuallyHidden } from '@mui/utils';

import _ from 'lodash';
import { codeSnippetIcon } from '@progress/kendo-svg-icons';

function createData(user, team, feedback, report_link) {
  return {
    user,
    team,
    feedback,
    report_link,
  };
}

const rows = [
  createData('Cupcake', 305, 3.7, 'a'),
  createData('Donut', 452, 25.0, 'a'),
  createData('Eclair', 262, 16.0, 'a'),
  createData('Frozen yoghurt', 159, 6.0, 'a'),
  createData('Gingerbread', 356, 16.0, 'a'),
  createData('Honeycomb', 408, 3.2, 'a'),
  createData('Ice cream sandwich', 237, 9.0, 'a'),
  createData('Jelly Bean', 375, 0.0, 'a'),
  createData('KitKat', 518, 26.0, 'a'),
  createData('Lollipop', 392, 0.2, 'a'),
  createData('Marshmallow', 318, 0, 'a'),
  createData('Nougat', 360, 19.0, 'a'),
  createData('Oreo', 437, 18.0, 'a'),
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }

  if (b[orderBy] > a[orderBy]) {
    return 1;
  }

  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }

    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'user',
    numeric: false,
    disablePadding: true,
    label: 'User',
  },
  {
    id: 'team',
    numeric: false,
    disablePadding: true,
    label: 'Team',
  },
  {
    id: 'feedback',
    numeric: false,
    disablePadding: true,
    label: 'Feedback',
  },
  {
    id: 'report_link',
    numeric: false,
    disablePadding: true,
    label: 'Report Link',
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead sx={{ backgroundColor: '#F9F9FC' }}>
      <TableRow>
        <TableCell sx={{ padding: '1em 1em 1em 0.5em' }}>
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default function Revisions() {
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const { overview: { data }, data_revision_tab } = useSelector((state) => state.tasks);
  const {
    data: { taskTypeList, subTaskList },
  } = useSelector((state) => state.manualTaskCreation);
  const dispatch = useDispatch();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('team');
  const [selected, setSelected] = React.useState([]);
  const [revisionData, setRevisionData] = React.useState(data_revision_tab);
  const { url } = useRouteMatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [itemChcked, setItemChcked] = useState([]);
  const [itemChckedString, setItemChckedString] = useState('');
  const [itemChckedAddSubtask, setItemChckedAddSubtask] = useState([]);

  useEffect(() => {
    dispatch(getTaskRevisions({ id: data?.id, type: data?.rel_type }));
    dispatch(requestFetchRevisionList_(url.split('/')[7], page, rowsPerPage));
    setRevisionData(data_revision_tab);
    dispatch(getData('get_task_type'));
    dispatch(getData('get_task_category'));
  }, []);


  const handleChangePage = (event, newPage) => {
    console.log(page, "handleChangePage")
    setPage(newPage);
    dispatch(requestFetchRevisionList_(url.split('/')[7], newPage, rowsPerPage));
  };

  const handleChangeRowsPerPage = (event) => {
    console.log(event.target.value, "handleChangeRowsPerPage")
    setRowsPerPage(parseInt(event.target.value, 10));
    // setPage(page);
    dispatch(requestFetchRevisionList_(url.split('/')[7], page, parseInt(event.target.value, 10)));
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.name);
      setSelected(newSelected);
      return;
    }

    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleClickSubtask = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteRevision = () => {
    const itemRevision = [];
    itemRevision.push({
      rel_id: url.split('/')[7],
      rel_type: 'task',
      ids: itemChckedString,
    });
    dispatch(requestDeleteRevision_(itemRevision[0]));
    setRevisionData(data_revision_tab)
  };

  const handleChecklistRevision = () => {
    const itemRevision = [];
    itemRevision.push({
      rel_id: url.split('/')[7],
      rel_type: 'task',
      ids: itemChckedString,
    });
    dispatch(requestChecklistRevision_(itemRevision[0]));
    setRevisionData(data_revision_tab)
  };

  const handleSubtaskAdd = (item) => {
    setAnchorEl(null);
    const itemRevision = [];
    itemRevision.push({
      task_id: url.split('/')[7],
      category_id: item,
      revision_id: itemChckedAddSubtask,
    });
    dispatch(requestAddSubtaskRevision_(itemRevision[0]));
  };

  const handleChangeCheckBox = (item) => {
    let tempItemChcked = itemChcked;

    if (tempItemChcked.some((users) => users.id === item.id)) {
      tempItemChcked = tempItemChcked.filter((users) => users.id !== item.id);
    } else {
      tempItemChcked.push(item);
    }

    setItemChcked(tempItemChcked);
    let itemCheckedToString = tempItemChcked.map(({ id }) => `${id}`).join(',')
    setItemChckedAddSubtask(tempItemChcked.map(({ id }) => `${id}`))

    setItemChckedString(itemCheckedToString);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const isSelected = (name) => selected.indexOf(name) !== -1;

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mt: 2 }} elevation={0} variant="outlined">
        <TableContainer>
          <Table aria-labelledby="tableTitle" size={'small'}>
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
              {stableSort((data_revision_tab ?? []), getComparator(order, orderBy)).map(
                (row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          onChange={() => {
                            handleChangeCheckBox(row);
                          }}
                          value={itemChcked[row.id]}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.user}
                      </TableCell>
                      <TableCell>{row.team}</TableCell>
                      <TableCell><div dangerouslySetInnerHTML={{ __html: row.feedback }}></div> </TableCell>
                      <TableCell>{row.report_link}</TableCell>
                    </TableRow>
                  );
                }
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Stack direction="row" justifyContent="space-between" mt={2}>
        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteOutlineOutlinedIcon />}
          onClick={handleDeleteRevision}
          disableElevation
        >
          Delete
        </Button>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<AddOutlinedIcon />}
            id="fade-button"
            aria-controls={open ? 'fade-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClickSubtask}
            disabled={_.isEmpty(selected)}
          >
            Subtask
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<FactCheckOutlinedIcon />}
            disableElevation
            onClick={handleChecklistRevision}
            disabled={_.isEmpty(selected)}
          >
            Checklist
          </Button>
        </Stack>
      </Stack>
      <TablePagination
        component="div"
        count={100}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Menu
        id="fade-menu"
        MenuListProps={{
          'aria-labelledby': 'fade-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <TextField />
        {subTaskList?.map((subCategory, index) => (
          <MenuItem key={index} onClick={(e) => {
            handleSubtaskAdd(subCategory?.id);
          }} sx={{ fontSize: '1em' }}>
            {subCategory?.name}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
