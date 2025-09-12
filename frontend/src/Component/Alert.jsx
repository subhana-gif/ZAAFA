import { useEffect } from "react";

export default function Alert({ message, type = "info", duration = 3000, onClose }) {
  // Automatically close after duration
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  // Colors based on type
  const bgColor =
    type === "success"
      ? "bg-green-100 border-green-400 text-green-700"
      : type === "error"
      ? "bg-red-100 border-red-400 text-red-700"
      : type === "warning"
      ? "bg-yellow-100 border-yellow-400 text-yellow-700"
      : "bg-blue-100 border-blue-400 text-blue-700";

  return (
    <div className={`fixed top-5 right-5 border-l-4 p-4 rounded shadow-md ${bgColor} z-50`}>
      <p>{message}</p>
    </div>
  );
}
