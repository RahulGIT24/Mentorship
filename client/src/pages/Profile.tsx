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
import toast from "react-hot-toast";

const Profile = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [data, setData] = useState<any>(null);
  const loggedIndata = useSelector((state: any) => state.user.user);
  const isAuthenticated = useSelector(
    (state: any) => state.user.isAuthenticated
  );
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isPending, setIsPending] = useState<boolean | null>(null);
  const [sender,setSender] = useState(null);
  const [receiver,setReceiver]=useState(null);
  const [connectionId,setConnectionId] = useState(null);
  const user = useSelector((state:any)=>state.user.user)

  const fetchUserById = async (userId: string) => {
    const res = await apiCall({
      method: "GET",
      url: `users/get-user?id=${userId}`,
    });
    await checkConnectionStatus();
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

  const checkConnectionStatus = async () => {
    if (isAuthenticated && id) {
      const res = await apiCall({
        url: `connection/check-connection?id=${id}`,
        method: "GET",
        withCredentials: true
      })
      if (res.status === 400) {
        setIsConnected(false);
        setIsPending(false);
        return;
      }
      if (res.status === 200) {
        setSender(res.data.sender)
        setConnectionId(res.data.id)
        setReceiver(res.data.receiver)
        setIsConnected(res.data.accepted);
        setIsPending(res.data.pending);
        return;
      }
      toast.error(res.message)
    }
  }

  const sendConnectionRequest = async () => {
    if (isAuthenticated && id && isPending === false && isConnected === false) {
      const res = await apiCall({
        url: `connection/send-request?id=${id}`,
        method: "POST",
        withCredentials: true,
        reqData: {
          receiverId: id
        }
      })
      if (res.status === 200) {
        setIsPending(true);
        setSender(user._id)
        setReceiver(id);
        toast.success(res.message)
        return;
      }
      toast.error(res.message)
    }
  }
  const deleteConnection = async () => {
    if (isAuthenticated && id) {
      if (isPending === false && isConnected === false) return;
      const res = await apiCall({
        url: `connection/delete-connection?id=${id}`,
        method: "DELETE",
        withCredentials: true,
        reqData: {
          receiverId: id
        }
      })
      if (res.status === 200) {
        setIsPending(false);
        setSender(null);
        setReceiver(null);
        setIsConnected(false);
        toast.success(res.message)
        return;
      }
      toast.error(res.message)
    }
  }
  const acceptRequest = async () => {
    if (isAuthenticated && id) {
      if (isPending === false && isConnected === false) return;
      const res = await apiCall({
        url: `connection/accept-request`,
        method: "POST",
        withCredentials: true,
        reqData: {
          connectionId: connectionId
        }
      })
      if (res.status === 200) {
        setIsPending(false);
        setIsConnected(true);
        toast.success(res.message)
        return;
      }
      toast.error(res.message)
    }
  }

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
                  <>
                    {
                      sender===null && receiver===null &&  <>
                        <Button className="bg-purple-700" onClick={() => { sendConnectionRequest() }}>Send Connection Request</Button>
                      </>
                    }
                    {
                      sender!==null && receiver!==null && receiver===user._id && isConnected===false && <>
                        <Button className="bg-green-700" onClick={() => { acceptRequest() }}>Accept Connection Request</Button>
                      </>
                    }
                    {
                      isPending !== null && isConnected !== null && isPending === true && sender === user._id &&<>
                        <p className="text-green-500">Request Sent</p>
                        <Button variant={'destructive'} onClick={()=>{deleteConnection()}}>Cancel Request</Button>
                      </>
                    }
                    {
                      isPending !== null && isConnected !== null && isConnected === true && <>
                        <p className="text-green-500">Already Connected</p>
                        <Button variant={'destructive'} onClick={()=>{deleteConnection()}}>Remove Connection</Button>
                      </>
                    }
                  </>
                ) : (
                  <div className="space-x-4">
                    <UpdateDialog />
                    <ShareProfile
                      plink={`${import.meta.env.VITE_FRONTEND_URl}profile?id=${data._id
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
