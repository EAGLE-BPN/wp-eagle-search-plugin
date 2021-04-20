jQuery(document).ready(function() {
    jQuery("#advSearch").click(Eagle.solrRequest);
    jQuery("#advSearchReset").click(Eagle.solrRequestReset);
});

var Eagle = {};
(function()
{
    var semaforo = true;
    var wpUrlAjax = "/wp-admin/admin-ajax.php?action=esi_process_ajax_research";
    var wpUrlAjaxObjectDetails = "/wp-admin/admin-ajax.php?action=esi_process_ajax_details_research";
    var wpUrlAjaxSave = "/wp-admin/admin-ajax.php?action=esi_save_ajax_research";
    var wpUrlAjaxDelete = "/wp-admin/admin-ajax.php?action=esi_delete_ajax_research";
//    var wpUrlAjaxObjectSavedDetails = "/wp-admin/admin-ajax.php?action=esi_process_ajax_get_saved";

    Eagle.isSimpleSearch = true;

    var research = "";
    var dnetObjectIdentifier = "";
    var result = null;
    var resultArray = Array();
    var start = 0;
    var numFound = 0;
    var saveState = 0;

    Eagle.restore = function(element) {
        jQuery(element).css("color", "black");
        jQuery(element).css("background-color", "white");
    };

    Eagle.solrRequest = function() {
        if (semaforo) {
            research = checkAndGetFields();
            jQuery.ajax({
                type: 'POST',
                url: wpUrlAjax,
                dataType: 'json',
                data: 'adv_search=' + encodeURIComponent(research),
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
    };

    Eagle.pagination = function(page) {
        if (semaforo) {
            jQuery.ajax({
                type: 'POST',
                url: wpUrlAjax,
                dataType: 'json',
                data: 'adv_search=' + encodeURIComponent(research) + '&page=' + (parseInt(page) * 10),
                beforeSend: function() {
                    semaforo = false;
                    jQuery("#appendResponse").slideUp("fast");
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
                        result = JSON.parse(data.json);
                        var html = jsonParser();
                        var link = '<h4 style="cursor:pointer;" onclick="Eagle.makeANewSearch();">Need a new search? click Here!</h4>';
//                        jQuery("#advS").slideUp("fast");
                        jQuery("#appendResponse").html(link + html);
                        jQuery("#appendResponse").slideDown("fast");
                    }
                }
            });
        }
    };


    Eagle.objectDetails = function(dnetResourceIdentifier) {
        if (semaforo) {
            dnetObjectIdentifier = dnetResourceIdentifier;
            jQuery.ajax({
                type: 'POST',
                url: wpUrlAjaxObjectDetails,
                dataType: 'json',
                data: 'dnetResourceIdentifier=' + encodeURIComponent("(dnetresourceidentifier:\"" + dnetResourceIdentifier + "\")"),
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
                        saveState = 2;
                        result = JSON.parse(data.json);
                        var html = jsonObjectParser();
                        var link = '<h5 style="cursor:pointer;" onclick="Eagle.returnToList();">Return to Object list? click Here!</h5>';
                        jQuery("#appendResponse").slideUp("fast");
                        jQuery("#appendResponseDetails").html(link + html);
                        jQuery("#appendResponseDetails").slideDown("fast");
                    }
                }
            });
        }
    };


    Eagle.returnToList = function() {
        jQuery("#appendResponseDetails").slideUp("fast", function() {
            jQuery("#appendResponseDetails").html("");
            jQuery("#appendResponse").slideDown("fast");
        });
        dnetObjectIdentifier = "";
        saveState = 1;
    };

    Eagle.saveCurrentState = function() {
        var data = checkSave();
        if (data === false)
            return;
        if (semaforo && saveState === 1) {
            saveResearch(data);
        } else if (semaforo && saveState === 2) {
            saveObject(data);
        }
    };

    Eagle.makeANewSearch = function() {
        saveState = 0;
        jQuery("#appendResponse").slideUp("fast", function() {
            jQuery("#appendResponse").html("");
            jQuery("#advS").slideDown("fast");

        });
        jQuery("fieldset#saveForm").slideUp("fast", function() {
            cleanUpSaveForm();
        });
    };

    Eagle.solrRequestReset = function() {
        jQuery("#advS input:text").val("");
        jQuery("#advS input:checkbox").attr("checked", false);
        jQuery("#advS input:radio").removeAttr("checked");
        jQuery("#advS select").val("select");
    };

    Eagle.showSavedElement = function(t_primary_key, type) {
        var obj = {
            't_primary_key': t_primary_key,
            'type': type
        };
        window.location = "/eagle-saved/?script=" + encodeURIComponent(JSON.stringify(obj));
    };

    Eagle.deleteElement = function(tab_id, type) {
        jQuery.ajax({
            type: 'POST',
            url: wpUrlAjaxDelete,
            dataType: 'json',
            data: 'type=' + type + '&tab_id=' + tab_id,
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
                else if (type === "research") {
                    var researchList = jQuery("ul#researchList li");
                    if (researchList.length > 1) {
                        /*Elimino solo il singolo elemento*/
                        jQuery("ul#researchList li#re_" + data.query_id).fadeOut("fast", function() {
                            jQuery("ul#researchList li#re_" + data.query_id).remove();
                        });
                    }
                    else {
                        /*Elimino tutta la struttura del listato*/
                        jQuery("ul#researchList").fadeOut("fast", function() {
                            jQuery("ul#researchList li#re_" + data.query_id).remove();
                            jQuery("ul#researchList").remove();
                            /*Elimino il titolo della sezione*/
                            var strong = jQuery("div#savedElementList strong");
                            for (var i = 0; i < strong.length; i++) {
                                if (jQuery(strong[i]).text() === "Saved Search List") {
                                    jQuery(strong[i]).remove();
                                }
                            }
                            routineNoElementSaved();
                        });
                    }

                } else if (type === "object") {
                    var objectList = jQuery("ul#objectList li");
                    if (objectList.length > 1) {
                        /*Elimino solo il singolo elemento*/
                        jQuery("ul#objectList li#obj_" + data.query_id).fadeOut("fast", function() {
                            jQuery("ul#objectList li#obj_" + data.query_id).remove();
                        });
                    }
                    else {
                        /*Elimino tutta la struttura del listato*/
                        jQuery("ul#objectList").fadeOut("fast", function() {
                            jQuery("ul#objectList li#obj_" + data.query_id).remove();
                            jQuery("ul#objectList").remove();
                            /*Elimino il titolo della sezione*/
                            var strong = jQuery("div#savedElementList strong");
                            for (var i = 0; i < strong.length; i++) {
                                if (jQuery(strong[i]).text() === "Saved Object List") {
                                    jQuery(strong[i]).remove();
                                }
                            }
                            routineNoElementSaved();
                        });
                    }
                }
            }
        });
    };

    function cleanUpSaveForm() {
        jQuery("fieldset#saveForm input[name=save_title]").val("");
        jQuery("fieldset#saveForm textarea[name=save_comment]").val("");
    }

    function routineNoElementSaved() {
        var childs = jQuery("div#savedElementList").children();
        if (childs.length === 0) {
            var accoda = '<p style="display:none;" id="nobsa">No save found!</p>';
            jQuery("div#savedElementList").append(accoda);
            jQuery("div#savedElementList p#nobsa").fadeIn("fast");
        }
    }
    ;

    function saveResearch(data) {
        jQuery.ajax({
            type: 'POST',
            url: wpUrlAjaxSave,
            dataType: 'json',
            data: 'adv_search=' + encodeURIComponent(research) + '&start=' + start + '&page=' + getCurrentPage() + '&title=' + data.title + '&comment=' + data.comment,
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
                    var p = jQuery("#nobsa");
                    cleanUpSaveForm();
                    if (p !== undefined)
                        p.remove();
                    var researchList = jQuery("ul#researchList");
                    if (researchList.length) {
                        /*Se ho già la struttura per listarli*/
                        researchList.prepend('<li id="re_' + data.error + '" ><span onclick="Eagle.showSavedElement(\'' + data.error + ' \',\'research\')"  >' + data.title + '</span><input onclick="Eagle.deleteElement(\'' + data.error + ' \',\'research\');" value="Delete" type="button" /></li>');
                    } else {
                        /*Inserisco elemento e struttura*/
                        jQuery("div#savedElementList").prepend('<strong>Saved Search List</strong><ul id="researchList"><li id="re_' + data.error + '" ><span onclick="Eagle.showSavedElement(\'' + data.error + ' \',\'research\')"  >' + data.title + '</span><input onclick="Eagle.deleteElement(\'' + data.error + ' \',\'research\');" value="Delete" type="button" /></li></ul>');
                    }
                }
            }
        });
    }

    function saveObject(data) {
        jQuery.ajax({
            type: 'POST',
            url: wpUrlAjaxSave,
            dataType: 'json',
            data: 'object=' + encodeURIComponent(dnetObjectIdentifier) + '&title=' + data.title + '&comment=' + data.comment,
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
                    var p = jQuery("#nobsa");
                    cleanUpSaveForm();
                    if (p !== undefined)
                        p.remove();
                    /*Verifico di avere inserito già un oggetto*/
                    var objectList = jQuery("ul#objectList");
                    if (objectList.length) {
                        /*Se ho già la struttura per listarli*/
                        objectList.prepend('<li id="obj_' + data.error + '"><span onclick="Eagle.showSavedElement(\'' + data.error + ' \',\'object\')"  >' + data.title + '</span><input onclick="Eagle.deleteElement(\'' + data.error + ' \',\'object\');" value="Delete" type="button" /></li>');
                    } else {
                        /*Inserisco elemento e struttura*/
                        jQuery("div#savedElementList").append('<strong>Saved Object List</strong><ul id="objectList"><li id="obj_' + data.error + '" ><span onclick="Eagle.showSavedElement(\'' + data.error + ' \',\'object\')"  >' + data.title + '</span><input onclick="Eagle.deleteElement(\'' + data.error + ' \',\'object\');" value="Delete" type="button" /></li></ul>');
                    }
                }
            }
        });
    }

    function jsonParser() {
        var html = '<ul>';
        numFound = result.response.numFound;
        start = result.response.start;
        if (numFound === 0)
            return "<h5>No result found.!</h5>";
        for (var i = 0; i < result.response.docs.length; i++)
        {
            var xmlDoc = jQuery.parseXML(result.response.docs[i].__result[0]);
            var xml = jQuery(xmlDoc);
            var title = xml.find("title").text();
            var entityType = xml.find("entityType").text();
            var dnetResourceIdentifier = jQuery.trim(xml.find("dnetResourceIdentifier").text());
            html += '<li onclick="Eagle.objectDetails(\'' + dnetResourceIdentifier + '\')" >' + title + ' (' + entityType + ')</li>';
//            resultArray[i]=xml;

        }
//        xmlDoc = jQuery.parseXML(result.response.docs[0].__result[0]);
//        var xml = jQuery(xmlDoc);
//        xml.find("numFound");
        var paginationHTML = pagination();
        html += '</ul>';
        return html + paginationHTML;
    }

    function jsonObjectParser() {
        var html = '<fieldset>';
        numFound = result.response.numFound;
        start = result.response.start;
        if (numFound === 0)
            return "<h5>No result found.!</h5>";
        var xmlDoc = jQuery.parseXML(result.response.docs[0].__result[0]);
        var xml = jQuery(xmlDoc);
        if (jQuery.trim(xml.find("entityType").text()) === "Artifact") {
            /*Artifact Parsing*/
            /*Set the title on Legend*/
            html += '<legend>' + xml.find("title").text() + '</legend><br/>';
            /*Set the title Trimegistos ID*/
            html += '<label class="objectDetailField">Trimegistos ID</label><br/><span class="objectDetailValue">' + xml.find("refersTrismegistosCard").attr("tm_id") + '</span><br/><br/>';
            html += '<label class="objectDetailField">Thumbnails of inscription</label><br/><span class="objectDetailValue">Currently Unavaiable</span><br/><br/>';
            html += '<label class="objectDetailField">Type of inscription</label><br/><span class="objectDetailValue">' + xml.find("inscriptionType").text() + '</span><br/><br/>';
            html += '<label class="objectDetailField">Type of object</label><br/><span class="objectDetailValue">Currently Unavaiable</span><br/><br/>';
            html += '<label class="objectDetailField">Material</label><br/><span class="objectDetailValue">' + xml.find("material").text() + '</span><br/><br/>';
            html += '<label class="objectDetailField">Ancient Find Spot</label><br/><span class="objectDetailValue">' + xml.find("ancientFindSpot").text() + '</span><br/><br/>';
            html += '<label class="objectDetailField">Current Location</label><br/><span class="objectDetailValue">' + xml.find("conservationCountry").text() + ' : ' + xml.find("conservationRegion").text() + '</span><br/><br/>';
            html += '<label class="objectDetailField">Text</label><br/><span class="objectDetailValue">Currently Unavaiable</span><br/><br/>';
            html += '<label class="objectDetailField">Date</label><br/><span class="objectDetailValue">' + xml.find("originDating").text() + '</span><br/><br/>';
            html += '<label class="objectDetailField">Bibliografy</label><br/><span class="objectDetailValue">Currently Unavaiable</span><br/><br/>';
            html += '<label class="objectDetailField">Content Provider</label><br/><span class="objectDetailValue">' + xml.find("recordSourceInfo").attr("providerName") + '</span><br/><a target="_blank" href="' + xml.find("recordSourceInfo").text() + '">' + xml.find("recordSourceInfo").text() + '</a>';
        } else if (jQuery.trim(xml.find("entityType").text()) === "Documental manifestation") {
            /*Documental Manifestation Parsing*/
            /*Set the title on Legend*/
            html += '<legend>' + xml.find("title").text() + '</legend><br/>';
            /*Set the title Trimegistos ID*/
            html += '<label class="objectDetailField">Type of entity</label><br/><span class="objectDetailValue">' + xml.find("entityType").text() + '</span><br/><br/>';
            html += '<label class="objectDetailField">Type of document</label><br/><span class="objectDetailValue">' + xml.find("documentType").text() + '</span><br/><br/>';
            html += '<label class="objectDetailField">Transcription</label><br/><span class="objectDetailValue">' + xml.find("text").text() + '</span><br/><br/>';
            var bibliografy = jQuery(xml.find("bibliography"));
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
            html += '<label class="objectDetailField">Comment</label><br/><span class="objectDetailValue">' + xml.find("commentary").text() + '</span><br/><br/>';
        }
        else if (jQuery.trim(xml.find("entityType").text()) === "Visual representation") {
            /*Visual Rapresentation Parsing*/
            /*Set the title on Legend*/
            html += '<legend>' + xml.find("title").text() + '</legend><br/>';
            /*Set the title Trimegistos ID*/
            html += '<label class="objectDetailField">Type of entity</label><br/><span class="objectDetailValue">' + xml.find("entityType").text() + '</span><br/><br/>';
            html += '<label class="objectDetailField">Visual Rapresentation</label><br/><img src="' + xml.find("url").text() + '" class="objectDetailValue"/><br/><br/>';
            html += '<label class="objectDetailField">Visual Rapresentation Ipr</label><br/><span class="objectDetailValue">' + xml.find("visualRepresentationIpr").text() + '</span><br/><br/>';
        }
        html += '</fieldset>';
        return html;
    }

    function pagination() {
        var pagination = '<div class="mypagination">';
        var startPage = (0 > parseInt(getCurrentPage() - 5)) ? 0 : parseInt(getCurrentPage() - 5);
        var pageNumber = (numFound % 10 !== 0) ? (parseInt(numFound / 10) + 1) : (parseInt(numFound) / 10);
        var stopPage = (parseInt(pageNumber) < parseInt(getCurrentPage()) + 5) ? parseInt(pageNumber) : parseInt(getCurrentPage()) + 5;
        if (startPage > 0)
            pagination += '<span style="cursor:pointer;" onclick="Eagle.pagination(' + (getCurrentPage() - 1) + ')" >Prev</span>';
        for (var index = startPage; index < stopPage; index++) {
            pagination += (index === getCurrentPage()) ? '<span style="color:blue;">' + index + '</span>' : '<span style="cursor:pointer;" onclick="Eagle.pagination(' + index + ')" >' + index + '</span>';
        }
        if (pageNumber > getCurrentPage())
            pagination += '<span style="cursor:pointer;" onclick="Eagle.pagination(' + (getCurrentPage() + 1) + ')" >Next</span>';
        pagination += '</div>';
        return pagination;
    }

    function getCurrentPage() {
        return (start % 10 > 0) ? parseInt(start / 10) + 1 : parseInt(start / 10);
    }

    function checkSave() {
        var msg = "ATTENTION !! \n";
        var title = jQuery.trim(jQuery("#saveForm input[name=save_title]").val());
        var comment = jQuery.trim(jQuery("#saveForm textarea[name=save_comment]").val());
        if (title === "") {
            msg += "You must to specify a save title !!\n";
            jQuery("#saveForm input[name=save_title]").css("bacground-color", "red");
            jQuery("#saveForm input[name=save_title]").css("color", "white");
            alert(msg);
            jQuery("#saveForm input[name=save_title]").focus();
            return false;
        }
        return {"title": title, "comment": comment};

    }

    function checkAndGetFields() {
        var myresearch = '';
        if (!Eagle.isSimpleSearch) {
            var inscriptiontext = jQuery.trim(jQuery("#advS input:text[name=inscriptiontext]").val());
            var inscriptiontext_not_bool = jQuery("#advS input:checkbox[name=inscriptiontext_not_bool]").is(':checked');
            var inscriptiontext_cond = jQuery("#advS input:radio[name=inscriptiontext_cond]").is(':checked');
            if (inscriptiontext !== "") {
                myresearch += (inscriptiontext_not_bool === true) ? '-(inscriptiontext:"' + inscriptiontext + '")' : '(inscriptiontext:"' + inscriptiontext + '")';
            }
            if (inscriptiontext_cond === true) {
                myresearch += jQuery("#advS input:radio[name=inscriptiontext_cond]:checked").val();
            }

            var entitytype = jQuery.trim(jQuery("#advS select[name=entitytype] option:selected").val());
            var entitytype_not_bool = jQuery("#advS input:checkbox[name=entitytype_not_bool]").is(':checked');
            var entitytype_cond = jQuery("#advS input:radio[name=entitytype_cond]").is(':checked');
            if (entitytype !== "select") {
                myresearch += (entitytype_not_bool === true) ? '-(entitytype:"' + entitytype + '")' : '(entitytype:"' + entitytype + '")';
            }
            if (entitytype_cond === true) {
                myresearch += jQuery("#advS input:radio[name=entitytype_cond]:checked").val();
            }

            var inscriptiontype = jQuery.trim(jQuery("#advS select[name=inscriptiontype] option:selected").val());
            var inscriptiontype_not_bool = jQuery("#advS input:checkbox[name=inscriptiontype_not_bool]").is(':checked');
            if (inscriptiontype !== "select") {
                myresearch += (inscriptiontype_not_bool === true) ? '-(inscriptiontype:"' + inscriptiontype + '")' : '(inscriptiontype:"' + inscriptiontype + '")';
            }
        } else {
            myresearch = jQuery.trim(jQuery("#advS input:text[name=mysearch]").val());
        }
        return myresearch;
    }

}());