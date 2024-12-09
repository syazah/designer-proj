import { useContext, useState } from "react";
import { UserAuthContext } from "../context/UserAuthProvider";
import { useNavigate } from "react-router-dom";
import { PanelContext } from "../context/PanelContextProvider";
import { motion } from "framer-motion";
function SignInPage() {
  const [signInOption, setSignInOption] = useState("");
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotPasswordSection, setForgotPasswordSection] = useState(false);
  return (
    <div className="w-full h-[100vh] bg-zinc-950 p-4 flex flex-col relative">
      {/* SIGN IN METHOD SELECTOR  */}
      <div className="flex justify-start items-center w-full border-b-2 border-zinc-900 gap-2">
        <h1 className=" text-red-600 text-xl py-2 font-semibold ">
          Sign In As
        </h1>
        <select
          onChange={(e) => {
            setSignInOption(e.target.value);
            setFormData({});
          }}
          className="bg-zinc-950 text-white font-semibold text-xl cursor-pointer"
          defaultValue={""}
        >
          <option
            value={""}
            className="text-white font-semibold cursor-pointer"
            disabled
          >
            Select
          </option>
          <option
            value={"client"}
            className="text-white font-semibold cursor-pointer"
          >
            Client
          </option>
          <option
            value={"business"}
            className="text-white font-semibold cursor-pointer"
          >
            Business
          </option>
        </select>
      </div>

      {/* LOGIN  */}
      <div className="w-full h-full flex flex-col md:flex-row justify-center items-center pt-2">
        <div className="w-full md:w-1/2 h-full">
          {signInOption === "client" ? (
            <ClientLogin
              formData={formData}
              setFormData={setFormData}
              error={error}
              setError={setError}
              loading={loading}
              setLoading={setLoading}
              setForgotPasswordSection={setForgotPasswordSection}
            />
          ) : signInOption === "business" ? (
            <BusinessLogin
              formData={formData}
              setFormData={setFormData}
              error={error}
              setError={setError}
              loading={loading}
              setLoading={setLoading}
              setForgotPasswordSection={setForgotPasswordSection}
            />
          ) : (
            <div className="flex w-full h-full justify-center items-center gap-2">
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
                  d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
                />
              </svg>
              <h1 className="text-white">Choose The Sign In Option</h1>
            </div>
          )}
        </div>

        <div className="w-full md:w-1/2 h-full bg-[url('https://cdn.pixabay.com/photo/2020/07/19/09/55/man-5419522_1280.jpg')] bg-no-repeat bg-cover bg-center"></div>
      </div>
      {forgotPasswordSection && (
        <ForgotPasswordSection
          signInOption={signInOption}
          setForgotPasswordSection={setForgotPasswordSection}
        />
      )}
    </div>
  );
}

