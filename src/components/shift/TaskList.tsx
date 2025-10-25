import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TaskListProps {
  patientAssignmentId: string;
  userId: string;
}

interface Task {
  id: string;
  description: string;
  is_completed: boolean;
}

const fetchTasks = async (patientAssignmentId: string) => {
  const { data, error } = await supabase
    .from("shift_tasks")
    .select("*")
    .eq("patient_assignment_id", patientAssignmentId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data as Task[];
};

export const TaskList = ({ patientAssignmentId, userId }: TaskListProps) => {
  const queryClient = useQueryClient();
  const [newTaskDesc, setNewTaskDesc] = useState("");

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks", patientAssignmentId],
    queryFn: () => fetchTasks(patientAssignmentId),
  });

  const addTaskMutation = useMutation({
    mutationFn: async (description: string) => {
      const { data, error } = await supabase
        .from("shift_tasks")
        .insert({ description, patient_assignment_id: patientAssignmentId, user_id: userId })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", patientAssignmentId] });
      setNewTaskDesc("");
    },
    onError: (error) => toast.error("Erro ao adicionar tarefa", { description: error.message }),
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, is_completed }: { id: string; is_completed: boolean }) => {
      const { error } = await supabase.from("shift_tasks").update({ is_completed }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks", patientAssignmentId] }),
    onError: (error) => toast.error("Erro ao atualizar tarefa", { description: error.message }),
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("shift_tasks").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks", patientAssignmentId] }),
    onError: (error) => toast.error("Erro ao remover tarefa", { description: error.message }),
  });

  return (
    <div className="mt-4 pt-4 border-t">
      <h4 className="text-sm font-semibold mb-2">Tarefas e Pendências</h4>
      <div className="flex gap-2 mb-3">
        <Input
          placeholder="Nova tarefa (ex: Levar para Raio-X)"
          value={newTaskDesc}
          onChange={(e) => setNewTaskDesc(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTaskMutation.mutate(newTaskDesc)}
        />
        <Button onClick={() => addTaskMutation.mutate(newTaskDesc)} disabled={!newTaskDesc || addTaskMutation.isPending}>
          {addTaskMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        </Button>
      </div>
      {isLoading ? <div className="flex justify-center p-2"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div> :
        <div className="space-y-2">
          {tasks.map(task => (
            <div key={task.id} className="flex items-center gap-3 group">
              <Checkbox
                id={`task-${task.id}`}
                checked={task.is_completed}
                onCheckedChange={(checked) => updateTaskMutation.mutate({ id: task.id, is_completed: !!checked })}
              />
              <label
                htmlFor={`task-${task.id}`}
                className={cn("flex-1 text-sm font-medium cursor-pointer", task.is_completed && "line-through text-muted-foreground")}
              >
                {task.description}
              </label>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => deleteTaskMutation.mutate(task.id)}
                disabled={deleteTaskMutation.isPending && deleteTaskMutation.variables === task.id}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
          {tasks.length === 0 && <p className="text-xs text-muted-foreground text-center p-2">Nenhuma tarefa adicionada.</p>}
        </div>
      }
    </div>
  );
};