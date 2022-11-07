import { useState, Fragment, forwardRef, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { styled } from '@mui/styles';
import moment from 'moment';
import { updateCampaignByKey } from 'store/reducers/campaign';
import DatePicker from 'react-datepicker';

import { Typography, Chip, Button, Grid, Box } from '@mui/material';

import TaskContext from 'pages/Task/Context';
import TagIcon from '@mui/icons-material/Tag';
import 'react-datepicker/dist/react-datepicker.css';

const StyledDiv = styled('div')(() => ({
  display: 'flex',
  flexWrap: 'wrap',
  '& .MuiBox-root': {
    marginRight: 10,
    marginBottom: 10,
  },
}));

const StyledTextArea = styled('textarea')(() => ({
  backgroundColor: 'transparent',
  color: 'rgb(102, 102, 102)',
  fontSize: '1em',
  fontFamily: 'Karla, Roboto',
  fontWeight: '400',
  padding: '0px',
  textAlign: 'left',
  alignItems: 'center',
  outline: 'none',
  width: '100%',
  alignSelf: 'center',
  border: '1px solid #DF3C76',
}));

const List = ({ item, data }) => {
  const [value, setValue] = useState(new Date(data[item]));
  const dispatch = useDispatch();
  const [valueString, setValueString] = useState(
    data[item] == null ? '--' : data[item]
  );
  const [isEditingAdditionalInfo, setEditingAdditionalInfo] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [horizontal, setHorizontal] = useState('left');
  const [option, setOption] = useState([]);
  const [optionType, setOptionType] = useState(null);
  const [selected, setSelected] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [comment, setComment] = useState(null);
  const [isParent, setIsParent] = useState(null);

  const updateAdditionalInfo_ = (e) => {
    const itemAdditionalInfo = [];
    const {
      target: { value },
    } = e;

    e.preventDefault();
    if (e.key == 'Enter') {
      setEditingAdditionalInfo(false);
      itemAdditionalInfo.push({
        id: data.id,
        key: item,
        value: value,
      });
      setValueString(value);
      dispatch(updateCampaignByKey(itemAdditionalInfo[0]));
    }
  };

  // const { handleOpen } = useContext(TaskContext);

  const handleOpen = (event, position, type, data, select, relType) => {
    type === 'campaign' && setComment(select);
    event.preventDefault();
    setAnchorEl(event.currentTarget);
    setSelected(select);
    setHorizontal(position);
    setOptionType(type);
    setOption(data);
    setIsParent(relType === 'campaign' ? 1 : 0);
  };

  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
    <Button color="secondary" onClick={onClick} ref={ref}>
      {value}
    </Button>
  ));

  switch (item) {
    case 'concept_name':
    case 'name':
      return (
        <Typography sx={{ color: '#707683' }}>
          {!_.isEmpty(data[item]) ? data[item] : '-'}
        </Typography>
      );
    case 'sub_campaign':
      return (
        <Typography sx={{ color: '#707683' }}>{data[item].length}</Typography>
      );

    case 'partner_name':
      return (
        <Chip
          label={data[item]}
          size="small"
          variant="outlined"
          color="secondary"
        />
      );
    case 'delivery_type':
      return (
        <Typography sx={{ color: '#707683', textTransform: 'capitalize' }}>
          {data[item].replace(/_/g, ' ').toLowerCase()}
        </Typography>
      );
    case 'created_at':
    case 'launch_date':
    case 'delivery_date':
      return (
        <>
          {/* <StaticDateTimePicker
            value={value}
            onChange={(newValue) => {
              setValue(newValue);
            }}
            renderInput={(props) => (
              <Button {...props}>
                {!_.isEmpty(data[item]) ? data[item] : 'Not Set'}
              </Button>
            )}
          /> */}

          <DatePicker
            selected={value}
            onChange={(date) => {
              const itemDate = [];
              itemDate.push({
                id: data.id,
                key: item,
                value: moment(value).format('MM/DD/YYYY h:mm A'),
              });
              setValue(date);
              dispatch(updateCampaignByKey(itemDate[0]));
            }}
            showTimeSelect
            dateFormat="Pp"
            customInput={<ExampleCustomInput />}
          />
        </>
      );
    case 'tags':
      return (
        <Box
          onClick={(e) => handleOpen(e, 'left', item, null)}
          width="fit-content"
        >
          {!_.isEmpty(data[item]) ? (
            data[item].map((e, i) => (
              <Chip
                color="secondary"
                key={i}
                label={e.title}
                size="small"
                variant="outlined"
                sx={{ marginRight: '0.5em', cursor: 'pointer' }}
              />
            ))
          ) : (
            <Chip
              icon={<TagIcon />}
              label="Add tags"
              size="small"
              variant="outlined"
              color="secondary"
              sx={{
                marginRight: '0.5em',
                cursor: 'pointer',
                borderStyle: 'dashed',
                '& .MuiChip-iconSmall': {
                  width: '0.7em',
                  marginLeft: '5px',
                },
              }}
            />
          )}
        </Box>
      );
    case 'total_log_hours':
      return (
        <Typography sx={{ color: '#707683' }}>
          {!_.isEmpty(data[item]) ? data[item] : 0}
        </Typography>
      );

    case 'personalization_type':
      return (
        <Typography
          sx={{
            color: !_.isEmpty(data[item])
              ? data[item].toLowerCase() === 'assembly'
                ? '#ffab01'
                : '#84C529'
              : 'default',
          }}
        >
          {!_.isEmpty(data[item])
            ? data[item].toLowerCase() === 'assembly'
              ? 'Managed Service'
              : 'Self Service'
            : 'Not Specified'}
        </Typography>
      );
    case 'additional_info':
      return (
        <StyledDiv
          onDoubleClick={() => {
            if (!isEditingAdditionalInfo) {
              setEditingAdditionalInfo(true);
              setValueString(
                <StyledTextArea
                  rows="5"
                  cols="100"
                  onKeyUp={(e) => updateAdditionalInfo_(e)}
                ></StyledTextArea>
              );
            }
          }}
        >
          <Typography sx={{ color: '#707683', textTransform: 'capitalize' }}>
            {valueString}
          </Typography>
        </StyledDiv>
      );
    default:
      return null;
  }
};

List.propTypes = {
  item: PropTypes.string.isRequired,
  data: PropTypes.any,
  value: PropTypes.any,
  onClick: PropTypes.func,
};

export default List;
