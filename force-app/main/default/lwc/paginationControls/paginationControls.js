import { LightningElement, api } from 'lwc';

export default class PaginationControls extends LightningElement {
    @api page = 1;
    @api totalPages = 1;
    @api totalRecords = 0;
    @api pageSize = 10;

    get isFirst() { return this.page <= 1; }
    get isLast() { return this.page >= this.totalPages; }
    get label() { return `Page ${this.page} of ${this.totalPages}`; }

    emit(page) {
        this.dispatchEvent(new CustomEvent('pagechange', { detail: { page } }));
    }
    first() { this.emit(1); }
    previous() { this.emit(this.page - 1); }
    next() { this.emit(this.page + 1); }
    last() { this.emit(this.totalPages); }
}
