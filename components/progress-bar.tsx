interface ProgressBarProps {
  steps: string[]
  currentStep: number
}

export function ProgressBar({ steps, currentStep }: ProgressBarProps) {
  return (
    <div className="w-full">
      <div className="flex justify-between mb-2">
        {steps.map((step, index) => (
          <div
            key={step}
            className={`text-sm font-medium ${index <= currentStep ? "text-primary" : "text-muted-foreground"}`}
          >
            {step}
          </div>
        ))}
      </div>
      <div className="w-full bg-muted rounded-full h-2.5">
        <div
          className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        ></div>
      </div>
    </div>
  )
}
