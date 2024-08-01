import { useParams } from "react-router-dom";
import Panel from "../components/PanelComponents/Panel";
import ComNavbar from "../components/NormalComponents/ComNavbar";
import { useEffect, useState } from "react";
import Loading from "../components/Loading";
function ViewNormalPanel() {
  const { id } = useParams();
  const [panelInfo, setPanelInfo] = useState(null);
  const [collectionsInfo, setCollectionsInfo] = useState(null);

  async function GETPanel() {
    try {
      const userData = sessionStorage.getItem("userData");
      const _id = JSON.parse(userData);
      const res = await fetch("/api/v1/user/normal-panel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID: _id, panelID: id }),
      });
      const data = await res.json();
      if (data.success === true) {
        setCollectionsInfo(data.collections.collectionsCreated);
        setPanelInfo(data.panel);
      } else {
        alert("Error", data.message);
      }
    } catch (error) {
      alert("Error");
    }
  }
  useEffect(() => {
    GETPanel();
  }, []);
  return (
    <div className="w-full h-[100vh] flex flex-col bg-gray-300">
      <ComNavbar />
      {panelInfo === null || collectionsInfo === null ? (
        <Loading />
      ) : (
        <div className="w-full h-full flex flex-col">
          <div className="w-full p-2 flex flex-col justify-start items-start border-b-[2px] border-zinc-900">
            <h1 className="text-3xl font-semibold">{panelInfo.name}</h1>
            <h1 className="text-xl font-medium">
              {panelInfo.size} Module Standard Panel
            </h1>
          </div>
          <div className="flex w-full h-full">
            <div className="w-[1000px] h-full border-r-[2px] border-zinc-900 flex justify-center items-center">
              <Panel
                normalPanel={true}
                normalPanelRegSize={true}
                panelSize={panelInfo.size}
                panelFrame={panelInfo.frame}
                panelGlass={panelInfo.glass}
                panelVariant={panelInfo.variant}
                panelIcons={{}}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewNormalPanel;
