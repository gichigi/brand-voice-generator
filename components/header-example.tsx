import { ProfileDropdown } from "@/components/profile-dropdown"

export function Header() {
  return (
    <header className="flex items-center justify-between border-b px-6 py-3">
      <div className="flex items-center">
        <h1 className="text-xl font-bold">Brand Voice Generator</h1>
      </div>
      <ProfileDropdown />
    </header>
  )
}
