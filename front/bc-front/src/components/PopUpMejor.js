import { Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import * as React from 'react';
import { useState } from 'react';



const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });


function PopUpMejor(props) {

    const [aviso, setAviso] = useState("");
    const [open, setOpen] = useState(false);
  
    const handleOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      props.cerrar();
    };



    return (
      <div>
        <Dialog
        open={props.mostrar}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle style={{"textAlign": "center", "color": "#97077D", "fontWeight": "bold"}} >{"Important:"}</DialogTitle>
        <DialogContent sx={{px: "40px"}}>
          <DialogContentText id="alert-dialog-slide-description">
            {props.aviso}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {<Button onClick={handleClose}>Ok</Button>}
        </DialogActions>
      </Dialog>
  
      </div>
    );
  }
  
  export default PopUpMejor;