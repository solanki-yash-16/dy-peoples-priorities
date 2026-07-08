"use client"

import * as React from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { Loader2, CheckCircle2 } from "lucide-react"

import { Button } from "@repo/ui"
import { Textarea } from '@repo/ui';
import { Label } from '@repo/ui';
import { Select } from '@repo/ui';
import { VoiceRecorder } from "@/components/ui/voice-recorder"
import { ImageUploader } from "@/components/ui/image-uploader"
import { LocationPicker, type LocationData } from "@/components/ui/LocationPicker"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@repo/ui';
import { createComplaintSchema, type CreateComplaintDTO } from "@/lib/schemas/complaint.schema"

export function ComplaintForm() {
  const [submitted, setSubmitted] = React.useState(false)

  const form = useForm<CreateComplaintDTO>({
    resolver: zodResolver(createComplaintSchema),
    defaultValues: {
      description: {
        originalText: "",
        languageCode: "en",
      },
      location: {
        coordinates: [0, 0],
        address: "",
        village: "",
        district: "",
        state: "",
        country: "",
      },
      media: [],
    },
  })

  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, getValues, control } = form
  const media = useWatch({ control, name: "media" }) || []
  const location = useWatch({ control, name: "location" })

  const handleVoiceRecordingComplete = (data: { blob: Blob; file: File; base64?: string }) => {
    // In a real app, you'd upload this file or base64 to your backend/Firebase here
    console.log("Voice recording captured:", data.file.name)
    // Add to media array
    const currentMedia = form.getValues("media") || []
    setValue("media", [
      ...currentMedia, 
      { url: data.base64 || URL.createObjectURL(data.blob), type: "VOICE" }
    ])
  }

  const onSubmit = async (data: CreateComplaintDTO) => {
    console.log("Submitting complaint data:", data)
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center p-12 text-center">
        <CheckCircle2 className="size-20 text-green-500 mb-6" />
        <h2 className="text-3xl font-bold mb-2">Complaint Submitted</h2>
        <p className="text-zinc-500 max-w-md">Your voice has been heard. We will process your complaint and notify you of any updates.</p>
        <Button className="mt-8" onClick={() => { setSubmitted(false); form.reset() }}>Submit Another</Button>
      </motion.div>
    )
  }

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-xl border-zinc-200 dark:border-zinc-800 backdrop-blur-xl bg-white/95 dark:bg-zinc-950/95">
      <CardHeader className="pb-8">
        <CardTitle className="text-3xl">File a Complaint</CardTitle>
        <CardDescription className="text-base">Help us improve your constituency by reporting issues directly to the authorities.</CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-8">
          
          {/* Language Selection */}
          <div className="space-y-3">
            <Label required>Preferred Language</Label>
            <Select 
              {...register("description.languageCode")}
              options={[
                { label: "English", value: "en" },
                { label: "Hindi (हिंदी)", value: "hi" },
                { label: "Marathi (मराठी)", value: "mr" },
              ]}
            />
            {errors.description?.languageCode && (
              <p className="text-sm text-red-500">{errors.description.languageCode.message}</p>
            )}
          </div>

          {/* Description & Voice */}
          <div className="space-y-4">
            <div className="space-y-3">
              <Label required>Describe the Issue</Label>
              <Textarea 
                placeholder="Please describe the problem in detail..." 
                className="min-h-[150px] text-base"
                {...register("description.originalText")}
              />
              {errors.description?.originalText && (
                <p className="text-sm text-red-500">{errors.description.originalText.message}</p>
              )}
            </div>

            <div className="space-y-3">
              <Label>Or Record a Voice Message (Optional)</Label>
              <VoiceRecorder 
                onRecordingComplete={handleVoiceRecordingComplete} 
                onDelete={() => {
                  const currentMedia = form.getValues("media") || []
                  setValue("media", currentMedia.filter(m => m.type !== "VOICE"))
                }}
              />
            </div>
          </div>

          {/* Media Upload */}
          <div className="space-y-3">
            <Label>Attach Images (Optional)</Label>
            <ImageUploader 
              value={media.filter(m => m.type === "IMAGE").map(m => m.url)}
              onChange={(urls) => {
                const currentVoice = getValues("media")?.filter(m => m.type === "VOICE") || []
                const newImages = urls.map(url => ({ url, type: "IMAGE" as const }))
                setValue("media", [...currentVoice, ...newImages])
              }}
              maxFiles={4}
            />
          </div>

          {/* Location Section */}
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <LocationPicker 
              value={location as LocationData}
              onChange={(locationData) => {
                setValue("location.coordinates", locationData.coordinates)
                setValue("location.address", locationData.address)
                setValue("location.village", locationData.village)
                setValue("location.district", locationData.district)
                setValue("location.state", locationData.state)
                setValue("location.country", locationData.country)
              }}
            />
            {errors.location && (
              <p className="text-sm text-red-500 mt-2">Please ensure all required location fields are filled.</p>
            )}
          </div>

        </CardContent>
        <CardFooter className="pt-6 pb-8 bg-zinc-50/50 dark:bg-zinc-900/20 border-t border-zinc-100 dark:border-zinc-800 px-6 rounded-b-xl flex justify-end">
          <Button type="submit" size="lg" className="w-full sm:w-auto px-8 gap-2 text-base h-12" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="size-5 animate-spin" />}
            Submit Complaint
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
