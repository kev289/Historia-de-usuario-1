// Imports en especial de modulo interno de Next que se enfoca en respuestas de metodos
import dbConnect from "@/src/lib/database";
import { User } from "@/src/models/user";
import { NextResponse } from "next/server";

// Funcion GET para consulta de Usuarios
export async function GET() {
  try {
    await dbConnect();

    const users = await User.find({});

    return NextResponse.json(users);
  } catch {
    return NextResponse.json({ error: "Error al obtener usuarios" }, { status: 500 });
  }
}
