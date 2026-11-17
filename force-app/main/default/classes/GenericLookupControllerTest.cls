@isTest
private class GenericLookupControllerTest {

    @isTest
    static void findsAccountsByName() {
        insert new Account(Name = 'Harborview Example Org');
        insert new Account(Name = 'Other Example Org');

        Test.startTest();
        List<GenericLookupController.LookupResult> rows =
            GenericLookupController.searchRecords('Account', 'Harborview');
        Test.stopTest();

        System.assertEquals(1, rows.size());
        System.assertEquals('Harborview Example Org', rows[0].label);
    }

    @isTest
    static void rejectsNonAllowlistedObject() {
        Boolean thrown = false;
        try {
            GenericLookupController.searchRecords('User', 'ab');
        } catch (AuraHandledException e) {
            thrown = true;
        }
        System.assertEquals(true, thrown);
    }

    @isTest
    static void shortTermReturnsEmpty() {
        System.assertEquals(0,
            GenericLookupController.searchRecords('Account', 'a').size());
    }

    @isTest
    static void bulkSearchIsSingleQuery() {
        List<Account> accs = new List<Account>();
        for (Integer i = 0; i < 200; i++) {
            accs.add(new Account(Name = 'Bulk Example ' + i));
        }
        insert accs;

        Test.startTest();
        Integer queriesBefore = Limits.getQueries();
        List<GenericLookupController.LookupResult> rows =
            GenericLookupController.searchRecords('Account', 'Bulk Example');
        System.assertEquals(queriesBefore + 1, Limits.getQueries(),
            'Lookup must use exactly one SOQL query');
        Test.stopTest();
        System.assertEquals(20, rows.size(), 'Results are capped at 20');
    }
}
