import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserAuthContext } from "../context/UserAuthProvider";
import DialogBox from "../components/DialogBox";
import { motion } from "framer-motion";
function HomePage() {
  const { user, userType } = useContext(UserAuthContext);
  const [createCustomPanelBusinessPopup, setCreateCustomPanelBusinessPopup] =
    useState(false);
  useEffect(() => {
    document.title = "Design Panels";
  }, []);

  async function handleSignOut() {
    try {
      const res = await fetch("/api/v1/general/signout", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.success === true) {
        sessionStorage.removeItem("userData");
        window.location.reload();
      }
    } catch (error) {
      alert("Error");
    }
  }
  return (
    <div className="w-full min-h-[100vh] md:h-[100vh] overflow-hidden bg-zinc-800 flex flex-col relative">
      {/* NAVBAR  */}
      <div className="w-full flex justify-end items-center p-2 shadow-xl">
        <div className="flex justify-center gap-4">
          <Link className="h-[30px] md:h-[40px] px-2 md:px-5 bg-red-600 rounded-full text-xs md:text-base flex justify-center items-center">
            Contact Us
          </Link>
          {user && userType === 5 && (
            <Link
              to={"/admin"}
              className="h-[40px] px-5 rounded-full text-base flex justify-center items-center border-2 border-red-600 text-white"
            >
              Admin Panel
            </Link>
          )}
          {user && userType === 8 && (
            <Link
              to={"/business"}
              className="h-[40px] px-5 rounded-full text-base flex justify-center items-center border-2 border-red-600 text-white"
            >
              Business Panel
            </Link>
          )}
          {user && (
            <button
              onClick={handleSignOut}
              className="bg-red-600 rounded-full text-base flex justify-center items-center hover:bg-red-800 transition-all duration-300 group overflow-hidden p-1 md:p-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="black"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                />
              </svg>
              <h2 className="max-w-0 max-h-0 opacity-0 group-hover:max-w-xs group-hover:max-h-10 group-hover:opacity-100 transition-all duration-300 overflow-hidden">
                Sign Out
              </h2>
            </button>
          )}
        </div>
      </div>

      {/* DIALOG BOX COMPONENT  */}
      <DialogBox />

      {/* Text Content */}
      <NegativeAuthContent
        user={user}
        setCreateCustomPanelBusinessPopup={setCreateCustomPanelBusinessPopup}
        userType={userType}
      />

      {userType === 8 && createCustomPanelBusinessPopup && (
        <div className="w-full h-[100vh] absolute top-0 left-0 backdrop-blur-sm z-30 bg-[rgb(10,10,10,0.2)] flex flex-col justify-center items-center">
          <div className="w-1/2 p-2 bg-white rounded-xl flex flex-col justify-start items-start">
            <div className="w-full p-2 flex justify-between items-center">
              <h1 className="font-semibold border-b-[1px] border-zinc-400">
                Create Customer Account
              </h1>
              <div
                onClick={() => setCreateCustomPanelBusinessPopup(false)}
                className="w-6 cursor-pointer h-6 bg-red-600 rounded-full flex justify-center items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6 stroke-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
            <p className="p-2 text-sm">
              Custom panel creation is not available directly from a business
              account. However, you can create a customer account using your
              business account and log in with the customer credentials to
              access the panel design features.
            </p>
            <div className="w-full flex justify-end items-center">
              <Link
                to="/business/signup/client"
                className="bg-red-600 p-2 rounded-full text-white hover:bg-red-800"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NegativeAuthContent({
  user,
  userType,
  setCreateCustomPanelBusinessPopup,
}) {
  return (
    <div className="grid grid-rows-10 grid-cols-10 relative w-full h-full p-8 gap-4 mt-4">
      <div className="hidden md:flex md:row-start-4 md:col-start-1 md:w-[0px] md:h-[0px] md:rounded-full md:shadow-[0px_0px_200px_60px_#00c2cb] md:bg-[#00c2cb]"></div>
      <div className="hidden md:flex row-start-6 col-start-11 w-[0px] h-[0px] rounded-full shadow-[0px_0px_200px_60px_#FF3131] bg-[#FF3131]"></div>
      <div className="absolute top-0 left-0 w-full h-full flex flex-col p-4 md:p-8 justify-start items-center gap-4 mt-4">
        <motion.h3
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className=" text-sm text-center md:text-2xl font-medium text-gray-400"
        >
          {!user
            ? "Transform Your Home into a Smart Heaven"
            : `Hello ${user.name} 👋`}
        </motion.h3>
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-2xl md:text-6xl font-semibold text-gray-100 text-center"
        >
          {!user
            ? "Create and Customize Smart Home Panels with Ease"
            : userType === 6
            ? "Continue Customizing or Explore New Predefined Panels"
            : userType === 8
            ? "Panels For Businesses, Create Clients And Grow"
            : "Continue Customizing or Explore New Predefined Panels"}
        </motion.h1>
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-gray-400 text-sm md:text-xl text-center px-4 md:px-28"
        >
          {!user
            ? "Welcome to our platform, where you can design your own custom smart panels or choose from our curated selection. Sign In now to start transforming your home into a smart heaven with personalized control and automation solutions."
            : "You're just a few steps away from perfecting your smart home setup. Dive back into your projects to tweak your custom panels or discover new predesigned options that add convenience and efficiency to your home environment. Your personalized smart home experience awaits!"}
        </motion.p>
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="flex md:mt-4 gap-6"
        >
          {!user ? (
            <Link
              to={"/signin"}
              className="bg-red-600 p-2 md:p-4 rounded-full font-semibold text-white text-lg flex justify-center items-center gap-2 hover:bg-red-800 transition-all duration-300"
            >
              Sign In
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          ) : userType === 6 ? (
            <>
              <Link
                to={"/normal-panels"}
                className="bg-red-600 p-2 md:p-4 rounded-full font-semibold text-white text-lg flex justify-center items-center hover:bg-red-800 transition-all duration-300"
              >
                Normal Panels
              </Link>

              <Link
                className="border-2 border-red-600 p-2 md:p-4 rounded-full font-semibold flex justify-center items-center text-white text-lg hover:bg-red-600 transition-all duration-300"
                to={"/customise"}
              >
                Custom Panels
              </Link>
            </>
          ) : userType === 8 ? (
            <button
              onClick={() => setCreateCustomPanelBusinessPopup(true)}
              to={"/normal-panels"}
              className="bg-red-600 p-2 md:p-4 rounded-full font-semibold text-white text-lg flex justify-center items-center hover:bg-red-800 transition-all duration-300"
            >
              Create Custom Panel
            </button>
          ) : (
            <></>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default HomePage;
