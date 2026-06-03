"use client";

import { useEffect, useMemo, useState } from "react";
import { createTodo, deleteTodo, getTodoList, updateTodo } from "@/src/services/todoList.service";
import type { Task } from "@/src/types/task";

const getVisibleTime = (task: Task, now: number) => {
  if (task.status !== "inProgress" || !task.startedAt) {
    return task.time;
  }

  const elapsed = Math.floor((now - new Date(task.startedAt).getTime()) / 1000);
  return task.time + Math.max(elapsed, 0);
};

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        const result = await getTodoList();
        setTasks(result.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error inesperado al cargar tareas");
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  useEffect(() => {
    const hasActiveTask = tasks.some((task) => task.status === "inProgress");

    if (!hasActiveTask) {
      return;
    }

    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(interval);
  }, [tasks]);

  const visibleTasks = useMemo(
    () => tasks.map((task) => ({ ...task, time: getVisibleTime(task, now) })),
    [now, tasks]
  );

  const createTask = async () => {
    const title = taskTitle.trim();

    if (!title) {
      return;
    }

    try {
      const result = await createTodo(title);
      setTasks((currentTasks) => [result.data, ...currentTasks]);
      setTaskTitle("");
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear la tarea");
    }
  };

  const startTask = async (id: string) => {
    const startedAt = new Date().toISOString();
    const changedIds = new Set<string>();
    const previousTasks = tasks;
    const updates = tasks.map((task) => {
      if (task.id === id) {
        changedIds.add(task.id);
        return { ...task, status: "inProgress" as const, startedAt, endedAt: null };
      }

      if (task.status === "inProgress") {
        changedIds.add(task.id);
        return {
          ...task,
          status: "pending" as const,
          time: getVisibleTime(task, Date.now()),
          startedAt: null,
        };
      }

      return task;
    });

    setTasks(updates);

    try {
      await Promise.all(
        updates
          .filter((task) => changedIds.has(task.id))
          .map((task) =>
            updateTodo(task.id, {
              title: task.title,
              status: task.status,
              time: task.time,
              startedAt: task.startedAt,
              endedAt: task.endedAt,
            })
          )
      );
      setError(null);
    } catch (err) {
      setTasks(previousTasks);
      setError(err instanceof Error ? err.message : "Error al iniciar la tarea");
    }
  };

  const finishTask = async (id: string) => {
    const endedAt = new Date().toISOString();
    const task = tasks.find((currentTask) => currentTask.id === id);

    if (!task) {
      return;
    }

    const previousTasks = tasks;
    const finishedTask: Task = {
      ...task,
      status: "done",
      time: getVisibleTime(task, Date.now()),
      startedAt: null,
      endedAt,
    };

    setTasks((currentTasks) =>
      currentTasks.map((currentTask) => (currentTask.id === id ? finishedTask : currentTask))
    );

    try {
      await updateTodo(id, {
        title: finishedTask.title,
        status: finishedTask.status,
        time: finishedTask.time,
        startedAt: finishedTask.startedAt,
        endedAt: finishedTask.endedAt,
      });
      setError(null);
    } catch (err) {
      setTasks(previousTasks);
      setError(err instanceof Error ? err.message : "Error al finalizar la tarea");
    }
  };

  const removeTask = async (id: string) => {
    const previousTasks = tasks;
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));

    try {
      await deleteTodo(id);
      setError(null);
    } catch (err) {
      setTasks(previousTasks);
      setError(err instanceof Error ? err.message : "Error al eliminar la tarea");
    }
  };

  return {
    tasks: visibleTasks,
    taskTitle,
    setTaskTitle,
    loading,
    error,
    createTask,
    startTask,
    finishTask,
    removeTask,
  };
};
