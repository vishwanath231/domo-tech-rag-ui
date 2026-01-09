/* eslint-disable react-hooks/set-state-in-effect */
import { ChevronDown, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useEffect, useState } from "react"

const models = [
  { id: "1", name: "Chat", description: "Normal chatbot" },
  { id: "2", name: "MCP Server", description: "MCP chatbot" },
]

export function ModelSelector() {
  const [selectedModel, setSelectedModel] = useState(models[0]) // Default to GPT-3.5
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // You can add logic here to persist the selected model if needed
    const savedModelId = localStorage.getItem("chat_type")
    if (savedModelId) {
      const model = models.find((m) => m.name === savedModelId)
      if (model) {
        setSelectedModel(model)
      }
    }else {
      setSelectedModel(models[0])
      localStorage.setItem("chat_type", models[0].name)
    }
  }, [])

  const handleSelectModel = (model: { id: string; name: string; description: string }) => {
    setSelectedModel(model)
    localStorage.setItem("chat_type", model.name)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="h-auto flex-col items-start gap-0.5 px-2 py-1.5 hover:bg-gray-100 rounded-lg"
        >
          <div className="flex items-center gap-1.5">
            <span className="text-base font-semibold text-gray-900">{selectedModel.name}</span>
            <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
          </div>
          <span className="text-xs text-gray-500">{selectedModel.description}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start" sideOffset={8}>
        <div className="p-2">
          {models.map((model) => (
            <button
              key={model.id}
              className="w-full flex items-start justify-between gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-gray-100 transition-colors"
              onClick={() => handleSelectModel(model)}
            >
              <div className="flex flex-col gap-0.5">
                <span className="font-semibold text-gray-900">{model.name}</span>
                <span className="text-sm text-gray-500">{model.description}</span>
              </div>
              {selectedModel.id === model.id && (
                <Check className="h-5 w-5 text-gray-900 shrink-0 mt-0.5" />
              )}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
