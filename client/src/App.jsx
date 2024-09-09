import { Suspense, lazy, useContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Loading from "./components/Loading";
import { UserAuthContext } from "./context/UserAuthProvider";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const Home = lazy(() => import("./pages/HomePage"));
const PanelPage = lazy(() => import("./pages/PanelPage"));
const Admin = lazy(() => import("./pages/AdminPage"));
const Business = lazy(() => import("./pages/BusinessPanelPage"));
const CustomPanel = lazy(() => import("./pages/CustomPanelPage"));
const ErrorPage = lazy(() => import("./pages/ErrorNotFound"));
const ViewNormalPanel = lazy(() => import("./pages/ViewNormalPanel"));
const CollectionPage = lazy(() =>
  import("./components/CustomiseComponents/CollectionPage")
);
const MainAdmin = lazy(() =>
  import("./components/AdminComponents/MainAdminBoxes")
);
const NormalPage = lazy(() => import("./pages/NormalPage"));
const MainBusiness = lazy(() =>
  import("./components/BusinessComponents/MainBusinessBoxes")
);
const ClientSignUp = lazy(() =>
  import("./components/AdminComponents/ClientSignUp")
);
const BusinessSignUp = lazy(() =>
  import("./components/AdminComponents/BusinessSignUp")
);
const ViewUsers = lazy(() => import("./components/AdminComponents/ViewUsers"));
const ViewBusinesses = lazy(() =>
  import("./components/AdminComponents/ViewBusinesses")
);
const UserDetail = lazy(() =>
  import("./components/AdminComponents/UserDetail")
);
const BusinessDetail = lazy(() =>
  import("./components/AdminComponents/BusinessDetail")
);
const ViewUsersBusiness = lazy(() =>
  import("./components/BusinessComponents/ViewUsersBusiness")
);
const SmallScreenComponent = lazy(() => import("./pages/SmallScreenComponent"));
const SignIn = lazy(() => import("./pages/SignInPage"));
function App() {
  const width = window.innerWidth;
  const { userType, user } = useContext(UserAuthContext);
  return (
    <Suspense fallback={<Loading />}>
      <DndProvider backend={HTML5Backend}>
        <BrowserRouter>
          <Routes>
            <Route index element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route
              path="/customise"
              element={user !== null ? <CustomPanel /> : <ErrorPage />}
            />
            <Route
              path="/admin"
              element={userType === 5 ? <Admin /> : <ErrorPage />}
            >
              <Route index element={<MainAdmin />} />
              <Route path="signup/client" element={<ClientSignUp />} />
              <Route path="signup/business" element={<BusinessSignUp />} />
              <Route path="view/users" element={<ViewUsers />} />
              <Route path="view/businesses" element={<ViewBusinesses />} />
              <Route path="detail/user/:id" element={<UserDetail />} />
              <Route path="detail/business/:id" element={<BusinessDetail />} />
            </Route>
            <Route
              path="/business"
              element={userType === 8 ? <Business /> : <ErrorPage />}
            >
              <Route index element={<MainBusiness />} />
              <Route path="signup/client" element={<ClientSignUp />} />
              <Route path="view/users" element={<ViewUsersBusiness />} />
              <Route path="detail/user/:id" element={<UserDetail />} />
            </Route>
            <Route
              path="/collection/:id"
              element={
                user !== null ? (
                  width < 750 ? (
                    <SmallScreenComponent />
                  ) : (
                    <CollectionPage />
                  )
                ) : (
                  <ErrorPage />
                )
              }
            />
            <Route
              path="/panel/:id"
              element={
                user !== null ? (
                  width < 750 ? (
                    <SmallScreenComponent />
                  ) : (
                    <PanelPage />
                  )
                ) : (
                  <ErrorPage />
                )
              }
            />
            <Route
              path="/normal-panels"
              element={user !== null ? <NormalPage /> : <ErrorPage />}
            />
            <Route
              path="/normal-panels/:id"
              element={user !== null ? <ViewNormalPanel /> : <ErrorPage />}
            />
          </Routes>
        </BrowserRouter>
      </DndProvider>
    </Suspense>
  );
}

export default App;
