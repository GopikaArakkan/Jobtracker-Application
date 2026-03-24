import { useState, useEffect, useRef } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import api from "../api/axios"; // ⭐ ADDED

export default function ReminderWidget() {

  const [reminders, setReminders] = useState([]);
  const [text, setText] = useState("");
  const [time, setTime] = useState("");
  const [editingId, setEditingId] = useState(null);

  const alarmSoundRef = useRef(new Audio("/alarm.mp3"));
  alarmSoundRef.current.loop = true;

  const [alarmActive, setAlarmActive] = useState(false);

  // ⭐ FETCH FROM DATABASE (REPLACES localStorage load)
  const fetchReminders = async () => {
    try {
      const res = await api.get("/api/widget-reminders");
      setReminders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  // Ask notification permission
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // Check reminders every 30 seconds
  useEffect(() => {

    const interval = setInterval(() => {

      const now = new Date();
      const currentTime = now.toTimeString().slice(0,5);

      reminders.forEach(async (reminder) => {

        if (
          reminder.time === currentTime &&
          !reminder.notified &&
          !reminder.completed
        ) {

          if (Notification.permission === "granted") {
            new Notification("Reminder", {
              body: reminder.text
            });
          }

          alarmSoundRef.current.currentTime = 0;
          alarmSoundRef.current.play();

          setAlarmActive(true);

          // ⭐ UPDATE notified IN DB
          await api.put(`/api/widget-reminders/${reminder._id}`, {
            notified: true
          });

          fetchReminders();
        }

      });

    }, 30000);

    return () => clearInterval(interval);

  }, [reminders]);

  // ❌ REMOVE localStorage (kept structure but disabled)
  useEffect(() => {}, []);
  useEffect(() => {}, [reminders]);

  // Add reminder
  const addReminder = async () => {

    if (!text.trim() || !time) return;

    if (editingId) {

      await api.put(`/api/widget-reminders/${editingId}`, {
        text,
        time
      });

      setEditingId(null);

    } else {

      await api.post("/api/widget-reminders", {
        text,
        time
      });

    }

    setText("");
    setTime("");
    fetchReminders();
  };

  // Delete reminder
  const deleteReminder = async (id) => {

    await api.delete(`/api/widget-reminders/${id}`);
    fetchReminders();

  };

  // Edit reminder
  const editReminder = (reminder) => {

    setText(reminder.text);
    setTime(reminder.time);
    setEditingId(reminder._id); // ⭐ FIXED

  };

  // Toggle complete
  const toggleComplete = async (reminder) => {

    await api.put(`/api/widget-reminders/${reminder._id}`, {
      completed: !reminder.completed
    });

    alarmSoundRef.current.pause();
    alarmSoundRef.current.currentTime = 0;
    setAlarmActive(false);

    fetchReminders();
  };

  return (

   <div
    className={`bg-gray-900 p-5 rounded-xl text-white transition-all h-full flex flex-col ${
      alarmActive ? "animate-pulse border-2 border-red-500" : ""
    }`}
  >

      <div className="mb-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <FaCheckCircle className="text-green-400"/>
          Daily Reminder
        </h2>
        <div className="h-[2px] mt-2 bg-gradient-to-r from-green-400 via-yellow-400 to-blue-400 rounded"></div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">

        <input
          value={text}
          onChange={(e)=>setText(e.target.value)}
          placeholder="Reminder..."
          className="flex-1 min-w-[120px] p-2 rounded bg-gray-800 text-white"
        />

        <input
          type="time"
          value={time}
          onChange={(e)=>setTime(e.target.value)}
          className="w-24 p-2 rounded bg-gray-800 text-white"
        />

        <button
          onClick={addReminder}
          className="bg-green-500 px-3 py-2 rounded whitespace-nowrap"
        >
          {editingId ? "Update" : "Add"}
        </button>

      </div>

      <div className="max-h-60 overflow-y-auto pr-1">

        {reminders.length === 0 ? (
          <p className="text-gray-400">
            No reminders today
          </p>
        ) : (
          reminders.map(reminder => (

            <div
              key={reminder._id} // ⭐ FIXED
              className="flex items-center justify-between bg-gray-800 p-2 rounded mb-2"
            >

              <div className="flex items-center gap-2">

                <input
                  type="checkbox"
                  checked={reminder.completed}
                  onChange={()=>toggleComplete(reminder)} // ⭐ FIXED
                />

                <span className={reminder.completed ? "line-through text-gray-500" : ""}>
                  {reminder.text}
                </span>

                <span className="text-xs text-gray-400 ml-2">
                  🕒 {reminder.time}
                </span>

              </div>

              <div className="flex gap-2">

                <FaEdit
                  className="cursor-pointer text-yellow-400"
                  onClick={()=>editReminder(reminder)}
                />

                <FaTrash
                  className="cursor-pointer text-red-400"
                  onClick={()=>deleteReminder(reminder._id)} // ⭐ FIXED
                />

              </div>

            </div>

          ))
        )}

      </div>

    </div>

  );
}