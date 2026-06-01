"use client";

import { Card } from '../components/Card';
import { useTasks } from '@/src/hooks/useTasks';

function App() {
  const {
    tasks,
    taskTitle,
    setTaskTitle,
    loading,
    error,
    createTask,
    startTask,
    finishTask,
    removeTask,
  } = useTasks();

  return (
    <main>
      <h1>Task Timer</h1>
      <form
        className="task-form"
        onSubmit={(event) => {
          event.preventDefault();
          createTask();
        }}
      >
        <input
          type="text"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          placeholder="Escribe una tarea"
        />
        <button type="submit">Crear</button>
      </form>

      {error && <p className="status-message error-message">{error}</p>}

      <div className='tasks-list'>
        {loading ? (
          <p className="status-message">Cargando tareas...</p>
        ) : tasks.length === 0 ? (
          <p className="status-message">No hay tareas. ¡Crea una para empezar!</p>
        ) : (
          tasks.map((todo) => (
            <Card
              key={todo.id}
              title={todo.title}
              status={todo.status}
              time={todo.time}
              onStart={() => startTask(todo.id)}
              onFinish={() => finishTask(todo.id)}
              onDelete={() => removeTask(todo.id)}
            />
          ))
        )
        }
      </div>
    </main>
  )
}

export default App;
