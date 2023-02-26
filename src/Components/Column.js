import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { FaTrashAlt } from "react-icons/fa";

const Column = ({ column, tasks, removeTrashList = function(){} }) => {
  const CalcColor = () => {
    const def = "bg-[#1f1f1f]";
    const progress = "bg-yellow-500";
    const complate = "bg-green-800";
    const trash = "bg-red-800";
    if (column.id === "column-1") return def;
    if (column.id === "column-2") return progress;
    if (column.id === "column-3") return complate;
    if (column.id === "column-4") return trash;
  };
  return (
    <div className="w-[25rem] max-h-[600px] h-[600px] relative overflow-y-auto overflow-x-hidden bg-[#2f2f2f] flex flex-col rounded-md">
      <h1
        className={`w-full top-0 absolute py-4 px-4 flex text-md font-semibold items-center text-[#f1f1f1] rounded-md bg-[#3f3f3f] ${CalcColor()}`}
      >
        {column.id === "column-4" && <FaTrashAlt className="absolute right-4 cursor-pointer" onClick={() => removeTrashList(column)}/>}
        {column.title}
      </h1>
      <Droppable droppableId={column.id}>
        {(droppableProvided, droppableSnapshot) => (
          <div
            className="w-full p-2 mt-12 h-full flex flex-col"
            ref={droppableProvided.innerRef}
            {...droppableProvided.droppableProps}
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={`${task.id}`} index={index}>
                {(draggableProvided, draggableSnapshot) => (
                  <div
                    ref={draggableProvided.innerRef}
                    {...draggableProvided.draggableProps}
                    {...draggableProvided.dragHandleProps}
                    className={`px-4 min-h-[60px] max-h-[60px] flex items-center overflow-x-auto rounded-md cursor-move my-2 font-semibold
                    ${CalcColor()}`}
                  >
                    <p className="text-white/75">{task.content}</p>
                  </div>
                )}
              </Draggable>
            ))}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;
