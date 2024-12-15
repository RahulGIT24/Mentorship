import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import PaginatedPagination from "@/components/Pagination";
import apiCall from "@/lib/apiCall";
import { INotification } from "@/types/type";
import { LoaderCircle, MailIcon } from "lucide-react";
import toast from "react-hot-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { decrementUnreadNotifications } from "@/redux/reducers/userSlice";

const NotificationDialog = ({ notification, onClose }: { notification: INotification | null; onClose: () => void }) => {
  if (!notification) return null;
  const navigate = useNavigate();

  return (
    <Dialog open={!!notification} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="space-y-3">
          <DialogTitle>{notification.subject}</DialogTitle>
          <DialogDescription>{notification.description}</DialogDescription>
          <Button
            variant="secondary"
            onClick={() => {
              navigate(`/profile?id=${notification.sender}`);
            }}
          >
            View Profile
          </Button>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

const NotificationList = ({
  notifications,
  readNotification,
  onNotificationClick,
}: {
  notifications: INotification[];
  readNotification: (notification: INotification) => void;
  onNotificationClick: (notification: INotification) => void;
}) => {
  return (
    <>
      {notifications.map((notif) => (
        <div
          className="border border-gray-600 my-8 hover:bg-zinc-900 cursor-pointer p-4"
          key={notif._id}
          onClick={() => {
            readNotification(notif);
            onNotificationClick(notif);
          }}
        >
          <div className="flex justify-start items-center space-x-7">
            <MailIcon size={40} />
            <p>{notif.subject}</p>
          </div>
        </div>
      ))}
    </>
  );
};

const Notifications = () => {
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState("all");
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalNotifications, setTotalNotifications] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedNotification, setSelectedNotification] = useState<INotification | null>(null);

  const fetchNotifications = async () => {
    const url = `notifications/get-notifications?type=${current}&page=${currentPage}`;
    const response = await apiCall({
      method: "GET",
      url: url,
      withCredentials: true,
    });
    setLoading(false);
    if (response.status !== 200) {
      toast.error(response.message);
      return;
    }
    setNotifications(response.data.notifications);
    setCurrentPage(response.data.currentPage);
    setTotalPages(response.data.totalPages);
    setTotalNotifications(response.data.totalNotifications);
  };

  const dispatch = useDispatch();

  const readNotification = async (notification: INotification) => {
    if (notification.isRead === true) {
      return;
    }
    const url = `notifications/read-notification?id=${notification._id}`;
    const response = await apiCall({
      method: "GET",
      url: url,
      withCredentials: true,
    });
    if (response.status !== 200) {
      toast.error(response.message);
      return;
    }
    setNotifications((prevNotifications) =>
      prevNotifications.map((notif) =>
        notif._id === notification._id
          ? { ...notif, isRead: true }
          : notif
      )
    );
    if (current === "unread") {
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notif) => notif._id !== notification._id)
      );
    }
    dispatch(decrementUnreadNotifications());
  };

  const handleNotificationClick = (notification: INotification) => {
    setSelectedNotification(notification);
  };

  const closeDialog = () => {
    setSelectedNotification(null);
  };

  useEffect(() => {
    fetchNotifications();
  }, [current, currentPage]);

  return (
    <>
      <Navbar />
      <main className="w-full h-full">
        <div className="px-20 py-20">
          <div className="space-x-6">
            <Button
              variant={`${current === "all" ? "default" : "secondary"}`}
              onClick={() => setCurrent("all")}
              size="lg"
            >
              All
            </Button>
            <Button
              variant={`${current === "read" ? "default" : "secondary"}`}
              onClick={() => setCurrent("read")}
              size="lg"
            >
              Read
            </Button>
            <Button
              variant={`${current === "unread" ? "default" : "secondary"}`}
              onClick={() => setCurrent("unread")}
              size="lg"
            >
              Unread
            </Button>
          </div>
          <section>
            <div className="mt-20">
              {loading && (
                <div className="flex justify-center items-center">
                  <LoaderCircle className="animate-spin" size={60} />
                </div>
              )}
              {!loading && notifications.length > 0 ? (
                <NotificationList
                  notifications={notifications}
                  readNotification={readNotification}
                  onNotificationClick={handleNotificationClick}
                />
              ) : (
                <div>
                  <p className="text-center text-3xl">Nothing to Show</p>
                </div>
              )}
              {!loading && notifications.length > 10 && (
                <PaginatedPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </div>
          </section>
        </div>
      </main>
      <NotificationDialog notification={selectedNotification} onClose={closeDialog} />
    </>
  );
};

export default Notifications;
