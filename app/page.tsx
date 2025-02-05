"use client"

import { useState } from "react"
import { useUser } from "./context/UserContext"
import { RotatingLines } from "react-loader-spinner"
import UploadWidget from "./components/upload-widget"
import cld from "./components/cld"
import { AdvancedImage } from "@cloudinary/react"
import { fill } from "@cloudinary/url-gen/actions/resize"
import {
  enhance,
  generativeRestore,
  upscale,
} from "@cloudinary/url-gen/actions/effect"
import { focusOn, autoGravity } from "@cloudinary/url-gen/qualifiers/gravity"
import { face } from "@cloudinary/url-gen/qualifiers/focusOn"
import { CLOUDINARY_CONFIG } from "./config/cloudinary"

// The Profile page lets the user input their personal information and upload a profile picture.
export default function MyProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [uploadError, setUploadError] = useState("")

  const {
    setProfilePublicId,
    profileImage,
    setProfileImage,
    name,
    setName,
    location,
    setLocation,
    birthday,
    setBirthday,
    setProfileIsPoorQuality,
  } = useUser()
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsEditing(false)
  }

  const handleUploadSuccess = (publicId: string, poorQuality: boolean) => {
    setLoading(false)
    setUploadError("")
    setProfilePublicId(publicId)
    setProfileIsPoorQuality(poorQuality)

    // Create the delivery URL for the profile picture:
    const profileImage = cld.image(publicId)

    profileImage
      .resize(
        fill()
          .width(300)
          .height(300)
          .gravity(focusOn(face()).fallbackGravity(autoGravity()))
      )
      .format("auto")
      .quality("auto")

    if (poorQuality) {
      profileImage
        .effect(enhance())
        .effect(generativeRestore())
        .effect(upscale())
    }

    setProfileImage(profileImage)
  }

  const handleUploadError = (error: string) => {
    setLoading(false)
    setUploadError(error)
  }

  const handleImageUpload = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent form submission
    // The actual upload logic is handled in the UploadWidget component
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 rounded-full"
          />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 rounded-full"
          />
          <input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 [color-scheme:light] dark:[color-scheme:dark] rounded-full"
          />
          <button
            type="submit"
            className="bg-green-600 rounded-full w-[100px] h-[36px] flex items-center justify-center cursor-pointer text-[16px] gap-[4px] px-[28px] py-[8px] no-underline font-bold transition duration-300"
          >
            Save
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <p>
            <strong>Name:</strong> {name || "Not set"}
          </p>
          <p>
            <strong>Location:</strong> {location || "Not set"}
          </p>
          <p>
            <strong>Birthday:</strong> {birthday || "Not set"}
          </p>
          <button
            onClick={() => setIsEditing(true)}
            className="bg-[#0095FF] hover:bg-[#0095FF] rounded-full h-[36px] flex items-center justify-center cursor-pointer text-[16px] gap-[4px] px-[28px] py-[8px] no-underline font-bold transition duration-300"
          >
            Edit Profile
          </button>
        </div>
      )}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Profile Picture</h2>
        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-md flex items-center gap-2 w-full max-w-md mb-4 text-sm">
          <svg
            className="w-8 h-8 text-blue-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-9-3a1 1 0 112 0v4a1 1 0 11-2 0V7zm1 6a1.25 1.25 0 100 2.5A1.25 1.25 0 0010 13z"
              clipRule="evenodd"
            />
          </svg>
          <p>
          Upload an image for your profile picture.
            <p>
            We&apos;ll check that it&apos;s not offensive and doesn&apos;t
            contain malware.
            </p>
          </p>
        </div>

        <div className="space-y-4">
          {loading ? (
            <RotatingLines
              visible={true}
              width="96"
              strokeColor="#de5e14"
              strokeWidth="5"
              animationDuration="0.75"
            />
          ) : profileImage ? (
            <AdvancedImage
              cldImg={profileImage}
              width={300}
              height={300}
              alt="Profile"
            />
          ) : (
            <AdvancedImage
              cldImg={cld
                .image(CLOUDINARY_CONFIG.defaultImage)
                .resize(fill().width(300).height(300).gravity(autoGravity()))
                .format("auto")
                .quality("auto")}
              width={300}
              height={300}
              alt="Profile"
            />
          )}
          <UploadWidget
            onUploadSuccess={handleUploadSuccess}
            onUploadError={handleUploadError}
            setLoading={setLoading}
            buttonText="Edit Profile Picture"
            onClick={handleImageUpload}
          />
        </div>
        {uploadError && <p className="text-red-500 mt-2">{uploadError}</p>}
      </div>
    </div>
  )
}
