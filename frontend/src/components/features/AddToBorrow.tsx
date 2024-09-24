import { BaseUrl } from "@/contants";
import { Member } from "@/types";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Ellipsis, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";

interface PropsBorrow {
  code: string;
}

const AddToBorrow = ({ code }: PropsBorrow) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${BaseUrl}/members`, {
          method: "GET",
        });
        const dataResponse = await response.json();
        setData(dataResponse);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="absolute top-3 right-3 group-hover:visible invisible">
          <Ellipsis className="cursor-pointer hover:text-gray-600" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            Borrow
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {open && (
        <SubmitBorrow
          code={code}
          members={data}
          open={open}
          onClose={() => setOpen(false)}
          loading={loading}
        />
      )}
    </>
  );
};

export default AddToBorrow;

function SubmitBorrow({
  code,
  members,
  open,
  onClose,
  loading,
}: {
  code: string;
  members: Member[];
  open: boolean;
  onClose: () => void;
  loading: boolean;
}) {
  const [selectedMember, setSelectedMember] = useState<string>("");
  const [borrowing, setBorrowing] = useState(false);
  const [response, setResponse] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const Borrow = async () => {
    setBorrowing(true);
    setResponse(null);
    try {
      const response = await fetch(`${BaseUrl}/borrow/borrow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          memberId: selectedMember,
          bookId: code,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to borrow book");
      }
      setResponse({ success: true, message: "Book borrowed successfully" });
    } catch (error) {
      console.error(error);
      setResponse({
        success: false,
        message: error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setBorrowing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Select a Member
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-gray-600">
            Choose a member to borrow the book with code{" "}
            <span className="font-bold">{code}</span>.
          </p>
          <div className="max-h-60 overflow-y-auto border rounded-md p-2">
            {loading ? (
              <div className="flex justify-center items-center h-20">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : members.length > 0 ? (
              members.map((member) => (
                <div
                  key={member.code}
                  onClick={() => setSelectedMember(member.code)}
                  className={`cursor-pointer p-3 rounded-md flex items-center justify-between transition-all ${
                    selectedMember === member.code
                      ? "bg-blue-100 border-blue-500"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <span className="text-gray-800">{member.name}</span>
                  {selectedMember === member.code && (
                    <span className="text-blue-600 font-semibold">
                      Selected
                    </span>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No members available.</p>
            )}
          </div>
          {response && (
            <Alert variant={response.success ? "default" : "destructive"}>
              <AlertTitle>{response.success ? "Success" : "Error"}</AlertTitle>
              <AlertDescription>{response.message}</AlertDescription>
            </Alert>
          )}
        </div>
        <DialogFooter className="mt-6">
          <Button onClick={onClose} variant="secondary" disabled={borrowing}>
            {response && response.success ? "Close" : "Cancel"}
          </Button>
          <Button onClick={Borrow} disabled={!selectedMember || borrowing}>
            {borrowing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Borrowing...
              </>
            ) : (
              "Confirm Borrow"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
