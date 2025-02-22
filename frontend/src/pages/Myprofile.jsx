import React, { useContext, useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const MyProfile = () => {
  const { userData, setUserData, backendUrl, token, fetchUserProfile } =
    useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();

      if (userData.fullName) formData.append("FullName", userData.fullName);
      if (userData.phone) formData.append("Phone", userData.phone);
      if (userData.address?.line1)
        formData.append("Address.Line1", userData.address.line1);
      if (userData.address?.line2)
        formData.append("Address.Line2", userData.address.line2);
      if (userData.gender) formData.append("Gender", userData.gender);
      if (userData.dob) {
        const formattedDob = new Date(userData.dob).toISOString();
        formData.append("Dob", formattedDob);
      }

      if (imageUrl) {
        console.log("Uploading Image:", imageUrl);
        formData.append("Image", imageUrl);
      }

      const response = await axios.put(
        `${backendUrl}/api/user/update-profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success("Profile updated successfully!");
        setImageUrl(userData.imageUrl);
        fetchUserProfile();
      } else {
        toast.error(response.data.message || "Profile update failed!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Something went wrong while updating the profile.");
    }
  };

  useEffect(() => {
    fetchUserProfile();
    setLoading(false);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Selected File:", file);
      setImageUrl(file);
    }
  };

  return loading ? (
    <p>Loading...</p>
  ) : (
    userData && (
      <div className="max-w-lg flex flex-col gap-2 text-sm">
        {isEdit ? (
          <label htmlFor="image">
            <div className="inline-block relative cursor-pointer">
              <img
                className="w-36 rounded"
                src={
                  userData.imageUrl?.startsWith("http")
                    ? userData.imageUrl
                    : `${backendUrl}${userData.imageUrl}`
                }
                alt="Profile"
              />

              <img
                className="w-10 absolute bottom-12 right-12"
                src={imageUrl ? "" : assets.upload_icon}
                alt="Profile"
              />
            </div>
            <input onChange={handleImageChange} type="file" hidden id="image" />
          </label>
        ) : (
          <img
            className="w-36 rounded"
            src={
              userData.imageUrl?.startsWith("http")
                ? userData.imageUrl
                : `${backendUrl}${
                    userData.imageUrl ||
                    userData.image ||
                    assets.defaultProfileImage
                  }`
            }
            alt="Profile"
          />
        )}

        {isEdit ? (
          <input
            className="bg-gray-50 text-3xl font-medium max-w-60 mt-4"
            type="text"
            value={userData.fullName || ""}
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, fullName: e.target.value }))
            }
          />
        ) : (
          <p className="font-medium text-3xl text-neutral-800 mt-4">
            {userData?.fullName || "Name not provided"}
          </p>
        )}

        <hr className="bg-zinc-400 h-[-1px] border-none" />

        <div>
          <p className="text-neutral-500 underline mt-3">CONTACT INFORMATION</p>
          <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 text-neutral-700">
            <p className="font-medium">Email id:</p>
            <p className="text-blue-500">{userData.email}</p>
            <p className="font-medium">Phone:</p>
            {isEdit ? (
              <input
                className="bg-gray-100 max-w-52"
                type="text"
                value={userData.phone || ""}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
            ) : (
              <p className="text-blue-400">
                {userData.phone || "Not Provided"}
              </p>
            )}

            <p className="font-medium">Address:</p>
            {isEdit ? (
              <div>
                <input
                  className="bg-gray-50"
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line1: e.target.value },
                    }))
                  }
                  value={userData?.address?.line1 || ""}
                  type="text"
                />
                <br />
                <input
                  className="bg-gray-50"
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line2: e.target.value },
                    }))
                  }
                  value={userData?.address?.line2 || ""}
                  type="text"
                />
              </div>
            ) : (
              <p className="text-gray-500">
                {userData?.address?.line1 || "Not Provided"}
                <br />
                {userData?.address?.line2 || ""}
              </p>
            )}
          </div>
        </div>

        <div>
          <p className="text-neutral-500 underline mt-3">BASIC INFORMATION</p>
          <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
            <p className="font-medium">Gender:</p>
            {isEdit ? (
              <select
                className="max-w-20 bg-gray-100"
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, gender: e.target.value }))
                }
                value={userData.gender || ""}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            ) : (
              <p className="text-gray-400">
                {userData.gender || "Not Provided"}
              </p>
            )}

            <p className="font-medium">Birthday:</p>
            {isEdit ? (
              <input
                className="max-w-28 bg-gray-100"
                type="date"
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, dob: e.target.value }))
                }
                value={userData.dob || ""}
              />
            ) : (
              <p className="text-gray-400">{userData.dob || "Not Provided"}</p>
            )}
          </div>
        </div>

        <div className="mt-10">
          {isEdit ? (
            <button
              className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
              onClick={() => {
                updateUserProfileData();
                setIsEdit(false);
              }}
            >
              Save information
            </button>
          ) : (
            <button
              className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
              onClick={() => setIsEdit(true)}
            >
              Edit
            </button>
          )}
        </div>
      </div>
    )
  );
};

export default MyProfile;
