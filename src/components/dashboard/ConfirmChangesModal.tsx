import React from "react";
import { Button } from "@/components/ui/button";

export interface DiffBudget {
  category: string;
  oldAmount: number;
  newAmount: number;
  deltaAmount: number;
  oldPercentage: number;
  newPercentage: number;
  deltaPercentage: number;
}

interface ConfirmChangesModalProps {
  isOpen: boolean;
  changes: DiffBudget[];
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmChangesModal: React.FC<ConfirmChangesModalProps> = ({
  isOpen,
  changes,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Confirm Budget Update</h2>
        <div className="max-h-64 overflow-auto mb-4">
          <ul>
            {changes.map((item, idx) =>
              item.deltaAmount !== 0 && (
                <li key={idx} className="mb-2 text-sm">
                  <strong>{item.category}:</strong>
                  <br />
                  Old: ₹{item.oldAmount.toLocaleString()} ({item.oldPercentage.toFixed(1)}%)
                  <br />
                  New: ₹{item.newAmount.toLocaleString()} ({item.newPercentage.toFixed(1)}%)
                  <br />
                  Change: {item.deltaAmount >= 0 ? "+" : ""}
                  ₹{item.deltaAmount.toLocaleString()} ({item.deltaPercentage >= 0 ? "+" : ""}
                  {item.deltaPercentage.toFixed(1)}%)
                </li>
              )
            )}
          </ul>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>Confirm</Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmChangesModal;