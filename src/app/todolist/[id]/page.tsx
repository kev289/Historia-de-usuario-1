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
    <div>
      <h1>Detalles de la TodoList</h1>
      <div>
        <p><strong>ID:</strong> {id}</p>
        <p><strong>Título:</strong> {todo.title}</p>
        <p><strong>Estado:</strong> {todo.status}</p>
        {todo.time > 0 && <p><strong>Tiempo transcurrido:</strong> {todo.time} segundos</p>}
      </div>
    </div>
  );
};  

export default DetailsTodoList;