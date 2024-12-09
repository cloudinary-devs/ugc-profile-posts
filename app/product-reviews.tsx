'use client'

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CloudinaryVideoPlayer } from "./cloudinary-video-player"

interface Review {
  id: string
  text: string
  videoUrl?: string
  date: string
}

export function ProductReviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [newReview, setNewReview] = useState("")
  const [uploadWidget, setUploadWidget] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && !window.cloudinary) {
      const script = document.createElement("script")
      script.src = "https://upload-widget.cloudinary.com/global/all.js"
      script.async = true
      script.onload = initializeUploadWidget
      document.body.appendChild(script)

      return () => {
        document.body.removeChild(script)
      }
    } else if (window.cloudinary && !uploadWidget) {
      initializeUploadWidget()
    }
  }, [])

  const initializeUploadWidget = useCallback(() => {
    if (window.cloudinary && !uploadWidget) {
      const widget = window.cloudinary.createUploadWidget(
        {
          cloudName: "cld-demo-ugc",
          uploadPreset: "ugc-video",
          sources: ["local", "camera"],
          resourceType: "video",
        },
        (error: any, result: any) => {
          if (error) {
            console.error("Error in upload widget:", error)
            return
          }
          if (result && result.event === "success") {
            const newReviewWithVideo = {
              id: Date.now().toString(),
              text: newReview,
              videoUrl: result.info.public_id,
              date: new Date().toLocaleDateString()
            }
            setReviews(prevReviews => [newReviewWithVideo, ...prevReviews])
            setNewReview("")
          }
        }
      )
      setUploadWidget(widget)
    }
  }, [newReview])

  const handleUploadVideo = () => {
    if (uploadWidget) {
      uploadWidget.open()
    } else {
      console.error("Upload widget is not initialized")
    }
  }

  const handleSubmitTextReview = () => {
    if (!newReview.trim()) return

    const textOnlyReview = {
      id: Date.now().toString(),
      text: newReview,
      date: new Date().toLocaleDateString()
    }
    setReviews(prevReviews => [textOnlyReview, ...prevReviews])
    setNewReview("")
  }

  return (
    <div className="mt-12 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Write a Review</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Share your experience with this product..."
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex gap-4">
            <Button onClick={handleSubmitTextReview}>Submit Text Review</Button>
            <Button variant="secondary" onClick={handleUploadVideo}>
              Add Video Review
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Customer Reviews</h2>
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6 space-y-4">
              {review.videoUrl && (
                <div className="aspect-video">
                  <CloudinaryVideoPlayer publicId={review.videoUrl} />
                </div>
              )}
              <p className="text-lg">{review.text}</p>
              <div className="text-sm text-muted-foreground">
                Posted on {review.date}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

