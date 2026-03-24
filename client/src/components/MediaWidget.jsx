import { useState, useEffect } from "react";
import { FaUpload, FaTrash, FaEdit, FaLink, FaFile } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import api from "../api/axios"; // ⭐ added

export default function MediaWidget() {

  const [files, setFiles] = useState([]);
  const [linkInput, setLinkInput] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  // ⭐ FETCH FROM DB
  const fetchMedia = async () => {
    try {
      const res = await api.get("/api/media");
      setFiles(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  // ❌ DISABLE localStorage (kept structure)
  useEffect(() => {}, []);
  useEffect(() => {}, [files]);

  /* Upload files (name only saved) */
  const handleUpload = async (e) => {

    const uploaded = Array.from(e.target.files);

    for (let file of uploaded) {
      await api.post("/api/media", {
        name: file.name,
        type: "file",
        url: "#" // placeholder
      });
    }

    fetchMedia();
  };

  /* Add portfolio link */
  const addLink = async () => {

    if (!linkInput.trim()) return;

    await api.post("/api/media", {
      name: linkInput,
      type: "link",
      url: linkInput
    });

    setLinkInput("");
    fetchMedia();
  };

  /* Delete */
  const deleteItem = async (id) => {
    await api.delete(`/api/media/${id}`);
    fetchMedia();
  };

  /* Rename */
  const renameItem = async (item) => {

    const newName = prompt("Rename file");

    if (!newName) return;

    await api.put(`/api/media/${item._id}`, {
      name: newName
    });

    fetchMedia();
  };

  return (

   <div className="bg-gray-900 p-5 rounded-xl h-full flex flex-col text-white h-full">

      <div className="mb-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <FaCheckCircle className="text-green-400"/>
          Media
        </h2>
        <div className="h-[2px] mt-2 bg-gradient-to-r from-green-400 via-yellow-400 to-blue-400 rounded"></div>
      </div>

      <div className="flex gap-2 mb-3">

        <label className="flex items-center gap-2 bg-green-600 px-2 py-1 rounded cursor-pointer text-sm">

          <FaUpload />
          Upload

          <input
            type="file"
            multiple
            className="hidden"
            onChange={handleUpload}
          />

        </label>

        <input
          placeholder="Add portfolio link..."
          className="bg-gray-800 p-1 rounded text-sm flex-1"
          value={linkInput}
          onChange={(e)=>setLinkInput(e.target.value)}
        />

        <button
          onClick={addLink}
          className="bg-blue-500 px-1 rounded text-sm"
        >
          <FaLink/>
        </button>

      </div>

      <div className="space-y-2 max-h-40 overflow-y-auto">

        {files.length === 0 && (
          <p className="text-gray-400 text-sm">
            No files added
          </p>
        )}

        {files.map((file)=>(
          <div
            key={file._id}
            className="flex justify-between items-center bg-gray-800 p-2 rounded text-sm"
          >

            <a
              href={file.url === "#" ? "#" : file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 truncate hover:text-blue-400"
            >
              <FaFile/>
              {file.name}
            </a>

            <div className="flex gap-2">

              <FaEdit
                className="cursor-pointer text-yellow-400"
                onClick={()=>renameItem(file)}
              />

              <FaTrash
                className="cursor-pointer text-red-400"
                onClick={()=>deleteItem(file._id)}
              />

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}