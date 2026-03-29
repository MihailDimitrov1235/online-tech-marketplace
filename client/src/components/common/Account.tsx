import { useState } from 'react';
import { User } from 'lucide-react';

import { paths } from '@/router';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from "@/store/authSlice"

import { Dropdown } from "./Menu"

export const Account = () => {
  const dispatch = useAppDispatch();

  const { user } = useAppSelector(state => state.auth);

  const [open, setOpen] = useState(false);

  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : ""

  return (
    <Dropdown
      align="bottom-left"
      variant="outline"
      size="icon"
      open={open}
      setOpen={setOpen}
      className="w-8 h-8 rounded-full bg-primary-tint text-primary-on border-primary-tint-border hover:bg-primary-tint-hover text-xs font-bold"
      menuItems={[
        { label: "Settings", link: paths.settings },
        { label: "Logout", onClick: () => dispatch(logout()) },
      ]}
    >
      {initials || <User size={14} />}
    </Dropdown>
  )
}