"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  SortingState,
  getSortedRowModel,
  getCoreRowModel,
  // getPaginationRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  VisibilityState,
  useReactTable,
} from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProjectStore } from "@/store/useProjectStore";

interface DataTableProps<TData, TValue> {
  archiveProjects: boolean
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  archiveProjects,
  columns,
  data,
}: DataTableProps<TData, TValue>) {

  const {fetchProjects } = useProjectStore();
  const [searchTerm, setSearchTerm] = React.useState("");

  React.useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProjects(1, searchTerm, archiveProjects);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, fetchProjects]);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: { sorting, columnFilters, columnVisibility, },
  });

  const { error, currentPage, isLoading, totalPages } =
    useProjectStore();

  return (
    <div className="rounded-2xl p-4 bg-[#ffffff] ">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter projects by title, domain, ID, supervisor, etc..."
          value={searchTerm}
          onChange={(event) =>
            setSearchTerm(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="outline" className="ml-auto" />}
          >
            Columns
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table className="">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {error ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-red-500 font-medium"
                >
                  Failed to connect DB
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex items-center justify-end p-3 space-x-2 py-4">
          <Button
            variant={"outline"}
            size={"sm"}
            onClick={() => fetchProjects(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
          >
            Previous
          </Button>

          <span className="text-sm text-slate-500">
            Page {currentPage} of {totalPages}
          </span>

          <Button
            variant={"outline"}
            size={"sm"}
            onClick={() => fetchProjects(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
