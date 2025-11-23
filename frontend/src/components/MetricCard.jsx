import React from "react";

// function Slider({data}){
  
// }

export default function MetricCard({
  icon,
  title,
  fields = [],
  onChange,
  note,
}) {
  const handleInputChange = (name, value) => {
    if (onChange) onChange(name, value);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md w-full">
      <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4">
        <div className="flex justify-center items-center h-9 w-9 rounded-xl bg-gray-100 text-gray-600">
        {icon}
        </div>
      <h3 className="text-lg font-semibold text-gray-800">  {title}</h3>
      </div>


      <div className="flex flex-col gap-4 p-5 w-full">
        {fields.map((field) => {
          const isSlider = field.type === "range"
          if(isSlider) {
          return (
            <div key={field.name} className="">
              <label htmlFor={field.name} className="flex flex-col gap-2 min-w-full">
                <div className="block w-full text-left text-sm text-gray-700">
                  <span className=" p-1">{field.label}</span>
                  <span className=" text-sm text-gray-500">{"("}
                      {field.value ?? 0}{field.max ? ` / ${field.max}` : ""}{")"}
                    </span>
                   </div>
                <input
                  type="range"
                  id={field.name}
                  name={field.name}
                  value={field.value}
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  className="w-full cursor-pointer accent-primary"
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                />
                
              </label>
            </div>
          )}

          else return (
            <div key={field.name} className="">
              <label htmlFor={field.name} className="flex flex-col gap-2 min-w-full">
                <div className="flex gap-2 text-sm text-gray-700 w-full">
                  <span className="block w-full text-left p-1 ">{field.label}</span>
                   </div>
                <input
                  type="number"
                  id={field.name}
                  name={field.name}
                  value={field.value}
                  min={field.min}
                  max={field.max}
                  placeholder={field.placeholder}
                  step={field.step}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-primary focus:ring-0 outline-none"
                />
                
              </label>
            </div>
          )}
        )}

        {note && (
          <p className="text-sm text-gray-500">{note}</p>
        )}
      </div>
    </div>
  );
}
 