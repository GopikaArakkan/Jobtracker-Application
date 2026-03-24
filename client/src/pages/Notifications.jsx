import { useEffect, useState } from "react";
import api from "../api/axios";
import { FaBell } from "react-icons/fa";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [backupNotifications, setBackupNotifications] = useState([]);
const [showUndo, setShowUndo] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/api/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications");
    }
  };

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  const markRead = async (id) => {
  try {
    await api.put(`/api/notifications/${id}/read`);
    fetchNotifications();   // refresh list
  } catch (err) {
    console.error(err);
  }
};

const deleteNotification = async (id) => {
  try {
    await api.delete(`/api/notifications/${id}`);
    fetchNotifications();   // refresh list
  } catch (err) {
    console.error(err);
  }
};

const clearAll = () => {
  setBackupNotifications(notifications); // save backup
  setNotifications([]); // clear UI
  setShowUndo(true);

  // auto hide undo after 5 sec
  setTimeout(() => {
    setShowUndo(false);
    setBackupNotifications([]);
  }, 5000);
};

const undoClear = () => {
  setNotifications(backupNotifications);
  setBackupNotifications([]);
  setShowUndo(false);
};

  return (
  <div className="min-h-screen bg-[#0F172A] flex justify-center">
  <div className="w-full max-w-3xl p-8 text-white">

     <div className="flex justify-between items-center mb-6">
  <h1 className="text-3xl font-bold text-white">
    🔔 Notifications
  </h1>




  <button
  onClick={clearAll}
  className="text-sm text-white bg-gray-600 p-2 rounded-xl border-gray-400 border-2 hover:border-red-400"
>
  Clear All
</button>
{showUndo && (
  <div className="text-gray-400 justify-between items-center">
      <button
      onClick={undoClear}
      className="text-s text-white bg-gray-600 p-2 rounded-xl border-gray-400 border-2 flex"
    >
      Undo
    </button>
   
  </div>
  
)}
</div>

      {notifications.length === 0 ? (
        <p className="text-gray-400">No notifications yet</p>
      ) : (
        <div className="space-y-4">

          {notifications.map((n) => (
           <div
  key={n._id}
  className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200
  ${n.read 
    ? "bg-gray-900 border-gray-500" 
    : "bg-gray-800 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
  }
  hover:scale-[1.01] hover:shadow-lg`}
>

  <div className="flex items-start gap-4">

    {/* Icon */}
    <div className="bg-blue-500/20 p-2 rounded-lg">
      <FaBell className="text-blue-400" />
    </div>

    {/* Content */}
    <div>
      <p className="text-white font-medium">{n.message}</p>
      <p className="text-xs text-gray-400 mt-1">
        {new Date(n.createdAt).toLocaleString()}
      </p>
    </div>

  </div>

  {/* Actions */}
  <div className="flex gap-2">

    {!n.read && (
      <button
        onClick={() => markRead(n._id)}
        className="bg-green-500/20 text-green-400 px-3 py-1 font-bold rounded-lg text-xs hover:bg-green-500/30"
      >
        ✓ Read
      </button>
    )}

    <button
      onClick={() => deleteNotification(n._id)}
      className="bg-red-500/20 text-red-400 px-3 py-1 font-bold  rounded-lg text-xs hover:bg-red-500/30"
    >
      ✕
    </button>

  </div>

</div>
          ))}

        </div>
      )}
        </div>
    </div>
  );
}