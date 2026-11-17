import { LightningElement, api, track } from 'lwc';
import searchRecords from '@salesforce/apex/GenericLookupController.searchRecords';

/**
 * Generic lookup backed by GenericLookupController.
 * The server only searches an allowlist of objects (see Apex).
 */
export default class LookupField extends LightningElement {
    @api objectApiName = 'Account';
    @api label = 'Lookup';
    @api placeholder = 'Search...';
    @track options = [];
    @track selectedId;

    async handleSearch(event) {
        const term = event.target.value;
        if (!term || term.length < 2) { this.options = []; return; }
        try {
            const results = await searchRecords({
                objectApiName: this.objectApiName, searchTerm: term });
            this.options = results.map((r) => ({ label: r.label, value: r.value }));
        } catch (e) {
            this.options = [];
        }
    }

    handleChange(event) {
        this.selectedId = event.detail.value;
        this.dispatchEvent(new CustomEvent('selection', {
            detail: { recordId: this.selectedId, objectApiName: this.objectApiName }
        }));
    }
}
