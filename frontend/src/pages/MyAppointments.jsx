import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const MyAppointments = () => {
  const { doctors, backendUrl, token, fetchDoctors } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState({});
  const months = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");
    return (
      dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    );
  };

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        if (data.appointments.length === 0) {
          setAppointments([]);
          toast.info("No appointments found.");
          return;
        }

        setAppointments(data.appointments.reverse());

        const updatedStatus = {};
        data.appointments.forEach((appointment) => {
          if (appointment.payment) {
            updatedStatus[appointment.id] = "Paid";
          }
        });

        setPaymentStatus(updatedStatus);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const response = await axios.delete(
        `${backendUrl}/api/user/cancel-appointment/${appointmentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast.success("Appointment canceled successfully.");
        getUserAppointments();
        fetchDoctors();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to cancel the appointment.");
    }
  };
  const handlePaymentRequest = async (appointment) => {
    try {
      console.log("Appointment Data:", appointment);

      setPaymentStatus((prevStatus) => ({
        ...prevStatus,
        [appointment]: "Paid",
      }));

      const { data } = await axios.post(
        `${backendUrl}/api/user/create-payment`,
        { appointmentId: appointment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Response from backend:", data);

      if (data.success) {
        toast.success("Payment successful!");

        setAppointments((prevAppointments) =>
          prevAppointments.map((item) =>
            item.id === appointment ? { ...item, amount: data.payment } : item
          )
        );
      } else {
        toast.error("Payment failed. Please try again.");
        setPaymentStatus((prevStatus) => ({
          ...prevStatus,
          [appointment]: "Failed",
        }));
      }
    } catch (error) {
      console.error("Error during payment request:", error);
      toast.error(
        error.message || "An error occurred while processing the payment."
      );

      setPaymentStatus((prevStatus) => ({
        ...prevStatus,
        [appointment]: "Failed",
      }));
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">
        My Appointments
      </p>

      {appointments.length === 0 ? (
        <p className="text-center text-gray-500">No appointments found.</p>
      ) : (
        <div>
          {appointments.map((item, index) => (
            <div
              className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b"
              key={index}
            >
              <div>
                <img
                  className="w-32 bg-indigo-50"
                  src={backendUrl + item.docData.image}
                  alt=""
                />
              </div>
              <div className="flex-1 text-sm text-zinc-600">
                <p className="text-neutral-800 font-semibold">
                  {item.docData.name}
                </p>
                <p>{item.docData.speciality}</p>
                <p className="text-zinc-700 font-medium mt-1">Address:</p>
                <p className="text-xs">{item.docData.address?.line1}</p>
                <p className="text-xs">{item.docData.address?.line2}</p>
                <p className="text-xs mt-1">
                  <span className="text-sm text-neutral-700 font-medium">
                    Date & Time:
                  </span>{" "}
                  {slotDateFormat(item.slotDate)} | {item.slotTime}
                </p>
              </div>
              <div></div>
              <div className="flex flex-col gap-2 justify-end">
                {!item.cancelled && paymentStatus[item.id] !== "Paid" && (
                  <button
                    onClick={() => handlePaymentRequest(item.id)}
                    className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300"
                  >
                    Pay Online
                  </button>
                )}
                {paymentStatus[item.id] === "Paid" && (
                  <button className="sm:min-w-48 py-2 border rounded text-green-500">
                    Paid
                  </button>
                )}
                {!item.cancelled && (
                  <button
                    onClick={() => cancelAppointment(item.id)}
                    className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300"
                  >
                    Cancel Appointment
                  </button>
                )}
                {item.cancelled && (
                  <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500">
                    Appointment cancelled
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
