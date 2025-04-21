"use client"

import { useState, useEffect } from "react"

export const useMutation = (mutationFunction: any) => {
  return async (...args: any[]) => {
    console.log("Mutation called with args:", args)
    return "mock_convex_id_123456"
  }
}

export const useQuery = (queryFunction: any) => {
  const [result, setResult] = useState(null)

  useEffect(() => {
    setResult("Mock query result")
  }, [])

  return result
}

export const useConvexAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return { isAuthenticated, isLoading, setIsAuthenticated }
}
