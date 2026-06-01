import Todolist from "@/src/models/todolist";
import conectionDB from "@/src/lib/database";
import { NextRequest, NextResponse } from "next/server";

const taskToResponse = (task: {
  _id: { toString: () => string };
  title: string;
  status?: "pending" | "inProgress" | "done";
  state?: "pending" | "inProgress" | "done";
  time?: number;
  startedAt?: Date | null;
  endedAt?: Date | null;
}) => ({
  id: task._id.toString(),
  title: task.title,
  status: task.status ?? task.state ?? "pending",
  time: task.time ?? 0,
  startedAt: task.startedAt ? task.startedAt.toISOString() : null,
  endedAt: task.endedAt ? task.endedAt.toISOString() : null,
});

export async function GET() {
  try {
    await conectionDB();
    const tasks = await Todolist.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ data: tasks.map(taskToResponse) });
  } catch {
    return NextResponse.json({ error: "Error al obtener tareas" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await conectionDB();
    const body = await request.json();
    const title = String(body.title ?? "").trim();

    if (!title) {
      return NextResponse.json({ error: "El titulo es obligatorio" }, { status: 400 });
    }

    const task = await Todolist.create({
      title,
      status: "pending",
      time: 0,
      startedAt: null,
      endedAt: null,
    });

    return NextResponse.json({ data: taskToResponse(task) }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error al crear tarea" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await conectionDB();
    const body = await request.json();
    const id = String(body.id ?? "");

    if (!id) {
      return NextResponse.json({ error: "El id es obligatorio" }, { status: 400 });
    }

    if (!["pending", "inProgress", "done"].includes(body.status)) {
      return NextResponse.json({ error: "Estado invalido" }, { status: 400 });
    }

    const update = {
      status: body.status,
      time: Number(body.time ?? 0),
      startedAt: body.startedAt ? new Date(body.startedAt) : null,
      endedAt: body.endedAt ? new Date(body.endedAt) : null,
    };

    const task = await Todolist.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return NextResponse.json({ error: "Tarea no encontrada" }, { status: 404 });
    }

    return NextResponse.json({ data: taskToResponse(task) });
  } catch {
    return NextResponse.json({ error: "Error al actualizar tarea" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await conectionDB();
    const id = request.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "El id es obligatorio" }, { status: 400 });
    }

    await Todolist.findByIdAndDelete(id);

    return NextResponse.json({ data: { id } });
  } catch {
    return NextResponse.json({ error: "Error al eliminar tarea" }, { status: 500 });
  }
}
