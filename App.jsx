import React, { useEffect, useState } from "react";

const App = () => {
  const [inputText, setInputText] = useState("");
  const [category, setCategory] = useState("General");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [todoList, setTodoList] = useState(
    JSON.parse(localStorage.getItem("todoData")) || []
  );

  // Save tasks in localStorage
  useEffect(() => {
    localStorage.setItem("todoData", JSON.stringify(todoList));
  }, [todoList]);

  const handleAdd = () => {
    if (!inputText.trim()) return;
    setTodoList([
      ...todoList,
      { text: inputText.trim(), completed: false, category, priority, dueDate },
    ]);
    resetForm();
  };

  const handleDelete = (index) => {
    setTodoList(todoList.filter((_, i) => i !== index));
  };

  const handleDeleteAll = () => {
    if (window.confirm("Are you sure you want to delete all tasks?")) {
      setTodoList([]);
    }
  };

  const handleEdit = (index) => {
    const task = todoList[index];
    setInputText(task.text);
    setCategory(task.category);
    setPriority(task.priority);
    setDueDate(task.dueDate);
    setEditIndex(index);
    setIsEditing(true);
  };

  const handleUpdate = () => {
    if (!inputText.trim()) return;
    const updatedList = todoList.map((item, i) =>
      i === editIndex
        ? { ...item, text: inputText.trim(), category, priority, dueDate }
        : item
    );
    setTodoList(updatedList);
    resetForm();
  };

  const resetForm = () => {
    setInputText("");
    setCategory("General");
    setPriority("Medium");
    setDueDate("");
    setIsEditing(false);
    setEditIndex(null);
  };

  const toggleComplete = (index) => {
    const updatedList = todoList.map((item, i) =>
      i === index ? { ...item, completed: !item.completed } : item
    );
    setTodoList(updatedList);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      isEditing ? handleUpdate() : handleAdd();
    }
  };

  const priorityColors = {
    High: "bg-red-100 text-red-600",
    Medium: "bg-yellow-100 text-yellow-600",
    Low: "bg-green-100 text-green-600",
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 px-4 py-10">
      <div className="w-full max-w-3xl bg-white p-6 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
          To-do List
        </h1>

        {/* Input Section */}
        <div className="space-y-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Enter your task..."
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />

          {/* Responsive grid for category, priority, date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option>General</option>
              <option>Work</option>
              <option>Study</option>
              <option>Personal</option>
            </select>

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>

            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Buttons responsive */}
          <div className="flex flex-col sm:flex-row gap-2">
            {isEditing ? (
              <button
                onClick={handleUpdate}
                className="bg-yellow-500 hover:bg-yellow-600 w-full sm:w-auto flex-1 py-2 text-white rounded-lg shadow-md transition"
              >
                Update
              </button>
            ) : (
              <button
                onClick={handleAdd}
                className="bg-green-500 hover:bg-green-600 w-full sm:w-auto flex-1 py-2 text-white rounded-lg shadow-md transition"
              >
                Add
              </button>
            )}

            <button
              onClick={handleDeleteAll}
              className="bg-red-500 hover:bg-red-600 w-full sm:w-auto flex-1 py-2 text-white rounded-lg shadow-md transition"
            >
              Delete All
            </button>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="mt-6 space-y-3">
          {todoList.length === 0 && (
            <p className="text-gray-500 text-center italic animate-pulse">
              No tasks yet. Add one!
            </p>
          )}

          {todoList.map((item, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:justify-between sm:items-center border p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition shadow-sm"
            >
              {/* Task info */}
              <div className="flex items-start gap-3 flex-1">
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => toggleComplete(index)}
                  className="mt-1 w-5 h-5 accent-indigo-500 cursor-pointer"
                />
                <div>
                  <p
                    className={`text-gray-700 text-lg ${
                      item.completed ? "line-through opacity-60" : ""
                    }`}
                  >
                    {item.text}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-1 text-sm">
                    <span className="bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-md">
                      {item.category}
                    </span>
                    <span
                      className={`${priorityColors[item.priority]} px-2 py-0.5 rounded-md`}
                    >
                      {item.priority} Priority
                    </span>
                    {item.dueDate && (
                      <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-md">
                        Due: {new Date(item.dueDate).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions responsive */}
              <div className="flex gap-2 mt-2 sm:mt-0">
                <button
                  onClick={() => handleEdit(index)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg shadow-sm transition w-full sm:w-auto"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg shadow-sm transition w-full sm:w-auto"
                >
                  Delete
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
