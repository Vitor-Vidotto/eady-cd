"use client"
"use client";
import React, { useRef } from "react";
import Draggable from "react-draggable"; // Importando a biblioteca
import CdPage from "./CdPage";

export default function MovableCdPage() {
  const draggableRef = useRef(null);

  return (
    <div className="relative w-full h-full">
      <Draggable nodeRef={draggableRef}>
        <div
          ref={draggableRef}
          className=" cursor-move"
        >
          <CdPage />
        </div>
      </Draggable>
    </div>
  );
}