function BusinessLogin({
  formData,
  setFormData,
  error,
  setError,
  loading,
  setLoading,
  setForgotPasswordSection,
}) {
  const { setUser } = useContext(UserAuthContext);
  const navigate = useNavigate();
  const { setInitialSignIn } = useContext(PanelContext);
  function handleFormData(e) {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value.trim(" ").trim(" "),
    });
  }

  async function handleBusinessLogin(e) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/v1/business/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
      }
      if (res.ok && data.success === true) {
        setUser(data.userData);
        setInitialSignIn(true);
        return navigate("/");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(JSON.stringify(error));
    }
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center px-2 py-4 gap-4">
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-white font-bold text-3xl">
          Welcome Back{" "}
          <span className="text-red-600">
            {Object.keys(formData).length > 0 && formData.name}
          </span>
        </h1>
        <p className="text-white font-normal text-lg">Enter Your Details</p>
      </div>
      <form
        onSubmit={handleBusinessLogin}
        className="flex flex-col justify-start items-start w-2/3 gap-2"
      >
        <label className="flex flex-col justify-start items-start gap-2 w-full">
          <h3 className="text-lg text-white">Business Name</h3>
          <input
            id="name"
            onChange={handleFormData}
            placeholder="xyz company"
            className="w-full p-2 bg-zinc-900 rounded-full text-white focus:outline-none focus:border-none"
          />
        </label>
        <label className="flex flex-col justify-start items-start gap-2 w-full">
          <h3 className="text-lg text-white">Business Code</h3>
          <input
            id="code"
            onChange={handleFormData}
            placeholder="******"
            className="w-full p-2 bg-zinc-900 rounded-full text-white focus:outline-none focus:border-none"
          />
        </label>
        <label className="flex flex-col justify-start items-start gap-2 w-full">
          <h3 className="text-lg text-white">Password</h3>
          <input
            id="password"
            type="password"
            placeholder="********"
            onChange={handleFormData}
            className="w-full p-2 bg-zinc-900 rounded-full text-white"
          />
        </label>
        <div className="flex w-full justify-end items-center gap-2">
          <button
            type="button"
            onClick={() => setForgotPasswordSection(true)}
            className="px-4 bg-zinc-200 mt-4 self-end text-base rounded-full py-2 hover:bg-zinc-400 transition-all duration-300"
          >
            Forgot Password
          </button>
          <button
            type="submit"
            className="px-4 bg-red-600 mt-4 self-end text-base rounded-full py-2 hover:bg-red-800 transition-all duration-300"
          >
            {loading ? "Loading..." : "SIGN IN"}
          </button>
        </div>
        {error != "" && (
          <div className="w-full flex justify-start items-center bg-red-400 p-4 rounded-xl border-2 border-red-500 gap-2">
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
                d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z"
              />
            </svg>

            <h1 className="text-white text-lg">Error:{error}</h1>
          </div>
        )}
      </form>
    </div>
  );
}
function ClientLogin({
  formData,
  setFormData,
  error,
  setError,
  loading,
  setForgotPasswordSection,
  setLoading,
}) {
  const { setUser } = useContext(UserAuthContext);
  const navigate = useNavigate();
  const { setInitialSignIn } = useContext(PanelContext);
  //HANDLE FORM DATA
  function handleFormData(e) {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim(" ") });
  }
  // HANDLE SIGN IN
  async function handleSignIn(e) {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/v1/user/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
      }
      if (res.ok && data.success === true) {
        setUser(data.userData);
        setInitialSignIn(true);
        return navigate("/");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(JSON.stringify(error));
    }
  }
  return (
    <div className="w-full h-full flex flex-col justify-center items-center md:px-2 py-4 gap-4">
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-white font-bold text-2xl md:text-3xl">
          Welcome Back{" "}
          <span className="text-red-600">
            {Object.keys(formData).length > 0 && formData.name}
          </span>
        </h1>
        <p className="text-white font-normal text-base md:text-lg">
          Enter Your Details
        </p>
      </div>
      <form
        onSubmit={handleSignIn}
        className="flex flex-col justify-start items-start w-full md:w-2/3 gap-2"
      >
        <label className="flex flex-col justify-start items-start gap-2 w-full">
          <h3 className="text-lg text-white">Your Name</h3>
          <input
            id="name"
            placeholder="Azaan Ahmad"
            onChange={handleFormData}
            className="w-full p-2 bg-zinc-900 rounded-full text-white"
          />
        </label>
        <label className="flex flex-col justify-start items-start gap-2 w-full">
          <h3 className="text-lg text-white">Your Email/Username</h3>
          <input
            id="username"
            onChange={handleFormData}
            placeholder="thesyazah@gmail.com"
            className="w-full p-2 bg-zinc-900 rounded-full text-white"
          />
        </label>
        <label className="flex flex-col justify-start items-start gap-2 w-full">
          <h3 className="text-lg text-white">Password</h3>
          <input
            id="password"
            type="password"
            placeholder="********"
            onChange={handleFormData}
            className="w-full p-2 bg-zinc-900 rounded-full text-white"
          />
        </label>
        <div className="flex w-full justify-end items-center gap-2">
          <button
            type="button"
            onClick={() => setForgotPasswordSection(true)}
            className="px-4 bg-zinc-200 mt-4 self-end text-base rounded-full py-2 hover:bg-zinc-400 transition-all duration-300"
          >
            Forgot Password
          </button>
          <button
            type="submit"
            className="px-4 bg-red-600 mt-4 self-end text-base rounded-full py-2 hover:bg-red-800 transition-all duration-300"
          >
            {loading ? "Loading..." : "SIGN IN"}
          </button>
        </div>
        {error != "" && (
          <div className="w-full flex justify-start items-center bg-red-400 p-4 rounded-xl border-2 border-red-500 gap-2">
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
                d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z"
              />
            </svg>

            <h1 className="text-white text-lg">Error:{error}</h1>
          </div>
        )}
      </form>
    </div>
  );
}

