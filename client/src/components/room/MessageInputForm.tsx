import { type FormEvent } from 'react'
import { SendIcon } from '../ui/SendIcon'

export type MessageInputFormProps = {
  chatInput: string
  setChatInput: (value: string) => void
  handleChatSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export function MessageInputForm({
  chatInput,
  setChatInput,
  handleChatSubmit,
}: MessageInputFormProps) {
  return (
    <form onSubmit={handleChatSubmit} className="flex shrink-0 gap-1.5 lg:gap-2">
      <input
        type="text"
        value={chatInput}
        onChange={(e) => setChatInput(e.target.value)}
        placeholder="Type a message..."
        className="w-full rounded-md border border-slate-700/80 bg-slate-950 px-2.5 py-1.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 lg:rounded-lg lg:border-slate-700 lg:px-3 lg:py-2"
      />
      <button
        type="submit"
        aria-label="Send message"
        className="grid shrink-0 place-items-center rounded-md bg-indigo-500 px-2.5 py-1.5 text-white transition hover:bg-indigo-400 lg:rounded-lg lg:px-3 lg:py-2"
      >
        <SendIcon className="h-4.5 w-4.5 lg:h-5 lg:w-5" />
      </button>
    </form>
  )
}
