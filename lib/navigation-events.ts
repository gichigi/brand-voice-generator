// A simple event system for navigation that avoids circular dependencies
// by decoupling the toast component from the router

type NavigationHandler = (url: string) => void

class NavigationEvents {
  private handlers: NavigationHandler[] = []

  // Register a navigation handler
  public subscribe(handler: NavigationHandler): () => void {
    this.handlers.push(handler)

    // Return unsubscribe function
    return () => {
      this.handlers = this.handlers.filter((h) => h !== handler)
    }
  }

  // Trigger navigation
  public navigate(url: string): void {
    if (this.handlers.length > 0) {
      // If we have handlers, use them
      this.handlers.forEach((handler) => handler(url))
    } else {
      // Fallback to window.location if no handlers are registered
      window.location.href = url
    }
  }
}

// Singleton instance
export const navigationEvents = new NavigationEvents()
