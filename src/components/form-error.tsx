import React from "react";

interface IFormError {
  errorMessage: string;
}

export const FormError: React.FC<IFormError> = ({ errorMessage }) => (
  <span className="font-lg text-red-700">{errorMessage}</span>
);
