"use client"

import { Badge } from "@/components/ui/badge"

export function SubscriptionStatus() {
  // In a real app, this would fetch the subscription status from an API
  const subscriptionStatus = "active"
  const plan = "Pro"

  if (subscriptionStatus !== "active") {
    return (
      <Badge variant="outline" className="text-yellow-600 border-yellow-300 bg-yellow-50">
        Free Plan
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className="text-green-600 border-green-300 bg-green-50">
      {plan} Plan
    </Badge>
  )
}
