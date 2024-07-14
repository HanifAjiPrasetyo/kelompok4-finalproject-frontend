import React from "react";

export default function InputComponent({ label, id, name, type, value, onChange }) {
  return (
    <div className="text-start w-full">
      <label htmlFor="username" className="block mb-1 text-[#322C2B]">
        {label} :
      </label>
      <input id={id} name={name} type={type} value={value} onChange={onChange} className="w-full p-1 border rounded-md focus:border-blue-500 focus:outline-none p-2" required />
    </div>
  );
}
