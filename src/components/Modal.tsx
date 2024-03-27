import React from "react";

export default function Modal(props: {
  children: React.ReactNode;
  open: boolean;
  onClose: Function;
}) {
  return (
    <div
      onClick={(e) => e.stopPropagation}
      className={`fixed inset-0 flex justify-center items-center transition-colors
          ${props.open ? "visible bg-black/20" : "invisible"}`}
    >
      <div
        className={`bg-white rounded-xl shadow p-6 transition-all
        ${props.open ? "scale-100 opacity-100" : "scale-125 opacity-0"}`}
      >
        <div className="modal-content">{props.children}</div>
      </div>
    </div>
  );
}
