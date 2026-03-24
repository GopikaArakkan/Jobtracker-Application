import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaCheckCircle } from "react-icons/fa";

export default function CalendarWidget() {

  return(
   <div className="bg-gray-900 p-5 rounded-xl h-full flex flex-col">

   <div className="mb-3">
  <h2 className="text-lg text-white font-semibold flex items-center gap-2">
    <FaCheckCircle className="text-green-400"/>
   Calendar
  </h2>
   <div className="h-[2px] mt-2 bg-gradient-to-r from-green-400 via-yellow-400 to-blue-400 rounded"></div>
</div>

 
  <Calendar />
</div>

   
  )
}