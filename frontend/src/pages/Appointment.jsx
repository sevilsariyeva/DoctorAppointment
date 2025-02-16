import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, backendUrl } = useContext(AppContext);
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  // Find the doctor using the correct property (id)
  useEffect(() => {
    console.log("Doctors:", doctors);
    console.log("docId:", docId);

    if (doctors.length > 0) {
      const doc = doctors.find((d) => String(d.id) === String(docId));
      if (doc) {
        setDocInfo(doc);
        console.log("Found doctor:", doc);
      } else {
        console.log("Doctor not found!");
      }
    }
  }, [doctors, docId]);

  // Generate available slots once docInfo is set
  useEffect(() => {
    if (docInfo) {
      generateAvailableSlots();
    }
  }, [docInfo]);

  const generateAvailableSlots = () => {
    // Instead of calling setDocSlots multiple times in a loop,
    // accumulate the slots and update state once.
    const slotsArray = [];
    let today = new Date();

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      let endTime = new Date(today);
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      // For today, adjust start time; otherwise start at 10:00
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
        );
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlots = [];
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        timeSlots.push({
          dateTime: new Date(currentDate),
          time: formattedTime,
        });
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }
      slotsArray.push(timeSlots);
    }
    setDocSlots(slotsArray);
  };

  // Optional: log docSlots for debugging
  useEffect(() => {
    console.log("Doc Slots:", docSlots);
  }, [docSlots]);

  if (!docInfo)
    return <p className="text-center mt-10">Loading doctor details...</p>;

  return (
    <div>
      {/* Doctor Details */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div>
          <img
            className="bg-primary w-full sm:max-w-72 rounded-lg"
            src={`${backendUrl}/${docInfo.image}`}
            alt={`Dr. ${docInfo.name}`}
          />
        </div>
        <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
          <p className="flex items-center gap-2 text-xl font-medium text-gray-900">
            {docInfo.name}{" "}
            <img className="w-5" src={assets.verified_icon} alt="Verified" />
          </p>
          <div className="flex items-center gap-4 text-sm mt-1 text-gray-600">
            <p>
              {docInfo.degree} - {docInfo.speciality}
            </p>
            <button className="py-0.5 px-2 border text-xs rounded-full">
              {docInfo.experience}
            </button>
          </div>
          <div className="mt-3">
            <p className="flex items-center gap-1 text-sm font-medium text-gray-900">
              About <img src={assets.info_icon} alt="Info" />
            </p>
            <p className="text-sm text-gray-500 mt-1">{docInfo.about}</p>
          </div>
          <p className="text-gray-500 font-medium mt-4">
            Appointment fee:{" "}
            <span className="text-gray-600">
              {currencySymbol}
              {docInfo.fees}
            </span>
          </p>
        </div>
      </div>

      {/* Booking Slots */}
      <div className="sm:ml-72 sm:pl-4 mt-8 font-medium text-gray-700">
        <p>Booking Slots</p>
        <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
          {docSlots.length > 0 &&
            docSlots.map((daySlots, index) => (
              <div
                onClick={() => setSlotIndex(index)}
                className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                  slotIndex === index
                    ? "bg-primary text-white"
                    : "border border-gray-200"
                }`}
                key={index}
              >
                <p>
                  {daySlots[0] && daysOfWeek[daySlots[0].dateTime.getDay()]}
                </p>
                <p>{daySlots[0] && daySlots[0].dateTime.getDate()}</p>
              </div>
            ))}
        </div>
        <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
          {docSlots.length > 0 &&
            docSlots[slotIndex] &&
            docSlots[slotIndex].map((slot, index) => (
              <p
                onClick={() => setSlotTime(slot.time)}
                className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                  slot.time === slotTime
                    ? "bg-primary text-white"
                    : "text-gray-400 border border-gray-300"
                }`}
                key={index}
              >
                {slot.time.toLowerCase()}
              </p>
            ))}
        </div>
        <button className="bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6">
          Book an appointment
        </button>
      </div>

      {/* Related Doctors */}
      <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
    </div>
  );
};

export default Appointment;
