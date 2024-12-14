import { useEffect } from "react";
import Navbar from "../components/Navbar";
import { useDispatch } from "react-redux";
import { revertInitialFilter } from "../redux/reducers/filterSlice";

const Home = () => {
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(revertInitialFilter())
  },[]) 
  return (
    <>
      <Navbar />
    </>
  );
};

export default Home;
