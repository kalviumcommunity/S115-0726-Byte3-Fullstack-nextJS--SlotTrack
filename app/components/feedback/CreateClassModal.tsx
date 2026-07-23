"use client";

import React from "react";
import Modal from "../ui/Modal";
import CreateClassForm from "../forms/CreateClassForm";

interface CreateClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    category: string;
    location: string;
    detailedLocation?: string;
    startTime: string;
    endTime: string;
    date: string;
    capacity: number;
    price: number;
  }) => void;
}

export default function CreateClassModal({ isOpen, onClose, onSubmit }: CreateClassModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Class">
      <CreateClassForm onSubmit={onSubmit} onCancel={onClose} />
    </Modal>
  );
}
