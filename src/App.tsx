"use client";

import { useState, useEffect } from "react";
import { MdDone } from "react-icons/md";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";

// Define the structure of a single todo item
interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");

  useEffect(() => {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedValue = newTodo.trim();

    if (!trimmedValue) return;

    setTodos([...todos, { id: Date.now(), text: trimmedValue, completed: false }]);
    setNewTodo("");
  };

  const handleToggleComplete = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditingText(todo.text);
  };

  const handleUpdate = (id: number, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedValue = editingText.trim();

    if (!trimmedValue) return;

    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: trimmedValue } : todo
      )
    );
    setEditingId(null);
    setEditingText("");
  };

  const handleDelete = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingText("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 animate-gradient bg-[length:200%_200%]">
      {/* Main container */}
      <div className="w-full max-w-md mx-auto backdrop-blur-lg bg-white/30 rounded-lg shadow-lg border border-white/10">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10">
          <h1 className="text-3xl font-bold text-center text-indigo-200 tracking-wide">
            To-Do List
          </h1>
        </div>

        {/* Input form */}
        <div className="p-6">
          <form onSubmit={handleAddTodo} className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Add a new task"
                className="flex-1 px-4 py-2 rounded-xl bg-white/80 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-400 shadow-md"
              />
              <button
                type="submit"
                disabled={!newTodo.trim()}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
          </form>

          {/* Task list */}
          {todos.length === 0 ? (
            <p className="text-center text-gray-300 py-4">
              No tasks yet. Add one above!
            </p>
          ) : (
            <ul className="space-y-2 mt-4">
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className={`rounded-lg border border-gray-300 backdrop-blur-sm transition-colors ${
                    todo.completed
                      ? "bg-green-100/60 text-gray-800"
                      : "bg-white/60 hover:bg-purple-50"
                  }`}
                >
                  {editingId === todo.id ? (
                    <form
                      onSubmit={(e) => handleUpdate(todo.id, e)}
                      className="flex gap-2 p-3"
                    >
                      <input
                        type="text"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        autoFocus
                        className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="submit"
                        disabled={!editingText.trim()}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 shadow-md"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 shadow-md"
                      >
                        Cancel
                      </button>
                    </form>
                  ) : (
                    <div className="flex justify-between items-center p-3">
                      <span
                        className={`break-all pr-4 ${
                          todo.completed
                            ? "line-through text-gray-500"
                            : "text-gray-800"
                        }`}
                      >
                        {todo.text}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleComplete(todo.id)}
                          className="p-2 text-green-500 hover:bg-green-50 rounded-full shadow-inner"
                          aria-label={`Complete task: ${todo.text}`}
                        >
                          <MdDone className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleEdit(todo)}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-full shadow-inner"
                          aria-label={`Edit task: ${todo.text}`}
                        >
                          <AiOutlineEdit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(todo.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full shadow-inner"
                          aria-label={`Delete task: ${todo.text}`}
                        >
                          <AiOutlineDelete className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}


