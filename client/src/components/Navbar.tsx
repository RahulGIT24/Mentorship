import { logout } from "@/lib/logout";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";
import { BellIcon, LogInIcon, LogOutIcon, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { revertInitial } from "@/redux/reducers/userSlice";
import { Badge } from "./ui/badge";

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: any) => state.user.isAuthenticated)
  const data = useSelector((state: any) => state.user.user)
  const dispatch = useDispatch();
  return (
    <nav className="w-full border-b border-gray-700 bg-zinc-900">
      <div className="px-16 py-6 text-xl flex justify-between items-center">
        <div className="text-gray-500">
          <ul className="flex space-x-7 justify-center items-center">
            <li
              onClick={() => {
                navigate("/");
              }}
              className={`font-bold text-purple-700 font-mono text-3xl`}
            >
              MentorSphere
            </li>
            <li
              onClick={() => {
                navigate("/");
              }}
              className={`cursor-pointer hover:text-purple-700 ${location.href.endsWith("/") && "text-purple-400"
                }`}
            >
              Home
            </li>
            {
              isAuthenticated && <>
                <li
                  onClick={() => {
                    navigate("/discover");
                  }}
                  className={`cursor-pointer hover:text-purple-700 ${location.href.split("/")[location.href.split("/").length - 1] === "discover" && "text-purple-400"
                    }`}
                >
                  Discover
                </li>
                <li
                  onClick={() => {
                    navigate("/foryou");
                  }}
                  className={`cursor-pointer hover:text-purple-700 ${location.href.split("/")[location.href.split("/").length - 1] === "foryou" && "text-purple-400"
                    }`}
                >
                  For You
                </li>
                {/* <li
                  onClick={() => {
                    navigate("/notifications");
                  }}
                  className={`cursor-pointer ${location.href.split("/")[location.href.split("/").length - 1] === "notifications" && "text-purple-400"
                    }`}
                >
                  Notifications
                </li> */}
              </>
            }
          </ul>
        </div>
        <div className="space-x-8">
          {
            isAuthenticated &&
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <UserRound className={`cursor-pointer hover:text-purple-700 ${location.href.endsWith("profile") && "text-purple-400"}`} size={"2rem"} onClick={() => { navigate("/profile") }} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>User Profile</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <BellIcon className={`cursor-pointer hover:text-purple-700 ${location.href.endsWith("notifications") && "text-purple-400"}`} size={"2rem"} onClick={() => { navigate("/notifications") }} />
                    {data.unreadNotifications>0 &&
                      <Badge className="absolute top-[12px]" variant="destructive">
                        {data.unreadNotifications}
                      </Badge>
                    }
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Notifications</p>
                  </TooltipContent> 
                </Tooltip>
              </TooltipProvider>
            </>
          }
          {
            isAuthenticated ?
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <LogOutIcon className="cursor-pointer hover:text-purple-700" size={"2rem"} onClick={() => {
                      if (logout()) {
                        dispatch(revertInitial());
                      }
                    }} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Log Out</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              :
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <LogInIcon className="cursor-pointer hover:text-purple-700" size={"2rem"} onClick={() => { navigate("/login") }} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Log In</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
          }
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
