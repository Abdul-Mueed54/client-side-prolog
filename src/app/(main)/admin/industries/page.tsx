"use client";

import { useIndustryStore } from "@/store/useIndustryStore";
import { columns } from "./columns";
import { DataTable } from "./industryDataTable";
import { useEffect } from "react";
import AddIndustryButton from "./addIndustry";

export default function DemoPage() {
  const { industries, fetchIndustries } = useIndustryStore();

  useEffect(() => {
    fetchIndustries();
  }, [fetchIndustries]);
  return (
    <>
      <div className="flex justify-end p-5 item-center">
        <AddIndustryButton />
      </div>
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={industries} />
      </div>
    </>
  );
}
