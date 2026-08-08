'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type DialogOptions = {
  title?: string;
  message: string;
  type: 'alert' | 'confirm';
  onConfirm?: () => void;
  onCancel?: () => void;
};

type DialogContextType = {
  showAlert: (message: string, title?: string) => Promise<void>;
  showConfirm: (message: string, title?: string) => Promise<boolean>;
};

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
};

export const DialogProvider = ({ children }: { children: ReactNode }) => {
  const [dialog, setDialog] = useState<DialogOptions | null>(null);

  const showAlert = useCallback((message: string, title = 'Notification') => {
    return new Promise<void>((resolve) => {
      setDialog({
        title,
        message,
        type: 'alert',
        onConfirm: () => {
          setDialog(null);
          resolve();
        }
      });
    });
  }, []);

  const showConfirm = useCallback((message: string, title = 'Confirmation') => {
    return new Promise<boolean>((resolve) => {
      setDialog({
        title,
        message,
        type: 'confirm',
        onConfirm: () => {
          setDialog(null);
          resolve(true);
        },
        onCancel: () => {
          setDialog(null);
          resolve(false);
        }
      });
    });
  }, []);

  return (
    <DialogContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      <AnimatePresence>
        {dialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-black-matte border border-gold-dim shadow-2xl rounded p-6 max-w-sm w-full relative overflow-hidden rounded-2xl"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-dim via-gold-bright to-gold-dim" />
              
              {dialog.title && (
                <h3 className="text-xl font-serif-latin text-gold mb-3">{dialog.title}</h3>
              )}
              
              <div className="text-cream-dim text-sm leading-relaxed mb-6 whitespace-pre-wrap">
                {dialog.message}
              </div>

              <div className="flex justify-end gap-3 mt-4">
                {dialog.type === 'confirm' && (
                  <button
                    onClick={dialog.onCancel}
                    className="btn-admin-secondary"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={dialog.onConfirm}
                  className="btn-admin-primary"
                >
                  {dialog.type === 'confirm' ? 'Confirm' : 'OK'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DialogContext.Provider>
  );
};
