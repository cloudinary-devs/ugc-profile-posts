import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { ProductReviews } from "./product-reviews"

export default function ProductPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <div className="aspect-square relative overflow-hidden rounded-lg">
              <Image
                src="https://res.cloudinary.com/demo/image/upload/f_auto/q_auto/docs/bluetooth_dongle.jpg"
                alt="Bluetooth Dongle"
                fill
                className="object-cover"
                priority
              />
            </div>
          </CardContent>
        </Card>
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Bluetooth 5.0 USB Adapter</h1>
          <p className="text-lg text-muted-foreground">
            High-speed Bluetooth dongle compatible with Windows, Mac, and Linux. Perfect for connecting wireless devices to your computer.
          </p>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold">$29.99</div>
            <div className="text-sm text-muted-foreground">Free shipping</div>
          </div>
        </div>
      </div>
      <ProductReviews />
    </div>
  )
}

