"use client";

import React from "react";

type ResultsHeaderProps = {
  count: number;
  search: string;
  sort: string;
  onSearchChange: (value: string) => void;
  onSortChange: (value: string) => void;
};

const SORT_OPTIONS = ["Newest", "Price: Low to High", "Price: High to Low"] as const;

export const ResultsHeader: React.FC<ResultsHeaderProps> = ({
  count,
  search,
  sort,
  onSearchChange,
  onSortChange,
}) => {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-gray-500">
        <span className="font-bold text-gray-900">{count}</span> results
      </p>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by title, brand, model..."
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 sm:w-72"
        />
        <select
          value={sort}
          onChange={(event) => onSortChange(event.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
