import { ColumnDef } from "@tanstack/react-table";
import { AuditLog } from "@/types";
import { format } from "date-fns"; // library for formatting dates
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const columns: ColumnDef<AuditLog>[] = [
  {
    accessorKey: "tableName",
    header: "Table",
    cell: ({ row }) => (
      <span className="font-medium text-slate-700 capitalize">
        {row.getValue("tableName")}
      </span>
    ),
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      const action = row.getValue("action") as string;

      // Dynamic badges based on the action type
      let badgeStyle = "bg-slate-100 text-slate-700 border-slate-200"; // Default

      if (action === "INSERT") {
        badgeStyle = "bg-emerald-50 text-emerald-700 border-emerald-200";
      } else if (action === "UPDATE") {
        badgeStyle = "bg-blue-50 text-blue-700 border-blue-200";
      } else if (action === "DELETE") {
        badgeStyle = "bg-red-50 text-red-700 border-red-200";
      }

      return (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border ${badgeStyle}`}
        >
          {action}
        </span>
      );
    },
  },
  {
    accessorKey: "changedAt",
    header: "Timestamp",
    cell: ({ row }) => {
      const rawDate = row.getValue("changedAt") as string | undefined;

      if (!rawDate) {
        return <span className="text-sm text-slate-400">Unknown Date</span>;
      }

      const date = new Date(rawDate);

      if (isNaN(date.getTime())) {
        return <span className="text-sm text-slate-400">Invalid Date</span>;
      }

      return (
        <span className="text-sm text-slate-500">
          {format(date, "MMM dd, yyyy, p")}
        </span>
      );
    },
  },
  {
    id: "details",
    header: "Details",
    cell: ({ row }) => {
      const log = row.original;

      return (
        <Dialog>
          {/* 1. The Button that opens the modal */}
          <DialogTrigger
            render={
              <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                View Changes
              </button>
            }
          ></DialogTrigger>
          <DialogContent className="max-w-[95vw] w-[95vw] h-[70vh] max-h-[70vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                Log Details{" "}
                <span className="text-slate-400 font-normal text-sm">
                  | ID: {log.id}
                </span>
              </DialogTitle>
            </DialogHeader>

            {/* A split 2-column view for Old vs New data */}
            <div className="grid grid-rows-2 gap-4 mt-2 overflow-y-auto pr-2 ">
              {/* LEFT COLUMN: Old Data */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between bg-slate-100 p-2 rounded-t-md border border-slate-200 border-b-0">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    Old Data
                  </h3>
                </div>
                <pre className="flex-1 bg-slate-50 p-4 rounded-b-md border border-slate-200 text-xs overflow-auto text-slate-700">
                  {log.oldData ? (
                    JSON.stringify(log.oldData, null, 2)
                  ) : (
                    <span className="text-slate-400 italic">
                      No previous data (New record)
                    </span>
                  )}
                </pre>
              </div>

              {/* RIGHT COLUMN: New Data */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between bg-blue-50 p-2 rounded-t-md border border-blue-200 border-b-0">
                  <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                    New Data
                  </h3>
                </div>
                <pre className="flex-1 bg-blue-50/30 p-4 rounded-b-md border border-blue-200 text-xs overflow-auto text-slate-700">
                  {log.newData ? (
                    JSON.stringify(log.newData, null, 2)
                  ) : (
                    <span className="text-slate-400 italic">
                      No new data (Deleted record)
                    </span>
                  )}
                </pre>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      );
    },
  },
];
