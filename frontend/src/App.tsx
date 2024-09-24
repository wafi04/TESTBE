import { useEffect, useState } from "react";
import { BaseUrl } from "./contants";
import { Boooks } from "./types";
import AddToBorrow from "./components/features/AddToBorrow";
import { ListUsers } from "./components/features/ListUsers";
import { formatTime } from "./lib/utils";

const App = () => {
  const [data, setData] = useState<Boooks[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(`${BaseUrl}/books`, {
          method: "GET",
        });
        const dataResponse = await response.json();
        setData(dataResponse);
      } catch (error) {
        console.error("Failed to fetch books", error);
      }
    };
    fetchBooks();
  }, []);

  console.log(data);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">All Books</h1>
        <ListUsers />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((book, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 flex flex-col relative group"
          >
            {book.availableQuantity > 0 && <AddToBorrow code={book.code} />}

            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {book.title}
            </h2>
            <p className="text-gray-600 mb-4">Author: {book.author}</p>
            <p
              className={`${
                book.availableQuantity > 0 ? "text-green-600" : "text-red-600"
              } font-medium`}
            >
              {book.availableQuantity > 0
                ? `Available Quantity: ${book.availableQuantity}`
                : "Out of Stock"}
            </p>

            {/* Informasi Peminjam */}
            {book.Borrow.length > 0 && (
              <div className="mt-4 bg-gray-100 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700">
                  Borrowed By:
                </h3>
                {book.Borrow.map((borrow) => (
                  <div
                    key={borrow.id}
                    className="mt-2 p-2 bg-gray-50 rounded-lg shadow-sm"
                  >
                    <p className="text-gray-800">
                      <strong>{borrow.member.name}</strong>
                    </p>
                    <p className="text-gray-600">
                      Borrowed on:{" "}
                      <span className="text-gray-700">
                        {formatTime(borrow.borrowedAt)}
                      </span>
                    </p>
                    <p className="text-gray-600">
                      Due Date:{" "}
                      <span className="text-red-600">
                        {formatTime(borrow.dueDate)}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
