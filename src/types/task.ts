export type TaskStatus = "pending" | "inProgress" | "done";

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  time: number;
  startedAt: string | null;
  endedAt: string | null;
}

export type TaskPayload = Pick<Task, "title" | "status" | "time" | "startedAt" | "endedAt">;
