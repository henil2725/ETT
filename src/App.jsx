import React, { useEffect, useState } from "react";

const App = () => {
  const [inputText, setInputText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [todoList, setTodoList] = useState(
    JSON.parse(localStorage.getItem("todoData")) || []
  );

  useEffect(() => {
    localStorage.setItem("todoData", JSON.stringify(todoList));
  }, [todoList]);

  function handleAdd() {
    if (!inputText.trim()) return;
    setTodoList([...todoList, { text: inputText.trim(), completed: false }]);
    setInputText("");
  }

  function handleDelete(index) {
    setTodoList(todoList.filter((_, i) => i !== index));
  }

  function handleEdit(index) {
    setInputText(todoList[index].text);
    setEditIndex(index);
    setIsEditing(true);
  }

  function handleUpdate() {
    if (!inputText.trim()) return;
    const updatedList = todoList.map((item, i) =>
      i === editIndex ? { ...item, text: inputText.trim() } : item
    );
    setTodoList(updatedList);
    setInputText("");
    setIsEditing(false);
    setEditIndex(null);
  }

  function toggleComplete(index) {
    const updatedList = todoList.map((item, i) =>
      i === index ? { ...item, completed: !item.completed } : item
    );
    setTodoList(updatedList);
  }

  function handleKeyPress(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      isEditing ? handleUpdate() : handleAdd();
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-50 to-purple-100 py-10 px-4">
      <div className="w-full max-w-lg bg-white p-6 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-800 tracking-wide">
          My Todo List
        </h1>

      
        <div className="flex gap-2">
          <input
            className="flex-1 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            type="text"
            placeholder="Enter your task..."
          />
          {isEditing ? (
            <button
              onClick={handleUpdate}
              className="bg-yellow-500 hover:bg-yellow-600 px-5 py-2 text-white rounded-lg shadow-md transition"
            >
              Update
            </button>
          ) : (
            <button
              onClick={handleAdd}
              className="bg-green-500 hover:bg-green-600 px-5 py-2 text-white rounded-lg shadow-md transition"
            >
              Add
            </button>
          )}
        </div>

      
        <div className="mt-6 space-y-3">
          {todoList.length === 0 && (
            <p className="text-gray-500 text-center italic">
              No tasks yet. Add one!
            </p>
          )}
          {todoList.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center border p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition shadow-sm"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => toggleComplete(index)}
                  className="w-5 h-5 accent-indigo-500 cursor-pointer"
                />
                <p
                  className={`text-gray-700 ${
                    item.completed ? "line-through opacity-60" : ""
                  }`}
                >
                  {item.text}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDelete(index)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg shadow-sm"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleEdit(index)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg shadow-sm"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
