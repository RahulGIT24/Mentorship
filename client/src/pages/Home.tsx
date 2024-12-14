import { useEffect } from "react";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { revertInitialFilter } from "../redux/reducers/filterSlice";
import image from "../assets/98d5c9aa-7421-4609-9b5e-83517343a02e.jpg"
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state:any)=>state.user.isAuthenticated)
  useEffect(()=>{
    dispatch(revertInitialFilter())
  },[]) 
  const navigate = useNavigate();
  return (
    <>
      <Navbar />
      <div className="flex flex-row flex-wrap w-full justify-around items-center h-[80vh]">
      <section className=""> 
        <h1 className="text-8xl">Welcome to</h1>
        <h1 className="text-7xl font-bold text-purple-700 font-mono mb-12">MentorSphere</h1>
        <p className="text-2xl">A Platform for Mentors and Mentees</p>
        <div className="flex mt-6">
          {
            isAuthenticated ? <div className="space-x-7">
            <Button variant="default" onClick={()=>{navigate("/discover")}}>Explore Other's Profile</Button>
            <Button variant="default" onClick={()=>{navigate("/foryou")}}>Check Our Suggestions</Button>
            </div> : <div className="space-x-7">
            <Button variant="default" onClick={()=>{navigate("/login")}}>Login</Button>
            <Button variant="default" onClick={()=>{navigate("/register")}}>Register Here</Button>
            </div>
          }
          
        </div>
      </section>  
      <section>
        <img src={image} className="h-[55vh] border shadow-md shadow-white transform "/>
      </section>
      </div>

    </>
  );
};

export default Home;
