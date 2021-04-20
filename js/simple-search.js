var SimpleSearch = {};
(function()
{
    var semaforo = true;
    var wpUrlSearchAjax = "/wp-admin/admin-ajax.php?action=esi_process_ajax_research";
//    var wpUrlAjaxObjectDetails = "/wp-admin/admin-ajax.php?action=esi_process_ajax_details_research";
//    var wpUrlAjaxSave = "/wp-admin/admin-ajax.php?action=esi_save_ajax_research";
//    var wpUrlAjaxDelete = "/wp-admin/admin-ajax.php?action=esi_delete_ajax_research";
//    var wpUrlAjaxObjectSavedDetails = "/wp-admin/admin-ajax.php?action=esi_process_ajax_get_saved";

//    Eagle.isSimpleSearch = true;
//
    var research = "";
    var resultType = "";
//    var dnetObjectIdentifier = "";
//    var result = null;
//    var resultArray = Array();
//    var start = 0;
//    var numFound = 0;
//    var saveState = 0;

    SimpleSearch.restore = function(element) {
        jQuery(element).css("color", "black");
        jQuery(element).css("background-color", "white");
    };

    SimpleSearch.resetValue = function() {
        jQuery("#mysearch").removeAttr("onclick");
        jQuery("#mysearch").val("");
    };

    Eagle.simpleSearch = function() {
        if(event.keyCode==13)alert("Premuto invio");

    };

    function  solrRequest() {
        if (semaforo) {
            jQuery.ajax({
                type: 'POST',
                url: wpUrlSearchAjax,
                dataType: 'html',
                data: 'search=' + encodeURIComponent(research) + '&type='+resultType,
                beforeSend: function() {
                    semaforo = false;
                },
                error: function() {
                    semaforo = true;
                    alert('Error parsing you request!\nPlease report this bug!');
                },
                success: function(data) {
                    semaforo = true;
                    if (data.error === true) {
                        alert(data.message);
                    }
                    else {
                        saveState = 1;
                        result = JSON.parse(data.json);
                        var html = jsonParser();
                        var link = '<h4 style="cursor:pointer;" onclick="Eagle.makeANewSearch();">Need a new search? click Here!</h4>';
                        jQuery("#advS").slideUp("fast");
                        jQuery("#appendResponse").html(link + html);
                        jQuery("#appendResponse").slideDown("fast");
                        jQuery("fieldset#saveForm").slideDown("fast", function() {
                            /*Add onclick save action*/
                            jQuery("fieldset#saveForm input[type=button]").click(Eagle.saveCurrentState);
                        });

                    }
                }
            });
        }
    }
    ;


}());