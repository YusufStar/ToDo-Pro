import React, { Children, useState } from "react";
import { AiOutlineSend } from "react-icons/ai";
import { DragDropContext } from "react-beautiful-dnd";
import loadable from "@loadable/component";
import toast, { Toaster } from "react-hot-toast";
const Column = loadable(() => import("./Components/Column"), { ssr: false });

const reorderColumnList = (sourceCol, startIndex, endIndex) => {
  console.log(sourceCol, startIndex, endIndex);
  const newTaskIds = Array.from(sourceCol.taskIds);
  const [removed] = newTaskIds.splice(startIndex, 1);
  newTaskIds.splice(endIndex, 0, removed);

  const newColumn = {
    ...sourceCol,
    taskIds: newTaskIds,
  };

  return newColumn;
};

function App() {
  const initialData = {
    tasks: {},
    columns: {
      "column-1": {
        id: "column-1",
        title: "TO-DO",
        taskIds: [],
      },
      "column-2": {
        id: "column-2",
        title: "IN-PROGRESS",
        taskIds: [],
      },
      "column-3": {
        id: "column-3",
        title: "COMPLETED",
        taskIds: [],
      },
      "column-4": {
        id: "column-4",
        title: "TRASH",
        taskIds: [],
      },
    },
    // Facilitate reordering of the columns
    columnOrder: ["column-1", "column-2", "column-3", "column-4"],
  };

  const [state, setState] = useState(initialData);

  const handleRemoveAllTrahsItems = (column) => {
    if (!state.columns["column-4"].taskIds[0])
      return toast.error("Trash Empty");
    const newTask = {};
    Object.keys(state.tasks).filter((item) => {
      if (!state.columns["column-4"].taskIds.includes(Number(item))) {
        const task = state.tasks[item];
        newTask[item] = task;
      }
    });
    setState({
      ...state,
      tasks: newTask,
      columns: {
        ...state.columns,
        "column-4": {
          ...state.columns["column-4"],
          taskIds: [],
        },
      },
    });
    toast.success("Trash Cleared");
  };

  const handleSubmit = async (e) => {
    await e.preventDefault();
    const value = e.target[0].value;
    const id = Math.floor(Math.random() * 1000);
    setState((prev) => ({
      ...prev,
      tasks: { ...prev.tasks, [id]: { id: id, content: value } },
      columns: {
        ...prev.columns,
        "column-1": {
          ...prev.columns["column-1"],
          taskIds: [...prev.columns["column-1"].taskIds, id],
        },
      },
    }));
    toast.success("Added TO-DO");
  };

  const onDragEnd = (result) => {
    const { destination, source } = result;
    console.log(destination);

    // If user tries to drop in an unknown destination
    if (!destination) return;

    // if the user drags and drops back in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // If the user drops within the same column but in a different positoin
    const sourceCol = state.columns[source.droppableId];
    const destinationCol = state.columns[destination.droppableId];

    if (sourceCol.id === destinationCol.id) {
      const newColumn = reorderColumnList(
        sourceCol,
        source.index,
        destination.index
      );

      const newState = {
        ...state,
        columns: {
          ...state.columns,
          [newColumn.id]: newColumn,
        },
      };
      setState(newState);
      return;
    }

    // If the user moves from one column to another
    const startTaskIds = Array.from(sourceCol.taskIds);
    const [removed] = startTaskIds.splice(source.index, 1);
    const newStartCol = {
      ...sourceCol,
      taskIds: startTaskIds,
    };

    const endTaskIds = Array.from(destinationCol.taskIds);
    endTaskIds.splice(destination.index, 0, removed);
    const newEndCol = {
      ...destinationCol,
      taskIds: endTaskIds,
    };

    const newState = {
      ...state,
      columns: {
        ...state.columns,
        [newStartCol.id]: newStartCol,
        [newEndCol.id]: newEndCol,
      },
    };

    setState(newState);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="min-h-screen h-auto w-full bg-[#1f1f1f] overflow-auto  flex flex-col items-center justify-center">
        <Toaster position="top-center" reverseOrder={false} />
        <form
          onSubmit={handleSubmit}
          className="w-full h-auto flex flex-col items-center"
        >
          <h1 className="text-3xl my-6 font-semibold text-white">
            React Todo List <span className="text-red-700">Drag Drop</span>
          </h1>
          <div className="flex w-auto h-auto mb-16 items-center">
            <div className="w-auto h-auto relative">
              <input
                required
                type="text"
                className="bg-[#3f3f3f] py-2 rounded-md w-[300px] pl-3 font-semibold outline-none border-[1px] border-[#2f2f2f] text-[#9f9f9f] placeholder:text-[#5f5f5f]"
                placeholder="Enter New Todo"
              />
              <button
                type="submit"
                className="absolute right-2 cursor-pointer outline-none bottom-3"
              >
                <AiOutlineSend color="white" size={20} />
              </button>
            </div>
          </div>
          <div className="w-full flex justify-around h-auto">
            {state?.columnOrder?.map((columnId) => {
              const column = state?.columns[columnId];
              const tasks = column?.taskIds?.map(
                (taskId) => state.tasks[taskId]
              );

              return (
                <Column
                  key={column?.id}
                  removeTrashList={handleRemoveAllTrahsItems}
                  column={column}
                  tasks={tasks}
                />
              );
            })}
          </div>
        </form>
      </div>
    </DragDropContext>
  );
}

export default App;
