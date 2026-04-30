import PrimarySidebar from "../components/layouts/primarySidebar";
import SecondarySidebar from "../components/layouts/secondarySidebar";

export default function Guest() {
  return (
    <div className="flex h-screen overflow-hidden">
      <PrimarySidebar />
      <main className="flex-1 min-w-0 p-4 bg-[#eeeeee]">
        <MainWindow />
      </main>
      <div className="shrink-0 w-80 min-w-[20rem] max-w-[20rem]">
        <SecondarySidebar />
      </div>
    </div>
  );
}