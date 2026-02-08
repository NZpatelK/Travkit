"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

interface SlideUpModalProps {
  children: React.ReactNode;
}

export default function AddOnList({ children }: SlideUpModalProps) {
  const router = useRouter();

  const closeModal = () => {
    router.push('/dashboard');
  }



  return (
    <AnimatePresence>
      <>
        {/* Backdrop */}
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-white rounded-2xl modal-scroll w-full max-w-lg max-h-[90vh] overflow-auto p-6 relative"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <button
              className="absolute top-4 right-4 text-violet-700 hover:text-violet-900"
              onClick={closeModal}
            >
              <X />
            </button>
            {children}
          </motion.div>
        </motion.div>


      </>
    </AnimatePresence>
  );
}
