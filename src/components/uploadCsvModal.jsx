import React from 'react';
import { useDropzone } from "react-dropzone";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useMutation } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import axios from '../utils/axios'

export default function UploadCsvModal({ open, setIsOpen }) {
  const { enqueueSnackbar } = useSnackbar();

  const { mutate, isLoading } = useMutation((file) => {
    const formData = new FormData();
    formData.append('file', file);

    return axios.post(`file/csv/upload`,
      formData);
  }, {
    onSuccess: (data) => {
      enqueueSnackbar('Successfully', {
        variant: 'success',
        autoHideDuration: 5000,
        anchorOrigin: {
          horizontal: 'center',
          vertical: 'top'
        }
      });
      window.location.reload();

    },
    onError: (err) => {
      enqueueSnackbar(err.response.data.message, {
        variant: 'error',
        autoHideDuration: 5000,
        anchorOrigin: {
          horizontal: 'center',
          vertical: 'top'
        }
      });
    }
  })

  const onDrop = (files) => {
    mutate(files[0]);
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop, accept: { "text/csv": [".csv"] }, maxFiles: 1
  });

  return (
    <div>
      <Dialog
        open={open}
        onClose={() => setIsOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Upload CSV File"}
        </DialogTitle>
        <DialogContent>
          <a className="sampleFileLink" href={process.env.PUBLIC_URL + `/sample.csv`} download={true}>
            Download sample file
          </a>
          {
            isLoading ? <>Loading ...</> : <div style={{ border: '1px dashed', padding: '64px' }}{...getRootProps()}>
              <input {...getInputProps()} />
              <p>Drop 'n' Drop a files here or click to upload</p>
            </div>
          }
        </DialogContent>
      </Dialog>
    </div>
  );
}
