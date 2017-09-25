document.addEventListener("sync", function(event) {
            cordova.require("com.salesforce.util.logger").logToConsole("SyncId : "+event.detail.syncId+" status : "+event.detail.status+" progress : "+event.detail.progress);
            if(event.detail.status=="DONE"){
                //cordova.require("com.salesforce.plugin.smartsync").cleanResyncGhosts({storeName: "Store1", isGlobalStore:false},event.detail.syncId, function(){}, function(){});
            }
});


function regLinkClickHandlers() {
    var $j = jQuery.noConflict();
    var logToConsole = cordova.require("com.salesforce.util.logger").logToConsole;

    $j('#link_fetch_sfdc_contacts').click(function(){
        showContacts();
    });
    
    $j('#link_fetch_sfdc_accounts').click(function(){
        showAccounts();
    });

    $j('#link_clear').click(function(){
        var sfSmartstore = function() {
                return cordova.require("com.salesforce.plugin.smartstore");};

            sfSmartstore().clearSoup("Contact", function(){}, function(){});
            sfSmartstore().clearSoup("Account", function(){}, function(){});
    });
    
    $j('#link_reset').click(function() {
                           logToConsole("link_reset clicked");
                           $j("#div_device_contact_list").html("")
                           $j("#div_sfdc_contact_list").html("")
                           $j("#div_sfdc_account_list").html("")
                           $j("#div_sfdc_account_create").html("")
                           });
                      
    $j('#link_logout').click(function() {
    	logToConsole("link_logout clicked");
        var sfAccManagerPlugin = cordova.require("com.salesforce.plugin.sfaccountmanager");
        sfAccManagerPlugin.logout();
    });



    $j('#link_switch_user').click(function() {
        logToConsole("link_switch_user clicked");
        var sfAccManagerPlugin = cordova.require("com.salesforce.plugin.sfaccountmanager");
        sfAccManagerPlugin.logout();
        sfAccManagerPlugin.switchToUser();
    });

    $j('#link_fetch').click(function(){
        force.query("SELECT Name,Id,AccountId FROM Contact", onSuccessSfdcContacts, onErrorSfdc);
        force.query("SELECT Name,Id FROM Account LIMIT 10", onSuccessSfdcAccounts, onErrorSfdc);
    });

    $j('#link_sync').click(function(){
        manageSync();
    });

    $j('#link_create_account').click(function(){

        $j("#div_device_contact_list").html("");
        $j("#div_sfdc_contact_list").html("");
        $j("#div_sfdc_account_list").html("");
        $j("#div_sfdc_account_create").html("");
        var input = $j('<p><label>Name</label><input type="text" id="inputFirstName" placeholder="Full Name" /><label>Phone</label><input type="number" id="inputPhone" placeholder="Phone" /></p>');
        var buttons = $j('<p><a href="#" onclick="saveAccount()" data-role="button" data-inline="true">Save</a><a href="#" id="link_create_sfdc_back" data-role="button" data-inline="true">Back</a></p>');
        $j("#div_sfdc_account_create").append(input);
        $j("#div_sfdc_account_create").append(buttons);

1
    });

    $j('#link_image').click(function(){
        navigator.camera.getPicture(function(imageData){
                //console.log(imageData);

            }, function(errorMsg){
                // Most likely error is user cancelling out of camera
                console.log(errorMsg);
            }, {
                quality: 50,
                sourceType: Camera.PictureSourceType.CAMERA,
                destinationType: Camera.DestinationType.DATA_URL
            });

    });
}

function saveAccount(){
    var name = document.getElementById('inputFirstName').value;
    var phone = document.getElementById('inputPhone').value;

    acc = {
            Id: `local_${(new Date()).getTime()}`,
            Name:name,
            Phone:phone,
            __local__: true,
            __locally_created__: true,
            __locally_updated__: false,
            __locally_deleted__: false,
            attributes:{type:'Account'}
          };
          var sfSmartstore = function() {
                   return cordova.require("com.salesforce.plugin.smartstore");};
          sfSmartstore().upsertSoupEntries("Account",[acc], function(succ){checkSuccess(succ)}, function(){});

          cordova.require("com.salesforce.plugin.smartsync").syncUp
               (false,{},"Account", {fieldlist:["Name","Phone"],mergeMode:"OVERWRITE"}, function(succ){checkSuccess(succ)}, function(){});
          document.getElementById('inputFirstName').value = "";
          document.getElementById('inputPhone').value = "";

}

function logger(data){
    cordova.require("com.salesforce.util.logger").logToConsole(data);
}

function checkSuccess(succ){
    $j = jQuery.noConflict();
    $j.each(succ, function(key, value) {
        if(key == "target" || key == "options" || key=="0"){
            logger(key+" : "+value);
            $j.each(value,function(key1,value1){
                logger("    "+key1+" : "+value1);
            })
        }
        else{
            logger(key+" : "+value);
        }
    });
}

function onSuccessSfdcContacts(response) {
    var $j = jQuery.noConflict();
    cordova.require("com.salesforce.util.logger").logToConsole("onSuccessSfdcContacts: received " + response.totalSize + " Contact");

    contactEntries = [];
    $j.each(response.records, function(i,contact) {
               contactEntries.push(contact);
    });
    cordova.require("com.salesforce.util.logger").logToConsole("onSuccessSfdcContacts: received " + contactEntries + " Account");

    var sfSmartstore = function() {
        return cordova.require("com.salesforce.plugin.smartstore");};

    sfSmartstore().clearSoup("Contact", function(){}, function(){});
    sfSmartstore().upsertSoupEntries("Contact", contactEntries, function(){}, function(){});

    /*

    */
}

