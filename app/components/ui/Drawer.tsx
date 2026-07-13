import React from "react";

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  // TODO: Define custom drawer props.
}

export default function Drawer({ isOpen, onClose, children }: DrawerProps) {
  // TODO: Reusable drawer/sheet primitive component.
  return <></>;
}
