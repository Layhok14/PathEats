"use client";

import { Toaster as Sonner, ToasterProps } from "sonner";

/** PathEat toast wrapper — always light theme, styled with CSS variables */
const Toaster = ({ ...props }: ToasterProps) => {
  return <Sonner theme="light" className="toaster group" {...props} />;
};

export { Toaster };
