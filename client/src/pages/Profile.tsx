import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import profilePic from "../assets/profilepic.png";
import { LoaderCircle } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { UpdateDialog } from "../components/UpdateDialog";
import { ShareProfile } from "../components/ShareDialogBox";
import { useEffect, useState } from "react";
import { DeleteDialog } from "../components/DeleteDialog";
import apiCall from "../lib/apiCall";

const Profile = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [data, setData] = useState<any>(null);
  const loggedIndata = useSelector((state: any) => state.user.user);
  const isAuthenticated = useSelector(
    (state: any) => state.user.isAuthenticated
  );

  const fetchUserById = async (userId: string) => {
    const res = await apiCall({
      method: "GET",
      url: `users/get-user?id=${userId}`,
    });
    setData(res.data);
  };

  const navigate = useNavigate();
  useEffect(() => {
    if (id) {
      fetchUserById(id);
    }
    if (!id && isAuthenticated === false) {
      navigate("/login");
    }
    if (isAuthenticated === true) {
      setData(loggedIndata);
    }
  }, [loggedIndata, id, isAuthenticated]);
  return (
    <>
      <Navbar />
      <main>
        {data ? (
          <div className="flex justify-center items-center w-full h-full flex-col">
            <div className="flex items-center space-x-16 h-[35vh]">
              <img src={data?.profileImage ?? profilePic} alt="" className="rounded-full h-56" />
              <div className="space-y-6">
                <h1 className=" font-semibold text-7xl">
                  {data.name}
                  <br />
                  <p className="text-base text-purple-400">
                    {"@" + data.username}
                  </p>
                </h1>
                <p>
                  <i>{data.role.toUpperCase()}</i>
                </p>
                {id && isAuthenticated === true ? (
                  <Button className="bg-purple-700 text-white hover:bg-white hover:text-purple-700">
                    {data.role === "mentor"
                      ? "Ask For Mentorship"
                      : "Inivite for Mentorship"}
                  </Button>
                ) : (
                  <div className="space-x-4">
                    <UpdateDialog />
                    <ShareProfile
                      plink={`${import.meta.env.VITE_FRONTEND_URl}profile?id=${
                        data._id
                      }`}
                    />
                    <DeleteDialog />
                  </div>
                )}
              </div>
            </div>
            <section className="flex justify-start items-start w-full px-36 flex-col max-h-screen">
              <div className="p-5 my-4 space-y-5 w-full border border-gray-700 rounded-md">
                <p className="font-semibold text-5xl">
                  {data.name + "'s" + " " + "Bio"}
                </p>
                <section className="w-full">
                  <p className="text-xl">{data.bio ?? "Nothing to Show"}</p>
                </section>
              </div>
              <div className="p-5 my-4 space-y-5 w-full border border-gray-700 rounded-md">
                <p className="font-semibold text-5xl">
                  {data.name + "'s" + " " + "Skills"}
                </p>
                <section className="w-full flex space-x-5">
                  {data.skills.length > 0 ? (
                    data?.skills?.map((skill: string, index: number) => {
                      return (
                        <p
                          className="bg-purple-700 text-white p-3 border rounded-lg px-14"
                          key={index}
                        >
                          {skill}
                        </p>
                      );
                    })
                  ) : (
                    <p>Nothing to show</p>
                  )}
                </section>
              </div>
              <div className="p-5 my-4 space-y-5 w-full border border-gray-700 rounded-md">
                <p className="font-semibold text-5xl">
                  {data.name + "'s" + " " + "Interests"}
                </p>
                <section className="w-full flex flex-wrap space-x-5">
                  {data.interest.length > 0 ? (
                    data?.interest?.map((interest: string, index: number) => {
                      return (
                        <p
                          className="bg-purple-700 text-white p-3 border rounded-lg px-14"
                          key={index}
                        >
                          {interest}
                        </p>
                      );
                    })
                  ) : (
                    <p>Nothing to show</p>
                  )}
                </section>
              </div>
            </section>
          </div>
        ) : (
          <div className="flex justify-center items-center h-[80vh] w-full">
            <LoaderCircle className="animate-spin" size={"4rem"} />
          </div>
        )}
      </main>
    </>
  );
};

export default Profile;
