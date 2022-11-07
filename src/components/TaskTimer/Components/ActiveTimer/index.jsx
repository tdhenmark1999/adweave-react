// React
import { memo, useState, useEffect } from 'react';

import { useStopwatch } from 'react-timer-hook';

// MUI Components
import {
  styled,
  Button,
  Box,
  Stack,
  Collapse,
  Autocomplete,
  Typography,
  Divider,
  TextField,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

// MUI Icons
import AddIcon from '@mui/icons-material/Add';

import Input from '../Input';
import GlobalPopper from 'components/Common/Popper';

import {
  digitFormatter,
  getOffsetTimestamp,
  timeDifference,
} from '../../helper';

import _ from 'lodash';
import PropTypes from 'prop-types';
import moment from 'moment';

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'transparent',
    '&.Mui-focused fieldset': {
      borderColor: '#5025c4',
      // boxShadow: '0 0 0 4px rgb(80 37 196 / 10%)',
    },
  },
});

const StyledAutocomplete = styled(Autocomplete)({
  width: 'auto',
  '&.MuiListSubheader-root': {
    color: 'rgb(242 32 118)',
    lineHeight: '32px',
    backgroundColor: '#f0f0f0',
  },
  flex: 1,
});

function ActiveTimer({
  timer,
  inputPlaceholder,
  containerProps,
  tasksDatasource,
  partnersDatasource,
  campaignsDatasource,
  conceptsDatasource,
  canStopTimer,
  onPresetsSelectionChange,
  onPartnersSelectionChange,
  onCampaignsSelectionChange,
  onConceptsSelectionChange,
  onStartTimer,
  onStopTimer,
}) {
  // React state
  const [selectionsPopperAnchorEl, setSelectionsPopperAnchorEl] =
    useState(null);
  const [isSelectionsOpen, setIsSelectionsOpen] = useState(false);

  const [selectedTaskCategory, setSelectedTaskCategory] = useState(null);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedConcept, setSelectedConcept] = useState(null);

  const stopWatchConfigs = {
    autoStart: !_.isEmpty(timer),
    // Add offset
    offsetTimestamp:
      !_.isEmpty(timer) &&
      !_.isNull(timer) &&
      new Date(
        moment()
          .add(
            timeDifference(
              new Date(timer?.timeline[timer?.timeline?.length - 1]?.time_in),
              true
            ),
            's'
          )
          .format()
      ),
  };

  const { seconds, minutes, hours, isRunning, start, reset } =
    useStopwatch(stopWatchConfigs);

  // Hooks
  useEffect(() => {
    if (!_.isEmpty(timer)) {
      start();
    }
  }, [timer]);

  useEffect(() => {
    if (selectedPartner) {
      console.log('selectedPartner: ', selectedPartner);
      console.log(
        'conceptsDatasource.filter: ',
        conceptsDatasource.filter(
          (c) => selectedPartner.uuid === c.partner_uuid
        )
      );
    }
  }, [selectedPartner]);

  // Handlers
  const handleSelectionsButtonClick = (e) => {
    setSelectionsPopperAnchorEl(e.currentTarget);
    setIsSelectionsOpen(!isSelectionsOpen);
  };

  const handleTimerControlButtonClick = () => {
    if (isRunning) {
      if (selectedTaskCategory || timer) {
        reset(null, false);
        setSelectedTaskCategory(null);
        setSelectedPartner(null);
        setSelectedCampaign(null);
        setSelectedConcept(null);
        onStopTimer(timer);
      }
    } else {
      start();
      onStartTimer();
    }
  };

  const filteredConceptsBySelectedPartner = () => {
    return selectedPartner || (timer?.partner ?? null)
      ? conceptsDatasource.filter(
          (c) => (selectedPartner?.uuid ?? timer?.partner.id) === c.partner_uuid
        ) ?? []
      : conceptsDatasource ?? [];
  };

  const filteredCampaignsBySelectedConcept = () => {
    return selectedConcept || (timer?.concept ?? null)
      ? campaignsDatasource.filter(
          (c) => (selectedConcept?.uuid ?? timer?.concept.uuid) === c.concept_id
        ) ?? []
      : campaignsDatasource ?? [];
  };

  return (
    <Stack spacing={1} {...containerProps}>
      <Stack direction="row" justifyContent="space-between" m={1} spacing={2}>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ width: '-webkit-fill-available' }}
        >
          {/* Task selections */}
          <Input
            data={tasksDatasource}
            placeholder={inputPlaceholder}
            value={{
              name: selectedTaskCategory?.name ?? timer?.category?.name,
            }}
            onSelectionChange={(data) => {
              setSelectedTaskCategory(data);
              onPresetsSelectionChange(data);
            }}
          />
        </Stack>

        {/* Project Selections */}
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              minWidth: '5rem',
              whiteSpace: 'nowrap',
            }}
          >
            <Button
              sx={{
                textTransform: 'none',
                '& .MuiButton-startIcon': {
                  marginRight: '4px',
                  '& .MuiSvgIcon-root': { fontSize: '14px' },
                },
              }}
              startIcon={
                _.isNull(timer?.partner ?? null) &&
                _.isNull(selectedPartner) && <AddIcon />
              }
              color="secondary"
              onClick={handleSelectionsButtonClick}
            >
              {selectedPartner?.name ?? (timer?.partner?.name || 'Partner')}
            </Button>
          </Box>
          <Divider
            orientation="vertical"
            variant="middle"
            flexItem
            sx={{ borderStyle: 'dashed' }}
          />

          {/* Countdown timer */}
          <Box sx={{ display: 'flex', justifyContent: 'center' }} width={85}>
            <Typography variant="h6" fontWeight={700} color="primary">
              {`${digitFormatter(hours)}:${digitFormatter(
                minutes
              )}:${digitFormatter(seconds)}`}
            </Typography>
          </Box>

          {/* Controls */}
          <Stack direction="row" alignItems="center">
            <LoadingButton
              size="large"
              variant="contained"
              color="secondary"
              onClick={handleTimerControlButtonClick}
              disabled={isRunning && (!canStopTimer ?? false)}
            >
              {isRunning ? 'Stop' : 'Start'}
            </LoadingButton>
          </Stack>
        </Stack>

        {/* Concept, Campaigns, Partners Selection */}
        <GlobalPopper
          isOpen={isSelectionsOpen}
          anchorEl={selectionsPopperAnchorEl}
          onClose={() => setIsSelectionsOpen(false)}
          placement={'bottom'}
          sx={{ zIndex: 1 }}
          content={
            <Stack spacing={2} p={3} minWidth={350}>
              <StyledAutocomplete
                disablePortal
                freeSolo
                isOptionEqualToValue={(option, value) =>
                  option.uuid === value.id ?? value.uuid
                }
                value={selectedPartner ?? timer?.partner}
                options={partnersDatasource ?? []}
                getOptionLabel={(option) => option.name}
                onChange={(_, value) => {
                  setSelectedPartner(value);
                  onPartnersSelectionChange(value);
                }}
                renderInput={(params) => (
                  <StyledTextField
                    {...params}
                    size="small"
                    label="Select a partner"
                    placeholder={'Select a partner'}
                  />
                )}
                loading={false}
              />
              <StyledAutocomplete
                disablePortal
                freeSolo
                loading={false}
                isOptionEqualToValue={(option, value) =>
                  option.uuid === value.id ?? value.uuid
                }
                value={selectedConcept ?? timer?.concept ?? null}
                options={filteredConceptsBySelectedPartner()}
                getOptionLabel={(option) => option.name}
                onChange={(_, value) => {
                  setSelectedConcept(value);
                  onConceptsSelectionChange(value);
                }}
                renderInput={(params) => (
                  <StyledTextField
                    {...params}
                    InputProps={{
                      ...params.InputProps,
                    }}
                    size="small"
                    label={
                      _.isEmpty(filteredConceptsBySelectedPartner())
                        ? 'No Concepts Available'
                        : 'Select a concept'
                    }
                    placeholder={'Select a concept'}
                  />
                )}
                disabled={_.isEmpty(filteredConceptsBySelectedPartner())}
              />
              <StyledAutocomplete
                disablePortal
                freeSolo
                loading={false}
                isOptionEqualToValue={(option, value) =>
                  option.uuid === value.id ?? value.uuid
                }
                value={selectedCampaign ?? timer?.campaign}
                options={filteredCampaignsBySelectedConcept()}
                getOptionLabel={(option) => option.name}
                onChange={(_, value) => {
                  setSelectedCampaign(value);
                  onCampaignsSelectionChange(value);
                }}
                renderInput={(params) => (
                  <StyledTextField
                    {...params}
                    size="small"
                    label={
                      _.isEmpty(filteredCampaignsBySelectedConcept())
                        ? 'No Campaigns Available'
                        : 'Select a campaign'
                    }
                    placeholder={'Select a campaign'}
                  />
                )}
                disabled={_.isEmpty(filteredCampaignsBySelectedConcept())}
              />
            </Stack>
          }
        />
      </Stack>
    </Stack>
  );
}

ActiveTimer.propTypes = {
  timer: PropTypes.any,
  inputPlaceholder: PropTypes.any,
  containerProps: PropTypes.any,
  tasksDatasource: PropTypes.any,
  partnersDatasource: PropTypes.any,
  campaignsDatasource: PropTypes.any,
  conceptsDatasource: PropTypes.any,
  canStopTimer: PropTypes.any,
  onStartTimer: PropTypes.any,
  onStopTimer: PropTypes.any,
  onPresetsSelectionChange: PropTypes.any,
  onPartnersSelectionChange: PropTypes.any,
  onCampaignsSelectionChange: PropTypes.any,
  onConceptsSelectionChange: PropTypes.any,
};

export default memo(ActiveTimer);
