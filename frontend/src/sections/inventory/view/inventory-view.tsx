import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { _inventory } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../table-no-data';
import { InventoryTableRow } from '../inventory-table-row';
import { InventoryTableHead } from '../inventory-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { InventoryTableToolbar } from '../inventory-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

import type { InventoryProps } from '../inventory-table-row';

const url = 'ws://127.0.0.1:8000/ws/socket-server/';
const inventoryWs = new WebSocket(url);

// ----------------------------------------------------------------------

export function InventoryView() {
  const table = useTable();

  const [filterName, setFilterName] = useState('');
  const [inventoryData, setInventoryData] = useState(_inventory);
  const [highlightedRows, setHighlightedRows] = useState<string[]>([]);

  inventoryWs.onmessage = (e) => {
    const parsedMessage = JSON.parse(e.data);
    const wsMessage = parsedMessage?.message;

    setHighlightedRows((prev) => [...prev, wsMessage.id]);

    setTimeout(() => {
      setHighlightedRows((prev) => prev.filter((id) => id !== wsMessage.id));
    }, 1500);

    setInventoryData((prevInventory) => {
      const updatedInventory = [...prevInventory];
      const index = updatedInventory.findIndex((item) => item.id === wsMessage.id);

      if (index !== -1) {
        updatedInventory[index] = wsMessage;
      } else {
        updatedInventory.push(wsMessage);
      }

      return updatedInventory;
    });
  };

  const dataFiltered: InventoryProps[] = applyFilter({
    inputData: inventoryData,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Inventory
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          New Asset
        </Button>
      </Box>

      <Card>
        <InventoryTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <InventoryTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={inventoryData.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    inventoryData.map((item) => item.id)
                  )
                }
                headLabel={[
                  { id: 'cusip', label: 'CUSIP' },
                  { id: 'name', label: 'Name' },
                  { id: 'maturity', label: 'Maturity' },
                  { id: 'offered', label: 'Offered', align: 'center' },
                  { id: 'liquidity', label: 'Liquidity' },
                  { id: 'quantity', label: 'Quantity' },
                  { id: 'price', label: 'Price' },
                  { id: 'yield', label: 'Yield' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <InventoryTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      isHighlighted={highlightedRows.includes(row.id)}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, inventoryData.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={inventoryData.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}
