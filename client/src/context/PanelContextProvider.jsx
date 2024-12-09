import { createContext, useEffect, useState } from "react";

const PanelContext = createContext(null);
function PanelContextProvider({ children }) {
  const [panelSpecs, setPanelSpecs] = useState({
    panelSize: 2,
    panelVariant: [],
    bigPanelVariant: [[], []],
    panelIcons: {},
    panelGlass: "#000",
    panelFrame: "#ddd",
    panelWall: "",
    droppableType: 1,
    droppableColor: "#17c5e2",
    savedSpaceLeft: 12,
    savedUpSpace: 6,
    fanIcon: {
      id: "70",
      src: "/ICONS/fans/70.png",
    },
    dimmerIcon: { id: "AB04", src: "/ICONS/alphabets/alphabet-d.png" },
    extensionTypeOne: "",
    extensionTypeTwo: "",
  });
  const [spaceLeft, setSpaceLeft] = useState(panelSpecs.panelSize);
  const [panelCollectionContext, setPanelCollectionContext] = useState(null);

  const [initialSignIn, setInitialSignIn] = useState(false);
  const [upSpace, setUpSpace] = useState(6);
  const [currentCollectionId, setCurrentCollectionId] = useState("");
  const [twelveModExtError, setTwelveModExtError] = useState(false);
  useEffect(() => {
    if (panelSpecs.panelSize) {
      setSpaceLeft(panelSpecs.panelSize);
    }
  }, [panelSpecs.panelSize]);
  return (
    <PanelContext.Provider
      value={{
        panelSpecs,
        setPanelSpecs,
        spaceLeft,
        setSpaceLeft,
        panelCollectionContext,
        setPanelCollectionContext,
        initialSignIn,
        setInitialSignIn,
        currentCollectionId,
        setCurrentCollectionId,
        upSpace,
        setUpSpace,
        twelveModExtError,
        setTwelveModExtError,
      }}
    >
      {children}
    </PanelContext.Provider>
  );
}

export { PanelContextProvider, PanelContext };
