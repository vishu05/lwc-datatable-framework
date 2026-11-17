/** Pure helpers - unit-tested with Jest, no LWC/Apex dependencies. */

export function paginate(rows, page, pageSize) {
    const safeRows = rows || [];
    const size = Math.max(1, pageSize || 10);
    const totalPages = Math.max(1, Math.ceil(safeRows.length / size));
    const safePage = Math.min(Math.max(1, page || 1), totalPages);
    const start = (safePage - 1) * size;
    return {
        rows: safeRows.slice(start, start + size),
        page: safePage,
        totalPages,
        totalRecords: safeRows.length
    };
}

export function sortRows(rows, field, direction) {
    if (!rows || !field) return rows || [];
    const dir = direction === 'desc' ? -1 : 1;
    return [...rows].sort((a, b) => {
        const av = a[field]; const bv = b[field];
        if (av === bv) return 0;
        if (av === null || av === undefined) return 1;
        if (bv === null || bv === undefined) return -1;
        return (av > bv ? 1 : -1) * dir;
    });
}

export function filterRows(rows, term) {
    if (!rows || !term) return rows || [];
    const needle = String(term).toLowerCase();
    return rows.filter((row) =>
        Object.values(row).some(
            (v) => v !== null && v !== undefined && String(v).toLowerCase().includes(needle)
        )
    );
}
