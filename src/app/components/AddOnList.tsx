"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface SlideUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function AddOnList({ isOpen, onClose, children }: SlideUpModalProps) {
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    if (isOpen) setIsVisible(true);
  }, [isOpen]);

  const handleClose = () => {
    // Start exit animation
    setIsVisible(false);
    // Delay actual onClose until animation finishes
    setTimeout(() => {
      onClose();
    }, 300); // match exit animation duration
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Slide Up to Center Modal */}
          <motion.div
            className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 rounded-2xl bg-white p-6 max-w-lg w-11/12"
            initial={{ y: "200%", opacity: 0 }}
            animate={{ y: "-50%", opacity: 1 }}
            exit={{ y: "200%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              onClick={handleClose}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button> */}
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
