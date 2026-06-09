
# Historia de Usuario — TodoList Detail View (Next.js)

## Nombre del proyecto
**TodoList Detail — Vista de detalle con historial de comentarios**

---

# Contexto

Se requiere extender la aplicación **TodoList** existente en Next.js con una vista de detalle para cada item. Al hacer clic en una tarea, el usuario debe poder acceder a una URL dinámica que muestre toda la información de esa tarea y un historial de comentarios asociado. Los comentarios deben persistir en **MongoDB** y estar disponibles cada vez que se entre a la vista de detalle.

La arquitectura debe respetar la separación ya existente: vistas → servicios → API routes → base de datos.

---

# Historia de Usuario Principal

### HU-01 — Vista de detalle de una tarea

**Como** usuario de la aplicación  
**Quiero** hacer clic en una tarea y navegar a su vista de detalle  
**Para** ver toda su información y el historial de comentarios asociado.

---

### HU-02 — Historial de comentarios por tarea

**Como** usuario de la aplicación  
**Quiero** escribir comentarios en la vista de detalle de una tarea  
**Para** dejar registro de notas, avances o información relevante sobre esa tarea.

---

### HU-03 — (Opcional) Contador de comentarios en la card

**Como** usuario de la aplicación  
**Quiero** ver cuántos comentarios tiene cada tarea desde la lista principal  
**Para** saber de un vistazo cuáles tareas tienen actividad registrada.

---

# Funcionamiento esperado

## Vista de lista principal (`/`)

- El componente `Card` debe incluir un botón con el texto **"Ver detalles"**.
- Al hacer clic en ese botón, se debe usar `useRouter` de `next/navigation` para navegar programáticamente a `/todolist/[id]`, donde `[id]` es el `_id` real del item.
- **No usar `<Link>` para esta navegación** — se requiere explícitamente `useRouter`.
- **(Opcional)** Cada `Card` debe mostrar el número de comentarios que tiene la tarea.

---

## Vista de detalle (`/todolist/[id]`)

Al ingresar a la ruta dinámica con el `id` de una tarea:

- Se debe hacer una llamada al backend para traer el item cuyo `_id` coincida con el `id` de la URL.
- La vista debe mostrar:
  - Título de la tarea
  - Estado actual (`pending`, `inProgress`, `done`)
  - Fecha de inicio (si existe)
  - Fecha de fin (si existe)
  - Historial de comentarios (ordenados del más antiguo al más reciente)
- Debe incluir un formulario para agregar un nuevo comentario:
  - Campo de texto para el contenido del comentario
  - Botón "Comentar"
- Al agregar un comentario, este debe guardarse en la base de datos y aparecer en el historial sin recargar la página.

---

# Modelo de datos

## Modelo de comentario (`Comment`)

Cada comentario debe tener los siguientes campos:

| Campo       | Tipo     | Descripción                                     |
|-------------|----------|-------------------------------------------------|
| `todoId`    | ObjectId | Referencia al item del todolist al que pertenece |
| `content`   | String   | Contenido del comentario                        |
| `createdAt` | Date     | Fecha y hora de creación (automático)           |

---

## Cambio en el modelo `Todolist` (opcional)

Si se implementa la funcionalidad del contador de comentarios, se puede agregar un campo virtual o calculado `commentCount` que represente la cantidad de comentarios asociados. Este campo **no debe guardarse** en el documento de la tarea, sino calcularse con una consulta de agregación o un `populate` desde el modelo de comentarios.

---

# API Routes requeridas

Deben implementarse las siguientes rutas de API:

| Método | Ruta                              | Descripción                                  |
|--------|-----------------------------------|----------------------------------------------|
| `GET`  | `/api/todolist/[dato]`            | Ya existe — traer un item por ID             |
| `POST` | `/api/comments`                   | Crear un nuevo comentario para una tarea     |

---


# Rutas dinámicas en Next.js

## Vista (`/todolist/[id]`)

La carpeta de la vista ya existe en `src/app/todolist/[id]/page.tsx`.

El `id` se obtiene con el hook `useParams()`:

```tsx
import { useParams } from "next/navigation";

const { id } = useParams();
```

---

# Comportamientos esperados

## Si la tarea no existe
Mostrar un mensaje de error:

```txt
Tarea no encontrada.
```

---

## Si no hay comentarios aún
Dentro de la sección de comentarios mostrar:

```txt
No hay comentarios aún. ¡Sé el primero en comentar!
```

---

