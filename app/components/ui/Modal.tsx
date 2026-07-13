import React from "react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  // TODO: Define custom modal props.
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  // TODO: Reusable modal pop-up primitive component.
  return <></>;
}
