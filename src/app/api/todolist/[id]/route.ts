import Todolist from "@/src/models/todolist";
import conectionDB from "@/src/lib/database";

await conectionDB();

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {

    const { id } = await params;

    const datos = await Todolist.findById(id);

    if (!datos) {
        return Response.json({
            error: "No se encontró el elemento",
            code: 404,
        }, { status: 404 });
    }

    return Response.json({
        data: datos,
        code: 200,
        message: "el servicio contesto",
    });
}