import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { motion } from 'framer-motion'
import Router from 'next/router'
import { FunctionComponent, useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { elapsedTime } from '../../pages/board/contest'
import { setLoading, setModal } from '../../redux/silces/alertSlice'
import { Contest } from '../../redux/silces/boardSlice'
import DetailContest from './DetailContest'

const MyContest: FunctionComponent<{ board: string }> = ({ board }) => {
  const [rows, setRows] = useState<Contest[]>([])
  const [open, setOpen] = useState(false)
  const [id, setId] = useState<number>()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setLoading(true))
    axios
      .get('http://163.44.181.194:1212/api/board/contest/myPost')
      .then((response: AxiosResponse<Contest[]>) => {
        setRows(response.data)
        dispatch(setLoading(false))
      })
      .catch((error: AxiosError<string>) => {
        dispatch(setLoading(false))
        dispatch(setModal([true, error.response?.data as string]))
      })
  }, [dispatch])

  const columns: GridColDef[] = useMemo(() => {
    return [
      {
        field: 'title',
        headerName: 'Title',
        description: '제목',
        sortable: false,
        width: 390,
        headerAlign: 'center',
        align: 'center',
      },
      {
        field: 'date',
        headerName: 'Date',
        description: '작성 날짜',
        width: 150,
        headerAlign: 'center',
        align: 'center',
        valueGetter: ({ row }) => {
          return elapsedTime(row.date)
        },
      },
      {
        field: 'like',
        headerName: 'Like',
        description: '좋아요',
        width: 100,
        headerAlign: 'center',
        align: 'center',
        valueGetter: ({ row }) => {
          return row.like_user_id.length
        },
      },
      {
        field: 'applicants',
        headerName: 'Applicants',
        description: '신청자 수',
        width: 130,
        headerAlign: 'center',
        align: 'center',
        valueGetter: ({ row }) => {
          return row.join_user_id.length
        },
      },
      {
        field: 'state',
        headerName: 'State',
        description: '상태',
        width: 130,
        headerAlign: 'center',
        align: 'center',
      },
    ]
  }, [])

  return (
    <>
      <Box sx={{ m: '30px 30px' }}>
        <b style={{ fontSize: '3rem' }}>내 게시물</b>
        <p>
          본인이 {board === 'contest' && '공모전 게시판에'} 작성한 게시물들을 볼
          수 있습니다.
        </p>
      </Box>
      <motion.div
        style={{ width: '100%', height: '32rem', marginTop: '5rem', border: 0 }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          disableColumnSelector
          disableColumnMenu
          disableSelectionOnClick
          pageSize={7}
          rowsPerPageOptions={[7]}
          pagination
          onRowDoubleClick={(item) => {
            setId(item.id as number)
            setOpen(true)
          }}
          sx={{
            fontFamily: 'nanumSquare',
            fontSize: '1rem',
            borderLeft: 0,
            borderRight: 0,
          }}
          className="MuiDataGrid-aggregationColumnHeader--alignCenter"
        />
      </motion.div>
      <Dialog
        fullWidth={true}
        maxWidth="lg"
        open={open}
        onClose={() => {
          setOpen(false)
        }}
      >
        <DialogTitle fontFamily="nanumSquare">내 게시물</DialogTitle>
        <DialogContent>{id && <DetailContest id={id} />}</DialogContent>
        <DialogActions>
          <Button
            sx={{ fontFamily: 'nanumSquare' }}
            onClick={() => {
              setOpen(false)
              Router.push(`/board/contest/${id}`)
            }}
          >
            페이지로 이동
          </Button>
          <Button
            sx={{ fontFamily: 'nanumSquare' }}
            onClick={() => {
              setOpen(false)
            }}
          >
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default MyContest
