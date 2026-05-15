"use client";

import { useGrantStore } from "@/store/useGrantsStore";
import { columns } from "./columns";
import { DataTable } from "./grantsDataTable";
import { Project } from "@/types";
import { useEffect } from "react";
import AddGrantButton from "./addGrants";

export default function DemoPage() {
  const { grants, fetchGrants } = useGrantStore();

  // Fetch data on mount
  useEffect(() => {
    fetchGrants();
  }, [fetchGrants]);
  return (
    <>
      <div className="flex justify-end p-5 item-center">
        <AddGrantButton />
      </div>
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={grants} />
      </div>
    </>
  );
}
