import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"

import { cn } from "@/lib/utils"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed bottom-0 right-0 z-[100] flex max-h-screen w-[380px] flex-col gap-2 p-4 sm:pointer-events-none sm:pb-20",
      className,
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Root
    ref={ref}
    className={cn(
      "group relative pointer-events-auto m-0 flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 shadow-lg transition-all data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-bottom-10 data-[state=closed]:slide-out-to-bottom-10 sm:w-[390px]",
      className,
    )}
    {...props}
  />
))
Toast.displayName = ToastPrimitives.Root.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn(
      "mb-1 text-lg font-semibold [&[data-state=open]]:animate-in [&[data-state=closed]]:animate-out [&[data-state=closed]]:fade-out-80 [&[data-state=open]]:slide-in-from-top-10",
      className,
    )}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn(
      "text-sm opacity-70 [&[data-state=open]]:animate-in [&[data-state=closed]]:animate-out [&[data-state=closed]]:fade-out-80 [&[data-state=open]]:slide-in-from-top-10",
      className,
    )}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md text-foreground opacity-50 transition-opacity hover:opacity-80 focus:shadow-none focus:outline-none disabled:pointer-events-none data-[state=open]:bg-secondary",
      className,
    )}
    aria-label="Close"
    {...props}
  />
))
ToastClose.displayName = ToastPrimitives.Close.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<React.ComponentProps<typeof ToastPrimitives.Action>>

export { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose }

export type { ToastProps, ToastActionElement }