function ForgotPasswordSection({ setForgotPasswordSection, signInOption }) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [currentStage, setCurrentStage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  async function GetOTP() {
    try {
      console.log(signInOption);
      setLoading(true);
      const res = await fetch("/api/v1/general/forgot-password/get-otp", {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ email, type: signInOption }),
      });
      const data = await res.json();
      if (data.success === true) {
        setCurrentStage(1);
      } else {
        alert(data.message);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      return alert(JSON.stringify(error));
    }
  }
  async function VerifyOTP() {
    try {
      console.log(otp);
      setLoading(true);
      const res = await fetch("/api/v1/general/forgot-password/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === true) {
        setCurrentStage(2);
      } else {
        alert(data.message);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      return alert(JSON.stringify(error));
    }
  }
  async function ChangePassword() {
    try {
      setLoading(true);
      const res = await fetch(
        "/api/v1/general/forgot-password/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, type: signInOption }),
        }
      );
      const data = await res.json();
      if (data.success === true) {
        setForgotPasswordSection(false);
        setLoading(false);
        return alert("Password Changed Successfully");
      } else {
        alert(data.message);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      return alert(JSON.stringify(error));
    }
  }
  return (
    <div className="w-full h-full flex justify-center items-center top-0 left-0 backdrop-blur-sm absolute bg-[rgb(10,10,10,0.5)] z-20">
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-1/2 bg-zinc-200 p-2 rounded-xl border-[2px] border-black"
      >
        <div className="w-full p-2 flex justify-between items-center border-b-[1px] border-zinc-400 mb-2">
          <h1 className="text-lg font-semibold">
            Enter Your{" "}
            {currentStage === 0
              ? `Mail`
              : currentStage === 1
              ? "OTP"
              : "Password"}
          </h1>
          <div
            onClick={() => setForgotPasswordSection(false)}
            className="w-8 h-8 rounded-full bg-red-800 flex justify-center items-center cursor-pointer hover:bg-red-900 transition-all duration-300"
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

        <input
          type={currentStage === 2 ? "password" : "text"}
          value={
            currentStage === 0 ? email : currentStage === 1 ? otp : password
          }
          onChange={(e) =>
            currentStage === 0
              ? setEmail(e.target.value)
              : currentStage === 1
              ? setOtp(e.target.value)
              : setPassword(e.target.value)
          }
          placeholder={`Your Valid ${
            currentStage === 0
              ? "Mail"
              : currentStage === 1
              ? "OTP"
              : "Password"
          }`}
          className="w-full bg-zinc-300 rounded-full p-2"
        />
        <p className="p-2 text-sm text-zinc-600">
          {currentStage === 0
            ? "Enter a valid email, where we will send you an OTP for verification"
            : ""}
        </p>
        <div className="w-full p-2 flex justify-end">
          <button
            onClick={() =>
              currentStage === 0
                ? GetOTP()
                : currentStage === 1
                ? VerifyOTP()
                : ChangePassword()
            }
            className="p-2 bg-red-800 rounded-full text-white"
          >
            {loading ? "loading..." : "Submit"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default SignInPage;