function onSuccessSfdcAccounts(response) {
    var $j = jQuery.noConflict();
    cordova.require("com.salesforce.util.logger").logToConsole("onSuccessSfdcAccounts: received " + response.totalSize + " Account");

    accountEntries = [];
    $j.each(response.records, function(i,account) {
           accountEntries.push(account);
    });
    cordova.require("com.salesforce.util.logger").logToConsole("onSuccessSfdcAccounts: received " + accountEntries + " Account");
    var sfSmartstore = function() {
            return cordova.require("com.salesforce.plugin.smartstore");};

    sfSmartstore().clearSoup("Account", function(){}, function(){});
    sfSmartstore().upsertSoupEntries("Account", accountEntries, function(){}, function(){});


    /*

    */
}

function onErrorSfdc(error) {
    cordova.require("com.salesforce.util.logger").logToConsole("onErrorSfdc: " + JSON.stringify(error));
    alert('Error getting sfdc Contact!');
}

function registerSoups() {
    var sfSmartstore = function() {
                return cordova.require("com.salesforce.plugin.smartstore");};

    var AccountSpecs = [
        {path:"Name",type:"string"},
        {path:"Id",type:"string"},
        {path:"Phone",type:"string"},
        {path:"__local__",type: "string"},
        {path:"__locally_created__",type: "string"},
        {path:"__locally_updated__",type: "string"},
        {path:"__locally_deleted__",type: "string"}
    ];

    var ContactSpecs = [
        {path:"Name",type:"string"},
        {path:"Id",type:"string"},
        {path:"AccountId",type:"string"},
        {path:"__local__",type: "string"},
        {path:"__locally_created__",type: "string"},
        {path:"__locally_updated__",type: "string"},
        {path:"__locally_deleted__",type: "string"}
    ];

    sfSmartstore().registerSoup("Account", AccountSpecs, function(){}, function(){});
    sfSmartstore().registerSoup("Contact", ContactSpecs, function(){}, function(){});

}

function manageSync(){
    cordova.require("com.salesforce.plugin.smartsync").syncDown({type:"soql", query:"SELECT Name,Id,AccountId,LastModifiedDate FROM Contact"}, "Contact", {mergeMode:Force.MERGE_MODE_DOWNLOAD.OVERWRITE}, function(){},function(){});
    cordova.require("com.salesforce.plugin.smartsync").syncDown({type:"soql", query:"SELECT Name,Id,Phone,LastModifiedDate FROM Account"}, "Account", {mergeMode:Force.MERGE_MODE_DOWNLOAD.OVERWRITE}, function(){}, function(){});
}

function showAccounts(){

    var querySpec = navigator.smartstore.buildSmartQuerySpec("select {Account:Name}, {Account:Id} from {Account}", 350);
    navigator.smartstore.runSmartQuery(querySpec, function(cursor) {
        records = cursor.currentPageOrderedEntries;
        navigator.smartstore.closeCursor(cursor);
        cordova.require("com.salesforce.util.logger").logToConsole(records);
        var $j = jQuery.noConflict();
        $j("#div_sfdc_account_list").html("")
        var ul = $j('<ul data-role="listview" data-inset="true" data-theme="a" data-dividertheme="a"></ul>');
        $j("#div_sfdc_account_list").append(ul);

        ul.append($j('<li data-role="list-divider">Salesforce Accounts: ' + records.length + '</li>'));
        $j.each(records, function(i, account) {
            cordova.require("com.salesforce.util.logger").logToConsole(account);
            var newLi = $j("<li><a href='#' onclick='showAccountContacts(\""+account[1]+"\")'> " + (i+1) + " - " + account[0] + "</a></li>");
            ul.append(newLi);
        });

        $j("#div_sfdc_account_list").trigger( "create" );
    });
}

function showContacts(){


    var sfSmartstore = function() {
                    return cordova.require("com.salesforce.plugin.smartstore");};

    var querySpec = sfSmartstore().buildSmartQuerySpec("select {Contact:Name} from {Contact}", 350);
    sfSmartstore().runSmartQuery(querySpec, function(cursor) {
        records = cursor.currentPageOrderedEntries;
        sfSmartstore().closeCursor(cursor);
        cordova.require("com.salesforce.util.logger").logToConsole(records);

        var $j = jQuery.noConflict();
        $j("#div_sfdc_contact_list").html("")
        var ul = $j('<ul data-role="listview" data-inset="true" data-theme="a" data-dividertheme="a"></ul>');
        $j("#div_sfdc_contact_list").append(ul);

        ul.append($j('<li data-role="list-divider">Salesforce Contacts:  '+ records.length +' </li>'));
        $j.each(records, function(i, contactName) {
               var newLi = $j("<li><a href='#'>" + (i+1) + " - " + contactName + "</a></li>");
               ul.append(newLi);
               });


        $j("#div_sfdc_contact_list").trigger( "create" );
    });
}

function showAccountContacts(AccountId){
    var sfSmartstore = function() {
                        return cordova.require("com.salesforce.plugin.smartstore");};

        var querySpec = sfSmartstore().buildSmartQuerySpec("select {Contact:Name} from {Contact} where {Contact:AccountId} = '"+AccountId+"'", 150);
        sfSmartstore().runSmartQuery(querySpec, function(cursor) {
            records = cursor.currentPageOrderedEntries;
            sfSmartstore().closeCursor(cursor);
            cordova.require("com.salesforce.util.logger").logToConsole(records);
            if (records.length == 0)
                alert("No Contacts.");
            else if(records.length == 1)
                alert(records.length+" Contact.")
            else
                alert(records.length+" Contacts.")
        });
}