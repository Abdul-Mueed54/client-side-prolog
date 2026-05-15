"use client";

import { useDomainsStore } from "@/store/useDomainStore";
import { columns } from "./columns";
import { DataTable } from "./domainsDataTable";
import { Domains } from "@/types";
import { useEffect } from "react";

export default function DomainsTable() {
  const { domains, fetchDomains } = useDomainsStore();

  // Fetch data on mount
  useEffect(() => {
    fetchDomains();
  }, [fetchDomains]);
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={domains} />
    </div>
  );
}
