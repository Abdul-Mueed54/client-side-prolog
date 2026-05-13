import { columns } from "./columns"
import { DataTable } from "./projectsDataTable"
import { Project } from "@/types"

async function getData(): Promise<Project[]> {
  // Fetch data from your API here.
  return [
   
    // ...
  ]
}

export default async function DemoPage() {
  const data = await getData()
  // const columns = await ProjectColumn()
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}