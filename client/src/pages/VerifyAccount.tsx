import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import apiCall from "../lib/apiCall";

const VerifyAccount = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isVerfied, setIsVerified] = useState<null | Boolean>(null);
  const [timer, setTimer] = useState<number>(5);

  useEffect(() => {
    if (!searchParams.get("token")) {
      navigate("/login");
    }
    if (isVerfied != null) {
      setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);
      if (timer === 0) {
        navigate("/login");
      }
    }
  }, [isVerfied, timer]);

  const verifyAccount = async() => {
    if(searchParams.get("token")){
      console.log(searchParams.get("token"));
      const res = await apiCall({method:"PATCH",url:`auth/verify-account?token=${searchParams.get("token")}`});
      if (res.status === 200) {
        setIsVerified(true);
      } else {
        setIsVerified(false);
      }
    }
  };

  useEffect(() => {
    verifyAccount();
  }, []);

  return (
    <main className="flex justify-center items-center w-full h-screen flex-col">
      <h1 className="text-4xl text-center my-3 bg-white text-black px-6 py-3 rounded-md">
        <b className="text-purple-700">MentorSphere</b> Account Verification
      </h1>
      {isVerfied === null && (
        <p className="text-xl my-3">Verifying Please Wait...........</p>
      )}
      {isVerfied === false && (
        <p className="text-red-600 text-xl my-3">
          Account Not Verified. Invalid Token
        </p>
      )}
      {isVerfied === true && (
        <p className="text-green-600 text-xl my-3">Account Verified</p>
      )}
      {isVerfied != null && (
        <p className="mt-10">Redirecting to Login in {timer} seconds</p>
      )}
    </main>
  );
};

export default VerifyAccount;
