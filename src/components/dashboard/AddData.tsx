"use client";

import React, { useState } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AddDataProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddData({ isOpen, onClose }: AddDataProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfPassword, setPdfPassword] = React.useState("");
  const [isEncrypted, setIsEncrypted] = React.useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type !== "application/pdf") {
      setError("Please upload a PDF file");
      return;
    }
    setFile(selectedFile || null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("pdfPassword", pdfPassword);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");
      onClose();
    } catch (err) {
      setError("Failed to upload file");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Upload PDF</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors">
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
                id="pdf-upload"
              />
              <label
                htmlFor="pdf-upload"
                className="text-sm text-gray-600 cursor-pointer hover:text-gray-800"
              >
                {file ? file.name : "Click to upload PDF"}
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isEncrypted"
                checked={isEncrypted}
                onChange={(e) => setIsEncrypted(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="isEncrypted" className="text-sm text-gray-600">
                File is encrypted
              </label>
            </div>

            {isEncrypted && (
              <div className="space-y-2">
                <label className="text-sm text-gray-600">PDF Password</label>
                <input
                  type="password"
                  value={pdfPassword}
                  onChange={(e) => setPdfPassword(e.target.value)}
                  placeholder="Enter PDF password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!file || isLoading}>
                {isLoading ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
