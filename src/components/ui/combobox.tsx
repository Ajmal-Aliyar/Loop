import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useUserStore } from "@/store/userStore"
import type { User } from "@/api/users/user.types"

interface ComboboxProps {
  onSelect: (user: User) => void;
  selectedUserIds?: string[];
}

export function ComboboxDemo({ onSelect, selectedUserIds = [] }: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const { users, loading, fetchUsers } = useUserStore()

  // Fetch users when component mounts
  React.useEffect(() => {
    if (users.length === 0) {
      fetchUsers()
    }
  }, [users.length, fetchUsers])

  const filteredUsers = users.filter(user => 
    !selectedUserIds.includes(user._id)
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={loading}
        >
          {loading ? "Loading users..." : "Add people..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder="Search people..." />
          <CommandEmpty>No user found.</CommandEmpty>
          <CommandGroup>
            {filteredUsers.map((user) => (
              <CommandItem
                key={user._id}
                value={user.username}
                onSelect={() => {
                  setOpen(false)
                  onSelect(user)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4 opacity-0"
                  )}
                />
                <div className="flex flex-col">
                  <span className="font-medium">{user.name || user.username}</span>
                  <span className="text-xs text-muted-foreground">@{user.username}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}