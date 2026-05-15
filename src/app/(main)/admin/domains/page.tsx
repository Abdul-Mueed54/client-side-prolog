"use client";

import { useDomainsStore } from "@/store/useDomainStore";
import { columns } from "./columns";
import { DataTable } from "./domainsDataTable";
import { useEffect } from "react";
import AddDomainButton from "./addDomains";

export default function DomainsTable() {
  const { domains, fetchDomains, addDomain } = useDomainsStore();

  // Fetch data on mount
  useEffect(() => {
    fetchDomains();
  }, [fetchDomains, addDomain]);
  return (
    <>
      <div className="flex justify-end p-5 item-center">
        <AddDomainButton />
      </div>
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={domains} />
      </div>
    </>
  );
}
