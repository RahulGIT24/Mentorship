import Navbar from '@/components/Navbar'
import React, { useEffect, useState } from 'react'
import { Textarea } from "@/components/ui/textarea"
import { Button } from '@/components/ui/button';
import apiCall from '@/lib/apiCall';
import toast from 'react-hot-toast';
import { LoaderCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { IUser } from '@/types/type';
import image from "../assets/profilepic.png"
import PaginatedPagination from '@/components/Pagination';

const UserCard = ({ users }: { users: IUser[] }) => {
  const navigate = useNavigate();
  return (
    <div className="sm:block md:grid md:grid-cols-2 lg:grid-cols-4 gap-4">
      {users.map((user) => (
        <Card
          key={user._id}
          className="w-full max-w-sm mb-4 md:mb-0 shadow-md shadow-white py-5 mt-5 bg-gray-800 transform transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg "
        >
          <CardHeader>
            <img
              src={user?.profileImage ?? image}
              alt=""
              className="h-[50%] w-[50%] rounded-full mb-4"
            />
            <CardTitle className="text-2xl">{user.name}</CardTitle>
            <CardTitle className="text-purple-700">@{user.username}</CardTitle>
            <CardDescription>{user.role.toUpperCase()}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xl">
            <p>{user.bio && user.bio.slice(0, 15) + "....."}</p>
            {user.skills && user.skills.length > 0 && (
              <p>
                <strong>Skills:</strong> {user.skills.join(", ").slice(0, 15) + "...."}
              </p>
            )}
            {user.interest && user.interest.length > 0 && (
              <p>
                <strong>Interests:</strong> {user.interest.join(", ").slice(0, 15) + "...."}
              </p>
            )}
          </CardContent>
          <CardFooter className="flex">
            <Button variant={"default"} onClick={() => {
              navigate(`/profile?id=${user._id}`);
            }} className="cursor-pointer">View Profile</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

const ForYou = () => {
  const [preference,setPreference] = useState("")
  const [message, setMessage] = useState("")
  // const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1)
  const [data, setData] = useState(null);
  const [pages, setTotalPages] = useState<null | number>(null);
  const [loading, setLoading] = useState(true);

  const initialSearch = async () => {
    if (preference && preference.length < 50) {
      toast.error("Enter minimum 50 characters");
      return;
    }
    const res = await apiCall({
      method: "POST",
      withCredentials: true,
      url: `match/get-matched-users`,
      reqData: {
        preference: preference ? preference : null
      }
    })
    setLoading(false);
    if (res.status === 200) {
      setMessage(res.message);
      setData(res.data.users);
      setTotalPages(Math.ceil(res.data.total / 10))
      // setTotalResults(res.data.total)
      return;
    }
    toast.error(res.message)
  }

  useEffect(() => {
    initialSearch()
  }, [])
  return (
    <>
      <Navbar />
      <div className="flex justify-start p-9 flex-col">
        <Textarea
          className="p-3 bg-transparent w-1/2"
          placeholder="Search By Preference"
          value={preference}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
          setPreference(e.target.value); // Update search state
          }}
        />
        <Button size='sm' className='w-[12vw] mt-3' disabled={loading} onClick={initialSearch}>Search</Button>
      </div>
      {loading === true && (
        <div className="flex justify-center items-center h-[80vh]">
          <LoaderCircle className="animate-spin " size={"5rem"} />
        </div>
      )}
      {!data || data.length === 0 && loading === false && (
        <div className="w-full p-9">
          <h1 className="text-center text-4xl">Nothing to show</h1>
        </div>
      )}
      {data && data?.length >= 1 && loading === false && (
        <div className="w-full p-9">
          <UserCard users={data} />
          <footer className="mt-24">
            <PaginatedPagination
              currentPage={page}
              totalPages={pages}
              onPageChange={setPage}
            />
          </footer>
        </div>
      )}
    </>
  )
}

export default ForYou
