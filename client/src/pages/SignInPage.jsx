import { useContext, useState } from "react";
import { UserAuthContext } from "../context/UserAuthProvider";
import { useNavigate } from "react-router-dom";

function SignInPage() {
  const [signInOption, setSignInOption] = useState("");
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  return (
    <div className="w-full h-[100vh] bg-zinc-950 p-4 flex flex-col">
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
      <div className="w-full h-full flex justify-center items-center pt-2">
        <div className="w-1/2 h-full">
          {signInOption === "client" ? (
            <ClientLogin
              formData={formData}
              setFormData={setFormData}
              error={error}
              setError={setError}
              loading={loading}
              setLoading={setLoading}
            />
          ) : signInOption === "business" ? (
            <BusinessLogin
              formData={formData}
              setFormData={setFormData}
              error={error}
              setError={setError}
              loading={loading}
              setLoading={setLoading}
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
        <div className="w-1/2 h-full bg-[url('https://images.pexels.com/photos/8347501/pexels-photo-8347501.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-no-repeat bg-cover bg-center"></div>
      </div>
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
}) {
  const { setUser } = useContext(UserAuthContext);
  const navigate = useNavigate();
  function handleFormData(e) {
    setFormData({ ...formData, [e.target.id]: e.target.value });
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
      <form className="flex flex-col justify-start items-start w-2/3 gap-2">
        <label className="flex flex-col justify-start items-start gap-2 w-full">
          <h3 className="text-lg text-white">Business Name</h3>
          <div className="w-full flex justify-center items-center bg-zinc-900 rounded-full p-2">
            <input
              id="name"
              onChange={handleFormData}
              placeholder="alisan smart homes"
              className="w-full p-2 bg-zinc-900 rounded-full text-white focus:outline-none focus:border-none"
            />
          </div>
        </label>
        <label className="flex flex-col justify-start items-start gap-2 w-full">
          <h3 className="text-lg text-white">Business Code</h3>
          <div className="w-full flex justify-center items-center bg-zinc-900 rounded-full p-2">
            <input
              id="code"
              onChange={handleFormData}
              placeholder="******"
              className="w-full p-2 bg-zinc-900 rounded-full text-white focus:outline-none focus:border-none"
            />
          </div>
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
        <button
          onClick={handleBusinessLogin}
          className="px-4 bg-red-600 mt-4 self-end text-xl rounded-full py-2 hover:bg-red-800 transition-all duration-300"
        >
          {loading ? "Loading..." : "SUBMIT"}
        </button>
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
  setLoading,
}) {
  const { setUser } = useContext(UserAuthContext);
  const navigate = useNavigate();
  //HANDLE FORM DATA
  function handleFormData(e) {
    setFormData({ ...formData, [e.target.id]: e.target.value });
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
        onSubmit={handleSignIn}
        className="flex flex-col justify-start items-start w-2/3 gap-2"
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
        <button
          type="submit"
          className="px-4 bg-red-600 mt-4 self-end text-xl rounded-full py-2 hover:bg-red-800 transition-all duration-300"
        >
          {loading ? "Loading..." : "SIGN IN"}
        </button>
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

export default SignInPage;
