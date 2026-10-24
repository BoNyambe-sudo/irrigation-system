"use client";

import { useState } from "react";

export default function DeleteProductButton() {
  return (
    <button
      type="submit"
      className="text-red-600 hover:underline text-xs"
      onClick={(e) => {
        if (!confirm("Delete this product?")) e.preventDefault();
      }}
    >
      Delete
    </button>
  );
}