import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../Navbar";
import { useContext, useEffect, useState } from "react";
import { UserAuthContext } from "../../context/UserAuthProvider";
import CollectionPanels from "./CollectionPanels";
import getCompletePdfOfComponent from "../../../data/DownloadPanels/GetCompletePdfOfComponent";
import { PanelContext } from "../../context/PanelContextProvider";
import OrderPdf from "../../../data/DownloadPanels/OrderPdf";

function CollectionPage() {
  const navigation = useNavigate();
  const { user } = useContext(UserAuthContext);
  const [collection, setCollection] = useState(null);
  const [panels, setPanels] = useState([]);
  const [normalPanels, setNormalPanels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadingPanelPdf, setDownloadingPanelPdf] = useState(false);
  const { id } = useParams();
  const [addPanelPopup, setAddPanelPopup] = useState(false);
  const [currentToolSelected, setCurrentToolSelected] = useState(0);
  const [panelLoading, setPanelLoading] = useState(false);
  const [raiseOrderPopup, setRaiseOrderPopup] = useState(false);
  const [orderHistory, setOrderHistory] = useState(false);
  const [orderUploading, setOrderUploading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const { panelSpecs, setPanelSpecs } = useContext(PanelContext);
  const [panelBasicDetail, setPanelBasicDetail] = useState({
    collectionId: id,
    panelName: "",
    panelType: "",
  });
  const { panelCollectionContext, setCurrentCollectionId } =
    useContext(PanelContext);

  //   RAISE ORDER
  async function handleRaiseOrderCollection() {
    try {
      if (!panels.length) {
        return alert(
          "There Are No Panels To Raise Order For, Have At Least One Panel"
        );
      }

      setOrderLoading(true);
      const formData = new FormData();
      const pdfBlob = await OrderPdf(panelCollectionContext);
      setOrderLoading(false);
      if (!pdfBlob) {
        setOrderLoading(false);
        return alert("Something Went Wrong, cannot generate pdf");
      }
      if (pdfBlob.size === 0) {
        setOrderLoading(false);
        return alert("Generated PDF is empty");
      }
      setOrderUploading(true);
      formData.append("file", pdfBlob, `order-${id}.pdf`);
      const userData = JSON.parse(sessionStorage.getItem("userData"));
      const resPDF = await fetch(`/api/v1/user/upload-order/${userData._id}`, {
        method: "POST",
        body: formData,
      });
      const dataPDF = await resPDF.json();
      if (dataPDF.success === false) {
        setOrderUploading(false);
        return alert(dataPDF.message);
      }
      const res = await fetch("/api/v1/user/raise-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          panels,
          userID: user._id,
          pdfLink: dataPDF.downloadURL,
        }),
      });
      const data = await res.json();
      if (data.success === true) {
        alert(
          `Order Raised Successful, Your Reference Number = ${data.referenceNumber}`
        );
        setRaiseOrderPopup(false);
      } else {
        alert(data.message);
      }
      setOrderUploading(false);
    } catch (error) {
      setOrderUploading(false);
      alert("Error", `Something Went Wrong`);
    }
  }
  //GET COLLECTION
  async function GetCollection() {
    try {
      setLoading(true);
      setCurrentCollectionId(id);
      const res = await fetch("/api/v1/general/get-collection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (res.ok && data.success === true) {
        setCollection(data.collection);
        setPanels(data.collection.panels);
        if (data.collection.panels.length > 0) {
          setPanelSpecs({
            ...panelSpecs,
            droppableType:
              data.collection.panels[0].panelData.droppableType || "1",
          });
        }
        setNormalPanels(data.collection.normalPanels);
      } else {
        alert(data.message);
      }
      setLoading(false);
    } catch (error) {
      alert(JSON.stringify(error));
    }
  }
  useEffect(() => {
    GetCollection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // HANDLE CREATE PANEL
  async function HandleCreatePanel() {
    try {
      setPanelLoading(true);
      const res = await fetch("/api/v1/general/basic-panel-detail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(panelBasicDetail),
      });
      const data = await res.json();
      if (data.success === true) {
        setLoading(false);
        setCurrentCollectionId(id);
        setTimeout(() => {
          return navigation(`/panel/${data.panelId}`);
        }, 500);
      } else {
        alert("Error", data.message);
      }
      setPanelLoading(false);
    } catch (error) {
      setPanelLoading(false);
      alert("ERROR");
    }
  }

  return (
    <div className="w-full min-h-screen relative bg-zinc-800 flex flex-col ">
      {/* NAVBAR  */}

      <Navbar
        firstHead={user.name.split(" ")[0].toLowerCase()}
        secondHead={user.name.split(" ")[1]?.toLowerCase()}
      />

      {/* MAIN COLLECTION  */}
      <div className="w-full h-full flex justify-center items-center">
        {loading ? (
          <img className="w-[10%]" src="/loader.gif" />
        ) : (
          <div className="w-full h-full p-4 mt-8 flex flex-col">
            {/* TEXT  */}
            <div className="flex flex-col justify-center items-center gap-2 p-4">
              <h1 className="text-5xl text-white font-medium w-1/2 flex justify-center items-center border-b-2 border-red-600">
                {collection?.name.toUpperCase()}
              </h1>
              <p className="text-lg text-gray-200 font-medium text-center w-1/2 break-words">
                {collection?.description}
              </p>
            </div>

            {/* TOOLBAR  */}
            <div className="w-full flex mt-5 border-b-2 border-red-600 justify-between">
              <div className="flex ">
                <h2
                  onClick={() => setCurrentToolSelected(0)}
                  className={`text-lg text-white  ${
                    currentToolSelected === 0
                      ? "bg-red-600"
                      : "hover:bg-red-500"
                  } p-2 cursor-pointer flex justify-center items-center gap-1`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="white"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm.75-12h9v9h-9v-9Z"
                    />
                  </svg>
                  Panels
                </h2>
                <div
                  onClick={async () => {
                    setDownloadingPanelPdf(true);
                    await new Promise((resolve) => {
                      setTimeout(async () => {
                        await getCompletePdfOfComponent(panelCollectionContext);
                        resolve();
                        setTimeout(() => {
                          setDownloadingPanelPdf(false);
                        }, 5000);
                      }, 500);
                    });
                  }}
                  className="flex justify-center items-center bg-red-600 border-l-2 border-red-800 cursor-pointer p-2 group transition-all duration-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="white"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m-6 3.75 3 3m0 0 3-3m-3 3V1.5m6 9h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75"
                    />
                  </svg>

                  <h2 className="max-w-0 max-h-0 opacity-0 group-hover:max-w-xs group-hover:max-h-10 group-hover:opacity-100 transition-all duration-300 overflow-hidden text-white">
                    Download Collection PDF
                  </h2>
                </div>

                {/* RAISE ORDER  */}
                <div
                  onClick={() => setRaiseOrderPopup(true)}
                  className="flex justify-center items-center bg-red-600 border-l-2 border-red-800 cursor-pointer p-2 group transition-all duration-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="white"
                    className="size-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                    />
                  </svg>

                  <h2 className="max-w-0 max-h-0 opacity-0 group-hover:max-w-xs group-hover:max-h-10 group-hover:opacity-100 transition-all duration-300 overflow-hidden text-white">
                    Raise Order
                  </h2>
                </div>

                {/* VIEW ORDER HISTORY  */}
                <div
                  onClick={() => setOrderHistory(true)}
                  className="flex justify-center items-center bg-red-600 border-l-2 border-red-800 cursor-pointer p-2 group transition-all duration-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="white"
                    className="size-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                    />
                  </svg>

                  <h2 className="max-w-0 max-h-0 opacity-0 group-hover:max-w-xs group-hover:max-h-10 group-hover:opacity-100 transition-all duration-300 overflow-hidden text-white">
                    Order History
                  </h2>
                </div>
              </div>

              {/* SEARCH  */}

              <div className="w-1/4">
                <div className="bg-zinc-800 border-x-2 border-red-600 border-t-2 flex justify-center overflow-hidden p-2 items-center">
                  <input
                    placeholder="Search For Panels"
                    className="w-[90%] bg-zinc-800 focus:outline-none outline:border-none text-white"
                  />
                  <div className="w-[10%]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="red"
                      className="size-8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* TOOLBAR VAL  */}
            {currentToolSelected === 0 ? (
              <CollectionPanels
                downloadingPanelPdf={downloadingPanelPdf}
                setAddPanelPopup={setAddPanelPopup}
                panels={panels}
                normalPanels={normalPanels}
              />
            ) : (
              <></>
            )}
          </div>
        )}
      </div>

      {/* RAISE ORDER POPUP  */}
      {raiseOrderPopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-[rgb(20,20,20,0.4)] z-10 flex justify-center items-center backdrop-blur-sm">
          <div className=" w-1/2 p-4 py-6 border-2 border-red-800 rounded-xl bg-zinc-900 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-semibold text-white border-b-2 border-red-600">
                Raise Order
              </h1>
            </div>

            <div>
              <h1 className="text-white">
                Do you want to raise order for{" "}
                <span className="text-red-600">{collection?.name},</span>
                This will send your details along with the details of
                collection, then our experts will contact you with the final
                product.
              </h1>
            </div>

            <div className="w-full flex justify-end gap-2">
              <button
                onClick={() => setRaiseOrderPopup(false)}
                className="p-2 bg-red-600 hover:bg-red-800 transition-all duration-200 rounded-full text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleRaiseOrderCollection}
                className="p-2 border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-200 rounded-full"
              >
                {orderLoading
                  ? "Order Generating..."
                  : orderUploading
                  ? "Uploading Order..."
                  : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PANEL POPUP  */}
      {addPanelPopup && (
        <div
          className="fixed w-full h-full bg-[rgb(10,10,10,0.5)] flex justify-center items-center top-0 left-0 z-50
        "
        >
          <div className="w-[600px] flex flex-col p-4 rounded-xl border-y-2 border-red-600 bg-zinc-950 gap-2">
            <div className="w-full flex justify-between items-center ">
              <h2 className="text-white text-2xl font-semibold border-b-2 border-red-600">
                Add Panel
              </h2>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="red"
                onClick={() => setAddPanelPopup(false)}
                className="size-8 hover:stroke-red-800 cursor-pointer transition-all duration-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </div>

            {/* PANEL FORM  */}
            <div className="flex flex-col justify-start items-start mt-4 gap-4">
              <div>
                <h2 className="text-base text-red-600 mb-2">Panel Name</h2>
                <input
                  onChange={(e) => {
                    setPanelBasicDetail({
                      ...panelBasicDetail,
                      panelName: e.target.value,
                    });
                  }}
                  className="p-2 bg-zinc-900 w-full rounded-lg text-white focus:outline-none focus:border-none"
                  placeholder="Name Your Panel"
                />
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  <h2 className="text-base text-red-600">Panel Type</h2>
                  <p className="text-sm text-zinc-400">Select The Panel Type</p>
                </div>
                <div className="flex gap-2">
                  <h3
                    onClick={() => {
                      setPanelBasicDetail({
                        ...panelBasicDetail,
                        panelType: "normal",
                      });
                    }}
                    className={`p-2 ${
                      panelBasicDetail.panelType === "normal"
                        ? "bg-red-600 text-white"
                        : ""
                    } border-x-[2px] border-red-600 text-white rounded-full flex justify-center items-center cursor-pointer hover:bg-red-600`}
                  >
                    Panel Without Extension
                  </h3>
                  <h3
                    onClick={() => {
                      setPanelBasicDetail({
                        ...panelBasicDetail,
                        panelType: "extension",
                      });
                    }}
                    className={`p-2 ${
                      panelBasicDetail.panelType === "extension"
                        ? "bg-red-600 text-white"
                        : ""
                    } border-x-2 border-red-600 text-white rounded-full flex justify-center items-center cursor-pointer hover:bg-red-600`}
                  >
                    Panel With Extensions
                  </h3>
                </div>
              </div>
            </div>

            {/* PANEL SUBMIT BUTTON  */}
            <div className="w-full p-2 flex justify-end items-center">
              <button
                onClick={HandleCreatePanel}
                className="p-2 px-4 rounded-full bg-red-600"
              >
                {panelLoading ? "Loading..." : "ADD +"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ORDER HISTORY  */}
      {orderHistory && (
        <OrderHistoryPopup
          setOrderHistory={setOrderHistory}
          userID={user._id}
        />
      )}
      {downloadingPanelPdf && <DownloadingPanelPdf />}
    </div>
  );
}

function OrderHistoryPopup({ setOrderHistory, userID }) {
  const [completeHistory, setCompleteHistory] = useState(null);
  async function GetOrderHistory() {
    try {
      const res = await fetch("/api/v1/user/get-order-history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID }),
      });
      const data = await res.json();
      if (data.success === true) {
        setCompleteHistory(data.data);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Something went wrong while fetching the history");
    }
  }
  useEffect(() => {
    GetOrderHistory();
  }, []);

  return (
    <div className="fixed z-50 bg-[rgb(20,20,20,0.8)] backdrop-blur-xl overflow-y-scroll w-1/2 h-[100vh] top-0 left-0 border-l-2 border-black">
      {/* HEADER  */}
      <div className="p-2 flex justify-between items-center">
        <h1 className="text-white text-xl font-semibold border-b-2 border-red-600">
          Your Order History
        </h1>
        <div onClick={() => setOrderHistory(false)} className="cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="red"
            className="size-8 hover:stroke-red-900"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </div>
      </div>

      {/* BODY  */}
      {completeHistory === null ? (
        <div className="w-full h-full flex justify-center items-center">
          <img src="/loader.gif" className="w-[100px] h-[100px]" />
        </div>
      ) : (
        <div className="w-full h-full p-2">
          {completeHistory.map((item, index) => (
            <div key={index} className="bg-zinc-900 rounded-md p-2">
              <h1 className="text-md text-white font-medium">
                <span className="text-red-600">Reference Number</span>{" "}
                {item.referenceNumber}
              </h1>
              <h1 className="text-md text-white font-medium">
                <span className="text-red-600">Raised At</span> {item.createdAt}
              </h1>
              <h1 className="text-md text-white font-medium">
                <span className="text-red-600">Number Of Panels</span>{" "}
                {item.panelData.length}
              </h1>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DownloadingPanelPdf() {
  return (
    <div className="w-full fixed top-0 left-0 h-[100vh] bg-zinc-900 z-50 flex flex-col justify-center items-center">
      <img className="w-[200px]" src="/loader.gif" />
      <h1 className="text-white font-semibold text-xl">DOWNLOADING</h1>
    </div>
  );
}

export default CollectionPage;
