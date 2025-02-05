'use client'

import { useState } from 'react'
import { useUser } from '../context/UserContext'
import { RotatingLines } from 'react-loader-spinner'
import UploadWidget from '../components/upload-widget'
import cld from "../components/cld"
import { AdvancedImage } from '@cloudinary/react'
import { fill, pad } from '@cloudinary/url-gen/actions/resize'
import { focusOn, autoGravity } from "@cloudinary/url-gen/qualifiers/gravity"
import { face } from "@cloudinary/url-gen/qualifiers/focusOn"
import { max, byRadius } from "@cloudinary/url-gen/actions/roundCorners"
import { outline,enhance, generativeRestore, upscale  } from "@cloudinary/url-gen/actions/effect"
import { color } from "@cloudinary/url-gen/qualifiers/background"
import { CLOUDINARY_CONFIG } from "../config/cloudinary"

interface Post {
  id: number
  content: string
  image?: string
}

// The Posts page lets users write a post and optionally upload an image.
export default function MyPosts() {
  const [newPost, setNewPost] = useState('')
  const [newImage, setNewImage] = useState('')
  const [uploadError, setUploadError] = useState('')
  const [loading, setLoading] = useState(false)
  const { profilePublicId, posts, setPosts, profileIsPoorQuality } = useUser()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPost.trim() !== '') {
      setPosts(prevPosts => [
        { id: Date.now(), content: newPost, image: newImage },
        ...prevPosts,
      ])
      setNewPost('')
      setNewImage('')
      setUploadError('')
    }
  }

  const handleUploadSuccess = (publicId: string) => {
    setLoading(false)
    setNewImage(publicId)
    setUploadError('')
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
      <h1 className="text-2xl font-bold mb-4">My Posts</h1>
      <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-md flex items-center justify-center gap-2 w-full mb-4 text-sm">
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
            Write a message in the text field and optionally upload an image before posting.
            <p>We&apos;ll check that the image is not offensive and doesn&apos;t contain malware.</p>
          </p>
        </div>
      <form onSubmit={handleSubmit} className="mb-4 space-y-2">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        />
        {loading ? (
          <RotatingLines
          visible={true}
          width="96"
          strokeColor="#de5e14"
          strokeWidth="5"
          animationDuration="0.75"
        />
        ):
        newImage && (
             <AdvancedImage cldImg={cld.image(newImage).
              resize(pad().width(300).height(200).background(color("gray"))).
                roundCorners(byRadius(5)).format('auto').quality('auto')
            } width={300} height={200} alt="New post"/>
        )}
        <div className="flex space-x-2">
          <UploadWidget
            onUploadSuccess={handleUploadSuccess}
            onUploadError={handleUploadError}
            setLoading={setLoading}
            buttonText="Upload Image"
            onClick={handleImageUpload}
          />
          <button type="submit" className="bg-green-600 rounded-full w-[100px] h-[36px] flex items-center justify-center cursor-pointer text-[16px] gap-[4px] px-[28px] py-[8px] no-underline font-bold transition duration-300 transition duration-300">
            Post
          </button>
        </div>
        {uploadError && <p className="text-red-500 mt-2">{uploadError}</p>}
      </form>
      <div className="space-y-4">
        {posts.map((post: Post) => (
          <div key={post.id} className="border p-4 rounded flex items-start dark:border-gray-700">
            <div className="flex-shrink-0 w-[75px] h-[75px] mr-4">
            <AdvancedImage cldImg={(() => {
              const img = cld.image(profilePublicId || CLOUDINARY_CONFIG.defaultImage)
              if (profileIsPoorQuality) {
                img.effect(enhance())
                .effect(generativeRestore())
                .effect(upscale())
              }
              img.resize(fill().width(75).height(75).gravity(
                focusOn(face()).fallbackGravity(autoGravity())))
              .roundCorners(max())
              .effect(outline().color("pink"))
              .format('auto')
              .quality('auto')
          
              return img
            })()} width={75} height={75} alt="Profile"/>
            </div>
            <div>
            <p className="text-gray-900 dark:text-gray-100">{post.content}</p>
              {post.image && (
                <AdvancedImage cldImg={cld.image(post.image).
                  resize(pad().width(300).height(200).background(color("gray")))
                    .roundCorners(byRadius(5))
                    .format('auto')
                    .quality('auto')
                } width={300} height={200} alt="Post" className="mt-2"/>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}