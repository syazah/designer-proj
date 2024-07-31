import ComNavbar from "../components/NormalComponents/ComNavbar";
import ComTopbar from "../components/NormalComponents/ComTopbar";
import NormalPanelContent from "../components/NormalComponents/NormalPanelContent";
import NormalSidebar from "../components/NormalComponents/NormalSidebar";

function NormalPage() {
  return (
    <div className="w-full flex flex-col min-h-[100vh] bg-gray-200">
      <ComTopbar />
      <ComNavbar />
      <div className="flex justify-center items-center p-4 border-b-[2px] border-zinc-900">
        <h1 className="text-5xl font-semibold ">ALL</h1>
      </div>
      <div className="flex w-full flex-grow">
        <NormalSidebar />
        <NormalPanelContent />
      </div>
    </div>
  );
}

export default NormalPage;
