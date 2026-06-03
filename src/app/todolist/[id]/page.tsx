import Todolist from "@/src/models/todolist";
import conectionDB from "@/src/lib/database";
import { notFound } from "next/navigation";

const DetailsTodoList = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  await conectionDB();

  let todo = null;
  try {
    todo = await Todolist.findById(id);
  } catch (err) {
    console.error("Error fetching todo:", err);
    // Si el ID tiene formato inválido para MongoDB, arrojamos 404
    notFound();
  }

  if (!todo) {
    notFound();
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Detalles de la TodoList</h1>
      <div style={{ padding: "1.5rem", borderRadius: "8px", border: "1px solid #ccc", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
        <p><strong>ID:</strong> {id}</p>
        <p><strong>Título:</strong> {todo.title}</p>
        <p><strong>Estado:</strong> {todo.status}</p>
        {todo.time > 0 && <p><strong>Tiempo transcurrido:</strong> {todo.time} segundos</p>}
      </div>
    </div>
  );
};  

export default DetailsTodoList;