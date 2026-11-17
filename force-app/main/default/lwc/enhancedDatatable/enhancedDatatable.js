import { LightningElement, api, track } from 'lwc';
import { paginate, sortRows, filterRows } from './datatableUtils';

/**
 * Reusable datatable: client-side search, column sorting and pagination
 * over any row set. Parent owns the data; this component owns presentation
 * state and re-emits selection/page events.
 */
export default class EnhancedDatatable extends LightningElement {
    @api columns = [];
    @api keyField = 'id';
    @api pageSize = 10;
    @api showSearch = false;

    @track _rows = [];
    @track currentPage = 1;
    @track searchTerm = '';
    @track sortedBy;
    @track sortDirection = 'asc';

    @api
    set rows(value) {
        this._rows = value || [];
        this.currentPage = 1;
    }
    get rows() { return this._rows; }

    get filteredRows() { return filterRows(this._rows, this.searchTerm); }
    get sortedRows() { return sortRows(this.filteredRows, this.sortedBy, this.sortDirection); }
    get page() { return paginate(this.sortedRows, this.currentPage, this.pageSize); }
    get visibleRows() { return this.page.rows; }
    get totalPages() { return this.page.totalPages; }
    get totalRecords() { return this.filteredRows.length; }
    get isEmpty() { return this.totalRecords === 0; }

    handleSearch(event) {
        this.searchTerm = event.target.value;
        this.currentPage = 1;
    }

    handleSort(event) {
        this.sortedBy = event.detail.fieldName;
        this.sortDirection = event.detail.sortDirection;
    }

    handlePageChange(event) {
        this.currentPage = event.detail.page;
        this.dispatchEvent(new CustomEvent('pagechange', {
            detail: { page: this.currentPage, pageSize: this.pageSize }
        }));
    }

    handleRowSelection(event) {
        this.dispatchEvent(new CustomEvent('rowselection', {
            detail: { selectedRows: event.detail.selectedRows }
        }));
    }
}
