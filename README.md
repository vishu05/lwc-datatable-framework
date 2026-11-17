# LWC Datatable Framework

A small, reusable Lightning Web Component framework: a searchable, sortable,
paginated datatable, standalone pagination controls, and a generic
allowlisted lookup - with Jest-tested utility functions.

> Portfolio demo. Demo rows are generated fictional data; contains no code
> or data from any employer or client.

## Components

| Component | Purpose | Key public API |
|---|---|---|
| `c-enhanced-datatable` | Search + sort + paginate any row set | `columns`, `rows`, `key-field`, `page-size`, `show-search`; events `rowselection`, `pagechange` |
| `c-pagination-controls` | First/Prev/Next/Last controls | `page`, `total-pages`, `page-size`; event `pagechange` |
| `c-lookup-field` | Generic server-backed lookup | `object-api-name`, `label`; event `selection` |
| `c-datatable-playground` | Zero-setup demo page (42 fictional rows) | drop on any App/Home page |

## Usage

```html
<c-enhanced-datatable
    columns={columns} rows={rows} key-field="id"
    page-size="10" show-search
    onrowselection={handleSelection}>
</c-enhanced-datatable>
```

```js
columns = [
    { label: 'Organisation', fieldName: 'name', sortable: true },
    { label: 'Referrals', fieldName: 'referrals', type: 'number', sortable: true }
];
```

## Design Notes

- **Parent owns data, component owns presentation state.** Search/sort/page
  live inside `c-enhanced-datatable`; selection and page changes are
  re-emitted as events.
- **Pure, tested helpers.** `datatableUtils.js` (`paginate`, `sortRows`,
  `filterRows`) has no LWC imports, so Jest tests run fast with no org -
  see `__tests__/datatableUtils.test.js` (pagination clamping, non-mutating
  sort, case-insensitive filter).
- **Safe generic lookup.** `GenericLookupController` searches only an
  allowlist (`Account`, `Contact`), rejects everything else, escapes the
  search term, binds it as a variable, enforces FLS with
  `Security.stripInaccessible`, and caps results at 20. One SOQL per search
  (asserted in tests).

## Getting Started

```bash
sf org login web --alias demo
sf project deploy start --target-org demo
npm install && npm run test:unit
```

Add **Datatable Playground** to a Lightning page to try it with no data setup.

## License

MIT - see [LICENSE](LICENSE).
