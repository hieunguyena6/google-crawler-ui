import React, { useState, useCallback } from 'react';
import {
  Button, Typography, Table, TableContainer, Paper, TableHead, TableRow, TableCell,
  TableBody, TextField
} from '@mui/material';
import { DateTime } from 'luxon'
import { useQuery } from '@tanstack/react-query';
import useDebounceMemo from '../hooks/useDebounceMemo';
import UploadCsvModal from '../components/uploadCsvModal'

import axios from '../utils/axios'

import './homepage.scss';

const fetchKeywords = async (query) => {
  const res = await axios.get(`keywords?q=${query}`);
  return res.data;
};

export default function HomePage() {
  const [queryText, setQueryText] = useState('');
  const [openUploadCsvModal, setOpenUploadCsvModal] = useState(false);
  const debounceQueryText = useDebounceMemo(queryText);

  const keywordsQuery = useQuery(
    ['keywords', debounceQueryText],
    () => fetchKeywords(debounceQueryText),
    {
      staleTime: 36000
    }
  );
  const { data: keywords, total } = keywordsQuery.data || {};

  const onUploadCsvFileClick = useCallback(() => {
    setOpenUploadCsvModal(true)
  }, [setOpenUploadCsvModal])

  const onLogoutClick = useCallback(() => {
    localStorage.clear();
    window.location.reload();
  }, [])

  const onRefreshClick = useCallback(() => {
    keywordsQuery.refetch();
  }, [keywordsQuery])

  return <div className="container">
    <div className="buttonContainer">
      <div className="groupButton">
        <Button variant="contained" className="uploadFileButton" onClick={onUploadCsvFileClick}>
          Upload file
        </Button >
        <Button variant="contained" className="refreshButton" color="success" onClick={onRefreshClick}>
          Refresh
        </Button>
      </div>
      <Button onClick={onLogoutClick} className="logoutButton" variant="contained" color="error">
        Logout
      </Button>
    </div>
    <div className="tableContainer">
      <Typography variant="h5" className="tableTitle">Uploaded Keywords</Typography>
      <TextField
        label="Search Keyword"
        variant="outlined"
        className="searchInput"
        value={queryText}
        onChange={(event) => setQueryText(event.target.value)}
        style={{ marginBottom: 24 }}
      />
      <div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Keyword</TableCell>
                <TableCell align="right">Fetched time</TableCell>
                <TableCell align="right">Total result</TableCell>
                <TableCell align="right">Total ads</TableCell>
                <TableCell align="right">Total link</TableCell>
                <TableCell align="right">Status</TableCell>
                <TableCell align="right">Uploaded at</TableCell>
                <TableCell align="right">Fetched at</TableCell>
                <TableCell align="right">Preview</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                keywordsQuery.isLoading || keywordsQuery.isFetching ? 'Loading ...' : <>
                  {keywords.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.keyword}
                      </TableCell>
                      <TableCell align="right">{row.timeFetch}</TableCell>
                      <TableCell align="right">{row.totalResult}</TableCell>
                      <TableCell align="right">{row.totalAd}</TableCell>
                      <TableCell align="right">{row.totalLink}</TableCell>
                      <TableCell align="right">{row.status}</TableCell>
                      <TableCell align="right">{DateTime.fromISO(row.createdAt).toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS)}</TableCell>
                      <TableCell align="right">{row.dataFetchedAt && DateTime.fromISO(row.dataFetchedAt).toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS)}</TableCell>
                      <TableCell align="right">
                        {
                          row.HTMLPage && <iframe
                            title={row.keyword}
                            src={`data:text/html;charset=utf-8,${escape(row.HTMLPage)}`}
                            allowFullScreen
                            className="previewIframe"
                          >
                          </iframe>
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              }
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
    <UploadCsvModal open={openUploadCsvModal} setIsOpen={setOpenUploadCsvModal} />
    <Typography variant="h6">Total: {total} keywords</Typography>
  </div >
}