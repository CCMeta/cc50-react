import HelpIcon from '@mui/icons-material/HelpOutlineRounded';
import { Alert, Box, IconButton, Popover, Typography } from '@mui/material';
import * as React from 'react';
import { useObserver } from 'react-solid-state';
import { Define } from '../utils';


export default props => {
  const HelperLeaseTime = Define(null)

  return useObserver(() => (
    <Box component="span">
      <IconButton onMouseEnter={e => HelperLeaseTime.set(e.currentTarget)} size="small">
        <Typography lineHeight={1} variant="caption" component="span" color="#29b6f6">
          <HelpIcon fontSize="small" />
        </Typography>
      </IconButton>
      <Popover onClose={e => HelperLeaseTime.set(null)}
        anchorEl={HelperLeaseTime.get()}
        open={HelperLeaseTime.get() !== null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center', }}
        transformOrigin={{ vertical: 'top', horizontal: 'center', }}
        disableRestoreFocus>
        <Alert sx={{ whiteSpace: `pre-line`, maxWidth: { md: `50vw` } }} severity="info"
          onMouseLeave={e => HelperLeaseTime.set(null)}>
          {props.children}
        </Alert>
      </Popover>
    </Box>
  ))
}
