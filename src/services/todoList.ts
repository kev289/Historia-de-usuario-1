import type { Task, TaskPayload } from "@/src/types/task";

export const getTodoList = async () => {
  const res = await fetch("/api/todolist");

  if (!res.ok) {
    throw new Error("No se pudieron cargar las tareas");
  }

  return res.json() as Promise<{ data: Task[] }>;
};

export const createTodo = async (title: string) => {
  const res = await fetch("/api/todolist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });

  if (!res.ok) {
    throw new Error("No se pudo crear la tarea");
  }

  return res.json() as Promise<{ data: Task }>;
};

export const updateTodo = async (id: string, task: TaskPayload) => {
  const res = await fetch("/api/todolist", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...task }),
  });

  if (!res.ok) {
    throw new Error("No se pudo actualizar la tarea");
  }

  return res.json() as Promise<{ data: Task }>;
};

export const deleteTodo = async (id: string) => {
  const res = await fetch(`/api/todolist?id=${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("No se pudo eliminar la tarea");
  }

  return res.json() as Promise<{ data: { id: string } }>;
};
