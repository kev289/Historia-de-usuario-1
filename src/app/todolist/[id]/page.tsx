import { getTodoListById } from "@/src/services/todoList.service";

const DetailsTodoList = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const fetchData = async () => {

    try {
    const res = await fetch(`/api/todolist/${id}`);
    const data = res.json();

    return data;
  } catch (err) {
    console.error(err);
  }
  };

  fetchData();

  console.log(id);

  return (
    <div>
      <h1>Detalles de la TodoList</h1>
      <div> El id es : {id}</div>
      
    </div>
  );
};  

export default DetailsTodoList;