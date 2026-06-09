"useClient"

import type { TaskStatus } from "@/src/types/task";
import { useRouter } from "next/navigation";

interface CardProps {
    id: string;
    title: string;
    status: TaskStatus;
    time: number;
    onStart: () => void;
    onFinish: () => void;
    onDelete: () => void;
}

const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    const formattedMins = String(mins).padStart(2, '0');
    const formattedSecs = String(secs).padStart(2, '0')

    return `${formattedMins}:${formattedSecs}`
}

export const Card = ({ id, title, status, time, onStart, onFinish, onDelete }: CardProps) => {
    const statusLabel = {
        pending: "Pending",
        inProgress: "In Progress",
        done: "Done",
    }[status];

    const router = useRouter();

    return (
        <div className={`card ${status}`}>
            <h3>{title}</h3>
            <p>Estado: {statusLabel}</p>
            <p>Tiempo: {formatTime(time)}</p>

            <div className="card-actions">
                {status === "pending" && (
                    <button onClick={onStart} className="btn btn-start">
                        Iniciar
                    </button>
                )}
                {status === "inProgress" && (
                    <button onClick={onFinish} className="btn btn-finish">
                        Finalizar
                    </button>
                )}
                <button onClick={onDelete} className="btn btn-delete">
                    Eliminar
                </button>
                <button onClick={() => router.push(`/todolist/${id}`)} className="btn btn-details">
                    Ver detalles
                </button>
            </div>
        </div>

    )
}
