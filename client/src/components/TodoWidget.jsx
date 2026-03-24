import { useState, useEffect } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import api from "../api/axios";

export default function TodoWidget() {

  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await api.get("/api/todos");
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addTask = async () => {

    if (!input.trim()) return;

    // ⭐ KEEP your edit logic (frontend only for now)
    if (editingIndex !== null) {
      const updated = [...tasks];
      updated[editingIndex].text = input;
      setTasks(updated);
      setEditingIndex(null);
      setInput("");
      return;
    }

    // ⭐ FIXED: actual API call (this was broken before)
    try {
      await api.post("/api/todos", { text: input });
      setInput("");
      setEditingIndex(null);
      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTask = async (task) => {
    try {
      await api.put(`/api/todos/${task._id}`, {
        completed: !task.completed,
      });
      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/api/todos/${id}`);
      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  const editTask = (index) => {
    setInput(tasks[index].text);
    setEditingIndex(index);
  };

  return (

    <div className="bg-gray-900 p-5 rounded-xl h-full flex flex-col text-white">

      <div className="mb-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <FaCheckCircle className="text-green-400"/>
          To-Do List
        </h2>
        <div className="h-[2px] mt-2 bg-gradient-to-r from-green-400 via-yellow-400 to-blue-400 rounded"></div>
      </div>

      <div className="flex gap-2 mb-4">

        <input
          className="flex-1 p-2 rounded bg-gray-800"
          placeholder="Add task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          onClick={addTask}
          className="bg-green-500 px-3 py-2 rounded"
        >
          {editingIndex !== null ? "Update" : "Add"}
        </button>

      </div>

      {tasks.length === 0 && (
        <p className="text-gray-400">No tasks yet</p>
      )}

      <ul className="space-y-2 max-h-74 overflow-y-auto pr-1">

        {tasks.map((task, index) => (

          <li
            key={task._id}
            className="flex justify-between items-center bg-gray-800 p-2 rounded cursor-pointer"
            onClick={() => setActiveIndex(index)}
          >

            <div className="flex items-center gap-2">

              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task)}
              />

              <span
                className={
                  task.completed
                    ? "line-through text-gray-400"
                    : ""
                }
              >
                {task.text}
              </span>

            </div>

            {activeIndex === index && (

              <div className="flex gap-2">

                <FaEdit
                  className="text-yellow-400 cursor-pointer"
                  onClick={() => editTask(index)}
                />

                <FaTrash
                  className="text-red-400 cursor-pointer"
                  onClick={() => deleteTask(task._id)}
                />

              </div>

            )}

          </li>

        ))}

      </ul>

    </div>
  );
}