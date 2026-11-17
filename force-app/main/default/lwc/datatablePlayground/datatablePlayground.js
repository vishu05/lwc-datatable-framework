import { LightningElement } from 'lwc';

// Fictional demo rows - no real data. Drop this component on a Home/App page.
const DEMO_ROWS = Array.from({ length: 42 }, (_, i) => ({
    id: i + 1,
    name: `Example Organisation ${i + 1}`,
    programme: ['Mentoring', 'Food Assistance', 'Housing Support'][i % 3],
    referrals: (i * 7) % 50,
    status: i % 4 === 0 ? 'Closed' : 'Open'
}));

export default class DatatablePlayground extends LightningElement {
    rows = DEMO_ROWS;
    columns = [
        { label: 'Organisation', fieldName: 'name', type: 'text', sortable: true },
        { label: 'Programme', fieldName: 'programme', type: 'text', sortable: true },
        { label: 'Referrals', fieldName: 'referrals', type: 'number', sortable: true },
        { label: 'Status', fieldName: 'status', type: 'text', sortable: true }
    ];
    lastSelection = 'None';

    handleSelection(event) {
        this.lastSelection = `${event.detail.selectedRows.length} row(s) selected`;
    }
}