## Al agregar un comentario
- El input de texto debe limpiarse tras el envío.
- El nuevo comentario debe aparecer al final del historial sin necesidad de recargar la página.

---

## Al hacer clic en el botón "Ver detalles" de una card (HU-01)

El componente `Card` debe recibir el `_id` del item como prop y usarlo así:

```tsx
import { useRouter } from "next/navigation";

const router = useRouter();

<button onClick={() => router.push(`/todolist/${item._id}`)}>
  Ver detalles
</button>
```

- El `id` del item debe quedar visible en la URL (`/todolist/abc123`).
- **Obligatorio usar `useRouter`** — no usar `<Link>` ni `window.location`.

---

# Requerimientos técnicos obligatorios

## Next.js App Router
- Rutas dinámicas tanto en el frontend (`/todolist/[id]`) como en el backend (`/api/comments/[todoId]`).
- Uso de `useParams()` para leer parámetros de la URL en componentes cliente.

## React Hooks
- `useState` — manejo del estado local de comentarios y formulario.
- `useEffect` — carga inicial de los comentarios al montar la vista.

## MongoDB + Mongoose
- Nuevo modelo `Comment` con referencia al `todoId`.
- Consultas ordenadas por `createdAt` ascendente.

## Capa de servicios
- Las vistas no deben consumir la API directamente.
- Toda la lógica de fetch debe estar en `services/comments.ts`.

---

# Buenas prácticas de commits

```bash
git commit -m "add Comment model with mongoose"
git commit -m "create GET /api/comments/[todoId] route"
git commit -m "create POST /api/comments route"
git commit -m "add comments service layer"
git commit -m "add CommentForm and CommentList components"
git commit -m "implement todolist detail view with comments"
git commit -m "add comment count badge to Card component"
```

---

# Despliegue

La aplicación debe desplegarse en:

https://vercel.com

Las variables de entorno necesarias son las mismas que ya existen:
- `MONGODB_URI`

---

# Entregables

Cada estudiante/desarrollador deberá entregar:

## 1. Repositorio GitHub
Debe incluir:
- historial de commits con avance progresivo
- código funcional
- README actualizado

---

## 2. Link de despliegue en Vercel

```txt
https://mi-todolist-detail.vercel.app
```

---

# Criterios de aceptación

## La historia se considera completada cuando:

### Navegación y rutas dinámicas
- [ ] El componente `Card` tiene un botón con el texto **"Ver detalles"**
- [ ] El botón usa `useRouter` de `next/navigation` para navegar a `/todolist/[id]`
- [ ] El `id` en la URL corresponde al `_id` real del item en MongoDB
- [ ] La URL dinámica muestra la vista de detalle de la tarea correspondiente
- [ ] La ruta `/api/todolist/[dato]` recibe el id y retorna el item correcto desde MongoDB

### Vista de detalle
- [ ] Se muestra el título de la tarea
- [ ] Se muestra el estado actual de la tarea
- [ ] Se muestra la fecha de inicio si existe
- [ ] Se muestra la fecha de fin si existe
- [ ] Si la tarea no existe, se muestra un mensaje de error

### Comentarios
- [ ] La ruta `GET /api/comments/[todoId]` retorna los comentarios de esa tarea ordenados por fecha
- [ ] La ruta `POST /api/comments` crea un nuevo comentario en MongoDB
- [ ] El historial de comentarios se muestra en la vista de detalle
- [ ] Se puede agregar un nuevo comentario desde el formulario
- [ ] El input se limpia después de enviar el comentario
- [ ] El nuevo comentario aparece en el historial sin recargar la página
- [ ] Si no hay comentarios, se muestra el mensaje correspondiente

### Arquitectura
- [ ] Existe el modelo `Comment` en Mongoose con los campos requeridos
- [ ] Existe la capa de servicios `services/comments.ts`
- [ ] Las vistas no llaman a la API directamente

### (Opcional) Contador en cards
- [ ] Cada `Card` muestra el número de comentarios que tiene la tarea
- [ ] El contador se actualiza correctamente desde la base de datos

### Despliegue
- [ ] El proyecto está en GitHub con commits frecuentes
- [ ] La app está desplegada en Vercel
- [ ] La aplicación funciona sin errores en producción

---

# Recursos de referencia

- Next.js docs locales: `node_modules/next/dist/docs/`
- Dynamic Routes (App Router): ver docs locales `routing/dynamic-routes`
- MongoDB Atlas: https://cloud.mongodb.com
- Vercel: https://vercel.com

---

# Autor

Creado por **David Henao Bustamante**
