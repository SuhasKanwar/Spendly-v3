"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import axios from 'axios';

interface Goal {
  goalTitle: string;
  amount: number;
  remaining: number;
}

const GoalsPage = () => {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [newGoal, setNewGoal] = useState<Goal>({
    goalTitle: '',
    amount: 0,
    remaining: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  const username = session?.user?.username || '';

  useEffect(() => {
    if (!username) {
      console.error("No username found in session");
      return;
    }
    fetchGoals();
  }, [username]);

  const fetchGoals = async () => {
    try {
      const response = await axios.get(`/api/goals/${username}`);
      const data = response.data;
      if (data.success) {
        setGoals(data.goals);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error || "Failed to fetch goals"
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch goals"
      });
    }
  };

  const handleAddGoal = async () => {
    if (!newGoal.goalTitle.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Goal title is required"
      });
      return;
    }

    if (newGoal.amount <= 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Amount must be greater than 0"
      });
      return;
    }

    if (newGoal.remaining < 0 || newGoal.remaining > newGoal.amount) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Remaining amount must be between 0 and total amount"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`/api/goals/${username}`, newGoal);
      const data = response.data;
      
      if (data.success) {
        await fetchGoals();
        setIsAddModalOpen(false);
        setNewGoal({ goalTitle: '', amount: 0, remaining: 0 });
        toast({
          title: "Success",
          description: "Goal added successfully"
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error || "Failed to add goal"
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add goal"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteGoal = async () => {
    if (!selectedGoal) return;
    setIsLoading(true);
    try {
      const response = await axios.delete(`/api/goals/${username}`, {
        data: { goalTitle: selectedGoal.goalTitle }
      });
      const data = response.data;
      
      if (data.success) {
        await fetchGoals();
        setIsDeleteModalOpen(false);
        setSelectedGoal(null);
        toast({
          title: "Success",
          description: "Goal deleted successfully"
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error || "Failed to delete goal"
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete goal"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateGoal = async () => {
    if (!selectedGoal) return;

    if (!selectedGoal.goalTitle.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Goal title is required"
      });
      return;
    }

    if (selectedGoal.amount <= 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Amount must be greater than 0"
      });
      return;
    }

    if (selectedGoal.remaining < 0 || selectedGoal.remaining > selectedGoal.amount) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Remaining amount must be between 0 and total amount"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.patch(`/api/goals/${username}`, selectedGoal);
      const data = response.data;
      
      if (data.success) {
        await fetchGoals();
        setIsEditModalOpen(false);
        setSelectedGoal(null);
        toast({
          title: "Success",
          description: "Goal updated successfully"
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error || "Failed to update goal"
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update goal"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 mt-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Goals</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Goal
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {goals.map((goal) => (
          <Card key={goal.goalTitle} className="w-full">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {goal.goalTitle}
                <div className="space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedGoal(goal);
                      setIsEditModalOpen(true);
                    }}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedGoal(goal);
                      setIsDeleteModalOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress 
                value={goal.amount > 0 ? ((goal.remaining) / goal.amount) * 100 : 0}
                className="mb-2"
              />
              <p className="text-sm text-gray-500">
                ₹{(goal.amount - goal.remaining).toLocaleString()} remaining of ₹{goal.amount.toLocaleString()} - {goal.amount > 0 ? Math.round(((goal.remaining) / goal.amount) * 100) : 0}% completed
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Goal Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Goal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Goal Title"
              value={newGoal.goalTitle}
              onChange={(e) => setNewGoal({ ...newGoal, goalTitle: e.target.value })}
            />
            <Input
              type="number"
              min="0"
              placeholder="Target Amount"
              value={newGoal.amount}
              onChange={(e) => setNewGoal({ ...newGoal, amount: Number(e.target.value) })}
            />
            <Input
              type="number"
              min="0"
              placeholder="Remaining Amount"
              value={newGoal.remaining}
              onChange={(e) => setNewGoal({ ...newGoal, remaining: Number(e.target.value) })}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddGoal} disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Goal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Goal</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete "{selectedGoal?.goalTitle}"?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteGoal}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Goal Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Goal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Goal Title"
              value={selectedGoal?.goalTitle || ''}
              onChange={(e) => setSelectedGoal(selectedGoal ? { ...selectedGoal, goalTitle: e.target.value } : null)}
            />
            <Input
              type="number"
              min="0"
              placeholder="Target Amount"
              value={selectedGoal?.amount || 0}
              onChange={(e) => setSelectedGoal(selectedGoal ? { ...selectedGoal, amount: Number(e.target.value) } : null)}
            />
            <Input
              type="number"
              min="0"
              placeholder="Remaining Amount"
              value={selectedGoal?.remaining || 0}
              onChange={(e) => setSelectedGoal(selectedGoal ? { ...selectedGoal, remaining: Number(e.target.value) } : null)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateGoal}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GoalsPage;