import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";
import { UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="w-full border-b border-gray-700">
      <div className="px-16 py-6 text-xl flex justify-between items-center">
        <div className="text-gray-500">
          <ul className="flex space-x-7">
            <li
              onClick={() => {
                navigate("/");
              }}
              className={`cursor-pointer ${
                location.href.endsWith("/") && "text-purple-400"
              }`}
            >
              Home
            </li>
          </ul>
        </div>
        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <UserRound className="cursor-pointer" size={"2rem"} onClick={()=>{navigate("/profile")}}/>
              </TooltipTrigger>
              <TooltipContent>
                <p>User Profile</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
