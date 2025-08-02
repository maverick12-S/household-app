import { Alert, Snackbar  } from '@mui/material';
import React from 'react'

type Props = {
    open: boolean;
    onClose: () => void;
    message: string;
};

export const ErrorSnackbar = ({ open, onClose , message }: Props) => (
    <Snackbar open={open}
        autoHideDuration={5000}
        onClose={(event, reason) => {
            if(reason === 'clickaway') return;
            onClose();
        }}
        anchorOrigin={{ vertical: 'top',
            horizontal:'center'
        }}>
            <Alert onClose={onClose}
                severity="error" sx={{ width: '100% '}}>
                    {message}
            </Alert>
    </Snackbar>
);
