import { useContext, useEffect, useRef, useState } from "react";
import CreatedAccountInfo from "./CreatedAccountInfo";
import { UserAuthContext } from "../../context/UserAuthProvider";

function ClientSignUp() {
  const firstPartRef = useRef(null);
  const secondPartRef = useRef(null);
  const [formData, setFormData] = useState({});
  const [accountCreated, setAccountCreated] = useState(false);
  useEffect(() => {
    document.title = "Create User | ADMIN";
  }, []);

  return (
    <div className="w-full min-h-full bg-zinc-800 p-6 flex flex-col ">
      {accountCreated ? (
        <CreatedAccountInfo formData={formData} />
      ) : (
        <div className="wrapper w-full h-full bg-zinc-800 flex transition-transform duration-500 relative overflow-hidden">
          <div
            ref={firstPartRef}
            className="first-part absolute top-0 left-0 w-full h-full transition-transform duration-500"
          >
            <FirstPart
              firstPartRef={firstPartRef}
              secondPartRef={secondPartRef}
              formData={formData}
              setFormData={setFormData}
            />
          </div>
          <div
            ref={secondPartRef}
            className="second-part absolute top-0 left-0 w-full h-full transition-transform duration-500 translate-x-[100%]"
          >
            <SecondPart
              firstPartRef={firstPartRef}
              secondPartRef={secondPartRef}
              formData={formData}
              setFormData={setFormData}
              setAccountCreated={setAccountCreated}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function FirstPart({ firstPartRef, secondPartRef, formData, setFormData }) {
  function handleMove(e) {
    e.preventDefault();
    if (firstPartRef.current && secondPartRef.current) {
      firstPartRef.current.style.transform = "translateX(-100%)";
      secondPartRef.current.style.transform = "translateX(0%)";
    }
  }

  // HANDLE FORM
  function handleChangeForm(e) {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }
  return (
    <form className="w-full h-full flex flex-col justify-start items-end gap-4 px-4">
      <div className="w-full justify-center items-center">
        <h1 className="text-red-600 font-bold border-b-[1px] text-2xl py-2">
          Personal Details Of Clients
        </h1>
      </div>
      <div className="flex flex-col w-full">
        <div className="flex flex-col p-2 justify-start items-start gap-2">
          <h2 className="text-2xl text-white font-semibold">Full Name</h2>
          <input
            id="name"
            onChange={handleChangeForm}
            placeholder="John Doe"
            className="w-full p-2 rounded-md bg-zinc-900 text-white"
          />
        </div>
        <div className="flex flex-col p-2 justify-start items-start gap-2">
          <h2 className="text-2xl text-white font-semibold">Phone Number</h2>
          <div className="flex w-full">
            <select className="bg-zinc-900 rounded-tl-md rounded-bl-md text-white p-2">
              <option>+91</option>
            </select>
            <input
              type="tel"
              id="number"
              onChange={handleChangeForm}
              placeholder="9998881110"
              className="w-full p-2 rounded-tr-md rounded-br-md bg-zinc-900 text-white"
            />
          </div>
        </div>
        <div className="flex flex-col p-2 justify-start items-start gap-2">
          <h2 className="text-2xl text-white font-semibold">Country</h2>
          <input
            placeholder="India"
            id="country"
            onChange={handleChangeForm}
            className="w-full p-2 rounded-md bg-zinc-900 text-white"
          />
        </div>
        <div className="flex flex-col p-2 justify-start items-start gap-2">
          <h2 className="text-2xl text-white font-semibold">City</h2>
          <input
            id="city"
            onChange={handleChangeForm}
            placeholder="Delhi"
            className="w-full p-2 rounded-md bg-zinc-900 text-white"
          />
        </div>
      </div>
      <button
        className="p-2 bg-red-600 font-semibold text-xl rounded-xl px-4 text-zinc-950 shadow-xl hover:shadow-none"
        onClick={handleMove}
      >
        Next
      </button>
    </form>
  );
}

function SecondPart({
  firstPartRef,
  secondPartRef,
  formData,
  setFormData,
  setAccountCreated,
}) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passvalid, setPassValid] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifyOTP, setVerifyOTP] = useState(false);
  const [otpForm, setOTPForm] = useState({});
  const [otpLoading, setOtpLoading] = useState(false);
  const { userType, user } = useContext(UserAuthContext);
  // SLIDE MOVE
  function handleMovePrev(e) {
    e.preventDefault();
    if (firstPartRef.current && secondPartRef.current) {
      firstPartRef.current.style.transform = "translateX(0%)";
      secondPartRef.current.style.transform = "translateX(100%)";
    }
  }

  // HANDLE FORM CHANGE
  function handleChangeForm(e) {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }
  async function handleFormSubmit(e) {
    e.preventDefault();
    if (!passvalid) {
      return;
    }
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/v1/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, parentId: user._id, userType }),
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
      }
      if (res.ok && data.success === true) {
        setVerifyOTP(true);
        setOTPForm({ ...otpForm, id: data.id, username: formData.username });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(JSON.stringify(error));
      console.log(error);
    }
  }

  async function handleVerifyOtp(e) {
    e.preventDefault();
    console.log(otpForm);
    try {
      setOtpLoading(true);
      const res = await fetch("/api/v1/user/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(otpForm),
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
      }
      if (data.success === true) {
        setOtpLoading(false);
        return setAccountCreated(true);
      }
      setOtpLoading(false);
    } catch (error) {
      setError(JSON.stringify(error));
      setOtpLoading(false);
    }
  }
  return (
    <form
      className="w-full h-full flex flex-col justify-start items-end gap-4 px-4"
      onSubmit={handleFormSubmit}
    >
      <div className="w-full justify-center items-center">
        <h1 className="text-red-600 font-bold border-b-[1px] text-2xl py-2">
          Auth Details Of Clients
        </h1>
      </div>
      {verifyOTP || (
        <div className="flex flex-col w-full">
          <div className="flex flex-col p-2 justify-start items-start gap-2">
            <h2 className="text-2xl text-white font-semibold">Username</h2>
            <input
              id="username"
              onChange={handleChangeForm}
              placeholder="johndoe123"
              className="w-full p-2 rounded-md bg-zinc-900 text-white"
            />
          </div>
          <div className="flex flex-col p-2 justify-start items-start gap-2">
            <h2 className="text-2xl text-white font-semibold">Email Address</h2>
            <input
              id="email"
              onChange={handleChangeForm}
              type="email"
              placeholder="johndoe123@gmail.com"
              className="w-full p-2 rounded-md bg-zinc-900 text-white"
            />
          </div>
          <div className="flex flex-col p-2 justify-start items-start gap-2">
            <h2 className="text-2xl text-white font-semibold">Password</h2>
            <div className="flex w-full bg-zinc-900 px-2 justify-center items-center rounded-md">
              <input
                id="password"
                onChange={handleChangeForm}
                type={!passwordVisible ? "password" : "text"}
                placeholder="********"
                className="w-full p-2 rounded-md bg-zinc-900 text-white focus:outline-none focus:border-none"
              />
              <div
                onClick={(e) => {
                  e.preventDefault();
                  setPasswordVisible(!passwordVisible);
                }}
              >
                {passwordVisible ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="red"
                    className="size-8 cursor-pointer"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="red"
                    className="size-8 cursor-pointer"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                )}
              </div>
            </div>
          </div>
          <div className={`flex flex-col p-2 justify-start items-start gap-2`}>
            <h2 className="text-2xl text-white font-semibold">
              Confirm Password
            </h2>
            <div
              className={`${
                !passvalid ? "border-2 border-red-600" : ""
              } flex w-full bg-zinc-900 px-2 justify-center items-center rounded-md`}
            >
              <input
                onChange={(e) => {
                  if (formData.password) {
                    formData.password != e.target.value
                      ? setPassValid(false)
                      : setPassValid(true);
                  }
                }}
                type={!passwordVisible ? "password" : "text"}
                placeholder="********"
                className="w-full p-2 rounded-md bg-zinc-900 text-white focus:outline-none focus:border-none"
              />
              <div
                onClick={(e) => {
                  e.preventDefault();
                  setPasswordVisible(!passwordVisible);
                }}
              >
                {passwordVisible ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="red"
                    className="size-8 cursor-pointer"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="red"
                    className="size-8 cursor-pointer"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {verifyOTP ? (
        <div className="w-full flex flex-col p-2 justify-start items-start gap-2">
          <h2 className="text-2xl text-white font-semibold">Verify OTP</h2>
          <input
            id="otp"
            onChange={(e) => {
              setOTPForm({ ...otpForm, [e.target.id]: e.target.value });
            }}
            type="password"
            placeholder="An OTP is sent to the client mail kindly verify"
            className="w-full p-2 rounded-md bg-zinc-900 text-white"
          />
          <button
            onClick={handleVerifyOtp}
            className="bg-red-600 p-3 rounded-full"
          >
            {otpLoading ? "Loading..." : "VERIFY"}
          </button>
        </div>
      ) : (
        <></>
      )}
      {verifyOTP ? (
        <></>
      ) : (
        <div className="flex w-full justify-between items-center">
          <button
            className="p-2 bg-red-600 font-semibold text-xl rounded-xl px-4 text-zinc-950 shadow-xl hover:shadow-none"
            onClick={handleMovePrev}
          >
            Previous
          </button>
          <button
            type="submit"
            className="p-2 bg-red-600 font-semibold text-xl rounded-xl px-4 text-zinc-950 shadow-xl hover:shadow-none"
          >
            {loading ? "Loading..." : "Submit"}
          </button>
        </div>
      )}
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
  );
}

export default ClientSignUp;
