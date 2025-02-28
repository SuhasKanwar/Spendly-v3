import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

interface InvestmentChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
}

export default function InvestmentChoiceModal({
  isOpen,
  onClose,
  amount,
}: InvestmentChoiceModalProps) {
  const router = useRouter();

  const handleChoice = (choice: "stocks" | "mutual-funds") => {
    // Prevent any other events from firing
    router.push(`/dashboard/${choice}?amount=${amount}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choose Investment Type</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Button
            variant="outline"
            className="h-32 flex flex-col gap-2"
            onClick={(e) => {
              e.stopPropagation(); // Stop event bubbling
              handleChoice("stocks");
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
              <polyline points="16 7 22 7 22 13"/>
            </svg>
            Stocks
          </Button>
          <Button
            variant="outline"
            className="h-32 flex flex-col gap-2"
            onClick={(e) => {
              e.stopPropagation(); // Stop event bubbling
              handleChoice("mutual-funds");
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/>
              <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/>
              <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>
            </svg>
            Mutual Funds
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
