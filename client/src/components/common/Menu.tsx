import { NavLink } from "react-router"
import type { ButtonProps } from "./Button"
import { Button } from "./Button"
import { Card } from "./Card"
import { twMerge } from "tailwind-merge"

type MenuItem = {
  label: string
  link?: string
  onClick?: () => void
}

type DropdownAlign =
  | "bottom-center"
  | "bottom-left"
  | "bottom-right"
  | "top-center"
  | "top-left"
  | "top-right"
  | "left"
  | "right"

type DropdownProps = ButtonProps & {
  open: boolean
  setOpen: (open: boolean) => void
  menuItems: MenuItem[]
  align?: DropdownAlign
}

const alignStyles: Record<DropdownAlign, { menu: string; arrow: string }> = {
  "bottom-center": {
    menu: "top-full mt-3 left-1/2 -translate-x-1/2",
    arrow:
      "absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 border-l border-t rotate-45",
  },
  "bottom-right": {
    menu: "top-full mt-3 left-0",
    arrow: "absolute -top-1.5 left-3 w-3 h-3 border-l border-t rotate-45",
  },
  "bottom-left": {
    menu: "top-full mt-3 right-0",
    arrow: "absolute -top-1.5 right-3 w-3 h-3 border-l border-t rotate-45",
  },
  "top-center": {
    menu: "bottom-full mb-3 left-1/2 -translate-x-1/2",
    arrow:
      "absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 border-r border-b rotate-45",
  },
  "top-right": {
    menu: "bottom-full mb-3 left-0",
    arrow: "absolute -bottom-1.5 left-3 w-3 h-3 border-r border-b rotate-45",
  },
  "top-left": {
    menu: "bottom-full mb-3 right-0",
    arrow: "absolute -bottom-1.5 right-3 w-3 h-3 border-r border-b rotate-45",
  },
  left: {
    menu: "right-full mr-3 top-1/2 -translate-y-1/2",
    arrow:
      "absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 border-r border-t rotate-45",
  },
  right: {
    menu: "left-full ml-3 top-1/2 -translate-y-1/2",
    arrow:
      "absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 border-l border-b rotate-45",
  },
}

function ItemComponent({
  label,
  onClick,
}: {
  label: string
  onClick?: () => void
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="hover:bg-violet-200/50 rounded-none w-full"
      onClick={onClick}
    >
      {label}
    </Button>
  )
}

export const Dropdown = ({
  open,
  setOpen,
  menuItems,
  align = "bottom-center",
  ...buttonProps
}: DropdownProps) => {
  const { menu, arrow } = alignStyles[align]

  return (
    <div className="relative inline-block">
      <Button
        {...buttonProps}
        onClick={() => {
          setOpen(!open)
        }}
      />

      {open && (
        <Card
          className={twMerge(
            "absolute z-50 p-0 flex flex-col min-w-25 border border-neutral",
            menu,
          )}
        >
          <span className={twMerge("bg-white border-neutral", arrow)} />
          {menuItems.map(el =>
            el.link ? (
              <NavLink
                key={el.label}
                to={el.link}
                onClick={() => {
                  setOpen(false)
                }}
              >
                <ItemComponent label={el.label} />
              </NavLink>
            ) : (
              <ItemComponent
                key={el.label}
                label={el.label}
                onClick={() => {
                  el.onClick?.()
                  setOpen(false)
                }}
              />
            ),
          )}
        </Card>
      )}
    </div>
  )
}
