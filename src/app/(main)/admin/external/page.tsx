"use client";

import { useExternalStore } from "@/store/useExternalStore";
import { columns } from "./columns";
import { DataTable } from "./externalsDataTable";
import { useEffect } from "react";
import AddExternalButton from "./addExternal";


export default  function ExternalSupervisorsTable() {
  const { externals, fetchExternals, addExternal } = useExternalStore();

  useEffect(() => {
    fetchExternals();
  }, [fetchExternals, addExternal]);
return (
    <>
      <div className="flex justify-end p-3 item-center">
        <AddExternalButton />
      </div>
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={externals} />
    </div>
    </>
  );
}
