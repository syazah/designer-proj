import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserAuthContext } from "../context/UserAuthProvider";

function HomePage() {
  const { user, userType } = useContext(UserAuthContext);
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
    <div className="w-full h-[100vh] bg-zinc-800 flex flex-col">
      {/* NAVBAR  */}
      <div className="w-full flex justify-between items-center p-2 shadow-xl">
        <div>
          <h1 className="text-2xl font-semibold tracking-wider text-white">
            ALISAN
          </h1>
        </div>
        <div className="flex justify-center gap-4">
          <Link className="h-[40px] px-5 bg-red-600 rounded-full text-base flex justify-center items-center">
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
              className="bg-red-600 rounded-full text-base flex justify-center items-center hover:bg-red-800 transition-all duration-300 group overflow-hidden p-2"
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
      {/* Text Content */}
      <NegativeAuthContent user={user} userType={userType} />
    </div>
  );
}

function NegativeAuthContent({ user, userType }) {
  return (
    <div className="grid grid-rows-10 grid-cols-10 relative w-full h-full p-8 gap-4 mt-4">
      <div className="row-start-4 col-start-1 w-[0px] h-[0px] rounded-full shadow-[0px_0px_200px_60px_#00c2cb] bg-[#00c2cb]"></div>
      <div className="row-start-6 col-start-11 w-[0px] h-[0px] rounded-full shadow-[0px_0px_200px_60px_#FF3131] bg-[#FF3131]"></div>
      <div className="absolute top-0 left-0 w-full flex flex-col p-8 justify-start items-center gap-4 mt-4">
        <h3 className="text-2xl font-medium text-gray-400">
          {!user
            ? "Transform Your Home into a Smart Heaven"
            : `Hello ${user.name} 👋`}
        </h3>
        <h1 className="text-6xl font-semibold text-gray-100 text-center">
          {!user
            ? "Create and Customize Smart Home Panels with Ease"
            : userType === 6
            ? "Continue Customizing or Explore New Predefined Panels"
            : userType === 8
            ? "Panels For Businesses, Create Clients And Grow"
            : "Continue Customizing or Explore New Predefined Panels"}
        </h1>
        <p className="text-gray-400 text-xl text-center px-28">
          {!user
            ? "Welcome to our platform, where you can design your own custom smart panels or choose from our curated selection. Sign In now to start transforming your home into a smart heaven with personalized control and automation solutions."
            : "You're just a few steps away from perfecting your smart home setup. Dive back into your projects to tweak your custom panels or discover new predesigned options that add convenience and efficiency to your home environment. Your personalized smart home experience awaits!"}
        </p>
        <div className="flex mt-4 gap-6">
          {!user ? (
            <Link
              to={"/signin"}
              className="bg-red-600 p-4 rounded-full font-semibold text-white text-lg flex justify-center items-center gap-2 hover:bg-red-800 transition-all duration-300"
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
              <Link className="bg-red-600 p-4 rounded-full font-semibold text-white text-lg flex justify-center items-center hover:bg-red-800 transition-all duration-300">
                Normal Panels
              </Link>
              <Link
                className="border-2 border-red-600 p-4 rounded-full font-semibold flex justify-center items-center text-white text-lg hover:bg-red-600 transition-all duration-300"
                to={"/customise"}
              >
                Custom Panels
              </Link>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
