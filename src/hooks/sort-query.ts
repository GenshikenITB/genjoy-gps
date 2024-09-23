import { useMemo } from 'react';

type SortableItem = {
    [key: string]: any;
};

type SortKeyType = string | number | Date;

export const useSortedItems = <T extends SortableItem>(
    data: T[] | undefined,
    sortKey: keyof T
) => {
    return useMemo(() => {
        if (!data) return [];

        return [...data].sort((a, b) => {
            const aValue = a[sortKey] as SortKeyType;
            const bValue = b[sortKey] as SortKeyType;

            if (aValue instanceof Date && bValue instanceof Date) {
                return bValue.getTime() - aValue.getTime();
            }

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return aValue.localeCompare(bValue);
            }

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return aValue - bValue;
            }

            // Fallback for other types or mixed types
            return String(aValue).localeCompare(String(bValue));
        });
    }, [data, sortKey]);
};