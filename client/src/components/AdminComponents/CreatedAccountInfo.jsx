import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { UserAuthContext } from "../../context/UserAuthProvider";
function CreatedAccountInfo({ formData }) {
  const [loading, setLoading] = useState(false);
  const [buttonTitle, setButtonTitle] = useState("Send Details");
  const { userType } = useContext(UserAuthContext);
  async function handleSendMail() {
    try {
      setLoading(true);
      const res = await fetch("/api/v1/admin/send-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok && data.success == true) {
        alert("Email Sent !!");
        setButtonTitle("Send Again");
        setLoading(false);
      }
    } catch (error) {
      alert("Something Went Wrong !!");
      setLoading(false);
    }
  }
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-[600px] p-6 justify-start items-start flex flex-col bg-zinc-950 rounded-3xl">
        <div className="p-2 bg-zinc-900 rounded-full self-end">
          <Link to={userType === 8 ? "/business" : "/admin"}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              className="size-6 stroke-red-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
              />
            </svg>
          </Link>
        </div>
        <div className="w-full flex flex-col gap-2">
          <h1 className="text-white text-2xl border-b-[2px] border-red-600 flex gap-2 justify-start items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke=""
              className="size-6 stroke-red-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
              />
            </svg>
            Account For {formData.name} is created
          </h1>
          <div className="flex w-full gap-2 justify-start items-center mt-4">
            <h1 className="text-red-600 text-xl">Name</h1>
            <h3 className="text-white text-lg">{formData.name}</h3>
          </div>
          <div className="flex w-full gap-2 justify-start items-center">
            <h1 className="text-red-600 text-xl">Email</h1>
            <h3 className="text-white text-lg">{formData.email}</h3>
          </div>
          <div className="flex w-full gap-2 justify-start items-center">
            <h1 className="text-red-600 text-xl">Password</h1>
            <h3 className="text-white text-lg">{formData.password}</h3>
          </div>
          {formData.businessCode ? (
            <div className="flex w-full gap-2 justify-start items-center">
              <h1 className="text-red-600 text-xl">Business Code</h1>
              <h3 className="text-white text-lg">{formData.businessCode}</h3>
            </div>
          ) : (
            <></>
          )}
          {formData.tier ? (
            <div className="flex w-full gap-2 justify-start items-center">
              <h1 className="text-red-600 text-xl">Business Tier</h1>
              <h3 className="text-white text-lg">{formData.tier}</h3>
            </div>
          ) : (
            <></>
          )}
          {formData.username ? (
            <div className="flex w-full gap-2 justify-start items-center">
              <h1 className="text-red-600 text-xl">Username</h1>
              <h3 className="text-white text-lg">{formData.username}</h3>
            </div>
          ) : (
            <></>
          )}
          <div className="flex w-full gap-2 justify-end items-center">
            <button
              onClick={handleSendMail}
              className="bg-red-600 px-4 rounded-full py-2"
            >
              {loading ? "Loading" : buttonTitle}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatedAccountInfo;
