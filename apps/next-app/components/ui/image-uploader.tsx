"use client"

import * as React from "react"
import { useDropzone } from "react-dropzone"
import { UploadCloud, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { cn } from "@/lib/utils"
import { uploadService } from "@/services/upload.service"

export interface UploadedImage {
  id: string;
  url: string;
  file: File;
  preview: string;
}

interface ImageItemProps {
  image: UploadedImage;
  onRemove: (id: string) => void;
}

function ImageItem({ image, onRemove }: ImageItemProps) {
  const [uploadState, setUploadState] = React.useState<{status: "IDLE"|"COMPRESSING"|"UPLOADING"|"SUCCESS"|"ERROR", progress: number, error?: string}>({status: "IDLE", progress: 0})
  const [finalUrl, setFinalUrl] = React.useState<string | null>(!image.url.startsWith("blob:") ? image.url : null)

  React.useEffect(() => {
    // Only upload if we haven't already got a URL
    if (image.url.startsWith("blob:") && uploadState.status === "IDLE") {
      const doUpload = async () => {
        setUploadState({status: "UPLOADING", progress: 50})
        try {
          const url = await uploadService.uploadImage(image.file)
          setUploadState({status: "SUCCESS", progress: 100})
          setFinalUrl(url)
        } catch (err) {
          console.error("Failed to upload image", err)
          setUploadState({status: "ERROR", progress: 0, error: "Upload failed"})
        }
      }
      void doUpload()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 0.9 }}
      className="relative group rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 aspect-square"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
        src={image.preview} 
        alt="Preview" 
        className="w-full h-full object-cover"
        onLoad={() => {
          URL.revokeObjectURL(image.preview) // Cleanup
        }}
      />
      
      {/* Overlay Status */}
      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center transition-opacity">
        {uploadState.status === "COMPRESSING" && (
          <div className="flex flex-col items-center gap-2 text-white">
            <Loader2 className="size-6 animate-spin" />
            <span className="text-xs font-medium">Compressing...</span>
          </div>
        )}
        
        {uploadState.status === "UPLOADING" && (
          <div className="flex flex-col items-center gap-2 text-white w-full px-4">
            <span className="text-xs font-medium">{Math.round(uploadState.progress)}%</span>
            <div className="w-full h-1.5 bg-white/30 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${uploadState.progress}%` }} />
            </div>
          </div>
        )}
        
        {(uploadState.status === "SUCCESS" || finalUrl) && (
          <div className="absolute bottom-2 right-2 bg-green-500 rounded-full p-1 shadow-md">
            <CheckCircle2 className="size-4 text-white" />
          </div>
        )}

        {uploadState.status === "ERROR" && (
          <div className="absolute bottom-2 right-2 bg-red-500 rounded-full p-1 shadow-md" title={uploadState.error || "Error"}>
            <AlertCircle className="size-4 text-white" />
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => onRemove(image.id)}
        className="absolute top-2 right-2 bg-black/60 hover:bg-red-500 transition-colors text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 shadow-md"
      >
        <X className="size-4" />
      </button>
      
      {/* Hidden input to pass the final URL to the form if needed (usually handled by state in parent) */}
      <input type="hidden" value={finalUrl || ""} data-uploaded-url={image.id} />
    </motion.div>
  )
}

export interface ImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxFiles?: number;
  className?: string;
}

export function ImageUploader({ value = [], onChange, maxFiles = 5, className }: ImageUploaderProps) {
  // Map incoming string URLs to our internal object structure for the grid
  const [images, setImages] = React.useState<UploadedImage[]>(() => 
    value.map((url, i) => ({
      id: `existing-${i}`,
      url,
      file: new File([], "existing"), // Mock file for existing
      preview: url
    }))
  )

  // This ref helps us synchronize the child uploads with the parent state
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Periodically check for completed uploads to update the parent form
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (!containerRef.current) return
      const inputs = containerRef.current.querySelectorAll<HTMLInputElement>('input[data-uploaded-url]')
      const urls: string[] = []
      let pending = false
      
      inputs.forEach(input => {
        if (input.value) {
          urls.push(input.value)
        } else {
          pending = true
        }
      })
      
      if (!pending && urls.join(",") !== value.join(",")) {
        onChange(urls)
      }
    }, 500)
    
    return () => clearInterval(interval)
  }, [onChange, value])

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    if (images.length + acceptedFiles.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} images.`)
      return
    }

    const newImages = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substring(7),
      url: URL.createObjectURL(file), // Temp blob URL
      file,
      preview: URL.createObjectURL(file)
    }))

    setImages(prev => [...prev, ...newImages])
  }, [images.length, maxFiles])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: maxFiles - images.length,
    disabled: images.length >= maxFiles
  })

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id))
    // The setInterval will catch the change and update the parent
  }

  return (
    <div className={cn("space-y-4", className)} ref={containerRef}>
      {images.length < maxFiles && (
        <div 
          {...getRootProps()} 
          className={cn(
            "border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer group bg-zinc-50 dark:bg-zinc-900/50",
            isDragActive ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
          )}
        >
          <input {...getInputProps()} capture="environment" />
          <div className={cn(
            "p-4 rounded-full shadow-sm mb-4 transition-transform group-hover:scale-110",
            isDragActive ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400" : "bg-white text-zinc-500 dark:bg-zinc-800"
          )}>
            <UploadCloud className="size-8" />
          </div>
          <p className="font-medium text-zinc-700 dark:text-zinc-300 text-center">
            {isDragActive ? "Drop images here" : "Click to upload or drag & drop"}
          </p>
          <p className="text-sm text-zinc-500 mt-1 text-center">
            Supports mobile camera. JPG, PNG or WEBP (Max {maxFiles} images)
          </p>
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <AnimatePresence>
            {images.map(image => (
              <ImageItem key={image.id} image={image} onRemove={removeImage} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
