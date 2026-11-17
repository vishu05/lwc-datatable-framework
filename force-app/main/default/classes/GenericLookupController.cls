/**
 * @description Generic lookup search with a strict object allowlist,
 *              CRUD/FLS enforcement via Security.stripInaccessible, and
 *              SOQL built only from validated identifiers (no raw user
 *              input is ever concatenated into a query).
 */
public with sharing class GenericLookupController {

    public class LookupResult {
        @AuraEnabled public String label;
        @AuraEnabled public String value;
        public LookupResult(String l, String v) { label = l; value = v; }
    }

    // Only these objects may be searched. Extend deliberately, never from input.
    private static final Set<String> ALLOWED_OBJECTS = new Set<String>{ 'Account', 'Contact' };
    private static final Set<String> ALLOWED_FIELDS = new Set<String>{ 'Name' };

    @AuraEnabled(cacheable=true)
    public static List<LookupResult> searchRecords(String objectApiName, String searchTerm) {
        if (!ALLOWED_OBJECTS.contains(objectApiName)) {
            throw new AuraHandledException('Object not searchable: ' + objectApiName);
        }
        if (String.isBlank(searchTerm) || searchTerm.length() < 2) {
            return new List<LookupResult>();
        }
        Schema.SObjectType sType = Schema.getGlobalDescribe().get(objectApiName);
        if (sType == null || !sType.getDescribe().isQueryable()) {
            throw new AuraHandledException('Object not queryable.');
        }
        String term = '%' + String.escapeSingleQuotes(searchTerm.trim()) + '%';
        // objectApiName/field are allowlist-validated above; only :term is user data.
        List<SObject> records = Database.query(
            'SELECT Id, Name FROM ' + objectApiName +
            ' WHERE Name LIKE :term ORDER BY Name LIMIT 20');
        List<SObject> accessible = Security.stripInaccessible(
            AccessType.READABLE, records).getRecords();

        List<LookupResult> out = new List<LookupResult>();
        for (SObject r : accessible) {
            out.add(new LookupResult((String) r.get('Name'), (String) r.get('Id')));
        }
        return out;
    }
}
