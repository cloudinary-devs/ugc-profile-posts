'use client'

import { useEffect, useRef, useState } from "react"

interface CloudinaryVideoPlayerProps {
  publicId: string
}

export function CloudinaryVideoPlayer({ publicId }: CloudinaryVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)

  useEffect(() => {
    if (!window.cloudinary || !window.cloudinary.videoPlayer) {
      const script = document.createElement("script")
      script.src = "https://unpkg.com/cloudinary-core@latest/cloudinary-core-shrinkwrap.min.js"
      script.async = true
      
      script.onload = () => {
        const videoPlayerScript = document.createElement("script")
        videoPlayerScript.src = "https://unpkg.com/cloudinary-video-player@1.9.9/dist/cld-video-player.min.js"
        videoPlayerScript.async = true
        videoPlayerScript.onload = () => setIsScriptLoaded(true)
        videoPlayerScript.onerror = (error) => console.error("Error loading Cloudinary Video Player script:", error)
        document.head.appendChild(videoPlayerScript)
      }
      
      script.onerror = (error) => console.error("Error loading Cloudinary Core script:", error)
      document.head.appendChild(script)

      const link = document.createElement("link")
      link.href = "https://unpkg.com/cloudinary-video-player@1.9.9/dist/cld-video-player.min.css"
      link.rel = "stylesheet"
      document.head.appendChild(link)

      return () => {
        document.head.removeChild(script)
        const videoPlayerScript = document.querySelector('script[src="https://unpkg.com/cloudinary-video-player@1.9.9/dist/cld-video-player.min.js"]')
        if (videoPlayerScript) {
          document.head.removeChild(videoPlayerScript)
        }
        document.head.removeChild(link)
      }
    } else {
      setIsScriptLoaded(true)
    }
  }, [])

  useEffect(() => {
    if (isScriptLoaded && videoRef.current && window.cloudinary && window.cloudinary.videoPlayer) {
      const player = window.cloudinary.videoPlayer(videoRef.current, {
        cloud_name: "cld-demo-ugc",
        controls: true,
      })
      player.source(publicId)

      return () => {
        player.dispose()
      }
    }
  }, [isScriptLoaded, publicId])

  return (
    <video 
      ref={videoRef}
      className="cld-video-player w-full"
      controls
    />
  )
}

