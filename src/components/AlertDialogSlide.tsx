import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { DialogProps } from '../interfaces';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});


export default function AlertDialogSlide({
  open,
  onClose,
  title,
  content,
  actions,
}: DialogProps) {

  const renderContent = () => {
    if (typeof content === 'string') {
      return content;
    }
    if (content && typeof content === 'object') {
      return <pre><code>{JSON.stringify(content, null, 2)}</code></pre>;
    }
    return null;
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description" component="div">
          {renderContent()}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {actions.map((action, index) => (
          <Button key={index} onClick={action.onClick}
            color={
              action.color === 'secondary' ? 'secondary' : 
              action.color === 'error' ? 'error' : 
              action.color === 'success' ? 'success' : 
              action.color === 'warning' ? 'warning' : 
              action.color === 'info' ? 'info' : 
              'primary'
            }
          >
            {action.label}
          </Button>
        ))}
      </DialogActions>
    </Dialog>
  );
}
