import { paginate, sortRows, filterRows } from '../datatableUtils';

const rows = [
    { id: 1, name: 'Charlie', score: 30 },
    { id: 2, name: 'alpha', score: 10 },
    { id: 3, name: 'Bravo', score: 20 }
];

describe('paginate', () => {
    it('slices the requested page', () => {
        const p = paginate(rows, 2, 2);
        expect(p.rows).toHaveLength(1);
        expect(p.totalPages).toBe(2);
        expect(p.totalRecords).toBe(3);
    });
    it('clamps out-of-range pages', () => {
        expect(paginate(rows, 99, 2).page).toBe(2);
        expect(paginate(rows, 0, 2).page).toBe(1);
    });
    it('handles empty input', () => {
        const p = paginate([], 1, 10);
        expect(p.rows).toEqual([]);
        expect(p.totalPages).toBe(1);
    });
});

describe('sortRows', () => {
    it('sorts ascending and descending without mutating input', () => {
        const asc = sortRows(rows, 'score', 'asc');
        expect(asc.map((r) => r.score)).toEqual([10, 20, 30]);
        expect(sortRows(rows, 'score', 'desc').map((r) => r.score)).toEqual([30, 20, 10]);
        expect(rows[0].score).toBe(30);
    });
});

describe('filterRows', () => {
    it('matches case-insensitively across fields', () => {
        expect(filterRows(rows, 'ALP')).toHaveLength(1);
        expect(filterRows(rows, '20')).toHaveLength(1);
    });
    it('returns all rows for a blank term', () => {
        expect(filterRows(rows, '')).toHaveLength(3);
    });
});
