var EagleSaved = {};
(function()
{
    var semaforo = true;
//    var wpUrlAjax = "/wp-admin/admin-ajax.php?action=esi_process_ajax_research";
//    var wpUrlAjaxObjectDetails = "/wp-admin/admin-ajax.php?action=esi_process_ajax_details_research";
//    var wpUrlAjaxSave = "/wp-admin/admin-ajax.php?action=esi_save_ajax_research";
    var wpUrlAjaxObjectSavedDetails = "/wp-admin/admin-ajax.php?action=esi_process_ajax_get_saved";
    var currentPage = 0;
    var result = null;

    EagleSaved.restore = function(element) {
        jQuery(element).css("color", "black");
        jQuery(element).css("background-color", "white");
    };

    EagleSaved.getSaved = function(t_primary_key, type) {
        if (semaforo) {
            jQuery.ajax({
                type: 'POST',
                url: wpUrlAjaxObjectSavedDetails,
                dataType: 'json',
                data: 'type=' + type + '&t_primary_key=' + t_primary_key,
                beforeSend: function() {
                    semaforo = false;
//                    jQuery("#appendResponse").slideUp("fast");
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
                        result = data;

                        var html = (type === "research") ? jsonParser(data.query_id) : jsonObjectParser();
                        var link = '<h4 style="cursor:pointer;" onclick="EagleSaved.returnToSaved();">Turn Back? click Here!</h4>';
                        jQuery("#savedElementListPage").slideUp("fast");
                        jQuery("#appendResponseSaved").html(link + html);
                        jQuery("#appendResponseSaved").slideDown("fast");
                    }
                }
            });
        }
    };

    EagleSaved.objectSavedListDetails = function(dnetResourceIdentifier) {
        var html = '';
        var xmlDoc = jQuery.parseXML(result.xml);
        var xml = jQuery(xmlDoc);
        var docs = xml.find("doc");
        for (var i = 0; i < docs.length; i++)
        {
            var tmp = jQuery(docs[i]).children();
            var tmpXml = jQuery(tmp[2]);
            var savedDnetResourceIdentifier = jQuery.trim(tmpXml.find("dnetResourceIdentifier").text());
            if (savedDnetResourceIdentifier === dnetResourceIdentifier)
                html += offlineSavedObjectPrint(tmpXml);
        }
        var link = '<h4 style="cursor:pointer;" onclick="EagleSaved.returnToSavedList();">Turn Back? click Here!</h4>';
        jQuery("#appendResponseSaved").slideUp("fast");
        jQuery("#appendResponseSavedDetails").html(link + html);
        jQuery("#appendResponseSavedDetails").slideDown("fast");

    };

    EagleSaved.returnToSaved = function() {
        jQuery("#appendResponseSaved").slideUp("fast", function() {
            jQuery("#appendResponseSaved").html("");
            jQuery("#savedElementListPage").slideDown("fast");
        });
    };
    
    EagleSaved.returnToSavedList=function(){
        jQuery("#appendResponseSavedDetails").slideUp("fast", function() {
            jQuery("#appendResponseSavedDetails").html("");
            jQuery("#appendResponseSaved").slideDown("fast");
        });
    }

    function jsonParser() {
        var html = '<ul>';
        var xmlDoc = jQuery.parseXML(result.xml);
        var xml = jQuery(xmlDoc);
        var docs = xml.find("doc");
        for (var i = 0; i < docs.length; i++)
        {
            var tmp = jQuery(docs[i]).children();
            var tmpXml = jQuery(tmp[2]);
            var title = tmpXml.find("title").text();
            var entityType = tmpXml.find("entityType").text();
            var dnetResourceIdentifier = jQuery.trim(tmpXml.find("dnetResourceIdentifier").text());
            html += '<li onclick="EagleSaved.objectSavedListDetails(\'' + dnetResourceIdentifier + '\')" >' + title + ' (' + entityType + ')</li>';
//            resultArray[i]=xml;

        }
//        xmlDoc = jQuery.parseXML(result.response.docs[0].__result[0]);
//        var xml = jQuery(xmlDoc);
//        xml.find("numFound");
//        var paginationHTML = pagination();
        html += '</ul>';
        return html;
    }
    ;

    function jsonObjectParser() {
        var html = '<fieldset>';
        var xmlDoc = jQuery.parseXML(result.xml);
        var xml = jQuery(xmlDoc);
        var docs = xml.find("doc");
        var tmp = jQuery(docs[0]).children();
        var tmpXml = jQuery(tmp[2]);



//        numFound = result.response.numFound;
//        start = result.response.start;
//        if (numFound === 0)
//            return "<h5>No result found.!</h5>";
//        var xmlDoc = jQuery.parseXML(result.response.docs[0].__result[0]);
//        var xml = jQuery(xmlDoc);
        if (jQuery.trim(tmpXml.find("entityType").text()) === "Artifact") {
            /*Artifact Parsing*/
            /*Set the title on Legend*/
            html += '<legend>' + tmpXml.find("title").text() + '</legend><br/>';
            /*Set the title Trimegistos ID*/
            html += '<label class="objectDetailField">Trimegistos ID</label><br/><span class="objectDetailValue">' + tmpXml.find("refersTrismegistosCard").attr("tm_id") + '</span><br/><br/>';
            html += '<label class="objectDetailField">Thumbnails of inscription</label><br/><span class="objectDetailValue">Currently Unavaiable</span><br/><br/>';
            html += '<label class="objectDetailField">Type of inscription</label><br/><span class="objectDetailValue">' + tmpXml.find("inscriptionType").text() + '</span><br/><br/>';
            html += '<label class="objectDetailField">Type of object</label><br/><span class="objectDetailValue">Currently Unavaiable</span><br/><br/>';
            html += '<label class="objectDetailField">Material</label><br/><span class="objectDetailValue">' + tmpXml.find("material").text() + '</span><br/><br/>';
            html += '<label class="objectDetailField">Ancient Find Spot</label><br/><span class="objectDetailValue">' + tmpXml.find("ancientFindSpot").text() + '</span><br/><br/>';
            html += '<label class="objectDetailField">Current Location</label><br/><span class="objectDetailValue">' + tmpXml.find("conservationCountry").text() + ' : ' + tmpXml.find("conservationRegion").text() + '</span><br/><br/>';
            html += '<label class="objectDetailField">Text</label><br/><span class="objectDetailValue">Currently Unavaiable</span><br/><br/>';
            html += '<label class="objectDetailField">Date</label><br/><span class="objectDetailValue">' + tmpXml.find("originDating").text() + '</span><br/><br/>';
            html += '<label class="objectDetailField">Bibliografy</label><br/><span class="objectDetailValue">Currently Unavaiable</span><br/><br/>';
            html += '<label class="objectDetailField">Content Provider</label><br/><span class="objectDetailValue">' + tmpXml.find("recordSourceInfo").attr("providerName") + '</span><br/><a target="_blank" href="' + tmpXml.find("recordSourceInfo").text() + '">' + tmpXml.find("recordSourceInfo").text() + '</a>';
        } else if (jQuery.trim(tmpXml.find("entityType").text()) === "Documental manifestation") {
            /*Documental Manifestation Parsing*/
            /*Set the title on Legend*/
            html += '<legend>' + tmpXml.find("title").text() + '</legend><br/>';
            /*Set the title Trimegistos ID*/
            html += '<label class="objectDetailField">Type of entity</label><br/><span class="objectDetailValue">' + tmpXml.find("entityType").text() + '</span><br/><br/>';
            html += '<label class="objectDetailField">Type of document</label><br/><span class="objectDetailValue">' + tmpXml.find("documentType").text() + '</span><br/><br/>';
            html += '<label class="objectDetailField">Transcription</label><br/><span class="objectDetailValue">' + tmpXml.find("text").text() + '</span><br/><br/>';
            var bibliografy = jQuery(tmpXml.find("bibliography"));
            if (bibliografy.length > 1) {
                html += '<label class="objectDetailField">Bibliografy</label><br/><ul>';
                for (var i = 0; i < bibliografy.length; i++) {
                    html += '<li><span class="objectDetailValue">' + jQuery(bibliografy[i]).text() + '</span></li>';
                }
                html += '</ul><br/>';
            } else if (bibliografy.length === 1) {
                html += '<label class="objectDetailField">Bibliografy</label><br/>';
                html += '<span class="objectDetailValue">' + bibliografy.text() + '</span><br/>';
            }
            html += '<label class="objectDetailField">Comment</label><br/><span class="objectDetailValue">' + tmpXml.find("commentary").text() + '</span><br/><br/>';
        }
        else if (jQuery.trim(tmpXml.find("entityType").text()) === "Visual representation") {
            /*Visual Rapresentation Parsing*/
            /*Set the title on Legend*/
            html += '<legend>' + tmpXml.find("title").text() + '</legend><br/>';
            /*Set the title Trimegistos ID*/
            html += '<label class="objectDetailField">Type of entity</label><br/><span class="objectDetailValue">' + tmpXml.find("entityType").text() + '</span><br/><br/>';
            html += '<label class="objectDetailField">Visual Rapresentation</label><br/><img src="' + tmpXml.find("url").text() + '" class="objectDetailValue"/><br/><br/>';
            html += '<label class="objectDetailField">Visual Rapresentation Ipr</label><br/><span class="objectDetailValue">' + tmpXml.find("visualRepresentationIpr").text() + '</span><br/><br/>';
        }
        html += '</fieldset>';
        return html;
    }

    function offlineSavedObjectPrint(tmpXml) {
//        numFound = result.response.numFound;
        var html = '<fieldset>';
        if (jQuery.trim(tmpXml.find("entityType").text()) === "Artifact") {
            /*Artifact Parsing*/
            /*Set the title on Legend*/
            html += '<legend>' + tmpXml.find("title").text() + '</legend><br/>';
            /*Set the title Trimegistos ID*/
            html += '<label class="objectDetailField">Trimegistos ID</label><br/><span class="objectDetailValue">' + tmpXml.find("refersTrismegistosCard").attr("tm_id") + '</span><br/><br/>';
            html += '<label class="objectDetailField">Thumbnails of inscription</label><br/><span class="objectDetailValue">Currently Unavaiable</span><br/><br/>';
            html += '<label class="objectDetailField">Type of inscription</label><br/><span class="objectDetailValue">' + tmpXml.find("inscriptionType").text() + '</span><br/><br/>';
            html += '<label class="objectDetailField">Type of object</label><br/><span class="objectDetailValue">Currently Unavaiable</span><br/><br/>';
            html += '<label class="objectDetailField">Material</label><br/><span class="objectDetailValue">' + tmpXml.find("material").text() + '</span><br/><br/>';
            html += '<label class="objectDetailField">Ancient Find Spot</label><br/><span class="objectDetailValue">' + tmpXml.find("ancientFindSpot").text() + '</span><br/><br/>';
            html += '<label class="objectDetailField">Current Location</label><br/><span class="objectDetailValue">' + tmpXml.find("conservationCountry").text() + ' : ' + tmpXml.find("conservationRegion").text() + '</span><br/><br/>';
            html += '<label class="objectDetailField">Text</label><br/><span class="objectDetailValue">Currently Unavaiable</span><br/><br/>';
            html += '<label class="objectDetailField">Date</label><br/><span class="objectDetailValue">' + tmpXml.find("originDating").text() + '</span><br/><br/>';
            html += '<label class="objectDetailField">Bibliografy</label><br/><span class="objectDetailValue">Currently Unavaiable</span><br/><br/>';
            html += '<label class="objectDetailField">Content Provider</label><br/><span class="objectDetailValue">' + tmpXml.find("recordSourceInfo").attr("providerName") + '</span><br/><a target="_blank" href="' + tmpXml.find("recordSourceInfo").text() + '">' + tmpXml.find("recordSourceInfo").text() + '</a>';
        } else if (jQuery.trim(tmpXml.find("entityType").text()) === "Documental manifestation") {
            /*Documental Manifestation Parsing*/
            /*Set the title on Legend*/
            html += '<legend>' + tmpXml.find("title").text() + '</legend><br/>';
            /*Set the title Trimegistos ID*/
            html += '<label class="objectDetailField">Type of entity</label><br/><span class="objectDetailValue">' + tmpXml.find("entityType").text() + '</span><br/><br/>';
            html += '<label class="objectDetailField">Type of document</label><br/><span class="objectDetailValue">' + tmpXml.find("documentType").text() + '</span><br/><br/>';
            html += '<label class="objectDetailField">Transcription</label><br/><span class="objectDetailValue">' + tmpXml.find("text").text() + '</span><br/><br/>';
            var bibliografy = jQuery(tmpXml.find("bibliography"));
            if (bibliografy.length > 1) {
                html += '<label class="objectDetailField">Bibliografy</label><br/><ul>';
                for (var i = 0; i < bibliografy.length; i++) {
                    html += '<li><span class="objectDetailValue">' + jQuery(bibliografy[i]).text() + '</span></li>';
                }
                html += '</ul><br/>';
            } else if (bibliografy.length === 1) {
                html += '<label class="objectDetailField">Bibliografy</label><br/>';
                html += '<span class="objectDetailValue">' + bibliografy.text() + '</span><br/>';
            }
            html += '<label class="objectDetailField">Comment</label><br/><span class="objectDetailValue">' + tmpXml.find("commentary").text() + '</span><br/><br/>';
        }
        else if (jQuery.trim(tmpXml.find("entityType").text()) === "Visual representation") {
            /*Visual Rapresentation Parsing*/
            /*Set the title on Legend*/
            html += '<legend>' + tmpXml.find("title").text() + '</legend><br/>';
            /*Set the title Trimegistos ID*/
            html += '<label class="objectDetailField">Type of entity</label><br/><span class="objectDetailValue">' + tmpXml.find("entityType").text() + '</span><br/><br/>';
            html += '<label class="objectDetailField">Visual Rapresentation</label><br/><img src="' + tmpXml.find("url").text() + '" class="objectDetailValue"/><br/><br/>';
            html += '<label class="objectDetailField">Visual Rapresentation Ipr</label><br/><span class="objectDetailValue">' + tmpXml.find("visualRepresentationIpr").text() + '</span><br/><br/>';
        }
        html += '</fieldset>';
        return html;
    }

}());