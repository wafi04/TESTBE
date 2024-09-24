import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { formatTime } from "@/lib/utils";
import { Button } from "../ui/button";
import { Member } from "@/types";
import { BaseUrl } from "@/contants";

interface Props {
  memberId: string;
  open: boolean;
  onClose: () => void;
}
interface Borrows {
  author: string;
  bookCode: string;
  borrowId: number;
  borrowedAt: string;
  title: string;
}

export function ListUsers() {
  const [data, setData] = useState<Member[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BaseUrl}/members`, {
          method: "GET",
        });
        const dataResponse = await response.json();
        setData(dataResponse);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleOpen = (memberId: string) => {
    setOpen(true);
    setSelectedMember(memberId);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition">
          Users
          <ChevronDown className="ml-2 h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white shadow-lg rounded-md py-2 w-48">
          {data.map((member) => (
            <DropdownMenuItem
              key={member.code}
              onClick={() => handleOpen(member.code)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {member.code} - {member.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {open && (
        <DialogBorrowUsers
          memberId={selectedMember}
          onClose={() => setOpen(false)}
          open={open}
        />
      )}
    </>
  );
}

function DialogBorrowUsers({ memberId, onClose, open }: Props) {
  const [dataBorrow, setDataBorrow] = useState<Borrows[]>([]);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [returnMessage, setReturnMessage] = useState<string | null>(null);
  const [penaltyUntil, setPenaltyUntil] = useState<Date | null>(null);

  useEffect(() => {
    const fetchBorrowData = async () => {
      try {
        const response = await fetch(`${BaseUrl}/borrow/borrow/${memberId}`);
        if (!response.ok) throw new Error("Failed to fetch borrowed books");
        const responseData = await response.json();
        setDataBorrow(responseData);
      } catch (error) {
        console.error(error);
        setError("Failed to load borrowed books. Please try again.");
      }
    };
    fetchBorrowData();
  }, [memberId]);

  const ReturnBook = async (returnBookId: number) => {
    setLoadingId(returnBookId);
    setError(null);
    setReturnMessage(null);
    try {
      const response = await fetch(`${BaseUrl}/borrow/return`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          borrowId: returnBookId,
        }),
      });

      if (!response.ok) throw new Error("Failed to return the book");
      const result = await response.json();
      setDataBorrow((prevData) =>
        prevData.filter((book) => book.borrowId !== returnBookId)
      );
      setReturnMessage(
        `Book returned successfully. ${
          result.isLate
            ? `Late return. Penalty: 5 minutes.`
            : "Returned on time."
        }`
      );
      if (result.penaltyUntil) {
        setPenaltyUntil(new Date(result.penaltyUntil));
      }
    } catch (error) {
      console.error("Failed to return the book:", error);
      setError("Failed to return the book. Please try again.");
    } finally {
      setLoadingId(null);
    }
  };

  const isPenalized = penaltyUntil && penaltyUntil > new Date();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
        <DialogHeader>
          <h2 className="text-xl font-semibold">Borrowed Books</h2>
        </DialogHeader>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {returnMessage && (
          <p className="text-green-500 mt-2">{returnMessage}</p>
        )}
        {isPenalized && (
          <p className="text-yellow-500 mt-2">
            Member is penalized until: {formatTime(penaltyUntil.toISOString())}
          </p>
        )}
        {dataBorrow.length > 0 ? (
          <>
            <p className="mt-2 text-blue-500">
              Books borrowed: {dataBorrow.length} / 2
            </p>
            <ul className="space-y-4 mt-4">
              {dataBorrow.map((borrow) => (
                <li
                  key={borrow.borrowId}
                  className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                >
                  <h3 className="text-lg font-semibold">{borrow.title}</h3>
                  <p className="text-gray-600">
                    <span className="font-bold">Author:</span> {borrow.author}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-bold">Book Code:</span>{" "}
                    {borrow.bookCode}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-bold">Borrowed At:</span>{" "}
                    {formatTime(borrow.borrowedAt)}
                  </p>
                  <Button
                    onClick={() => ReturnBook(borrow.borrowId)}
                    disabled={loadingId === borrow.borrowId}
                  >
                    {loadingId === borrow.borrowId ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin h-5 w-5 mr-2 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          ></path>
                        </svg>
                        Returning...
                      </span>
                    ) : (
                      "Return"
                    )}
                  </Button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="mt-4 text-gray-600">
            No borrowed books for this member.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
