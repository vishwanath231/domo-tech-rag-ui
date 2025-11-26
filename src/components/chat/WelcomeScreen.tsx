import { MessageSquare, Lightbulb, Code, Sparkles } from "lucide-react"

export function WelcomeScreen() {
  const suggestions = [
    {
      icon: MessageSquare,
      title: "Explain a concept",
      description: "How does photosynthesis work?"
    },
    {
      icon: Lightbulb,
      title: "Get creative ideas",
      description: "Fun activities for a team building event"
    },
    {
      icon: Code,
      title: "Write code",
      description: "Create a Python script to analyze data"
    },
    {
      icon: Sparkles,
      title: "Brainstorm",
      description: "Marketing strategies for a new product"
    }
  ]

  return (
    <div className="flex h-full flex-col items-center justify-center px-4 pb-32">
      <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-[#99ccee]">
        <Sparkles className="h-8 w-8 text-white" />
      </div>
      
      <h1 className="mb-2 text-3xl font-semibold text-gray-900">
        How can I help you today?
      </h1>
      
      <div className="mt-8 grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2">
        {suggestions.map((suggestion, index) => {
          const Icon = suggestion.icon
          return (
            <button
              key={index}
              className="group flex flex-col items-start gap-2 rounded-2xl border border-gray-200 bg-white p-4 text-left transition-all hover:border-gray-300 hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <Icon className="h-5 w-5 text-gray-600" />
                <span className="font-medium text-gray-900">{suggestion.title}</span>
              </div>
              <p className="text-sm text-gray-600">{suggestion.description}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
