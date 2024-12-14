import { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import apiCall from "../lib/apiCall";
import toast from "react-hot-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { IUser } from "../types/type";
import image from "../assets/profilepic.png";
import { useNavigate } from "react-router-dom";
import PaginatedPagination from "../components/Pagination";
import { LoaderCircle } from "lucide-react";
import { Input } from "../components/ui/input";
import { FilterDialog } from "../components/FilterDialog";
import { Button } from "../components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { setSearch } from "../redux/reducers/filterSlice";

const Discover = () => {
    // const [search, setSearch] = useState<string>("");
    const dispatch = useDispatch()
    const [data, setData] = useState<null | []>(null);
    const [page, setPage] = useState(1);
    const [loader, setLoader] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null); // Ref to store timeout ID

    // Fetching skills, interests, and role from Redux state
    const { skills, interest, role,search } = useSelector(
        (state: any) => state.filter.filter
    );

    const fetchData = async () => {
        console.log(skills)
        setLoader(true);
        let url = `users/get-users?page=${page}`;
        if (search) {
            url = url + `&name=${search.split("@")[search.split("@").length > 1 ? 1 : 0]}`;
        }
        if (skills.length > 0) {
            url += `&skills=${skills}`
        }
        if (interest.length > 0) {
            url += `&interests=${interest}`
        }
        if (role != "") {
            url += `&role=${role}`
        }
        const res = await apiCall({ method: "GET", url: url, withCredentials: true });
        if (res.status > 200) {
            setLoader(false);
            toast.error(res.message);
            return;
        }
        setData(res.data.users);
        setTotalPages(res.data.totalPages);
        console.log(res.data);
        setLoader(false);
    };

    // Debounced API call based on search input
    useEffect(() => {
        if (search) {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current); // Clear the previous timeout if it's still pending
            }

            debounceTimeout.current = setTimeout(() => {
                fetchData();
            }, 500); // Delay of 500ms after user stops typing

            // Clean up the timeout on unmount
            return () => {
                if (debounceTimeout.current) {
                    clearTimeout(debounceTimeout.current);
                }
            };
        } else {
            fetchData();
        }
    }, [search, page]); // Trigger when search or page changes

    return (
        <>
            <Navbar />
            <div className="flex justify-between p-9">
                <Input
                    type="search"
                    className="w-4/12 py-5"
                    placeholder="Search by name or username"
                    value={search}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        dispatch(setSearch(e.target.value)); // Update search state
                    }}
                />
                {/* <Button variant={'secondary'}>Apply Filters<Filter /></Button> */}
                <FilterDialog
                    submit={fetchData}

                />
            </div>
            {loader === true && (
                <div className="flex justify-center items-center h-[80vh]">
                    <LoaderCircle className="animate-spin " size={"5rem"} />
                </div>
            )}
            {!data || data.length === 0 && loader === false && (
                <div className="w-full p-9">
                    <h1 className="text-center text-4xl">Nothing to show</h1>
                </div>
            )}
            {data && data?.length >= 1 && loader === false && (
                <div className="w-full p-9">
                    <UserCard users={data} />
                    <footer className="mt-24">
                        <PaginatedPagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                        />
                    </footer>
                </div>
            )}
        </>
    );
};

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

export default Discover;
