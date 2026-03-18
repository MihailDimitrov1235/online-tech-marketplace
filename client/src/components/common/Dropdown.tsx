import { NavLink } from "react-router";
import type { ButtonProps } from "./Button";
import { Button } from "./Button";
import { Card } from "./Card";

type MenuItem = {
  label: string;
  link?: string;
  onClick?: () => void;
};

type DropdownProps = ButtonProps & {
  open: boolean;
  setOpen: (open: boolean) => void;
  menuItems: MenuItem[];
};

function ItemComponent({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="hover:bg-neutral/30 rounded-none w-full"
      onClick={onClick}
    >
      {label}
    </Button>
  );
}

export const Dropdown = ({ open, setOpen, menuItems, ...buttonProps }: DropdownProps) => {
  return (
    <div className="relative inline-block">
      <Button
        {...buttonProps}
        onClick={() => {setOpen(!open)}}
      />

      {open && (
        <Card className="absolute z-50 mt-3 p-0 flex flex-col min-w-25 left-1/2 -translate-x-1/2 border border-neutral">
          {/* Arrow */}
          <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-l border-t border-neutral rotate-45" />

          {menuItems.map((el) =>
            el.link ? (
              <NavLink key={el.label} to={el.link}>
                <ItemComponent label={el.label} />
              </NavLink>
            ) : (
              <ItemComponent key={el.label} label={el.label} onClick={el.onClick} />
            )
          )}
        </Card>
      )}
    </div>
  );
};