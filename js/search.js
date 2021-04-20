window.mobilecheck = function () {
    var check = false;
    (function (a, b) {
//        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
//            check = true;
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            check = true;
        }
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
}

jQuery(document).ready(function () {
    if (!mobilecheck()) {
        if (typeof history.pushState === "function") {
            history.pushState("jibberish", null, null);
//            window.onpopstate = function () {
//                Search.checkAndGoBack();
//                // Handle the back (or forward) buttons here
//                // Will NOT handle refresh, use onbeforeunload for this.
//            };
            window.addEventListener('popstate', function (event) {
                if (event.state) {
                    Search.checkAndGoBack();
                }
            }, false);
        } else {
            var ignoreHashChange = true;
            window.onhashchange = function () {
                if (!ignoreHashChange) {
                    ignoreHashChange = true;
                    window.location.hash = Math.random();
                    // Detect and redirect change here
                    // Works in older FF and IE9
                    // * it does mess with your hash symbol (anchor?) pound sign
                    // delimiter on the end of the URL
                } else {
                    ignoreHashChange = false;
                }
            };
        }
    }
    jQuery('.fancybox').fancybox();
    jQuery('body').append('<div id="loaderc"><div id="loader">&nbsp;</div></div>');

    jQuery('#bookmark-this').click(Search.bookmarmkMe);

});



function isValidURL(url) {
    var encodedURL = encodeURIComponent(url);
    var isValid = false;

    var ajax = new XMLHttpRequest();
    jQuery.ajax({
        url: "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22" + encodedURL + "%22&format=json",
        type: "get",
        async: false,
        dataType: "json",
        success: function (data) {
            isValid = data.query.results != null;
        },
        error: function () {
            isValid = false;
        }
    });
    return isValid;
}


function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}
function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}


function replaceArray(str) {

//var find =  ["\\", "+", "-", "&", "|", "!", "(", ")", "{", "}", "[", "]", "^", "~", "*", "?", ":", ";"];
//var replace =  ["\\\\", "\\+", "\\-", "\\&", "\\|", "\\!", "\\(", "\\)", "\\{", "\\}", "\\[", "\\]", "\\^", "\\~", "\\*", "\\?", "\\:", "\\;"];

    var find = ["\\", "+", "-", "&", "|", "!", "(", ")", "{", "}", "[", "]", "^", "~",  "?", ":", ";"];
    var replace = ["\\\\", "\\+", "\\-", "\\&", "\\|", "\\!", "\\(", "\\)", "\\{", "\\}", "\\[", "\\]", "\\^", "\\~", "\\?", "\\:", "\\;"];

  for (var i = 0; i < find.length; i++) {
    str = replaceAll(str,find[i], replace[i]);
  }
//str =  encodeURIComponent(str);
return str;
}

    function getSubStr(AllStr) {
        //var result = '';
	//$countquote= substr_count($AllStr, '"');
	AllStr=AllStr.trim();
	var retstr='';
	var strret='';
	//if ($countquote % 2 == 0)
	//{
		var arr = AllStr.split(" ");
		var quoted=0;
		for (i=0 ; i < arr.length; i++)
		{
		var strret = arr[i];

		switch (arr[i])
			{
		    case "OR":
		    case "AND":
		       retstr += arr[i]+" ";
		        break;
		    default:
		        if (arr[i].indexOf('"')>-1)
		       	{
		       		retstr+= arr[i]+" ";
		       		quoted +=1;
		       	}
		       	else
		       	{
		       		if (arr[i].indexOf('"')>-1)
		       		{
		       		quoted +=1;
		       		retstr += arr[i]+" ";
		       		}
		       		else
		       		{
		       		if (quoted % 2 === 0)
		       		{
		       		retstr += "*"+arr[i]+"*"+" ";
		       		}
		       		else
		       		{
		       		retstr += arr[$i]+" ";
		       		}
		       		}
		       	}
			}
		}
	//}
//	alert(retstr);
	retstr=retstr.trim();
	retstr=replaceArray(retstr);
//      retstr= encodeURIComponent(retstr);
        retstr= "(" + retstr + ")";
       
        return retstr
    }


var Search = {};
(function ()
{
    var oldEntity = "artifact";
    var asyncForceState = null;
    var firstTimeOnArcList = true;
    var state = 0;
    var Fdata = null;
    var semaforo = true;
    var animating = false;
    var over = false;
    var wpUrlSearchAjax = "/wp-admin/admin-ajax.php?action=esi_process_ajax_research";
    var wpUrlGeneratePdf = "/wp-admin/admin-ajax.php?action=esi_generate_pdf";
    var wpUrlGenerateCsv = "/wp-admin/admin-ajax.php?action=esi_generate_csv";
    var wpUrlSaveAjax = "/wp-admin/admin-ajax.php?action=esi_save_ajax_research";
    var wpUrlGetFieldsAjax = "/wp-admin/admin-ajax.php?action=esi_field_ajax_request";
    var wpUrlGetFacetsAjax = "/wp-admin/admin-ajax.php?action=esi_facet_ajax_request";
    var wpUrlArchivesAjax = "/wp-admin/admin-ajax.php?action=esi_process_archive_action";
    var wpUrlAjaxLoginCheck = "/wp-admin/admin-ajax.php?action=esi_login_check";
    var wpUrlFmaSync = "/wp-admin/admin-ajax.php?action=esi_fma_sync";
    var wpUrlFmaDeleteAll="/wp-admin/admin-ajax.php?action=esi_fma_delete_all";
    var keyboardSourceURLAction = '/wp-admin/admin-ajax.php?action=esi_mk_keyboard';
    //var wpUrlExportAjax = "/wp-admin/admin-ajax.php?action=esi_getepidoc";
    var wpUrlDnetResourceIDSearchAjax = "/wp-admin/admin-ajax.php?action=esi_object_from_dnetresourceid";
    var wpUrlImageSearchAjax = "/wp-admin/admin-ajax.php?action=esi_image_search";
    var wpUrlSimilaritySaveAjax = "/wp-admin/admin-ajax.php?action=esi_similarity_save_ajax_research";


    var registerFields = {};
    var registerErrors = {};

    var wpUrlAjaxRegister = "/wp-admin/admin-ajax.php?action=esi_ajax_registration";

    var EDR_MATCH_CONDITIONS = new Array('Sardinia', 'Sicilia', 'Melita', 'Latium', 'Roma', ' Campania', 'Regio I', 'Apulia', 'Calabria', 'Regio II', 'Bruttium', 'Lucania', 'Regio III', 'Samnium', 'Regio IV', 'Picenum', 'Regio V', 'Umbria', 'Regio VI', 'Etruria', 'Regio VII', 'Aemilia', 'Regio VIII', 'Liguria', 'Regio IX', 'Venetia', 'Histria', 'Regio X', 'Transpadana', 'Regio XI');
    var OTHER_MATCH_CONDITIONS = new Array('hispania', 'Baetica', 'Lusitania', 'Hispania', 'citerior');

    var menu = new Array(
            {"label": "TEXT", "selected": false, "entity": "documental"},
            {"label": "IMAGES", "selected": false, "entity": "visual"},
            {"label": "ARTEFACTS", "selected": true, "entity": "artifact"}
    );

    var fbox = null;
    var view = "";
    var archivesView = "";
    var archivesDom = null;
    var archiveElement = null;
    var archiveType = "";
    var archiveTableId = "";
    var sidebarState = 1;

    var searchType = 0; /*0:Simple; 1:Advanced; 2:Similarity*/

    var advFields = {};
    var allowedAdvFields = {};
    var artifactSelectedCol = -1;
    var artifactSelectedRow = -1;
    var research = "";
    var lastResponse = "";
    var facetFilter = "";
    var imageSearchResponse = "";

    var entity = "artifact";
    var page = 0;
    var lastPage = 0;
    var hasTmidList = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0);

    var fboxTranslation = "";
    var fboxBibliography = "";
    var fboxSuggestion = "";
    var selectedLangiso = null;
    var key = null;
    var _fn = encodeURIComponent;

    jQuery(document).ready(function () {

        key = new MK_KEYBOARD('input[type=text],textarea', '.keySwitcher', keyboardSourceURLAction);

    });

    // var additionalAdvFields = {};
    Search.advFieldCache = {};
    Search.advFacetCache = {};

    Search.showTranslation = function () {
        jQuery.fancybox(fboxTranslation);
        return false;
    };

     Search.showHelp = function () {
     var fboxHelp='<b>Note that if you enter more terms in this text field the convention used by the EAGLE Search Engine is the following:</b><ul>';
     fboxHelp += '<li> parentibus AND suis matches inscriptions that contain both "parentibus" and "suis"'
     fboxHelp += '<li> parentibus OR suis matches inscriptions that contain either "parentibus" or "suis"'
     fboxHelp += '<li> "parentibus suis" matches inscriptions that contain the exact string, with words in that order'
     fboxHelp += '<li> parentibus -suis matches inscriptions that contain "parentius", but do not contain "suis"'
     fboxHelp += '</ul><b>  If you simply enter parentibus suis, the default behaviour is to interpret this as parentibus AND suis.</b>'
     
     fboxHelp = '<div id="tinline" >' + fboxHelp +'</div>' 

     
         jQuery.fancybox(fboxHelp);
         return false;
    };

    Search.showSuggestion = function () {
        jQuery.fancybox(fboxSuggestion);
        return false;
    };

    Search.showBibliography = function () {
        jQuery.fancybox(fboxBibliography);
        return false;
    };

    Search.restore = function (element) {
        jQuery(element).css("color", "black");
        jQuery(element).css("background-color", "white");
    };

    Search.resetValue = function (element) {
        if (element !== undefined) {
            jQuery(element).removeAttr("onclick");
            jQuery(element).val("");
        } else {
            jQuery("#mysearch").removeAttr("onclick");
            jQuery("#mysearch").val("");
        }
    };

    Search.resetAdvTextarea = function (element) {
        jQuery(element).css("background-color", "#FFFFFF");
        //jQuery(element).html("");
    };

    Search.resetAdvText = function (element) {
        //jQuery(element).val("");
    };

    Search.bookmarmkMe = function () {
        var bookmarkTitle = document.title;

        var uri = 'query=' + research + '&page=' + page + '&entity=' + entity + '&facet=' + facetFilter + '&artifactSelectedRow=' + artifactSelectedRow + '&artifactSelectedCol=' + artifactSelectedCol;
        if (!isEmpty(advFields)) {
            uri += '&fields=' + JSON.stringify(advFields);
        }

// nicola per farlo funzionare in locale
       // var urlArray = window.location.href.split('/', 5);
       // bookmarkURL = urlArray[0] + '//' + urlArray[2] + '/' + urlArray[3] + '/' + urlArray[4]+ '/' + encodeURIComponent(uri);
       
       
       var urlArray = window.location.href.split('/', 4);
       bookmarkURL = urlArray[0] + '//' + urlArray[2] + '/' + urlArray[3] + '/' + encodeURIComponent(uri);

//        if ('addToHomescreen' in window && window.addToHomescreen.isCompatible) {
//            addToHomescreen({autostart: false, startDelay: 0}).show(true);
//        } else if (window.sidebar && window.sidebar.addPanel) {
//            window.sidebar.addPanel(bookmarkTitle, bookmarkURL, '');
//        } else if ((window.sidebar && /Firefox/i.test(navigator.userAgent)) || (window.opera && window.print)) {
//            jQuery(this).attr({
//                href: bookmarkURL,
//                title: bookmarkTitle,
//                rel: 'sidebar'
//            }).off(e);
//            return true;
//        } else if (window.external && ('AddFavorite' in window.external)) {
//            window.external.AddFavorite(bookmarkURL, bookmarkTitle);
//        } else {
        //window.location.href = (bookmarkURL);
        window.open(bookmarkURL);
//        }

        return false;
    };
    
    Search.bookmarkPreloadArtifact = function (row, col) {
        /*Check for has Resource Correlated*/
        if (hasTmidList[row] !== 0) {
            Search.queryCorrelatedDnetResourceList(new Array(), row, col);
        } else {
            var resourceToAsk = getCorrelatedDnetResourceList(row);
            Search.queryCorrelatedDnetResourceList(resourceToAsk, row, col);
        }
    };

    Search.bookmarkSimple = function (bresearch, bpage, bentity, bfacet, bartifactSelectedRow, bartifactSelectedCol, badvFields) {
        artifactSelectedRow = parseInt(bartifactSelectedRow);
        artifactSelectedCol = parseInt(bartifactSelectedCol);
        research = bresearch;
        page = bpage;
        entity = bentity;
       
        facetFilter = decodeURI(bfacet);
        searchType = 0;
        jQuery('#loaderc').css('height', jQuery(window).height() + 'px');
        jQuery('#loader').css('margin-top', (jQuery(window).height() / 2) - 50 + 'px');
        jQuery('#loader').css('margin-left', (jQuery(window).width() / 2) - 50 + 'px');
        jQuery('#loaderc').fadeIn('fast');
        if (typeof badvFields !== 'undefined') {
            advFields = JSON.parse(decodeURIComponent(badvFields));
            Search.relSearchMki();
        } else {
            Search.simpleBookmarkSearch();
        }
    };



    Search.simpleBookmarkSearch = function () {
        jQuery.ajax({
            type: 'POST',
            url: wpUrlSearchAjax,
            dataType: 'json',
            data: 'query=' + encodeURIComponent(research) + '&page=' + page + '&entity=' + entity + '&facet=' + facetFilter,
            beforeSend: function () {
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if (jqXHR.status == 500) {
                    alert('Search engine temporary down for maintenance. Please try again later. Apologies for the inconvenience');
                } else {
                    alert('Error parsing you request!\nPlease report this bug at https://github.com/EAGLE-BPN/Inscription-Search-Engine');
                }
                jQuery('#loaderc').fadeOut('fast');
            },
            success: function (data) {
                jQuery('#loaderc').fadeOut('fast');
                if (data.grouped.tmid.groups.length === 0) {
                    alert("No results found!!");
                    research = "";
                    entity = "artifact";
                    return;
                }
                lastResponse = data;
                createSidebarFacet(data.facet_counts.facet_fields);
                Search.slideInSidebar();
                afterSimpleSearchShow();
                jQuery(".mysearchdiv").html("");
                jQuery(".mysearchdiv").append(htmlMenu(entity));
                jQuery(".mysearchdiv").append(htmlContent());
                if (entity === "visual")
                    setTimeout(imageVisualResize, "1000");
                else
                    setTimeout(imageListResize, "1000");
                jQuery(".mysearchdiv").append(pagination());
                jQuery("#mysearch-left").val(research);

                if (artifactSelectedRow != -1 && artifactSelectedCol != -1) {
                    Search.bookmarkPreloadArtifact(artifactSelectedRow, artifactSelectedCol);
                }

                key.destroy();
                key = new MK_KEYBOARD('#mysearch-left', '.keySwitcherSidebarBasic', keyboardSourceURLAction);

            }
        });

    };

    Search.bookmarkAdvanced = function (bresearch, badvFields, bpage, bentity,  bartifactSelectedRow, bartifactSelectedCol,bfacet) {
        artifactSelectedRow = parseInt(bartifactSelectedRow);
        artifactSelectedCol = parseInt(bartifactSelectedCol);

        research = bresearch;
        advFields = JSON.parse(decodeURIComponent(badvFields));
        // advFields = {};
        page = bpage;
        entity = bentity;
        facetFilter = decodeURI(bfacet);
        searchType = 0;
        jQuery('#loaderc').css('height', jQuery(window).height() + 'px');
        jQuery('#loader').css('margin-top', (jQuery(window).height() / 2) - 50 + 'px');
        jQuery('#loader').css('margin-left', (jQuery(window).width() / 2) - 50 + 'px');
        jQuery('#loaderc').fadeIn('fast');
        Search.advancedBookmarkSearch();
    };

    Search.advancedBookmarkSearch = function () {
        searchType = 1;
        research = "*";
        entity = "artifact";
        jQuery.ajax({
            type: 'POST',
            url: wpUrlSearchAjax,
            dataType: 'json',
            data: 'query=' + encodeURIComponent(research) + '&fields=' + JSON.stringify(advFields) + '&page=' + page + '&entity=' + entity + '&facet=' + facetFilter,
            beforeSend: function () {

            },
            error: function (jqXHR, textStatus, errorThrown) {

                if (jqXHR.status == 500) {
                    alert('Search engine temporary down for maintenance. Please try again later. Apologies for the inconvenience');
                } else {
                    alert('Error parsing you request!\nPlease report this bug at https://github.com/EAGLE-BPN/Inscription-Search-Engine');
                }
                jQuery('#loaderc').fadeOut('fast');
            },
            success: function (data) {
                jQuery('#loaderc').fadeOut('fast');
                if (data.grouped.tmid.groups.length === 0) {
                    alert("No results found!!");
                    research = "";
                    searchType = 0;
                    entity = "artifact";
                    return;
                }
                jQuery(".side-adv-research").html("");

                prepareSidebar();
                createSidebarFacet(data.facet_counts.facet_fields);
//                    jQuery("#adv1").slideUp('fast', function () {
//                       jQuery("#adv2").slideDown('fast'); 
//                    });

                jQuery("#adv2").slideDown('fast');

                lastResponse = data;
                jQuery(".mysearchdiv").html("");
                jQuery(".mysearchdiv").append(htmlMenuAdv(entity));
                jQuery(".mysearchdiv").append(htmlContent());
                setTimeout(imageListResize, "1000");
                jQuery(".mysearchdiv").append(pagination());

                jQuery('.keySwitcher').each(function () {
                    var $iterElement = jQuery(this);
                    $iterElement.prop("checked", false);
                });

                if (artifactSelectedRow != -1 && artifactSelectedCol != -1) {
                    Search.bookmarkPreloadArtifact(artifactSelectedRow, artifactSelectedCol);
                }

                key.destroy();
                key = new MK_KEYBOARD('.side-adv-research input[type=text],.side-adv-research textarea', '.keySwitcher', keyboardSourceURLAction);

            }
        });

    };

    Search.simpleSearch = function (evt, newtype) {
        var e = window.event || evt;
	        if (e.event) // IE
	        {
	            var keynum = e.keyCode
	        } else if (e.which) // Netscape/Firefox/Opera
	        {
	            var keynum = e.which
	        }
	
	        if (e.type === 'keydown' && keynum !== 13)
           {
           return;
           }
           else
           {
       // if (keynum === 13 && semaforo) {
            canonicalReset();
            searchType = 0;
            entity = jQuery.trim(newtype);
            research = jQuery.trim(jQuery("#mysearch").val());
            if (research === "")
            {    research = "*";
            }else
            {
            var ckstring = document.getElementById('ckstring');
            if (ckstring.checked) {
               research= getSubStr(research);
            }
            else
            {
             research= replaceArray(research);
            
            }
            }

            jQuery.ajax({
                type: 'POST',
                url: wpUrlSearchAjax,
                dataType: 'json',
                data: 'query=' + encodeURIComponent(research) + '&page=' + page + '&entity=' + entity,
                beforeSend: function () {
                    jQuery('#loaderc').css('height', jQuery(window).height() + 'px');
                    jQuery('#loader').css('margin-top', (jQuery(window).height() / 2) - 50 + 'px');
                    jQuery('#loader').css('margin-left', (jQuery(window).width() / 2) - 50 + 'px');
                    jQuery('#loaderc').fadeIn('fast');
                    semaforo = false;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    semaforo = true;

                    if (jqXHR.status == 500) {
                        alert('Search engine temporary down for maintenance. Please try again later. Apologies for the inconvenience');
                    } else {
                        alert('Error parsing you request!\nPlease report this bug at https://github.com/EAGLE-BPN/Inscription-Search-Engine');
                    }
                    jQuery('#loaderc').fadeOut('fast');
                },
                success: function (data) {
                    jQuery('#loaderc').fadeOut('fast');
                    semaforo = true;
                    if (data.grouped.tmid.groups.length === 0) {
                        alert("No results found!!");
                        //window.location.href ='http://localhost:8080/search-down/';

                        research = "";
                        entity = "artifact";
                        return;
                    }
                    state = 1;
                    lastResponse = data;
                    createSidebarFacet(data.facet_counts.facet_fields);
                    Search.slideInSidebar();
                    afterSimpleSearchShow();
                    jQuery(".mysearchdiv").html("");
                    jQuery(".mysearchdiv").append(htmlMenu(entity));
                    jQuery(".mysearchdiv").append(htmlContent());
                    setTimeout(imageListResize, "1000");
                    jQuery(".mysearchdiv").append(pagination());
                    jQuery("#mysearch-left").val(research);

                    key.destroy();
                    key = new MK_KEYBOARD('#mysearch-left', '.keySwitcherSidebarBasic', keyboardSourceURLAction);

                }
            });
        }
    };

    Search.richLightBox = function () {
        jQuery('div.galleryFotoC a img').each(function () {
            var $img = jQuery(this);
            //var datas = jQuery.trim($img.data('dnetid'));
            //            var $lightbox = jQuery('div#lightbox');
            //$lightbox.append('<div id="extraLightboxActions" class="lb-dataContainer"><button onclick="Search.searchSimilarByID(\'' + datas + '\');" class="btn">Search for similar images</button></div>');

            $img.click(function () {
                var $myimg = jQuery(this);
                var datas = jQuery.trim($myimg.data('dnetid'));
                jQuery('div#extraLightboxActions').remove();
                var $lightbox = jQuery('div#lightbox');
                $lightbox.append('<div id="extraLightboxActions" class="lb-dataContainer"><button onclick="Search.searchSimilarByID(\'' + datas + '\');" class="btn">Search for similar images</button></div>');
                //$img.data('dnetId');
            });
        });

    };


    Search.relatedLightBox = function () {
        jQuery('div#relatedsearch').show();
        //toggle();
        //jQuery(window).scrollTop(3000);
    };



    Search.closerelatedLightBox = function () {
        jQuery('div#relatedsearch').hide();
    };



    Search.searchSimilarByID = function (dnetResourceId) {
        if (semaforo)
            jQuery.ajax({
                type: 'POST',
                url: wpUrlImageSearchAjax,
                dataType: 'json',
                data: 'dnetResurceIdentifierById=' + dnetResourceId,
                beforeSend: function () {
                    jQuery('div#lightbox a.lb-close').trigger('click');

                    jQuery('#loaderc').css('height', jQuery(window).height() + 'px');
                    jQuery('#loader').css('margin-top', (jQuery(window).height() / 2) - 50 + 'px');
                    jQuery('#loader').css('margin-left', (jQuery(window).width() / 2) - 50 + 'px');
                    jQuery('#loaderc').fadeIn('fast');
                    semaforo = false;

                },
                error: function (jqXHR, textStatus, errorThrown) {
                    semaforo = true;

                    if (jqXHR.status == 500) {
                        alert('Search engine temporary down for maintenance. Please try again later. Apologies for the inconvenience');
                    } else {
                        alert('Error parsing you request!\nPlease report this bug at https://github.com/EAGLE-BPN/Inscription-Search-Engine');
                    }
                    jQuery('#loaderc').fadeOut('fast');
                },
                success: function (data) {
                    semaforo = true;
                    jQuery('#loaderc').fadeOut('fast', function () {
                        if (data.error)
                            alert(data.msg);
                        else {
                            imageSearchResponse = data.results;
                            Search.slideInSidebar();
                            jQuery(".mysearchdiv").html("");
                            //jQuery(".mysearchdiv").append(htmlMenu(entity));
                            jQuery(".mysearchdiv").append(drawImageSearch(data.results));
                            setTimeout(imageVisualResize, "1000");
                        }
                    });

                    searchType = 2;
                }
            });
    };

    Search.simpleSearchLeft = function (event) {
        var e = event || window.event;
        if (e.event) // IE
        {
            var keynum = e.keyCode
        } else if (e.which) // Netscape/Firefox/Opera
        {
            var keynum = e.which
        }


        if (e.type === 'keydown' && keynum !== 13)
            return;
        research = jQuery.trim(jQuery("#mysearch-left").val());
        if (research === "")
        {
         research = "*";
	}
	else
	{
	 research= replaceArray(research);
	}

        /*Aggiungo i filtri e chiamo searchCtype*/
        var myUlList = jQuery("ul.localFacetUl");
        var and = true;
        facetFilter = '';
        for (var i = 0; i < myUlList.length; i++) {
            jQuery(myUlList[i]).find("input:checked").each(function (index, element) {
                if (and) {
                    facetFilter += 'AND(';
                    and = false;
                }
                if (index > 0) {
                    facetFilter += 'OR';
                }
                var mytemp = jQuery(element);
                facetFilter += '(' + mytemp.attr("data") + ':"' + mytemp.val() + '")';
            });
            /*chiudo l'AND*/
            if (!and) {
                facetFilter += ')';
                and = true;
            }
        }
        page = 0;
        Search.simpleSearchCtype(entity);
    };


    Search.searchByImage = function () {
        Fdata = new FormData();
        jQuery.each(jQuery('#img_search')[0].files, function (i, file) {
            Fdata.append('image', file);
        });

        if (semaforo)
            jQuery.ajax({
                type: 'POST',
                cache: false,
                contentType: false,
                processData: false,
                url: wpUrlImageSearchAjax,
                dataType: 'json',
                data: Fdata,
                beforeSend: function () {
                    jQuery('#loaderc').css('height', jQuery(window).height() + 'px');
                    jQuery('#loader').css('margin-top', (jQuery(window).height() / 2) - 50 + 'px');
                    jQuery('#loader').css('margin-left', (jQuery(window).width() / 2) - 50 + 'px');
                    jQuery('#loaderc').fadeIn('fast');
                    semaforo = false;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    semaforo = true;

                    if (jqXHR.status == 500) {
                        alert('Search engine temporary down for maintenance. Please try again later. Apologies for the inconvenience');
                    } else {
                        alert('Error parsing you request!\nPlease report this bug at https://github.com/EAGLE-BPN/Inscription-Search-Engine');
                    }
                    jQuery('#loaderc').fadeOut('fast');
                },
                success: function (data) {
                    semaforo = true;
                    jQuery('#loaderc').fadeOut('fast');
                    if (data.error)
                        alert(data.msg);
                    else {
                        imageSearchResponse = data.results;
                        Search.slideInSidebar();
                        jQuery(".mysearchdiv").html("");
                        // jQuery(".mysearchdiv").append(htmlMenu(entity));
                        jQuery(".mysearchdiv").append(drawImageSearch(data.results));
                        setTimeout(imageVisualResize, "1000");
                    }
                    searchType = 2;
                }
            });
    };

    Search.showArtifactExtraInfoFromImageSearch = function (index) {
        if (semaforo)
            jQuery.ajax({
                type: 'POST',
//                cache: false,
//                contentType: false,
//                processData: false,
                url: wpUrlImageSearchAjax,
                dataType: 'json',
                data: 'dnetResurceIdentifier=' + imageSearchResponse[index].id[0],
                beforeSend: function () {
                    jQuery('#loaderc').css('height', jQuery(window).height() + 'px');
                    jQuery('#loader').css('margin-top', (jQuery(window).height() / 2) - 50 + 'px');
                    jQuery('#loader').css('margin-left', (jQuery(window).width() / 2) - 50 + 'px');
                    jQuery('#loaderc').fadeIn('fast');
                    semaforo = false;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    semaforo = true;

                    if (jqXHR.status == 500) {
                        alert('Search engine temporary down for maintenance. Please try again later. Apologies for the inconvenience');
                    } else {
                        alert('Error parsing you request!\nPlease report this bug at https://github.com/EAGLE-BPN/Inscription-Search-Engine');
                    }
                    jQuery('#loaderc').fadeOut('fast');
                },
                success: function (data) {
                    semaforo = true;
                    jQuery('#loaderc').fadeOut('fast');
                    if (data.error)
                        alert(data.msg);
                    else {
                        var html = getHtmlFromStringData(data.results[0]);
                        jQuery(".mysearchdiv").html("");
                        jQuery(".mysearchdiv").append(html);
                        jQuery("h1.search_help a").attr("href", "http://www.eagle-network.eu/inscriptions-search-engine-online-manual#SearchByImage");

                    }
                    //  Search.richLightBox();
                }
            });
    };


    Search.generateCSV = function () {
        var request = '';
        if (isSimpleSearch()) {
            request = 'query=' + encodeURIComponent(research) + '&page=' + page + '&entity=' + entity + '&facet=' + facetFilter;
        } else if (isAdvancedSearch()) {
            request = 'query=' + encodeURIComponent(research) + '&fields=' + JSON.stringify(advFields) + '&page=' + page + '&entity=' + entity + '&facet=' + facetFilter;
        } else {
            alert('Error. You could export CSV data only from Simple or Advanced search!');
            return;
        }

        if (semaforo) {
            jQuery.ajax({
                type: 'POST',
                url: wpUrlGenerateCsv,
                dataType: 'json',
                data: request,
                beforeSend: function () {
                    jQuery('#loaderc').css('height', jQuery(window).height() + 'px');
                    jQuery('#loader').css('margin-top', (jQuery(window).height() / 2) - 50 + 'px');
                    jQuery('#loader').css('margin-left', (jQuery(window).width() / 2) - 50 + 'px');
                    jQuery('#loaderc').fadeIn('fast');
                    semaforo = false;
                },
                error: function () {
                    semaforo = true;
                    alert('Error parsing you request!\nPlease report this bug at https://github.com/EAGLE-BPN/Inscription-Search-Engine');
                    jQuery('#loaderc').fadeOut('fast');
                },
                success: function (data) {
                    jQuery('#loaderc').fadeOut('fast');
                    semaforo = true;
                    if (data.error)
                        alert(data.msg);
                    else {
                        window.open(data.redirect, '_blank');
                    }
                }
            });
        }
    };



    Search.generatePDF = function () {
        var DOM = getPageHTML();
        if (semaforo)
            jQuery.ajax({
                type: 'POST',
                url: wpUrlGeneratePdf,
                dataType: 'json',
                data: 'dom_string=' + b64EncodeUnicode(DOM),
                beforeSend: function () {
                    jQuery('#loaderc').css('height', jQuery(window).height() + 'px');
                    jQuery('#loader').css('margin-top', (jQuery(window).height() / 2) - 50 + 'px');
                    jQuery('#loader').css('margin-left', (jQuery(window).width() / 2) - 50 + 'px');
                    jQuery('#loaderc').fadeIn('fast');
                    semaforo = false;
                },
                error: function () {
                    semaforo = true;
                    alert('Error parsing you request!\nPlease report this bug at https://github.com/EAGLE-BPN/Inscription-Search-Engine');
                    jQuery('#loaderc').fadeOut('fast');
                },
                success: function (data) {
                    semaforo = true;
                    jQuery('#loaderc').fadeOut('fast');
                    if (data.error)
                        alert(data.msg);
                    else {
                        window.open(data.redirect, '_blank');
                    }
                }
            });
        return false;
    };

    function b64EncodeUnicode(str) {
        return btoa(encodeURIComponent(str));
    }

    function getPageHTML() {
        var script = "jQuery(document).ready(function(){\n\
                jQuery('.lightbox').each(function(){\n\
                    jQuery(this).css('display','none');});});";

        jQuery("body").append('<script id="preventLightBox" type="text/javascript">' + script + '</script>')
        var DOM = jQuery("html").html();
        jQuery("#preventLightBox").remove();
        return "<html>" + DOM + "</html>";
    }

    function drawImageSearch(data) {
        jQuery("#appender").remove();
        var appender = '<div id="appender" style="display:none;">';
        var html = '<div class="search-padder">';
        html += '<h5 onclick="Search.showFBoxSavingForm();" class="mygrey saveres">Save result</h5>';
        html += '<h5 class="resultCount">About ' + data.length + ' results</h5>';
        html += '<div class="clear"></div>';
        html += '<div class="visual-cont">';

        for (var i = 0; i < data.length; i++) {
            var title = (data[i].title[0] !== undefined) ? data[i].title[0].substring(0, 20) + '...' : '';
            var cpId = (data[i].id[0] !== undefined) ? data[i].id[0].substring(0, 20) + '...' : '';
            var image = '<div class="artifactImgVisualCont" ><img  class="artifactImg visual" src="' + data[i].thumbnail[0] + '" /></div>';

            html += '<div onclick="Search.showArtifactExtraInfoFromImageSearch(' + i + ');" onmouseover="Search.showVisualExtraInfo(this,\'over\');" onmouseleave="Search.showVisualExtraInfo(this,\'leave\');" class="single-viasual">';
            html += '<div  class="descr-viasual">';
            html += '<h3>' + title + '</h3>';
            html += '<h5>cp.id: ' + cpId + '</h5>';
            html += '</div>';
            html += image;
            html += '</div>';
        }
        html += '<div class="clear"></div>';
        html += '</div>';
        appender += '</div>';
        jQuery("body").append(appender);
        html += '</div>';
        jQuery("h1.search_help a").attr("href", "http://www.eagle-network.eu/inscriptions-search-engine-online-manual#SearchByImage");
        return html;
    }

    function drawImageSearchArchives(data) {
        jQuery("#appender").remove();
        var appender = '<div id="appender" style="display:none;">';
        var html = '<div class="search-padder">';
        // html += '<h5 onclick="Search.showFBoxSavingForm();" class="mygrey saveres">Save result</h5>';
        html += '<h5 class="resultCount">About ' + data.length + ' results</h5>';
        html += '<div class="clear"></div>';
        html += '<div class="visual-cont">';

        for (var i = 0; i < data.length; i++) {
            var title = (data[i].title[0] !== undefined) ? data[i].title[0].substring(0, 20) + '...' : '';
            var cpId = (data[i].id[0] !== undefined) ? data[i].id[0].substring(0, 20) + '...' : '';
            var image = '<div class="artifactImgVisualCont" ><img  class="artifactImg visual" src="' + data[i].thumbnail[0] + '" /></div>';

            html += '<div onmouseover="Search.showVisualExtraInfo(this,\'over\');" onmouseleave="Search.showVisualExtraInfo(this,\'leave\');" class="single-viasual">';
            html += '<div  class="descr-viasual">';
            html += '<h3>' + title + '</h3>';
            html += '<h5>cp.id: ' + cpId + '</h5>';
            html += '</div>';
            html += image;
            html += '</div>';
        }
        html += '<div class="clear"></div>';
        html += '</div>';
        appender += '</div>';
        jQuery("body").append(appender);
        html += '</div>';
        jQuery("h1.search_help a").attr("href", "http://www.eagle-network.eu/inscriptions-search-engine-online-manual#SearchByImage");

        return html;
    }

    Search.advancedSearchLeft = function (event) {
        var e = event || window.event;

        /*Aggiungo i filtri e chiamo searchCtype*/
        var myUlList = jQuery("ul.localFacetUl");
        var and = true;
        facetFilter = '';
        for (var i = 0; i < myUlList.length; i++) {
            jQuery(myUlList[i]).find("input:checked").each(function (index, element) {
                if (and) {
                    facetFilter += 'AND(';
                    and = false;
                }
                if (index > 0) {
                    facetFilter += 'OR';
                }
                var mytemp = jQuery(element);
                facetFilter += '(' + mytemp.attr("data") + ':"' + mytemp.val() + '")';
            });
            /*chiudo l'AND*/
            if (!and) {
                facetFilter += ')';
                and = true;
            }
        }
        Search.advSearchCtype(entity);
    };

    Search.simpleSearchL = function (event) {
        var e = event || window.event;
        research = jQuery.trim(jQuery("#mysearch").val());
        if (research === "")
            research = "*";
        Search.simpleSearchCtype("artifact");
        Search.slideInSidebar();
    };

    Search.simpleSearchAll = function () {
        research = "*";
        jQuery.ajax({
            type: 'POST',
            url: wpUrlSearchAjax,
            dataType: 'json',
            data: 'query=' + encodeURIComponent(research) + '&page=' + page + '&entity=' + entity,
            beforeSend: function () {
                jQuery('#loaderc').css('height', jQuery(window).height() + 'px');
                jQuery('#loader').css('margin-top', (jQuery(window).height() / 2) - 50 + 'px');
                jQuery('#loader').css('margin-left', (jQuery(window).width() / 2) - 50 + 'px');
                jQuery('#loaderc').fadeIn('fast');
                semaforo = false;
            },
            error: function () {
                semaforo = true;
                alert('Search engine temporary down for maintenance. Please try again later. Apologies for the inconvenience.');
                jQuery('#loaderc').fadeOut('fast');
            },
            success: function (data) {
                jQuery('#loaderc').fadeOut('fast');
                semaforo = true;
                if (data.grouped.tmid.groups.length === 0) {
                    alert("No results found!!");
                    research = "";
                    entity = "artifact";
                    return;
                }
                state = 1;
                lastResponse = data;
                //   prepareSidebarS();
                createSidebarFacet(data.facet_counts.facet_fields);
                Search.slideInSidebar();
                afterSimpleSearchShow();
                jQuery(".mysearchdiv").html("");
                jQuery(".mysearchdiv").append(htmlMenu(entity));
                jQuery(".mysearchdiv").append(htmlContent());
                setTimeout(imageListResize, "1000");
                jQuery(".mysearchdiv").append(pagination());

                key.destroy();
                key = new MK_KEYBOARD('#mysearch-left', '.keySwitcherSidebarBasic', keyboardSourceURLAction);
            }
        });

    };

    Search.simpleSearchCtype = function (newtype, newpage) {
        if (semaforo) {
            canonicalReset();
            jQuery("#appender").remove();
            if (newpage !== undefined)
                page = newpage;
            searchType = 0;
//            jQuery("div.search-padder").slideUp("normal", function() {
            /*Se ho un cambiamento di tipologia dal menu sopra resetto la query*/
            if (entity !== newtype)
            {
                page = 0;
                facetFilter = "";
            }
            oldEntity = entity;
            entity = jQuery.trim(newtype);
            jQuery.ajax({
                type: 'POST',
                url: wpUrlSearchAjax,
                dataType: 'json',
                data: 'query=' + encodeURIComponent(research) + '&page=' + page + '&entity=' + entity + '&facet=' + facetFilter,
                beforeSend: function () {
                    jQuery('#loaderc').css('height', jQuery(window).height() + 'px');
                    jQuery('#loader').css('margin-top', (jQuery(window).height() / 2) - 50 + 'px');
                    jQuery('#loader').css('margin-left', (jQuery(window).width() / 2) - 50 + 'px');
                    jQuery('#loaderc').fadeIn('fast');
                    semaforo = false;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    semaforo = true;

                    if (jqXHR.status == 500) {
                        alert('Search engine temporary down for maintenance. Please try again later. Apologies for the inconvenience');
                    } else {
                        alert('Error parsing you request!\nPlease report this bug at https://github.com/EAGLE-BPN/Inscription-Search-Engine');
                    }
                    jQuery('#loaderc').fadeOut('fast');
                },
                success: function (data) {
                    jQuery('#loaderc').fadeOut('fast');
                    semaforo = true;
                    if (data.grouped.tmid.groups.length === 0) {
                        alert("No results found!!");
                        if (page > 0)
                            Search.simpleSearchCtype(entity, --page);
                        return;
                    }
                    state = 1;
                    lastResponse = data;
                    if (oldEntity === entity)
                        refreshSidebarFacet(data.facet_counts.facet_fields);
                    else
                    createSidebarFacet(data.facet_counts.facet_fields);


//                    jQuery('html, body').animate({scrollTop: jQuery("#left-area").offset().top}, 1000, function() {
//                    });
                    jQuery("html, body").animate({scrollTop: "0px"});
                    jQuery(".search-padder").remove();
                    jQuery(".mysearchdiv").html("");
                    jQuery(".mysearchdiv").append(htmlMenu(entity));
                    jQuery(".mysearchdiv").append(htmlContent());
                    if (entity === "visual")
                        setTimeout(imageVisualResize, "1000");
                    else
                        setTimeout(imageListResize, "1000");
                    jQuery(".mysearchdiv").append(pagination());
                    jQuery('.fancybox').fancybox();
                    if (asyncForceState !== null)
                        state = asyncForceState;
                    asyncForceState = null;
                }
            });
//            });
        }
    };


    Search.queryCorrelatedDnetResourceList = function (dnetresourceidentifierList, row, col) {
        if (dnetresourceidentifierList.length > 0)
            jQuery.ajax({
                type: 'POST',
                url: wpUrlDnetResourceIDSearchAjax,
                dataType: 'json',
                data: 'dnetresourceidentifierList=' + JSON.stringify(dnetresourceidentifierList) + '&entity=' + entity,
                success: function (data) {
                    if (data.error === undefined)
                    {
                        /*Push elements in doclist.... increase */
                        hasTmidList[row] = 1;
                        for (var iter = 0; iter < data.response.docs.length; iter++) {
                            lastResponse.grouped.tmid.groups[row].doclist.docs.push(data.response.docs[iter]);
                            lastResponse.grouped.tmid.groups[row].doclist.numFound++;
                        }

                    }

                    Search.slideOutSidebar();
                    artifactSelectedCol = col;
                    artifactSelectedRow = row;
                    jQuery(".search-padder").remove();
                    jQuery(".mysearchdiv").html("");

                    jQuery(".mysearchdiv").append(htmlMenuArt(row, col));

                    jQuery(".mysearchdiv").append(htmlContentArt(row, col));
                    imageItemResize();
                    jQuery("html, body").animate({scrollTop: "0px"});
                    //jQuery('.fancybox').fancybox();
                    jQuery('.fancybox-gallery').fancybox();
                }
            });
        else {
            Search.slideOutSidebar();
            artifactSelectedCol = col;
            artifactSelectedRow = row;
            jQuery(".search-padder").remove();
            jQuery(".mysearchdiv").html("");

            jQuery(".mysearchdiv").append(htmlMenuArt(row, col));

            jQuery(".mysearchdiv").append(htmlContentArt(row, col));
            imageItemResize();
            jQuery("html, body").animate({scrollTop: "0px"});
            jQuery(".various").fancybox({
                maxWidth: 800,
                maxHeight: 600,
                fitToView: false,
                width: '70%',
                height: '70%',
                autoSize: false,
                closeClick: false,
                openEffect: 'none',
                closeEffect: 'none'
            });
            //jQuery('.fancybox').fancybox();
            jQuery('.fancybox-gallery').fancybox();
        }
        // Search.richLightBox();
    };



    Search.advSearch = function (newtype) {
        if (semaforo) {

            searchType = 1;
            parseAdvFields();

//            entity = jQuery.trim(newtype);
            research = "*";
            
                    var ckstringadv = jQuery("input[name=ckstringadv]");
	            if (ckstringadv !== undefined) {
	                if (ckstringadv.is(':checked'))
	                    ckstringadv = 'true';
        		}
            
            entity = "artifact";
            jQuery.ajax({
                type: 'POST',
                url: wpUrlSearchAjax,
                dataType: 'json',
                data: 'query=' + encodeURIComponent(research) + '&fields=' + JSON.stringify(advFields) + '&page=' + page + '&entity=' + entity + '&ckstringadv=' + ckstringadv ,
                beforeSend: function () {
                    jQuery('#loaderc').css('height', jQuery(window).height() + 'px');
                    jQuery('#loader').css('margin-top', (jQuery(window).height() / 2) - 50 + 'px');
                    jQuery('#loader').css('margin-left', (jQuery(window).width() / 2) - 50 + 'px');
                    jQuery('#loaderc').fadeIn('fast');
                    semaforo = false;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    semaforo = true;

                    if (jqXHR.status == 500) {
                        alert('Search engine temporary down for maintenance. Please try again later. Apologies for the inconvenience');
                    } else {
                        alert('Error parsing you request!\nPlease report this bug at https://github.com/EAGLE-BPN/Inscription-Search-Engine');
                    }
                    jQuery('#loaderc').fadeOut('fast');
                },
                success: function (data) {
                    jQuery('#loaderc').fadeOut('fast');
                    semaforo = true;
                    if (data.grouped.tmid.groups.length === 0) {
                        alert("No results found!!");
                        research = "";
                        searchType = 0;
                        entity = "artifact";
                        return;
                    }
                    state = 10;
                    canonicalReset();
                    jQuery(".side-adv-research").html("");

                    prepareSidebar();
                    createSidebarFacet(data.facet_counts.facet_fields);
//                    jQuery("#adv1").slideUp('fast', function () {
//                       jQuery("#adv2").slideDown('fast'); 
//                    });

                    jQuery("#adv2").slideDown('fast');

                    lastResponse = data;
                    jQuery(".mysearchdiv").html("");
                    jQuery(".mysearchdiv").append(htmlMenuAdv(entity));
                    jQuery(".mysearchdiv").append(htmlContent());
                    setTimeout(imageListResize, "1000");
                    jQuery(".mysearchdiv").append(pagination());

                    jQuery('.keySwitcher').each(function () {
                        var $iterElement = jQuery(this);
                        $iterElement.prop("checked", false);
                    });

                    key.destroy();
                    key = new MK_KEYBOARD('.side-adv-research input[type=text],.side-adv-research textarea', '.keySwitcher', keyboardSourceURLAction);

                }
            });
            /*Intanto preparo la ricerca nella sidebar*/

        }
    };


    Search.bookmarmkRelated = function () {
        var bookmarkTitle = document.title;
        parseRelFields();
        //var uri = 'query=' + research + '&page=' + 0 + '&entity=' + entity;
       // var uri = 'query=' + research + '&page=' + 0 + '&entity=' + entity + '&facet=' + facetFilter + '&artifactSelectedRow=-1&artifactSelectedCol=-1';
        var uri = 'query=' + research + '&page=' + 0 + '&entity=' + entity + '&artifactSelectedRow=-1&artifactSelectedCol=-1';
        if (!isEmpty(relFields)) {
            uri += '&fields=' + JSON.stringify(relFields);
        }

// nicola per farlo funzionare in locale
        //var urlArray = window.location.href.split('/', 5);
        //bookmarkURL = urlArray[0] + '//' + urlArray[2] + '/' + urlArray[3] + '/' + urlArray[4]+ '/' + encodeURIComponent(uri);


        var urlArray = window.location.href.split('/', 4);
        bookmarkURL = urlArray[0] + '//' + urlArray[2] + '/' + urlArray[3] + '/' + encodeURIComponent(uri);

        window.open(bookmarkURL);

        return false;
    };

    Search.relSearch = function (newtype) {
        Search.bookmarmkRelated();
        return;


        if (semaforo) {
            searchType = 0;
            parseRelFields();
//            entity = jQuery.trim(newtype);
            research = "*";
            entity = "artifact";
            jQuery.ajax({
                type: 'POST',
                url: wpUrlSearchAjax,
                dataType: 'json',
                data: 'query=' + encodeURIComponent(research) + '&fields=' + JSON.stringify(relFields) + '&page=' + page + '&entity=' + entity,
                beforeSend: function () {
                    jQuery('#loaderc').css('height', jQuery(window).height() + 'px');
                    jQuery('#loader').css('margin-top', (jQuery(window).height() / 2) - 50 + 'px');
                    jQuery('#loader').css('margin-left', (jQuery(window).width() / 2) - 50 + 'px');
                    jQuery('#loaderc').fadeIn('fast');
                    semaforo = false;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    semaforo = true;

                    if (jqXHR.status == 503) {
                        alert('Search engine temporary down for maintenance. Please try again later. Apologies for the inconvenience');
                    } else {
                        alert('Error parsing you request!\nPlease report this bug at https://github.com/EAGLE-BPN/Inscription-Search-Engine');
                    }
                    jQuery('#loaderc').fadeOut('fast');
                },
                success: function (data) {
                    jQuery('#loaderc').fadeOut('fast');
                    semaforo = true;
                    if (data.grouped.tmid.groups.length === 0) {
                        alert("No results found!!");
                        research = "";
                        searchType = 0;
                        entity = "artifact";
                        return;
                    }
                    state = 10;
                    canonicalReset();
                  //  jQuery(".side-adv-research").html("");

                    prepareSidebar();
                    createSidebarFacet(data.facet_counts.facet_fields);
//                    jQuery("#adv1").slideUp('fast', function () {
//                       jQuery("#adv2").slideDown('fast'); 
//                    });

                    jQuery("#hidden-before-search").slideUp('fast');

                    lastResponse = data;
                    jQuery(".mysearchdiv").html("");
                    jQuery(".mysearchdiv").append(htmlMenuAdv(entity));
                    jQuery(".mysearchdiv").append(htmlContent());
                    setTimeout(imageListResize, "1000");
                    jQuery(".mysearchdiv").append(pagination());
                }
            });
            /*Intanto preparo la ricerca nella sidebar*/

        }
    };

    Search.relSearchMki = function (newtype) {
        if (semaforo) {
            searchType = 1;
            page = 0;
            research = "*";
            entity = "artifact";
            jQuery.ajax({
                type: 'POST',
                url: wpUrlSearchAjax,
                dataType: 'json',
                data: 'query=' + encodeURIComponent(research) + '&fields=' + JSON.stringify(advFields) + '&page=' + page + '&entity=' + entity,
                beforeSend: function () {
                    jQuery('#loaderc').css('height', jQuery(window).height() + 'px');
                    jQuery('#loader').css('margin-top', (jQuery(window).height() / 2) - 50 + 'px');
                    jQuery('#loader').css('margin-left', (jQuery(window).width() / 2) - 50 + 'px');
                    jQuery('#loaderc').fadeIn('fast');
                    semaforo = false;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    semaforo = true;

                    if (jqXHR.status == 503) {
                        alert('Search engine temporary down for maintenance. Please try again later. Apologies for the inconvenience');
                    } else {
                        alert('Error parsing you request!\nPlease report this bug at https://github.com/EAGLE-BPN/Inscription-Search-Engine');
                    }
                    jQuery('#loaderc').fadeOut('fast');
                },
                success: function (data) {
                    jQuery('#loaderc').fadeOut('fast');
                    semaforo = true;
                    if (data.grouped.tmid.groups.length === 0) {
                        alert("No results found!!");
                        research = "";
                        searchType = 1;
                        entity = "artifact";
                        return;
                    }
                    state = 10;
                    canonicalReset();
                    //jQuery(".side-adv-research").html("");

                    prepareSidebar();
                    createSidebarFacet(data.facet_counts.facet_fields);
//                    jQuery("#adv1").slideUp('fast', function () {
//                       jQuery("#adv2").slideDown('fast'); 
//                    });
                     jQuery("#hidden-before-search").slideDown('fast');
                    //jQuery("#adv2").slideDown('fast');

                    lastResponse = data;
                    jQuery(".mysearchdiv").html("");
                    jQuery(".mysearchdiv").append(htmlMenuAdv(entity));
                    jQuery(".mysearchdiv").append(htmlContent());
                    setTimeout(imageListResize, "1000");
                    jQuery(".mysearchdiv").append(pagination());
                }
            });
            /*Intanto preparo la ricerca nella sidebar*/

        }
    };

    Search.advSearchCtype = function (newtype, newpage) {
        if (semaforo) {
            canonicalReset();
            searchType = 1;
            if (newpage !== undefined)
                page = newpage;
            jQuery("#appender").remove();
//            entity = jQuery.trim(newtype);
            entity = "artifact";

            jQuery('#loaderc').css('height', jQuery(window).height() + 'px');
            jQuery('#loader').css('margin-top', (jQuery(window).height() / 2) - 50 + 'px');
            jQuery('#loader').css('margin-left', (jQuery(window).width() / 2) - 50 + 'px');
            jQuery('#loaderc').fadeIn('fast');
            semaforo = false;
            jQuery.ajax({
                type: 'POST',
                url: wpUrlSearchAjax,
                dataType: 'json',
                data: 'query=' + encodeURIComponent(research) + '&fields=' + JSON.stringify(advFields) + '&page=' + page + '&entity=' + entity + '&facet=' + facetFilter,
                beforeSend: function () {
                    jQuery('#loaderc').css('height', jQuery(window).height() + 'px');
                    jQuery('#loader').css('margin-top', (jQuery(window).height() / 2) - 50 + 'px');
                    jQuery('#loader').css('margin-left', (jQuery(window).width() / 2) - 50 + 'px');
                    jQuery('#loaderc').fadeIn('fast');
                    semaforo = false;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    semaforo = true;

                    if (jqXHR.status == 500) {
                        alert('Search engine temporary down for maintenance. Please try again later. Apologies for the inconvenience');
                    } else {
                        alert('Error parsing you request!\nPlease report this bug at https://github.com/EAGLE-BPN/Inscription-Search-Engine');
                    }
                    jQuery('#loaderc').fadeOut('fast');
                },
                success: function (data) {
                    jQuery('#loaderc').fadeOut('fast');
                    semaforo = true;
                    if (data.grouped.tmid.groups.length === 0) {
                        alert("No results found!!");
                        if (page > 0)
                            Search.advSearchCtype(entity, --page);
                        return;
                    }
                    state = 10;
                    lastResponse = data;
                    //prepareSidebar();
                    createSidebarFacet(data.facet_counts.facet_fields);
                    //refreshSidebarFacet(data.facet_counts.facet_fields);
//                    jQuery('html, body').animate({scrollTop: jQuery("#left-area").offset().top}, 1000, function() {
//                    });
                    jQuery("html, body").animate({scrollTop: "0px"});
                    jQuery(".search-padder").remove();
                    jQuery(".mysearchdiv").html("");
                    jQuery(".mysearchdiv").append(htmlMenuAdv(entity));
                    jQuery(".mysearchdiv").append(htmlContent());
                    setTimeout(imageListResize, "1000");
                    jQuery(".mysearchdiv").append(pagination());
                    // jQuery('.fancybox').fancybox();
                    if (asyncForceState !== null)
                        state = asyncForceState;
                    asyncForceState = null;
                }
            });
        }
    };


    Search.returnToList = function () {
        hasTmidList = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        if (archiveType !== "") {
            Search.archivesView(archiveType, archiveTableId);
            asyncForceState = 20;
        } else if (searchType === 0) {
            Search.simpleSearchCtype(entity, page);
            asyncForceState = 1;
        } else {
            Search.advSearchCtype(entity, page);
            asyncForceState = 10;
        }
        Search.sideBarToggle();

    };

    Search.returnToListArchives = function () {
        saveDomElement();
        view = "archives";
        archivesView = "list";
        jQuery(".mysearchdiv").append(htmlMenuArchives(archiveType));
        jQuery(".mysearchdiv").append(htmlContentArchives());
        imageListResize();
        jQuery(".mysearchdiv").append(paginationArchives());
        jQuery('.fancybox').fancybox();
        canonicalReset();
        state = 20;
    };



    Search.showVisualExtraInfo = function (element, evt) {
        if (jQuery(element).hasClass("single-viasual")) {
            if (evt === "over" && !animating && !over)
            {
                animating = true;
                over = true;
                var myElement = jQuery(element).children();
                myElement = myElement[myElement.length - 1];
                myElement = jQuery(myElement).detach();
                jQuery(element).prepend(myElement);
                animating = false;
            } else if (evt === "leave" && !animating && over) {
                animating = true;
                over = false;
                var myElement = jQuery(element).children();
                myElement = myElement[myElement.length - 1];
                myElement = jQuery(myElement).detach();
                jQuery(element).prepend(myElement);
                animating = false;
            }
        }
    };

    Search.registerShow = function () {
        jQuery.fancybox('<div id="fboxregisterform" ><p id="user_login-p"><label id="user_login-label" for="user_login">Username<br><input name="username" id="username" class="input" value="" size="20" type="text"></label></p><p id="user_email-p"><label id="user_email-label" for="user_email">E-mail<br><input name="email" id="email" class="input" value="" size="25" type="text"></label></p><p id="first_name-p"><label id="first_name-label" for="first_name">First Name<br><input name="first_name" id="first_name" class="input" value="" type="text"></label></p><p id="last_name-p"><label id="last_name-label" for="last_name">Last Name<br><input name="last_name" id="last_name" class="input" value="" type="text"></label></p>	<p id="reg_passmail">Data processing & Policy: By submitting this form,<br> I agree that my personal data being processed in accordance with the<br> General Data Protection Regulation (GDPR - Regulation UE 2016/679)<br>and the Legislative Decree 196 of the 30th June 2003.<br> Please note that your request will be forwarded to the system administrators.<br>As soon as they approve it, you will receive an email with the instructions how to create your password.</p><br class="clear"><div id="recaptcha" class="g-recaptcha" data-sitekey="6LcwsAcTAAAAAKQL0-RbbxRwxsx1PnadhOfNs9qC"></div><p class="submit"><input name="wp-submit" onclick="Search.register(\'fboxregisterform\');" id="wp-submit" class="button button-primary button-large" value="Register" type="submit"></p></div>');
        grecaptcha.render("recaptcha", {
            sitekey: '6LcwsAcTAAAAAKQL0-RbbxRwxsx1PnadhOfNs9qC',
            'tdata-theme': 'white',
            callback: function () {
                console.log('recaptcha callback');
            }
        });
    };


    Search.register = function (container) {
        var esito = parse_register_fields(container);
        if (!esito) {
            registerErrosHandler(registerErrors);
            return false;
        }
        jQuery.ajax({
            type: 'POST',
            url: wpUrlAjaxRegister,
            dataType: 'json',
            data: 'registerFields=' + JSON.stringify(registerFields),
            success: function (data) {
                if (data.error === false) {
                    jQuery('#fboxregisterform').html('<div style="width:315px"><h2 style="width:100%;text-align:center;">' + data.msg + '</h2></div>');
                } else {
                    jQuery('#fboxregisterform').html('<div style="width:315px"><h2 style="width:100%;text-align:center;color:red;">' + data.msg + '</h2></div>');
                }
            }
        });
    };

    Search.showArtifactExtraInfo = function (row, col, evt) {
        var e = window.event || evt;
        if (jQuery(e.target).hasClass("fancybox"))
            return;
        if (artifactSelectedCol === col && artifactSelectedRow === row)
            return;
        /*Check for has Resource Correlated*/
        if (hasTmidList[row] !== 0) {
            Search.queryCorrelatedDnetResourceList(new Array(), row, col);
        } else {
            var resourceToAsk = getCorrelatedDnetResourceList(row);
            Search.queryCorrelatedDnetResourceList(resourceToAsk, row, col);
        }
    };

    Search.advKeySearch = function (evt) {
        var e = window.event || evt;
        if (window.event) // IE
        {
            var keynum = evt.keyCode
        } else if (e.which) // Netscape/Firefox/Opera
        {
            var keynum = evt.which
        }
        if (keynum == 13)
            Search.advSearch('documental');

    };

    Search.showArtifactExtraInfoArchives = function (row, col, evt) {
        var e = window.event || evt;
        if (jQuery(e.target).hasClass("fancybox"))
            return;
        if (artifactSelectedCol === col && artifactSelectedRow === row && archivesView === "obj")
            return;
        Search.slideOutSidebar();
        artifactSelectedCol = col;
        artifactSelectedRow = row;
        jQuery(".search-padder").remove();
        jQuery(".mysearchdiv").html("");
//        jQuery(".mysearchdiv").append(htmlMenuArchives(archiveType));
        jQuery(".mysearchdiv").append(htmlMenuArtArchives(row, col));
        jQuery(".mysearchdiv").append(htmlContentArtArchives(row, col));
        imageItemResize();
        jQuery('.fancybox').fancybox();
        jQuery('.fancybox-gallery').fancybox();
        jQuery("html, body").animate({scrollTop: "0px"});
        archivesView = "obj";
        state = 21;
        // Search.richLightBox();
    };

    Search.showFBoxSavingForm = function (type) {
        if (semaforo) {
            jQuery.ajax({
                type: 'POST',
                url: wpUrlAjaxLoginCheck,
                dataType: 'json',
                beforeSend: function () {
                    jQuery.fancybox.close();
                    jQuery('#loaderc').css('height', jQuery(window).height() + 'px');
                    jQuery('#loader').css('margin-top', (jQuery(window).height() / 2) - 50 + 'px');
                    jQuery('#loader').css('margin-left', (jQuery(window).width() / 2) - 50 + 'px');
                    jQuery('#loaderc').fadeIn('fast');
                    semaforo = false;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    semaforo = true;

                    if (jqXHR.status == 500) {
                        alert('Search engine temporary down for maintenance. Please try again later. Apologies for the inconvenience');
                    } else {
                        alert('Error parsing you request!\nPlease report this bug at https://github.com/EAGLE-BPN/Inscription-Search-Engine');
                    }
                    jQuery('#loaderc').fadeOut('fast');
                },
                success: function (data) {
                    jQuery('#loaderc').fadeOut('fast');
                    semaforo = true;
                    if (!data.logged)
                        jQuery.fancybox(data.msg);
                    else {
                        var appender = (searchType !== 2) ? '<fieldset id="toSave"><legend>Save your data</legend><label>Title</label><br/><input onfocus="Search.resetAdvText(this);" onclick="Search.restore(this);" type="text" id="saveTitle" placeholder="Your title" value=""/><br/><br/><label>Notes</label><br/><textarea placeholder="Your notes" onfocus="Search.resetAdvText(this);" id="saveNotes" value=""></textarea><br/><input type="button" onclick="Search.save();" value="Save" /></fieldset>' : '<fieldset id="toSave"><legend>Save your data</legend><label>Title</label><br/><input onfocus="Search.resetAdvText(this);" onclick="Search.restore(this);" type="text" id="saveTitle"  placeholder="Your title" value=""/><br/><br/><label>Notes</label><br/><textarea onfocus="Search.resetAdvText(this);" id="saveNotes" placeholder="Your notes" value=""></textarea><br/><input type="button" onclick="Search.saveSimilarity(\'' + type + '\');" value="Save" /></fieldset>';
                        fbox = jQuery.fancybox(appender);
                    }
                }
            });
        }
    };

    Search.save = function () {
        var advancedSavedField = null;
        var facetOnAdvanced = null;
        var title = jQuery.trim(jQuery("#saveTitle").val());
        if (title === "" || title === "Your title" || title === "You must to specify a save title!") {
            jQuery("#saveTitle").css("background-color", "red");
            jQuery("#saveTitle").css("color", "white");
            jQuery("#saveTitle").val("You must to specify a save title!")
            return;
        }
        if (searchType === 0) {
            advancedSavedField = facetFilter;
            facetOnAdvanced = '';
        } else if (searchType === 1) {
            advancedSavedField = JSON.stringify(advFields);
            facetOnAdvanced = facetFilter;
        }
        var notes = jQuery.trim(jQuery("#saveNotes").val());
        if (semaforo) {
            jQuery.ajax({
                type: 'POST',
                url: wpUrlSaveAjax,
                dataType: 'json',
                data: 'query=' + encodeURIComponent(research) + '&fields=' + advancedSavedField + '&page=' + page + '&entity=' + entity + '&row=' + artifactSelectedRow + '&col=' + artifactSelectedCol + '&title=' + title + '&notes=' + notes + '&searchType=' + searchType + '&facetOnAdvanced=' + facetOnAdvanced,
                beforeSend: function () {
                    jQuery.fancybox.close();
                    jQuery('#loaderc').css('height', jQuery(window).height() + 'px');
                    jQuery('#loader').css('margin-top', (jQuery(window).height() / 2) - 50 + 'px');
                    jQuery('#loader').css('margin-left', (jQuery(window).width() / 2) - 50 + 'px');
                    jQuery('#loaderc').fadeIn('fast');
                    semaforo = false;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    semaforo = true;

                    if (jqXHR.status == 500) {
                        alert('Search engine temporary down for maintenance. Please try again later. Apologies for the inconvenience');
                    } else {
                        alert('Error parsing you request!\nPlease report this bug at https://github.com/EAGLE-BPN/Inscription-Search-Engine');
                    }
                    jQuery('#loaderc').fadeOut('fast');
                },
                success: function (data) {
                    jQuery('#loaderc').fadeOut('fast');
                    semaforo = true;
                    fbox = jQuery.fancybox(data.msg);
                }
            });
        }
    };


    Search.saveSimilarity = function (dnetResurceIdentifier) {
        var title = jQuery.trim(jQuery("#saveTitle").val());
        if (title === "" || title === "Your title" || title === "You must to specify a save title!") {
            jQuery("#saveTitle").css("background-color", "red");
            jQuery("#saveTitle").css("color", "white");
            jQuery("#saveTitle").val("You must to specify a save title!")
            return;
        }
        var notes = jQuery.trim(jQuery("#saveNotes").val());
        var form = Fdata;
        if (dnetResurceIdentifier != "undefined") {
            form = new FormData();
            form.append('dnetResurceIdentifier', dnetResurceIdentifier);
        }
        form.append('title', title);
        form.append('notes', notes);
        if (semaforo) {
            jQuery.ajax({
                type: 'POST',
                contentType: false,
                processData: false,
                url: wpUrlSimilaritySaveAjax,
                dataType: 'json',
                data: form,
                beforeSend: function () {
                    jQuery.fancybox.close();
                    jQuery('#loaderc').css('height', jQuery(window).height() + 'px');
                    jQuery('#loader').css('margin-top', (jQuery(window).height() / 2) - 50 + 'px');
                    jQuery('#loader').css('margin-left', (jQuery(window).width() / 2) - 50 + 'px');
                    jQuery('#loaderc').fadeIn('fast');
                    semaforo = false;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    semaforo = true;

                    if (jqXHR.status == 500) {
                        alert('Search engine temporary down for maintenance. Please try again later. Apologies for the inconvenience');
                    } else {
                        alert('Error parsing you request!\nPlease report this bug at https://github.com/EAGLE-BPN/Inscription-Search-Engine');
                    }
                    jQuery('#loaderc').fadeOut('fast');
                },
                success: function (data) {
                    jQuery('#loaderc').fadeOut('fast');
                    semaforo = true;
                    fbox = jQuery.fancybox(data.msg);
                }
            });
        }
    };

    Search.checkAndGoBack = function () {
//        alert("state \n" + state + " page \n" + page);
//        return;
        switch (state) {
            case 0 :
            {
                window.location = "/";
                break;
            }
            case 1 :
            {
                if (page > 0) {
                    history.pushState('newjibberish', null, null);
                    Search.backPage();
                } else
                    window.location = "/basic-search";
                break;
            }
            case 2 :
            {
                history.pushState('newjibberish', null, null);
                Search.returnToList();
                break;
            }
            case 10 :
            {
                if (page > 1) {
                    history.pushState('newjibberish', null, null);
                    Search.backPage();
                } else
                    window.location = "/advanced-search";
                break;
            }
            case 11 :
            {
                history.pushState('newjibberish', null, null);
                Search.returnToList();
                break;
            }
            case 20 :
            {
                history.pushState('newjibberish', null, null);
                if (page > 1 && !firstTimeOnArcList) {
                    Search.backPageArchives();
                } else {
                    Search.archivesRelist('results', 0);
                }
                break;
            }
            case 21 :
            {
                history.pushState('newjibberish', null, null);
                Search.returnToListArchives();
                break;
            }
            case 30 :
            {
                history.pushState('newjibberish', null, null);
                Search.archivesRelist('items', 0);
                break;
            }
            default :
            {
                alert("Deafult Action");
                history.pushState('newjibberish', null, null);
            }
        }







//        if (state !== 0 || (state === 1 && page !== 0))
//        {
//            /*inibisce il back*/
//            history.pushState('newjibberish', null, null);
//        }
//        if (state === 1) {
//            if (page > 0)
//                Search.backPage();
//        } else if (state === 2)
//            window.history.back();
    };

    Search.backPage = function () {
        page--;
        if (searchType === 0)
            Search.simpleSearchCtype(entity);
        else if (searchType === 1)
            Search.advSearchCtype(entity);
    };

    Search.nextPage = function () {
        page++;
        if (searchType === 0)
            Search.simpleSearchCtype(entity);
        else if (searchType === 1)
            Search.advSearchCtype(entity);
    };

    Search.nextPageArchives = function () {
        page++;
        firstTimeOnArcList = false;
        jQuery('html, body').animate({scrollTop: jQuery("#left-area").offset().top}, 1000, function () {
//        jQuery(".mysearchdiv").slideUp(1500, function() {
            jQuery(".search-padder").remove();
            jQuery(".mysearchdiv").html("");
            view = "archives";
            jQuery(".mysearchdiv").append(htmlMenuArchives(archiveType));
            jQuery(".mysearchdiv").append(htmlContentArchives());
            jQuery(".mysearchdiv").append(paginationArchives());
            jQuery(".mysearchdiv").slideDown(2500);
            jQuery('.fancybox').fancybox();
//        });
        });

    };

    Search.backPageArchives = function () {
        page--;
        firstTimeOnArcList = false;
        jQuery('html, body').animate({scrollTop: jQuery("#left-area").offset().top}, 1000, function () {
//        jQuery(".mysearchdiv").slideUp(1500, function() {
            jQuery(".search-padder").remove();
            jQuery(".mysearchdiv").html("");
            view = "archives";
            jQuery(".mysearchdiv").append(htmlMenuArchives(archiveType));
            jQuery(".mysearchdiv").append(htmlContentArchives());
            jQuery(".mysearchdiv").append(paginationArchives());
            jQuery(".mysearchdiv").slideDown(2500);
            jQuery('.fancybox').fancybox();
        });
//        });
    };

    Search.gotoPageArchives = function (newPage) {
        page = newPage;
        jQuery('html, body').animate({scrollTop: jQuery("#left-area").offset().top}, 1000, function () {
//        jQuery(".mysearchdiv").slideUp(1500, function() {
            jQuery(".search-padder").remove();
            jQuery(".mysearchdiv").html("");
            view = "archives";
            jQuery(".mysearchdiv").append(htmlContentArchives());
            jQuery(".mysearchdiv").append(paginationArchives());
            jQuery(".mysearchdiv").slideDown(2500);
            jQuery('.fancybox').fancybox();
        });
//        });
    };

    Search.gotoPage = function (newPage) {
        page = newPage;
        if (searchType === 0)
            Search.simpleSearchCtype(entity);
        else if (searchType === 1)
            Search.advSearchCtype(entity);
    };

    Search.sideBarToggle = function () {
        if (sidebarState === 0) {
            Search.slideInSidebar();
            sidebarState = 1;
        } else if (sidebarState === 1) {
            Search.slideOutSidebar();
            sidebarState = 0;
        }
    };

    Search.slideInSidebar = function () {
        jQuery("#sidebar").animate({
           // width: "305"
            width: "30%"
        }, 500, function () {
            // Animation complete.
            jQuery("#sidebar").css('overflow', 'visible');
            jQuery("#sidebar").css('display', 'block');
            sidebarState = 1;
        });
        jQuery("#left-area").animate({
        //    width: "625"
            width: "67%"
        }, 500, function () {
            // Animation complete.
        });
        jQuery("#sidebar").show();
        jQuery("div#slideInBarBtn").css("background", "url('/wp-content/plugins/eagle-search/img/glyphicons_173_play_r.png')");
        jQuery("#slideInBarBtn").show('fast');
    };

    function afterSimpleSearchShow() {
        $simpleBeforSearchHidden = jQuery("div#hidden-before-search");
        if ($simpleBeforSearchHidden.length > 0) {
            $simpleBeforSearchHidden.slideDown("fast");
        }
    }

    Search.slideOutSidebar = function () {
        jQuery("#sidebar").animate({
            width: "0"
        }, 500, function () {
            sidebarState = 0;
            jQuery("#sidebar").css('overflow', 'hidden');
            jQuery("div#slideInBarBtn").css("background", "url('/wp-content/plugins/eagle-search/img/glyphicons_173_play.png')");
        });
        var newWidth = jQuery("#left-area").parent().width() - 30;
        jQuery("#left-area").animate({
            width: newWidth
        }, 500, function () {
            // Animation complete.
        });
        jQuery("#slideInBarBtn").show('fast');
    };

    Search.dinamicFieldsReformer = function () {
        /*Check the selected fields and update cache*/
        var inputs = jQuery(".adv-vocabol input:checked");
        jQuery('#loaderc').css('height', jQuery(window).height() + 'px');
        jQuery('#loader').css('margin-top', (jQuery(window).height() / 2) - 50 + 'px');
        jQuery('#loader').css('margin-left', (jQuery(window).width() / 2) - 50 + 'px');
        if (lastResponse === "") {
	jQuery("div#fieldsAppender").html('');
	}
        for (var i = 0; i < inputs.length; i++) {
            var element = jQuery(inputs[i]);
            var disabled = element.attr("disabled");
            if (disabled === undefined) {
                var str = element.attr("data");
                var data = JSON.parse(str);
                if (data.voc !== 0 && !Search.advFieldCache.hasOwnProperty(data.name)) {
                    /*Devo caricare il campo governato da vocabolario*/
                    updateCacheFields(data.name);
                }
                if (lastResponse === "") {
                   // jQuery("div#fieldsAppender").html('');
                    var field = getAdvField(data);
                    jQuery("div#fieldsAppender").append(field);
                } else {
                    jQuery('#loaderc').fadeOut('fast');
                    prepareSidebar();
                    return;
                }
            	key.destroy();
	        key = new MK_KEYBOARD('.search-padder input[type=text],.search-padder textarea', '.keySwitcher', keyboardSourceURLAction);

            }
        }
        jQuery('#loaderc').fadeOut('fast');

//        if (lastResponse === "") {
//            // var inputs = jQuery(".adv-vocabol input:checked");
//            jQuery("div#fieldsAppender").html('');
//            jQuery('#loaderc').css('height', jQuery(window).height() + 'px');
//            jQuery('#loader').css('margin-top', (jQuery(window).height() / 2) - 50 + 'px');
//            jQuery('#loader').css('margin-left', (jQuery(window).width() / 2) - 50 + 'px');
//            jQuery('#loaderc').fadeIn('slow', function () {
//                for (var i = 0; i < inputs.length; i++) {
//                    var element = jQuery(inputs[i]);
//                    var disabled = element.attr("disabled");
//                    if (disabled === undefined) {
//                        var str = element.attr("data");
//                        var data = JSON.parse(str);
//                        if (data.voc !== 0 && !Search.advFieldCache.hasOwnProperty(data.name)) {
//                            /*Devo caricare il campo governato da vocabolario*/
//                            updateCacheFields(data.name);
//                        }
//                        var field = getAdvField(data);
//                        jQuery("div#fieldsAppender").append(field);
//                    }
//                }
//                jQuery('#loaderc').fadeOut('fast');
//            });
//        } else {
//            prepareSidebar();
//        }

    };

    Search.standardFieldsReformer = function () {
        var inputs = jQuery(".adv-vocabol input:checked");
        for (var i = 0; i < inputs.length; i++) {
            var element = jQuery(inputs[i]);
            //var disabled = element.attr("disabled");
            var str = element.attr("data");
            if (str !== undefined) {
                var data = JSON.parse(str);
                /*Search element on search*/
                var $advField = jQuery("div.search-padder select[name='" + data.name + "']");
                if ($advField.length === 0)
                    continue;
                if (data.voc !== 0 && !Search.advFieldCache.hasOwnProperty(data.name)) {
                    /*Devo caricare il campo governato da vocabolario*/
                    updateCacheFields(data.name);
                }
                var field = getAdvField(data);
                $advField.html(field);
            }
        }
    };


    Search.allFieldsSidebarReformer = function () {
        var inputs = jQuery(".adv-vocabol input:checked");
        for (var i = 0; i < inputs.length; i++) {
            var element = jQuery(inputs[i]);
            //var disabled = element.attr("disabled");
            var str = element.attr("data");
            if (str !== undefined) {
                var data = JSON.parse(str);
                /*Search element on search*/
                var $advField = jQuery("fieldset.side-adv-research select[name='" + data.name + "']");
                if ($advField.length === 0)
                    continue;
                if (data.voc !== 0 && !Search.advFieldCache.hasOwnProperty(data.name)) {
                    /*Devo caricare il campo governato da vocabolario*/
                    updateCacheFields(data.name);
                }
                var field = getAdvField(data);
                $advField.html(field);
            }
        }
    };

    function setAllowedADVFields() {
//         var inputs = jQuery(".adv-vocabol input:checked");
//        var $researchElements=jQuery("div.search-padder").children();
//        for(var i=0;i<$researchElements.length;i++){
//            if($researchElements[i].tagName==='INPUT' || $researchElements[i].tagName==='SELECT'){
//                var $researchElement=jQuery($researchElements[i]);
//                allowedAdvFields[$researchElement.attr('name')]=$researchElement.val();
//            }
//        }
    }

    Search.checkAllFields = function () {
        var inputs = jQuery(".adv-vocabol input");
        for (var i = 0; i < inputs.length; i++) {
            var element = jQuery(inputs[i]);
            var disabled = element.attr("disabled");
            if (disabled === undefined) {
                element.attr("checked", "checked");
            }
        }
    };

    Search.uncheckAllFields = function () {
        var inputs = jQuery(".adv-vocabol input");
        for (var i = 0; i < inputs.length; i++) {
            var element = jQuery(inputs[i]);
            var disabled = element.attr("disabled");
            if (disabled === undefined) {
                element.removeAttr("checked");
            }
        }
    };

    Search.slideFacet = function (el) {
        var myel = jQuery(el);
        if (myel.hasClass("up")) {
            myel.next().next().slideUp("fast");
            myel.removeClass("up");
        } else {
            myel.next().next().slideDown("fast");
            myel.addClass("up");
        }
    };

    Search.uncheckAllSimple = function () {
        jQuery("div.mainFacetDiv input:checked").each(function (index, element) {
            jQuery(element).attr('checked', false);
        });
    };

    Search.archiveSelectAll = function () {
        jQuery("table.tableArchives input").each(function (index, element) {
            jQuery(element).attr('checked', true);
        });
    };

    Search.archiveDeselectAll = function () {
        jQuery("table.tableArchives input").each(function (index, element) {
            jQuery(element).attr('checked', false);
        });
    };

    Search.archivesModify = function (type, tableid, row) {
        if (semaforo) {
            jQuery.ajax({
                type: 'POST',
                url: wpUrlArchivesAjax,
                dataType: 'json',
                data: 'myaction=info&type=' + type + '&tableid=' + tableid + '&row=' + row,
                beforeSend: function () {
                    jQuery.fancybox.close();
                    jQuery('#loaderc').css('height', jQuery(window).height() + 'px');
                    jQuery('#loader').css('margin-top', (jQuery(window).height() / 2) - 50 + 'px');
                    jQuery('#loader').css('margin-left', (jQuery(window).width() / 2) - 50 + 'px');
                    jQuery('#loaderc').fadeIn('fast');
                    semaforo = false;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    semaforo = true;

                    if (jqXHR.status == 500) {
                        alert('Search engine temporary down for maintenance. Please try again later. Apologies for the inconvenience');
                    } else {
                        alert('Error parsing you request!\nPlease report this bug at https://github.com/EAGLE-BPN/Inscription-Search-Engine');
                    }
                    jQuery('#loaderc').fadeOut('fast');
                },
                success: function (data) {
                    jQuery('#loaderc').fadeOut('fast');
                    semaforo = true;
                    if (!data.error)
                    {
                        fbox = jQuery.fancybox(data.html);
                    } else
                        fbox = jQuery.fancybox(data.msg);
                }
            });
        }
    };

    Search.archivesView = function (type, tableid, event) {
        if (semaforo) {
            archiveType = type;
            archiveTableId = (type === "items") ? 0 : tableid;
            jQuery.ajax({
                type: 'POST',
                url: wpUrlArchivesAjax,
                dataType: 'json',
                data: 'myaction=view&type=' + type + '&tableid=' + tableid,
                beforeSend: function () {
                    jQuery.fancybox.close();
                    jQuery('#loaderc').css('height', jQuery(window).height() + 'px');
                    jQuery('#loader').css('margin-top', (jQuery(window).height() / 2) - 50 + 'px');
                    jQuery('#loader').css('margin-left', (jQuery(window).width() / 2) - 50 + 'px');
                    jQuery('#loaderc').fadeIn('fast');
                    semaforo = false;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    semaforo = true;

                    if (jqXHR.status == 500) {
                        alert('Search engine temporary down for maintenance. Please try again later. Apologies for the inconvenience');
                    } else {
                        alert('Error parsing you request!\nPlease report this bug at https://github.com/EAGLE-BPN/Inscription-Search-Engine');
                    }
                    jQuery('#loaderc').fadeOut('fast');
                },
                success: function (data) {
                    jQuery('#loaderc').fadeOut('fast');
                    semaforo = true;
                    if (!data.error)
                    {
                        archiveElement = null;
                        lastResponse = JSON.parse(data.json);

                        lastPage = Math.ceil(lastResponse.grouped.tmid.groups.length / 10)
                        //lastPage = (lastResponse.grouped.tmid.groups.length%10>0)?lastp+1:lastp;
                        page = (parseInt(data.page) > 5) ? 5 : parseInt(data.page);
                        archivesDom = jQuery("div.mysearchdiv").html();
                        jQuery(".search-padder").remove();
                        jQuery(".mysearchdiv").html("");

                        if (type === "results")
                        {
                            state = 20;
                            entity = data.entity;
                            view = "archives";
                            archivesView = "list";

//                         lastResponse = data.json;

                            jQuery(".mysearchdiv").append(htmlMenuArchives(type));

                            jQuery(".mysearchdiv").append(htmlContentArchives());
                            imageListResize();
                            jQuery(".mysearchdiv").append(paginationArchives());
//                        jQuery(".mysearchdiv").append(pagination());
                            jQuery('.fancybox').fancybox();
                        } else {
                            view = "items";
                            archivesView = "obj";
                            preorder_by_criteria(parseInt(data.row) + (10 * (page)));
                            Search.showArtifactExtraInfoArchives(parseInt(data.row) + (10 * (page)), parseInt(data.col), event);
                            state = 30;
                        }
                        if (asyncForceState !== null)
                            state = asyncForceState;
                        asyncForceState = null;
                    } else
                        fbox = jQuery.fancybox(data.msg);
                }
            });
        }
    };

    Search.archivesSimilarityView = function (type, tableid, event) {
        if (semaforo) {
            archiveType = type;
            jQuery.ajax({
                type: 'POST',
                url: wpUrlArchivesAjax,
                dataType: 'json',
                data: 'myaction=view&type=' + type + '&tableid=' + tableid + '&similarity=true',
                beforeSend: function () {
                    jQuery.fancybox.close();
                    jQuery('#loaderc').css('height', jQuery(window).height() + 'px');
                    jQuery('#loader').css('margin-top', (jQuery(window).height() / 2) - 50 + 'px');
                    jQuery('#loader').css('margin-left', (jQuery(window).width() / 2) - 50 + 'px');
                    jQuery('#loaderc').fadeIn('fast');
                    semaforo = false;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    semaforo = true;

                    if (jqXHR.status == 500) {
                        alert('Search engine temporary down for maintenance. Please try again later. Apologies for the inconvenience');
                    } else {
                        alert('Error parsing you request!\nPlease report this bug at https://github.com/EAGLE-BPN/Inscription-Search-Engine');
                    }
                    jQuery('#loaderc').fadeOut('fast');
                },
                success: function (data) {
                    jQuery('#loaderc').fadeOut('fast');
                    semaforo = true;
                    if (!data.error)
                    {
                        archiveElement = null;
//                        lastResponse = JSON.parse(data.json);
//                        lastPage = Math.ceil(lastResponse.grouped.tmid.groups.length / 10)
                        //lastPage = (lastResponse.grouped.tmid.groups.length%10>0)?lastp+1:lastp;
//                        page = (parseInt(data.page) > 5) ? 5 : parseInt(data.page);
                        archivesDom = jQuery("div.mysearchdiv").html();
                        jQuery(".search-padder").remove();
                        jQuery(".mysearchdiv").html("");
                        if (type === "results")
                        {
                            state = 20;
                            //entity = data.entity;
                            view = "archives";
                            archivesView = "list";

//                         lastResponse = data.json;

                            jQuery(".mysearchdiv").append(htmlMenuArchives(type));

                            jQuery(".mysearchdiv").append(drawImageSearchArchives(data.results));
                            setTimeout(imageVisualResize, "1000");
                            //jQuery(".mysearchdiv").append(paginationArchives());
                            jQuery('.fancybox').fancybox();
                        } else {
                            view = "items";
                            archivesView = "obj";

                            var html = getHtmlFromStringDataArchives(data.results[0]);
                            // jQuery(".mysearchdiv").append(htmlMenuArchives(type));
                            jQuery(".mysearchdiv").append(html);

                            //Search.showArtifactExtraInfoArchives(parseInt(data.row) + (10 * (page)), parseInt(data.col), event);
                            state = 30;
                        }
                        if (asyncForceState !== null)
                            state = asyncForceState;
                        asyncForceState = null;
                    } else
                        fbox = jQuery.fancybox(data.msg);
                }
            });
        }
    };


    Search.fmaSync = function () {
        jQuery.ajax({
            type: 'POST',
            url: wpUrlFmaSync,
            dataType: 'json',
            beforeSend: function () {
                jQuery.fancybox.close();
                jQuery('#loaderc').css('height', jQuery(window).height() + 'px');
                jQuery('#loader').css('margin-top', (jQuery(window).height() / 2) - 50 + 'px');
                jQuery('#loader').css('margin-left', (jQuery(window).width() / 2) - 50 + 'px');
                jQuery('#loaderc').fadeIn('fast');
                semaforo = false;
            },
            error: function (jqXHR, textStatus, errorThrown) {
                semaforo = true;

                if (jqXHR.status == 500) {
                    alert('Search engine temporary down for maintenance. Please try again later. Apologies for the inconvenience');
                } else {
                    alert('Error parsing you request!\nPlease report this bug at https://github.com/EAGLE-BPN/Inscription-Search-Engine');
                }
                jQuery('#loaderc').fadeOut('fast');
            },
            success: function (data) {
                semaforo = true;
                jQuery('#loaderc').fadeOut('fast');
                fbox = jQuery.fancybox(data.msg);
                Search.archivesRelist('results', 0);
            }
        });
    };

    Search.fmaDeleteAll = function () {
        jQuery.ajax({
            type: 'POST',
            url: wpUrlFmaDeleteAll,
            dataType: 'json',
            beforeSend: function () {
                jQuery.fancybox.close();
                jQuery('#loaderc').css('height', jQuery(window).height() + 'px');
                jQuery('#loader').css('margin-top', (jQuery(window).height() / 2) - 50 + 'px');
                jQuery('#loader').css('margin-left', (jQuery(window).width() / 2) - 50 + 'px');
                jQuery('#loaderc').fadeIn('fast');
                semaforo = false;
            },
            error: function (jqXHR, textStatus, errorThrown) {
                semaforo = true;

                if (jqXHR.status == 503) {
                    alert('Search engine temporary down for maintenance. Please try again later. Apologies for the inconvenience');
                } else {
                    alert('Error parsing you request!\nPlease report this bug at https://github.com/EAGLE-BPN/Inscription-Search-Engine');
                }
                jQuery('#loaderc').fadeOut('fast');
            },
            success: function (data) {
                semaforo = true;
                jQuery('#loaderc').fadeOut('fast');
                fbox = jQuery.fancybox(data.msg);
            }
        });
    };

    Search.archivesModifySave = function (type, tableid, row) {
        if (semaforo) {
            var comment = jQuery.trim(jQuery("#editComment").val());
            var title = jQuery.trim(jQuery("#editTitle").val());
            jQuery.ajax({
                type: 'POST',
                url: wpUrlArchivesAjax,
                dataType: 'json',
                data: 'myaction=edit&type=' + type + '&tableid=' + tableid + '&comment=' + comment + '&title=' + title,
                beforeSend: function () {
                    jQuery.fancybox.close();
                    jQuery('#loaderc').css('height', jQuery(window).height() + 'px');
                    jQuery('#loader').css('margin-top', (jQuery(window).height() / 2) - 50 + 'px');
                    jQuery('#loader').css('margin-left', (jQuery(window).width() / 2) - 50 + 'px');
                    jQuery('#loaderc').fadeIn('fast');
                    semaforo = false;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    semaforo = true;

                    if (jqXHR.status == 500) {
                        alert('Search engine temporary down for maintenance. Please try again later. Apologies for the inconvenience');
                    } else {
                        alert('Error parsing you request!\nPlease report this bug at https://github.com/EAGLE-BPN/Inscription-Search-Engine');
                    }
                    jQuery('#loaderc').fadeOut('fast');
                },
                success: function (data) {
                    jQuery('#loaderc').fadeOut('fast');
                    semaforo = true;
                    if (data.error) {
                        /*Modifiche apportate aggiorno la riga*/
                        var td_list = jQuery("table.tableArchives tr#row" + row + " td");
                        jQuery(td_list[1]).html(title);
                    }
                    fbox = jQuery.fancybox(data.msg);
                }
            });
        }
    };

    Search.archivesDelete = function (type, tableid, row) {
        if (semaforo) {
            jQuery.ajax({
                type: 'POST',
                url: wpUrlArchivesAjax,
                dataType: 'json',
                data: 'myaction=delete&type=' + type + '&tableid=' + tableid,
                beforeSend: function () {
                    jQuery.fancybox.close();
                    jQuery('#loaderc').css('height', jQuery(window).height() + 'px');
                    jQuery('#loader').css('margin-top', (jQuery(window).height() / 2) - 50 + 'px');
                    jQuery('#loader').css('margin-left', (jQuery(window).width() / 2) - 50 + 'px');
                    jQuery('#loaderc').fadeIn('fast');
                    semaforo = false;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    semaforo = true;

                    if (jqXHR.status == 500) {
                        alert('Search engine temporary down for maintenance. Please try again later. Apologies for the inconvenience');
                    } else {
                        alert('Error parsing you request!\nPlease report this bug at https://github.com/EAGLE-BPN/Inscription-Search-Engine');
                    }
                    jQuery('#loaderc').fadeOut('fast');
                },
                success: function (data) {
                    jQuery('#loaderc').fadeOut('fast');
                    semaforo = true;
                    if (!data.error)
                    {
                        jQuery("table.tableArchives tr#row" + row).remove();
                    } else
                        fbox = jQuery.fancybox(data.msg);
                }
            });
        }
    };

    Search.deleteAllArchives = function () {
        jQuery.fancybox.close();
        jQuery('#loaderc').css('height', jQuery(window).height() + 'px');
        jQuery('#loader').css('margin-top', (jQuery(window).height() / 2) - 50 + 'px');
        jQuery('#loader').css('margin-left', (jQuery(window).width() / 2) - 50 + 'px');
        jQuery('#loaderc').fadeIn('fast');

        jQuery("table.tableArchives input:checked").each(function (index, element) {
            var myel = jQuery(element);
            var row = myel.parent().parent().attr("id");
            archivesDelete(myel.attr("mytype"), myel.attr("tableid"), row);
        });



        jQuery('#loaderc').fadeOut('fast');
    };

    Search.archivesRelist = function (type, archivePage) {
        if (semaforo) {
            jQuery.ajax({
                type: 'POST',
                url: wpUrlArchivesAjax,
                dataType: 'json',
                data: 'myaction=list&type=' + type + '&page=' + archivePage,
                beforeSend: function () {
                    jQuery.fancybox.close();
                    jQuery('#loaderc').css('height', jQuery(window).height() + 'px');
                    jQuery('#loader').css('margin-top', (jQuery(window).height() / 2) - 50 + 'px');
                    jQuery('#loader').css('margin-left', (jQuery(window).width() / 2) - 50 + 'px');
                    jQuery('#loaderc').fadeIn('fast');
                    semaforo = false;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    semaforo = true;

                    if (jqXHR.status == 500) {
                        alert('Search engine temporary down for maintenance. Please try again later. Apologies for the inconvenience');
                    } else {
                        alert('Error parsing you request!\nPlease report this bug at https://github.com/EAGLE-BPN/Inscription-Search-Engine');
                    }
                    jQuery('#loaderc').fadeOut('fast');
                },
                success: function (data) {
                    jQuery('#loaderc').fadeOut('fast');
                    if (view !== "") {
                        jQuery("div.mysearchdiv").html(archivesDom);
                        state = 0;
                    }
                    archiveElement = null;
                    semaforo = true;
                    if (!data.error) {
                        elegantDataIn('archivesCont', data.html);

                    } else
                        fbox = jQuery.fancybox(data.msg);
                    canonicalReset();
                    /*selected menu*/
                    var li_list = jQuery("ul.arcmenu li");
                    if (type === 'results') {
                        var toAdd = jQuery(li_list[0]);
                        var toRemove = jQuery(li_list[1]);
                        if (!toAdd.hasClass('selected'))
                            toAdd.addClass('selected');
                        if (toRemove.hasClass('selected'))
                            toRemove.removeClass('selected');
                    } else {
                        var toAdd = jQuery(li_list[1]);
                        var toRemove = jQuery(li_list[0]);
                        if (!toAdd.hasClass('selected'))
                            toAdd.addClass('selected');
                        if (toRemove.hasClass('selected'))
                            toRemove.removeClass('selected');
                    }

                }
            });
        }
    };


    Search.simpleFacetCacheRefresh = function () {
        searchType = 0;
        selectedLangiso = jQuery("select#lang option:selected").val();
        updateCacheFacet('all');
    };

    Search.advFacetCacheRefresh = function () {
        searchType = 1;
        selectedLangiso = jQuery("select#lang option:selected").val();
        /*Update cache dei Facet e se definita una ricerca rigenera il menù dei facet*/
        updateCacheFacet('all');
        /*Invalido la cache locale dei campi per il cambio di lingua*/
        Search.advFieldCache = {};
        /*Update cache dei Fields (campi della ricerca avanzata) e ne aggiorna il contenuto.*/
        if (lastResponse !== "")
            Search.allFieldsSidebarReformer();
        else {
            Search.standardFieldsReformer();
            Search.dinamicFieldsReformer();
        }
    };

    Search.exportEpidoc = function (objectID) {
        window.open(
                "http://www.eagle-network.eu/epidoc/?objectid=" + objectID,
                "_blank"
                );
        //     window.location.href='http://www.eagle-network.eu/epidoc/?objectid='+objectID;
    };

    function restore(element) {
        element = jQuery(element.target);
        element.val("");
        element.css("color", "black");
        element.css("background-color", "white");
    }

    function registerErrosHandler(errosObj) {
        registerErrors = errosObj;
        var element = 0;
        for (element in registerErrors) {
            if (registerErrors.hasOwnProperty(element)) {
                var localHelement = registerErrors[element];
                localHelement.css("color", "white");
                localHelement.css("background-color", "red");
                localHelement.click(function (event) {
                    restore(event);
                });
            }
        }
    }

    function parse_register_fields(container) {
        registerFields = {};
        registerErrors = {};
        var username = jQuery("div#" + container + " input[name=username]");
        if (username !== undefined && jQuery.trim(username.val()) !== "") {
            registerFields["username"] = jQuery.trim(username.val());
        } else {
            registerErrors["username"] = username;
        }

        var first_name = jQuery("div#" + container + " input[name=first_name]");
        if (first_name !== undefined && jQuery.trim(first_name.val()) !== "") {
            registerFields["first_name"] = jQuery.trim(first_name.val());
        } else {
            registerErrors["first_name"] = first_name;
        }

        var last_name = jQuery("div#" + container + " input[name=last_name]");
        if (last_name !== undefined && jQuery.trim(last_name.val()) !== "") {
            registerFields["last_name"] = jQuery.trim(last_name.val());
        } else {
            registerErrors["last_name"] = last_name;
        }

        var email = jQuery("div#" + container + " input[name=email]");
        if (email !== undefined && jQuery.trim(email.val()) !== "") {
            registerFields["email"] = jQuery.trim(email.val());
        } else {
            registerErrors["email"] = email;
        }

        var grecaptcharesponse = jQuery("textarea#g-recaptcha-response");
        if (grecaptcharesponse !== undefined && jQuery.trim(grecaptcharesponse.val()) !== "") {
            registerFields["grecaptcharesponse"] = jQuery.trim(grecaptcharesponse.val());
        }



        return (jsObjectSize(registerErrors)) ? false : true;
    }

    function jsObjectSize(obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key))
                size++;
        }
        return size;
    }

    function archivesDelete(type, tableid, row) {
        jQuery.ajax({
            type: 'POST',
            url: wpUrlArchivesAjax,
            dataType: 'json',
            data: 'myaction=delete&type=' + type + '&tableid=' + tableid,
            beforeSend: function () {
            },
            error: function (jqXHR, textStatus, errorThrown) {
                semaforo = true;

                if (jqXHR.status == 500) {
                    alert('Search engine temporary down for maintenance. Please try again later. Apologies for the inconvenience');
                } else {
                    alert('Error parsing you request!\nPlease report this bug at https://github.com/EAGLE-BPN/Inscription-Search-Engine');
                }
                jQuery('#loaderc').fadeOut('fast');
            },
            success: function (data) {

                if (!data.error)
                {
                    jQuery("table.tableArchives tr#" + row).remove();
                }

            }
        });
    }
    ;


    function elegantDataIn(elementID, data) {
        if (archiveElement !== null)
            jQuery("div.mysearchdiv").html(archiveElement);
        var myelement = jQuery("#" + elementID);
        myelement.slideUp("fast", function () {
            myelement.html("");
            myelement.append(data);
            myelement.slideDown("normal");
        });
    }

    function createSidebarFacet(facetListObject) {
        jQuery("#facet_list").html("");
        var generalUl = '<div class="mainFacetDiv">';
        var localUl = '';
        for (var property in facetListObject) {
            localUl = '<ul class="localFacetUl">';
            if (property === "ancientfindspotforbrowsing"
                    || property === "modernfindspotforbrowsing"
                    || property === "repositorynameforbrowsing"
//                    || property === "datingvoc"
//                    || property === "decorationvoc"
//                    || property === "inscriptiontypevoc"
//                    || property === "materialvoc"
//                    || property === "objecttypevoc"
//                    || property === "stateofpreservationvoc"
//                    || property === "stateofpreservationvoc"
                    ) {
                /*Non devo tredurre i nomi delle uri in label ma prendere quelli restituiti*/
                /*Ricavo il nome del campo e le traduzioni dei label*/
                //var pFN = property;
                var pFN = (property === 'repositorynameforbrowsing') ? 'content provider' : property.substring(0, property.length - 11);

                //generalUl += '<label onclick="Search.slideFacet(this);" class="facetName">' + pFN + '</label>';
                var i = 0;
                var facetElements = 0;
                for (var facetVal in facetListObject[property]) {
                    facetElements++;
                    localFacetName = facetVal;
                    lacalFacetHash = localFacetName.hashCode();
                    localFacetNumber = facetListObject[property][facetVal];
                    localUl += (localFacetNumber === 0) ? '<li id="' + pFN.replace(/ /, "-").toLowerCase() + lacalFacetHash + '" ><input disabled data="' + property + '" type="checkbox" class="facetCheck" value="' + localFacetName + '" /><strong class="facetLabel">' + localFacetName + '</strong><span  class="facetQty">(' + localFacetNumber + ')</span></li>' : '<li id="' + pFN.replace(/ /, "-").toLowerCase() + lacalFacetHash + '"><input data="' + property + '" type="checkbox" class="facetCheck" value="' + localFacetName + '" /><strong class="facetLabel">' + localFacetName + '</strong><span class="facetQty ">(' + localFacetNumber + ')</span></li>';
                    i++;
                }
                generalUl += (facetElements > 0) ? '<label onclick="Search.slideFacet(this);" class="facetName">' + pFN + '</label><br/>' : '<label  class="facetNameNoSlide">' + pFN + '</label><span class="facetQty ">(0)</span><br/>';
            } else {
                /*Ricavo il nome del campo e le traduzioni dei label*/
                var pFN = getPropertyFacetNameInCache(property);
                //generalUl += '<label onclick="Search.slideFacet(this);" class="facetName">' + pFN + '</label>';
                var i = 0;
                var facetElements = 0;
                for (var facetVal in facetListObject[property]) {
                    facetElements++;
                    localFacetName = getPropertyFacetValueInCache(property, facetVal);
                    localFacetUri = facetVal;
//                    if (localFacetName === false)
//                        localFacetName = localFacetUri;
                    if (localFacetName === false)
                        continue;
                    lacalFacetHash = localFacetName.hashCode();
                    localFacetNumber = facetListObject[property][facetVal];
                    localUl += (localFacetNumber === 0) ? '<li id="' + pFN.replace(/ /, "-").toLowerCase() + lacalFacetHash + '"><input disabled data="' + property + '" type="checkbox" class="facetCheck" value="' + localFacetUri + '" /><strong class="facetLabel">' + localFacetName + '</strong><span class="facetQty">(' + localFacetNumber + ')</span></li>' : '<li id="' + pFN.replace(/ /, "-").toLowerCase() + lacalFacetHash + '"><input data="' + property + '" type="checkbox" class="facetCheck" value="' + localFacetUri + '" /><strong class="facetLabel">' + localFacetName + '</strong><span class="facetQty ">(' + localFacetNumber + ')</span></li>';
                    i++;
                }
                generalUl += (facetElements > 0) ? '<label onclick="Search.slideFacet(this);" class="facetName">' + pFN + '</label><br/>' : '<label  class="facetNameNoSlide">' + pFN + '</label><span class="facetQty ">(0)</span><br/>';
            }
            localUl += '</ul>';
            generalUl += localUl;
        }
        generalUl += '</div>'
        jQuery("li#facet_list").append(generalUl);
    }

    function refreshSidebarFacet(facetListObject) {
        for (var property in facetListObject) {
            if (property === "ancientfindspotforbrowsing"
                    || property === "modernfindspotforbrowsing"
                    || property === "repositorynameforbrowsing"
//                    || property === "datingvoc"
//                    || property === "decorationvoc"
//                    || property === "inscriptiontypevoc"
//                    || property === "materialvoc"
//                    || property === "objecttypevoc"
//                    || property === "stateofpreservationvoc"
//                    || property === "stateofpreservationvoc"
                    ) {
                /*Non devo tredurre i nomi delle uri in label ma prendere quelli restituiti*/
                /*Ricavo il nome del campo e le traduzioni dei label*/
                //var pFN = property;
                var pFN = property.substring(0, property.length - 11);
                //generalUl += '<label onclick="Search.slideFacet(this);" class="facetName">' + pFN + '</label>';
                var i = 0;
                for (var facetVal in facetListObject[property]) {
                    lacalFacetHash = facetVal.hashCode();
                    var id = pFN.replace(/ /, "-").toLowerCase() + lacalFacetHash;
                    var htmlElement = '(' + facetListObject[property][facetVal] + ')';
                    jQuery("li#" + id + " span.facetQty").html(htmlElement);
                    i++;
                }
            } else {
                /*Ricavo il nome del campo e le traduzioni dei label*/
                var pFN = getPropertyFacetNameInCache(property);
                var i = 0;
                for (var facetVal in facetListObject[property]) {
                    
                    var localFacetName = getPropertyFacetValueInCache(property, facetVal);
                    var htmlElement = '(' + facetListObject[property][facetVal] + ')';
                    if (localFacetName !== false) {
                        lacalFacetHash = localFacetName.hashCode();
                        var id = pFN.replace(/ /, "-").toLowerCase() + lacalFacetHash;
                        jQuery("li#" + id + " strong.facetLabel").html(localFacetName);
                        jQuery("li#" + id + " span.facetQty").html(htmlElement);
                        jQuery("li#" + id).css('display', 'list-item');
                    }
//                    else{
//                        lacalFacetHash = localFacetName.hashCode();
//                        var id = pFN.replace(/ /, "-").toLowerCase() + lacalFacetHash;
//                        jQuery("li#" + id).css('display', 'none');
//                    }
                    i++;
                }
            }
        }
    }



    function saveDomElement() {
        archiveElement = jQuery("div.mysearchdiv").html();
        jQuery(".search-padder").remove();
        jQuery(".mysearchdiv").html("");
    }

    function getPropertyFacetNameInCache(facetname) {
        var val = Search.advFacetCache[facetname];
        return (val !== undefined) ? val.vocName : facetname;
    }

    function getPropertyFacetValueInCache(facetname, uri) {
        //var tmp = uri.replace("http://", "");
        //var tmp = uri;
        for (i in Search.advFacetCache[facetname]) {
            if (Search.advFacetCache[facetname].hasOwnProperty(i)) {
                var v = Search.advFacetCache[facetname][i];
                if (v.vocValue === uri)
                    return v.vocLabel;
            }
        }
        return false;
    }

    function updateCacheFields(fieldName) {
        if (semaforo) {
            jQuery.ajax({
                type: 'POST',
                url: wpUrlGetFieldsAjax,
                dataType: 'json',
                data: 'voc=' + fieldName + '&langiso=' + selectedLangiso,
                async: false,
                beforeSend: function () {
                    semaforo = false;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    semaforo = true;

                    if (jqXHR.status == 500) {
                        alert('Search engine temporary down for maintenance. Please try again later. Apologies for the inconvenience');
                    } else {
                        alert('Error parsing you request!\nPlease report this bug at https://github.com/EAGLE-BPN/Inscription-Search-Engine');
                    }
                    jQuery('#loaderc').fadeOut('fast');
                },
                success: function (data) {
                    if (fieldName == 'all') {
                        for (var i = 0; i < data.length; i++) {
                            Search.advFieldCache[data[i].fieldName] = data[i].fieldData;
                        }
                    } else {
                        Search.advFieldCache[fieldName] = data;
                    }
                    semaforo = true;

                }
            });
        }
    }
    ;

    function updateCacheFacet(facetName) {
        if (semaforo) {
            jQuery.ajax({
                type: 'POST',
                url: wpUrlGetFacetsAjax,
                dataType: 'json',
                data: 'voc=' + facetName + '&langiso=' + selectedLangiso,
                async: false,
                beforeSend: function () {
                    semaforo = false;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    semaforo = true;

                    if (jqXHR.status == 500) {
                        alert('Search engine temporary down for maintenance. Please try again later. Apologies for the inconvenience');
                    } else {
                        alert('Error parsing you request!\nPlease report this bug at https://github.com/EAGLE-BPN/Inscription-Search-Engine');
                    }
                    jQuery('#loaderc').fadeOut('fast');
                },
                success: function (data) {
                    if (facetName == 'all') {
                        for (var i = 0; i < data.length; i++) {
                            Search.advFacetCache[data[i].fieldName] = data[i].fieldData;
                        }
                    } else {
                        Search.advFacetCache[facetName] = data;
                    }
                    if (lastResponse !== "") {
                        //createSidebarFacet(lastResponse.facet_counts.facet_fields);
                        refreshSidebarFacet(lastResponse.facet_counts.facet_fields);
                    }
                    semaforo = true;
                }
            });
        }
    }
    ;

    function canonicalReset() {
        artifactSelectedCol = -1;
        artifactSelectedRow = -1;
        jQuery("h1.page_title").html("SEARCH INSCRIPTIONS");
    }

    function getAdvField(fieldData) {
        var field = '';
        if (fieldData.voc === 1) {
            field += '<select onkeydown="Search.advKeySearch(event);" class="search-element select" name="' + fieldData.name + '" ><option selected="selected" value="" >' + fieldData.value + '</option>';
            for (i in Search.advFieldCache[fieldData.name]) {
                if (Search.advFieldCache[fieldData.name].hasOwnProperty(i)) {
                    v = Search.advFieldCache[fieldData.name][i];
                    field += (advFields[fieldData.name] !== undefined && advFields[fieldData.name] === v.vocValue) ? '<option selected="selected" value="' + v.vocValue + '" >' + v.vocLabel + '</option>' : '<option value="' + v.vocValue + '" >' + v.vocLabel + '</option>';
                }
            }
            field += '</select><br/>';
        } else if (fieldData.type === 'INPUT') {
            field += (advFields[fieldData.name] !== undefined) ? '<input type="text" placeholder="' + fieldData.value + '" onkeydown="Search.advKeySearch(event);" onclick="Search.resetAdvText(this);" class="search-element input" name="' + fieldData.name + '" value="' + advFields[fieldData.name] + '" /><br/>' : '<input type="text" placeholder="' + fieldData.value + '" onkeydown="Search.advKeySearch(event);" onclick="Search.resetAdvText(this);" class="search-element input" name="' + fieldData.name + '" value="" /><br/>';
        } else if (fieldData.type === 'TEXTAREA') {
            field += (advFields[fieldData.name] !== undefined) ? '<textarea placeholder="' + fieldData.value + '" onkeydown="Search.advKeySearch(event);" onclick="Search.resetAdvTextarea(this);" class="search-element textareat" name="' + fieldData.name + '" >' + advFields[fieldData.name] + '</textarea><br/>' : '<textarea placeholder="' + fieldData.value + '" onkeydown="Search.advKeySearch(event);" onclick="Search.resetAdvTextarea(this);" class="search-element textareat" name="' + fieldData.name + '" ></textarea><br/>';
        }
        return field;
    }

    function prepareSidebar() {
        var $inputs = jQuery(".adv-vocabol input:checked");
        jQuery(".side-adv-research").html("");
        $inputs.each(function () {
            /*ottengo l'elemento della ricerca*/
            $element = jQuery(this);
            var str = $element.attr("data");
            if (str !== undefined) {
                var data = JSON.parse(str);
                var field = getAdvField(data);
                jQuery(".side-adv-research").append(field);
            }

        });



//        var field = (advFields["inscriptiontext"] !== undefined) ? '<textarea onkeydown="Search.advKeySearch(event);" onclick="Search.resetAdvTextarea(this);" class="search-element textareat" name="inscriptiontext" >' + advFields["inscriptiontext"] + '</textarea><br/>' : '<textarea onkeydown="Search.advKeySearch(event);" onclick="Search.resetAdvTextarea(this);" class="search-element textareat" name="inscriptiontext" placeholder="Text of the inscription" ></textarea><br/>';
//        jQuery(".side-adv-research").append(field);
//
//        var field = '<select onkeydown="Search.advKeySearch(event);" class="search-element select" name="objecttypevoc" ><option  value="" >Object Type</option>';
//        for (i in Search.advFieldCache.objecttypevoc) {
//            if (Search.advFieldCache.objecttypevoc.hasOwnProperty(i)) {
//                v = Search.advFieldCache.objecttypevoc[i];
//                field += (advFields["objecttypevoc"] === v.vocValue) ? '<option selected="selected" value="' + v.vocValue + '" >' + v.vocLabel + '</option>' : '<option value="' + v.vocValue + '" >' + v.vocLabel + '</option>';
//            }
//        }
//        field += '</select>';
//        jQuery(".side-adv-research").append(field);
//
//        appender = (advFields["ancientfindspot"] !== undefined) ? '<input onkeydown="Search.advKeySearch(event);" onclick="Search.resetAdvText(this);" class="search-element input" name="ancientfindspot" value="' + advFields["ancientfindspot"] + '" /><br/>' : '<input onkeydown="Search.advKeySearch(event);" onclick="Search.resetAdvText(this);" class="search-element input" name="ancientfindspot" value="" placeholder="Ancient spot" /><br/>';
//        jQuery(".side-adv-research").append(appender);
//
//
//
//        field = '<select onkeydown="Search.advKeySearch(event);" class="search-element select" name="inscriptiontypevoc" ><option selected="selected" value="" >Type of Inscription</option>';
//        for (i in Search.advFieldCache.inscriptiontypevoc) {
//            if (Search.advFieldCache.inscriptiontypevoc.hasOwnProperty(i)) {
//                v = Search.advFieldCache.inscriptiontypevoc[i];
//                field += (advFields["inscriptiontypevoc"] === v.vocValue) ? '<option  selected="selected" value="' + v.vocValue + '" >' + v.vocLabel + '</option>' : '<option value="' + v.vocValue + '" >' + v.vocLabel + '</option>';
//            }
//        }
//        field += '</select>';
//        jQuery(".side-adv-research").append(field);


        /*DATE HIDE*/
//        field = '<select onkeydown="Search.advKeySearch(event);" class="search-element select" name="datingvoc" ><option selected="selected" value="" >Date</option>';
//        for (i in Search.advFieldCache.datingvoc) {
//            if (Search.advFieldCache.datingvoc.hasOwnProperty(i)) {
//                v = Search.advFieldCache.datingvoc[i];
//                field += (advFields["datingvoc"] === v.vocValue) ? '<option selected="selected" value="' + v.vocValue + '" >' + v.vocLabel + '</option>' : '<option value="' + v.vocValue + '" >' + v.vocLabel + '</option>';
//            }
//        }
//        field += '</select>';
//        jQuery(".side-adv-research").append(field);


//        field = (advFields["bibliography"] !== undefined) ? '<textarea onkeydown="Search.advKeySearch(event);" onclick="Search.resetAdvTextarea(this);" class="search-element textareab" name="bibliography" >' + advFields["bibliography"] + '</textarea><br/>' : '<textarea onkeydown="Search.advKeySearch(event);" onclick="Search.resetAdvTextarea(this);" class="search-element textareab" name="bibliografhy" placeholder="Bibliography" ></textarea><br/>';
//        jQuery(".side-adv-research").append(field);
//
//        /*MOD Dynamic fields refill*/
//        field = allowedAdvFields["modernfindspot"];
//        if (field !== undefined) {
//            field = '<input onkeydown="Search.advKeySearch(event);" onclick="Search.resetAdvText(this);" class="search-element input" name="modernfindspot" value="' + advFields["modernfindspot"] + '" /><br/>';
//            jQuery(".side-adv-research").append(field);
//        }
//
//        if (advFields["decorationvoc"] !== undefined) {
//            field = '<select onkeydown="Search.advKeySearch(event);" class="search-element select" name="decorationvoc" ><option  value="-1" >Decoration</option>';
//            for (i in Search.advFieldCache.decorationvoc) {
//                if (Search.advFieldCache.decorationvoc.hasOwnProperty(i)) {
//                    v = Search.advFieldCache.decorationvoc[i];
//                    field += (advFields["decorationvoc"] === v.vocValue) ? '<option selected="selected" value="' + v.vocValue + '" >' + v.vocLabel + '</option>' : '<option value="' + v.vocValue + '" >' + v.vocLabel + '</option>';
//                }
//            }
//            field += '</select>';
//            jQuery(".side-adv-research").append(field);
//        }
//
//        if (advFields["materialvoc"] !== undefined) {
//            field = '<select onkeydown="Search.advKeySearch(event);" class="search-element select" name="materialvoc" ><option  value="-1" >Material</option>';
//            for (i in Search.advFieldCache.materialvoc) {
//                if (Search.advFieldCache.materialvoc.hasOwnProperty(i)) {
//                    v = Search.advFieldCache.materialvoc[i];
//                    field += (advFields["materialvoc"] === v.vocValue) ? '<option selected="selected" value="' + v.vocValue + '" >' + v.vocLabel + '</option>' : '<option value="' + v.vocValue + '" >' + v.vocLabel + '</option>';
//                }
//            }
//            field += '</select>';
//            jQuery(".side-adv-research").append(field);
//        }
//
//        if (advFields["writingtypevoc"] !== undefined) {
//            field = '<select onkeydown="Search.advKeySearch(event);" class="search-element select" name="writingtypevoc" ><option  value="-1" >Type of writing</option>';
//            for (i in Search.advFieldCache.writingtypevoc) {
//                if (Search.advFieldCache.writingtypevoc.hasOwnProperty(i)) {
//                    v = Search.advFieldCache.writingtypevoc[i];
//                    field += (advFields["writingtypevoc"] === v.vocValue) ? '<option selected="selected" value="' + v.vocValue + '" >' + v.vocLabel + '</option>' : '<option value="' + v.vocValue + '" >' + v.vocLabel + '</option>';
//                }
//            }
//            field += '</select>';
//            jQuery(".side-adv-research").append(field);
//        }
//
//        if (advFields["stateofpreservationvoc"] !== undefined) {
//            field = '<select onkeydown="Search.advKeySearch(event);" class="search-element select" name="stateofpreservationvoc" ><option  value="-1" >State of preservation</option>';
//            for (i in Search.advFieldCache.stateofpreservationvoc) {
//                if (Search.advFieldCache.stateofpreservationvoc.hasOwnProperty(i)) {
//                    v = Search.advFieldCache.stateofpreservationvoc[i];
//                    field += (advFields["stateofpreservationvoc"] === v.vocValue) ? '<option selected="selected" value="' + v.vocValue + '" >' + v.vocLabel + '</option>' : '<option value="' + v.vocValue + '" >' + v.vocLabel + '</option>';
//                }
//            }
//            field += '</select>';
//            jQuery(".side-adv-research").append(field);
//        }
//
//        if (advFields["socialstatus"] !== undefined) {
//            field = '<input onkeydown="Search.advKeySearch(event);" onclick="Search.resetAdvText(this);" class="search-element input" name="socialstatus" value="' + advFields["socialstatus"] + '" /><br/>';
//            jQuery(".side-adv-research").append(field);
//        }
        /*END----> MOD Dynamic fields refill*/

        jQuery(".side-adv-research").append('<br/><button onclick="Search.advSearch(\'documental\');" class="action-button" id="send">Search</button>');
    }

    function parseAdvFields() {
        advFields = {};
        var inscriptiontext = jQuery("textarea[name=inscriptiontext]");
        if (inscriptiontext !== undefined && jQuery.trim(inscriptiontext.val()) !== "Text of the inscription" && jQuery.trim(inscriptiontext.val()) !== "") {
            advFields["inscriptiontext"] = jQuery.trim(inscriptiontext.val());
        }

        var objecttypevoc = jQuery("select[name=objecttypevoc] option:selected");
        if (objecttypevoc !== undefined && jQuery.trim(objecttypevoc.val()) !== "") {
            advFields["objecttypevoc"] = jQuery.trim(objecttypevoc.val());
        }

        var ancientfindspot = jQuery("input[name=ancientfindspot]");
        if (ancientfindspot !== undefined && jQuery.trim(ancientfindspot.val()) !== "Ancient findspot" && jQuery.trim(ancientfindspot.val()) !== "") {
            advFields["ancientfindspot"] = jQuery.trim(ancientfindspot.val());
        }

        var inscriptiontypevoc = jQuery("select[name=inscriptiontypevoc] option:selected");
        if (inscriptiontypevoc !== undefined && jQuery.trim(inscriptiontypevoc.val()) !== "") {
            advFields["inscriptiontypevoc"] = jQuery.trim(inscriptiontypevoc.val());
        }

//        var datingvoc = jQuery("select[name=datingvoc] option:selected");
//        if (datingvoc !== undefined && jQuery.trim(datingvoc.val()) !== "") {
//            advFields["datingvoc"] = jQuery.trim(datingvoc.val());
//        }

        var bibliography = jQuery("textarea[name=bibliography]");
        if (bibliography !== undefined && jQuery.trim(bibliography.val()) !== "Bibliography" && jQuery.trim(bibliography.val()) !== "") {
            advFields["bibliography"] = jQuery.trim(bibliography.val());
        }

        /*
         * Dynamic fields section 
         */

        var modernfindspot = jQuery("input[name=modernfindspot]");
        if (modernfindspot !== undefined && jQuery.trim(modernfindspot.val()) !== "Modern findspot" && jQuery.trim(modernfindspot.val()) !== "") {
//            advFields.push({"ancientfindspot": jQuery.trim(ancientfindspot.val())});
            advFields["modernfindspot"] = jQuery.trim(modernfindspot.val());
        }

        var decorationvoc = jQuery("select[name=decorationvoc] option:selected");
        if (decorationvoc !== undefined && jQuery.trim(decorationvoc.val()) !== "") {
//            advFields.push({"datingvoc": jQuery.trim(datingvoc.val())});
            advFields["decorationvoc"] = jQuery.trim(decorationvoc.val());
        }

        var materialvoc = jQuery("select[name=materialvoc] option:selected");
        if (materialvoc !== undefined && jQuery.trim(materialvoc.val()) !== "") {
//            advFields.push({"datingvoc": jQuery.trim(datingvoc.val())});
            advFields["materialvoc"] = jQuery.trim(materialvoc.val());
        }

        var writingtypevoc = jQuery("select[name=writingtypevoc] option:selected");
        if (writingtypevoc !== undefined && jQuery.trim(writingtypevoc.val()) !== "") {
//            advFields.push({"datingvoc": jQuery.trim(datingvoc.val())});
            advFields["writingtypevoc"] = jQuery.trim(writingtypevoc.val());
        }

        var stateofpreservationvoc = jQuery("select[name=stateofpreservationvoc] option:selected");
        if (stateofpreservationvoc !== undefined && jQuery.trim(stateofpreservationvoc.val()) !== "") {
//            advFields.push({"datingvoc": jQuery.trim(datingvoc.val())});
            advFields["stateofpreservationvoc"] = jQuery.trim(stateofpreservationvoc.val());
        }

        var socialstatus = jQuery("input[name=socialstatus]");
        if (socialstatus !== undefined && jQuery.trim(socialstatus.val()) !== "Social status of people mentioned" && jQuery.trim(socialstatus.val()) !== "") {
//            advFields.push({"ancientfindspot": jQuery.trim(ancientfindspot.val())});
            advFields["socialstatus"] = jQuery.trim(socialstatus.val());
        }

        var detailedspot = jQuery("input[name=detailedspot]");
        if (detailedspot !== undefined && jQuery.trim(detailedspot.val()) !== "Detailed findspot" && jQuery.trim(detailedspot.val()) !== "") {
//            advFields.push({"ancientfindspot": jQuery.trim(ancientfindspot.val())});
            advFields["detailedspot"] = jQuery.trim(detailedspot.val());
        }

        var location = jQuery("input[name=location]");
        if (location !== undefined && jQuery.trim(location.val()) !== "Location" && jQuery.trim(location.val()) !== "") {
//            advFields.push({"ancientfindspot": jQuery.trim(ancientfindspot.val())});
            advFields["location"] = jQuery.trim(location.val());
        }

        var notbefore = jQuery("input[name=notbefore]");
        if (notbefore !== undefined && jQuery.trim(notbefore.val()) !== "" && !isNaN(jQuery.trim(notbefore.val()))) {
//            advFields.push({"ancientfindspot": jQuery.trim(ancientfindspot.val())});
            advFields["notbefore"] = jQuery.trim(notbefore.val());
        }

        var notafter = jQuery("input[name=notafter]");
        if (notafter !== undefined && jQuery.trim(notafter.val()) !== "" && !isNaN(jQuery.trim(notafter.val()))) {
//            advFields.push({"ancientfindspot": jQuery.trim(ancientfindspot.val())});
            advFields["notafter"] = jQuery.trim(notafter.val());
        }

        var hasimage = jQuery("input[name=hasimage]");
        if (hasimage !== undefined) {
            if (hasimage.is(':checked'))
                advFields["hasimage"] = 'true';
//            else
//                advFields["hasimage"] = 'false';
        }



        var hastranslation = jQuery("input[name=hastranslation]");
        if (hastranslation !== undefined) {
            if (hastranslation.is(':checked'))
                advFields["hastranslation"] = 'true';
//            else
//                advFields["hastranslation"] = 'false';
        }

    }



    function parseRelFields() {
        relFields = {};


        var relobject = jQuery("input[name=relobject]");
        if (relobject !== undefined) {
            if (relobject.is(':checked'))
                relFields["objecttype"] = (jQuery.trim(relobject.val()) !== '') ? jQuery.trim(relobject.val()) : '###';
        }


        var relancient = jQuery("input[name=relancient]");
        if (relancient !== undefined) {
            if (relancient.is(':checked'))
                relFields["romanprovinceitalicregion"] = (jQuery.trim(relancient.val()) !== '') ? jQuery.trim(relancient.val()) : '###';
        }


        var reldecoration = jQuery("input[name=reldecoration]");
        if (reldecoration !== undefined) {
            if (reldecoration.is(':checked'))
                relFields["decoration"] = (jQuery.trim(reldecoration.val()) !== '') ? jQuery.trim(reldecoration.val()) : '###';
        }


        var relmaterial = jQuery("input[name=relmaterial]");
        if (relmaterial !== undefined) {
            if (relmaterial.is(':checked'))
                relFields["material"] = (jQuery.trim(relmaterial.val()) !== '') ? jQuery.trim(relmaterial.val()) : '###';
        }


        var reltype = jQuery("input[name=reltype]");
        if (reltype !== undefined) {
            if (reltype.is(':checked'))
                relFields["inscriptiontype"] = (jQuery.trim(reltype.val()) !== '') ? jQuery.trim(reltype.val()) : '###';
        }


        var relmodern = jQuery("input[name=relmodern]");
        if (relmodern !== undefined) {
            if (relmodern.is(':checked'))
                relFields["modernfindspot"] = (jQuery.trim(relmodern.val()) !== '') ? jQuery.trim(relmodern.val()) : '###';
        }

    }



    function htmlMenuArt(row, col) {
        row = (view !== "") ? parseInt(row) + (10 * (page)) : parseInt(row);
        var element = lastResponse.grouped.tmid.groups[row];
        var i = 0;
        var html = '<ul class="menu-search">';
        //var element = preorder_by_criteria(row);
        TmidArr = new Array();
        do {
            var xmlDoc = jQuery.parseXML(element.doclist.docs[i].__result[0]);
            var xml = jQuery(xmlDoc);
            var linkNameArr = jQuery(xml.find("recordSourceInfo")[0]).text().split("/");
            linkNameArr = linkNameArr[linkNameArr.length - 1];
            if (TmidArr.indexOf(linkNameArr) === -1) {
                TmidArr.push(linkNameArr);
                html += (col === i) ? '<li onclick="Search.showArtifactExtraInfo(' + row + ',' + i + ',event);" class = "left selected">' + linkNameArr + '</li>' : '<li onclick="Search.showArtifactExtraInfo(' + row + ',' + i + ',event);" class = "left">' + linkNameArr + '</li>';
            }
            i++;
        } while (i < element.doclist.numFound);
        html += '</ul>';
        html += '<div class="clear">&nbsp;</div>';
        return html;

    }

    function htmlMenuArtArchives(row, col) {

        var element = lastResponse.grouped.tmid.groups[row];
        var i = 0;
        var html = '<ul class="menu-search">';

        //var element = preorder_by_criteria(row);

        TmidArr = new Array();
        do {
            var xmlDoc = jQuery.parseXML(element.doclist.docs[i].__result[0]);
            var xml = jQuery(xmlDoc);
            var linkNameArr = jQuery(xml.find("recordSourceInfo")[0]).text().split("/");
            linkNameArr = linkNameArr[linkNameArr.length - 1];
            if (TmidArr.indexOf(linkNameArr) === -1) {
                TmidArr.push(linkNameArr);
                html += (col === i) ? '<li onclick="Search.showArtifactExtraInfoArchives(' + row + ',' + i + ',event);" class = "left selected">' + linkNameArr + '</li>' : '<li onclick="Search.showArtifactExtraInfoArchives(' + row + ',' + i + ',event);" class = "left">' + linkNameArr + '</li>';
            }
            i++;
        } while (i < element.doclist.numFound);
        html += '</ul>';
        html += '<div class="clear">&nbsp;</div>';
        return html;

    }

    function htmlMenu(myentity) {
        var html = '<ul class="menu-search">';
        for (var i = 0; i < menu.length; i++) {
            html += (menu[i].entity === myentity) ? '<li onclick="Search.simpleSearchCtype(\'' + menu[i].entity + '\',0)" id="' + menu[i].label + '" class = "left selected">' + menu[i].label + '</li>' : '<li onclick="Search.simpleSearchCtype(\'' + menu[i].entity + '\',0)" id="' + menu[i].label + '" class = "left">' + menu[i].label + '</li>';
        }
        html += '</ul>';
        return html;
    }

    function htmlMenuAdv(myentity) {
        var html = '<ul class="menu-search">';
//        for (var i = 0; i < menu.length; i++) {
//            html += (menu[i].entity === myentity) ? '<li  class = "left selected">' + menu[i].label + '</li>' : '<li  class = "left">' + menu[i].label + '</li>';
//        }
        html += '<li  class = "left selected">ARTEFACTS</li>';
        html += '</ul>';
        return html;
    }
    function htmlMenuArchives(archType) {
        var html = '<ul class="menu-search arcmenu">';
        html += (archType === 'results') ? '<li class="left selected" onclick="Search.archivesRelist(\'results\',0);">Search results</li><li class="left" onclick="Search.archivesRelist(\'items\',0);">Single items</li>' : '<li class="left" onclick="Search.archivesRelist(\'results\',0);">Search results</li><li class="left selected" onclick="Search.archivesRelist(\'items\',0);">Single items</li>';
        html += '</ul>';
        return html;
    }


    function htmlContentLink(link, value) {
        var result = '';
        if (value) {
            if (link) {
                result = '<a target="blank" href="' + httpMatchReform(link) + '">' + value + '</a>';
            } else {
                result = '<span>' + value + '</span>';
            }
        } else {
            result = "not available";
        }
        return result;
    }

    function htmlContentArt(row, col) {
        row = (view !== "") ? parseInt(row) + (10 * (page)) : parseInt(row);
        //jQuery("#appender").remove();
        // var appender = '<div id="appender" style="display:none;">';

        var element = lastResponse.grouped.tmid.groups[row];
        var html = '';
        var xmlDoc = jQuery.parseXML(element.doclist.docs[col].__result[0]);
        var xml = jQuery(xmlDoc);
        html += '<div class="artDetMainC">';
        html += '<ul class="artSubMenu">';
//        onclick="window.location.href=\'basic-search\'"
        html += '<li class="left artMenu" onclick="Search.returnToList();" >Back to result list</li>';

        /*Bibliography info*/
        var bibliography = jQuery(xml.find("bibliography"));
        if (bibliography.length !== 0) {
            var bibliography_a = '<ul id="binline" class="biblioF">';
            for (var i = 0; i < bibliography.length; i++) {
                bibliography_a += '<li>' + jQuery(bibliography[i]).text() + '</li>';
            }
            bibliography_a += '</ul>';
            // appender += bibliography_a;
            fboxBibliography = bibliography_a;
            html += '<li class="left artMenu"><a onclick="Search.showBibliography();" class="" href="#">Bibliography</a></li>';
        } else
            fboxBibliography = '<p>not available</p>';

        /*Traslation info*/
        var translation = jQuery(xml.find("hasTranslation"));
        //var translation_a = (translation.length !== 0) ? '<a class="fancybox" href="#tinline">Traslation available</a>' : '<a style="cursor:text;" onclick="return false;" href="#">NO translation available</a>';
        var translation_a = '<a onclick="Search.showTranslation();" class="" href="#">View translations</a>';
        html += '<li class="left artMenu">' + translation_a + '</li>';
        //if (translation.length !== 0) {
        //    appender += (translation.length !== 0) ? '<div id="tinline" ><p>' + jQuery(translation[0]).find("text").text() + '</p></div>' : '';
        //}

        if (translation.length !== 0) {
            var translation_b = '';
            for (var i = 0; i < translation.length; i++) {
                translation_b += (jQuery(translation[i]).find("text").attr("lang")).toUpperCase() + " - " + jQuery(translation[i]).find("text").text() + '<br>';
            }
        }

        fboxTranslation = (translation.length !== 0) ? '<div id="tinline" ><p> <b>Translation</b><br>' + translation_b + 'For further information and for possible translations in other languages please visit the record page in the EAGLE MediaWiki at <a target="_blanck" href="' + jQuery(translation.find("recordSourceInfo")[0]).attr("landingPage") + '">' + jQuery(translation.find("recordSourceInfo")[0]).attr("landingPage") + '</a></p></div>' : '<div id="tinline" ><p>' + 'No translation available,<br>To request a new translation please contact <a href="mailto:info@eagle-network.eu">info@eagle-network.eu </a>.<br>To contribute with a new translation please visit <a href="https://wiki.eagle-network.eu/wiki/" target="_blank"> https://wiki.eagle-network.eu/wiki/</a>' + '</p></div>';


        //fboxTranslation = (translation.length !== 0) ? '<div id="tinline" ><p> <b>Translation</b><br>' + jQuery(translation[0]).find("text").text() + '<br>For further information and for possible translations in other languages please visit the record page in the EAGLE MediaWiki at <a target="_blanck" href="' + jQuery(translation.find("recordSourceInfo")[0]).attr("landingPage") + '">' + jQuery(translation.find("recordSourceInfo")[0]).attr("landingPage") + '</a></p></div>' : '<div id="tinline" ><p>' + 'No translation available,<br>To request a new translation please contact <a href="mailto:info@eagle-network.eu">info@eagle-network.eu </a>.<br>To contribute with a new translation please visit <a href="http://www.eagle-network.eu/wiki/" target="_blank"> http://www.eagle-network.eu/wiki/</a>' + '</p></div>';

        // fboxTranslation = (translation.length !== 0) ? '<div id="tinline" ><p><a target="_blanck" href="' + jQuery(translation.find("recordSourceInfo")[0]).attr("landingPage") + '">' + jQuery(translation[0]).find("text").text() + '</a></p></div>' : '<div id="tinline" ><p>' + 'No translation available, to contribute with a new translation please visit <a href="http://www.eagle-network.eu/wiki/" target="_blank"> http://www.eagle-network.eu/wiki/</a>' + '</p></div>';
        // appender += (translation.length !== 0) ? '<div id="tinline" ><p><a target="_blanck" href="' + jQuery(translation.find("recordSourceInfo")[0]).attr("landingPage") + '">' + jQuery(translation[0]).find("text").text() + '</a></p></div>' : '<div id="tinline" ><p>' + 'No translation available, to contribute with a new translation please visit <a href="http://www.eagle-network.eu/wiki/" target="_blank"> http://www.eagle-network.eu/wiki/</a>' + '</p></div>';

        var source = jQuery(xml.find("recordSourceInfo "));
        html += '<li class="left artMenu"><a target="_blanck" href="' + jQuery(source[0]).attr("landingPage") + '">Original source</a></li>';
        html += '<li onclick="Search.showFBoxSavingForm();" class="left artMenu">Save</li>';
        html += '<li onclick="Search.exportEpidoc(\'' + jQuery.trim(jQuery(xml.find("dnetResourceIdentifier")[0]).text()) + '\');" class="left artMenu">Export</li>';
        html += '<li onclick="Search.generatePDF();">PDF</li>';
        html += '</ul>';
        html += '<div class="clear">&nbsp;</div>';

        // appender += '</div>';

        if (entity === "visual")
        {
            var VisualRapresentation = jQuery(xml.find("VisualRepresentation"));

            var image = encodeURI(xml.find("thumbnail").text());
            var imageLarge = encodeURI(xml.find("url").text());

            if (imageLarge.length === 0)
                imageLarge = image;


            html += '<table><tr><td class="artFototc">';
//			    if (image.length !== 0) 
//			    {

            var visualdnet = xml.find("dnetResourceIdentifier").text();
            var pos = visualdnet.indexOf("visual");
            if (pos != -1)
            {
                visualdnet = visualdnet.substring(0, pos + 6);
            }

            var urlvisualdnet = visualdnet.replace("::", "..")
            urlvisualdnet = urlvisualdnet.replace("::", "..")
            urlvisualdnet = urlvisualdnet.replace("::", "..")
            urlvisualdnet = 'http://virserv101.isti.cnr.it/eagle-images/thumbnails/' + urlvisualdnet + '.jpg';
            html += '<div class="left galleryFotoC" ><a data-lightbox="roadtrip" title="' + visualdnet + '" href="' + imageLarge + '"><img data-dnetId="' + urlvisualdnet + '" src="' + urlvisualdnet + ' "onerror=this.onerror=null;this.src="' + image + '" /></a></div>';
            html += '<div class="clear">&nbsp;</div>';
//			}	
            html += '</td><td class="artDecrtc">';

        } else
        {
            var hasVisualRapresentation = jQuery(xml.find("hasVisualRepresentation"));

            if (hasVisualRapresentation.length > 0)
            {
                var image = jQuery(hasVisualRapresentation.find("thumbnail"));
                var imageLarge = jQuery(hasVisualRapresentation.find("url"));
                if (imageLarge.length === 0)
                    imageLarge = image;


                html += '<table><tr><td class="artFototc">';
                if (image.length !== 0)
                {
                    for (i = 0; i < image.length; i++) {

                        var urlvisualdnet = jQuery(hasVisualRapresentation[i]).find("dnetResourceIdentifier").text();
                        var urlvisualdnet = urlvisualdnet.replace("::", "..")
                        urlvisualdnet = urlvisualdnet.replace("::", "..")
                        urlvisualdnet = urlvisualdnet.replace("::", "..")
                        urlvisualdnet = 'http://virserv101.isti.cnr.it/eagle-images/thumbnails/' + urlvisualdnet + '.jpg';

                        html += '<div class="left galleryFotoC" ><a data-lightbox="roadtrip" title="' + jQuery(hasVisualRapresentation[i]).find("dnetResourceIdentifier").text() + '" href="' + encodeURI(jQuery(imageLarge[i]).text()) + '"><img data-dnetId="' + jQuery(hasVisualRapresentation[i]).find("dnetResourceIdentifier").text() + '" src="' + urlvisualdnet + ' "onerror=this.onerror=null;this.src="' + encodeURI(jQuery(image[0]).text()) + '" /></a></div>';
                    }

                    html += '<div class="clear">&nbsp;</div>';
                }
                html += '</td><td class="artDecrtc">';
            }

        }


        var cpId = jQuery(xml.find("recordSourceInfo")[0]).attr("providerName");
        if (cpId === "")
            cpId = "not available";
        var tmId = element.groupValue;
        //jQuery(xml.find("tmId")[0]).text();
        if (tmId === "" || /n\/a_/.test(tmId))
        {
            tmId = "not available";
        } else
        {
            var tmIdLink = 'http://www.trismegistos.org/text/' + tmId;
            tmId = htmlContentLink(tmIdLink, tmId);
        }

        var inscripT = jQuery(xml.find("inscriptionType")[0]).text();
        var inscripLink = jQuery(xml.find("inscriptionType")[0]).attr("uri");
        inscripT = htmlContentLink(inscripLink, inscripT);

        var objT = jQuery(xml.find("objectType")[0]).text();
        var objLink = jQuery(xml.find("objectType")[0]).attr("uri");
        objT = htmlContentLink(objLink, objT);

        var material = jQuery(xml.find("material")[0]).text();
        var materialLink = jQuery(xml.find("material")[0]).attr("uri");
        material = htmlContentLink(materialLink, material);

        var afsR = jQuery(xml.find("romanProvinceItalicRegion")[0]).text();
        var afsRlLink = jQuery(xml.find("romanProvinceItalicRegion")[0]).attr("uri");
        afsR = htmlContentLink(afsRlLink, afsR);

        var afsC = jQuery(xml.find("ancientFindSpot")[0]).text();
        var afsClLink = jQuery(xml.find("ancientFindSpot")[0]).attr("uri");
        afsC = htmlContentLink(afsClLink, afsC);

        var mfs = jQuery(xml.find("modernFindSpot")[0]).text();
        var mfsLink = jQuery(xml.find("modernFindSpot")[0]).attr("uri");
        mfs = htmlContentLink(mfsLink, mfs);

        var museum = jQuery(xml.find("museum")[0]).text();
        var museumLink = jQuery(xml.find("museum")[0]).attr("uri");
        museum = htmlContentLink(museumLink, museum);

        var cc = jQuery(xml.find("conservationCity")[0]).text();
        var ccLink = jQuery(xml.find("conservationCity")[0]).attr("uri");
        cc = htmlContentLink(ccLink, cc);

        var cr = jQuery(xml.find("conservationRegion")[0]).text();
        var crLink = jQuery(xml.find("conservationRegion")[0]).attr("uri");
        cr = htmlContentLink(crLink, cr);

        var cco = jQuery(xml.find("conservationCountry")[0]).text();
        var ccoLink = jQuery(xml.find("conservationCountry")[0]).attr("uri");
        cco = htmlContentLink(ccoLink, cco);

        var location = '';
        var locationArr = new Array();
        if (cc !== 'not available')
            locationArr.push(cc);
        if (cr !== 'not available')
            locationArr.push(cr);
        if (cco !== 'not available')
            locationArr.push(cco);
        if (museum !== 'not available')
            locationArr.push(museum);

        location = locationArr.join();

        if (location === "")
            location = "not available";

        var date = jQuery(xml.find("originDating")[0]).text();
        if (date === "")
            date = "not available";
//        var transcr = jQuery(xml.find("transcription")[0]).find("text").text();

        if (entity !== "documental")
            var transcr = xml.find("hasTranscription").find("text");
        else
            var transcr = xml.find("transcription").find("text");
        transcr = jQuery(transcr[0]).text();
        if (transcr === "")
            transcr = "not available";
        html += '<ul class="artDet">';
        html += '<li><strong>Content Provider: </strong><span>' + cpId + '</span></li>';
        html += '<li><strong>Trismegistos ID: </strong><span>' + tmId + '</span></li>';
        html += '<li><strong>Type of inscription: </strong><span>' + inscripT + '</span></li>';
        html += '<li><strong>Type of object: </strong><span>' + objT + '</span></li>';
        html += '<li><strong>Material: </strong><span>' + material + '</span></li>';
        html += '<li><strong>Ancient find spot Region: </strong><span>' + afsR + '</span></li>';
        html += '<li><strong>Ancient find spot City: </strong><span>' + afsC + '</span></li>';
        html += '<li><strong>Modern find spot: </strong><span>' + mfs + '</span></li>';
        html += '<li><strong>Current Location: </strong><span>' + location + '</span></li>';
        html += '<li><strong>Date: </strong><span>' + date + '</span></li>';
        html += '</ul>';

        html += '<p class="artTransc">' + htmlEntities(transcr) + '</p></td></tr></table></div>';

        fboxSuggestion = '<div id="tinline" ><p>' + 'If you wish to suggest a modification in the metadata of the object, please submit your suggestions by email at <a href="mailto:info@eagle-network.eu">info@eagle-network.eu </a>.<br>The EAGLE editorial board will check your proposal and come back to you as soon as possible.><br>Alternatively, you can contact directly the original data source where the object is stored. To do so, please follow the link "Original data source" that is available in the record page.</p></div>';

        html += '<p div class="artDetMainC">';
        html += '<ul class="artSubMenu">';
        var suggestion_a = '<a onclick="Search.showSuggestion();" class="" href="#">Make a suggestion</a>';
        var related_a = '<span onclick="Search.relatedLightBox();" onmouseover="cursor: hand (a pointing hand)" class="" >View related inscriptions</span>';
        html += '<li class="left artMenu">' + suggestion_a + '</li>';
        html += '<li class="left artMenu"><a target="_blanck" href="http://www.eagle-network.eu/?s&post_type=story&esa_item_source=eagle&esa_item_id=' + jQuery.trim(jQuery(xml.find("dnetResourceIdentifier")[0]).text()) + '">View related stories</a></li>';
        html += '<li class="left artMenu">' + related_a + '</li>';
        html += '</ul>';
        html += '</div></p>';
        html += '<div class="clear"></div>';
        var title = xml.find("title").text();

        html += '<div  style="display: none" id="relatedsearch">';
        html += '<table><tr><td width="20">&nbsp;</td><td align="center"><p>Related Inscriptions</p></td></tr></table>';
        html += '<div class="clear"></div>';
        html += '<table><tr><td width="20">&nbsp;</td><td><input type="checkbox" class="search-element checkbox" name="reldecoration" value="' + jQuery(xml.find("decoration")[0]).text() + '" /></td><td class="label">Decoration</td></tr></table>';
        html += '<table><tr><td width="20">&nbsp;</td><td><input type="checkbox" class="search-element checkbox" name="relmaterial" value="' + jQuery(xml.find("material")[0]).text() + '" /></td><td class="label">Material</td></tr></table>';
        html += '<table><tr><td width="20">&nbsp;</td><td><input type="checkbox" class="search-element checkbox" name="relobject" value="' + jQuery(xml.find("objectType")[0]).text() + '" /></td><td class="label">Object Type</td></tr></table>';
        html += '<table><tr><td width="20">&nbsp;</td><td><input type="checkbox" class="search-element checkbox" name="reltype" value="' + jQuery(xml.find("inscriptionType")[0]).text() + '" /></td><td class="label">Type of inscription</td></tr></table>';
        html += '<table><tr><td width="20">&nbsp;</td><td><input type="checkbox" class="search-element checkbox" name="relancient" value="' + jQuery(xml.find("romanProvinceItalicRegion")[0]).text() + '" /></td><td class="label">Ancient find spot</td></tr></table>';
        html += '<table><tr><td width="20">&nbsp;</td><td><input type="checkbox" class="search-element checkbox" name="relmodern" value="' + jQuery(xml.find("modernFindSpot")[0]).text() + '" /></td><td class="label">Modern find spot</td></tr></table>';
        html += '<div id="fieldsAppender"></div>';
        html += '<table><tr><td width="20">&nbsp;</td><td><button onclick="Search.relSearch(\'documental\');" class="action-button" id="send">View Related Inscriptions</button></td><td><button onclick="Search.closerelatedLightBox();" class="action-button" id="send">Close related inscriptions</button></td></tr></table>';
        html += '</div>';


        jQuery("h1.page_title").html(title);
        jQuery("h1.search_help a").attr("href", "http://www.eagle-network.eu/inscriptions-search-engine-online-manual#ContentArt");

        //jQuery("body").append(appender);
        state = (searchType === 0) ? 2 : 11;
        return html;

    }

    Search.returnToImageSearchList = function () {
        jQuery("h1.page_title").html('SEARCH INSCRIPTIONS');
        jQuery(".mysearchdiv").html("");
        // jQuery(".mysearchdiv").append(htmlMenu(entity));
        jQuery(".mysearchdiv").append(drawImageSearch(imageSearchResponse));
        setTimeout(imageVisualResize, "1000");
    };

    function getHtmlFromStringData(xmlString) {
        var html = '';
        var xmlDoc = jQuery.parseXML(xmlString);
        var xml = jQuery(xmlDoc);
        html += '<div class="artDetMainC">';
        html += '<ul class="artSubMenu">';
//        onclick="window.location.href=\'basic-search\'"
        html += '<li class="left artMenu" onclick="Search.returnToImageSearchList();" >Back to result list</li>';

        /*Bibliography info*/
        var bibliography = jQuery(xml.find("bibliography"));
        if (bibliography.length !== 0) {
            var bibliography_a = '<ul id="binline" class="biblioF">';
            for (var i = 0; i < bibliography.length; i++) {
                bibliography_a += '<li>' + jQuery(bibliography[i]).text() + '</li>';
            }
            bibliography_a += '</ul>';
            // appender += bibliography_a;
            fboxBibliography = bibliography_a;
            html += '<li class="left artMenu"><a onclick="Search.showBibliography();" class="" href="#">Bibliography</a></li>';
        } else
            fboxBibliography = '<p>not available</p>';

        /*Traslation info*/
        var translation = jQuery(xml.find("hasTranslation"));
        //var translation_a = (translation.length !== 0) ? '<a class="fancybox" href="#tinline">Traslation available</a>' : '<a style="cursor:text;" onclick="return false;" href="#">NO translation available</a>';
        var translation_a = '<a onclick="Search.showTranslation();" class="" href="#">View translations</a>';
        html += '<li class="left artMenu">' + translation_a + '</li>';
        //if (translation.length !== 0) {
        //    appender += (translation.length !== 0) ? '<div id="tinline" ><p>' + jQuery(translation[0]).find("text").text() + '</p></div>' : '';
        //}


        if (translation.length !== 0) {
            var translation_b = '';
            for (var i = 0; i < translation.length; i++) {
                translation_b += jQuery(translation[i]).find("text").text() + '<br>';
            }
        }

        fboxTranslation = (translation.length !== 0) ? '<div id="tinline" ><p> <b>Translation</b><br>' + translation_b + 'For further information and for possible translations in other languages please visit the record page in the EAGLE MediaWiki at <a target="_blanck" href="' + jQuery(translation.find("recordSourceInfo")[0]).attr("landingPage") + '">' + jQuery(translation.find("recordSourceInfo")[0]).attr("landingPage") + '</a></p></div>' : '<div id="tinline" ><p>' + 'No translation available,<br>To request a new translation please contact <a href="mailto:info@eagle-network.eu">info@eagle-network.eu </a>.<br>To contribute with a new translation please visit <a href="https://wiki.eagle-network.eu/wiki/" target="_blank"> https://wiki.eagle-network.eu/wiki/</a>' + '</p></div>';


        //fboxTranslation = (translation.length !== 0) ? '<div id="tinline" ><p> <b>Translation</b><br>' + jQuery(translation[0]).find("text").text() + '<br>For further information and for possible translations in other languages please visit the record page in the EAGLE MediaWiki at <a target="_blanck" href="' + jQuery(translation.find("recordSourceInfo")[0]).attr("landingPage") + '">' + jQuery(translation.find("recordSourceInfo")[0]).attr("landingPage") + '</a></p></div>' : '<div id="tinline" ><p>' + 'No translation available,<br>To request a new translation please contact <a href="mailto:info@eagle-network.eu">info@eagle-network.eu </a>.<br>To contribute with a new translation please visit <a href="http://www.eagle-network.eu/wiki/" target="_blank"> http://www.eagle-network.eu/wiki/</a>' + '</p></div>';

        //fboxTranslation = (translation.length !== 0) ? '<div id="tinline" ><p><a target="_blanck" href="' + jQuery(translation.find("recordSourceInfo")[0]).attr("landingPage") + '">' + jQuery(translation[0]).find("text").text() + '</a></p></div>' : '<div id="tinline" ><p>' + 'No translation available, to contribute with a new translation please visit <a href="http://www.eagle-network.eu/wiki/" target="_blank"> http://www.eagle-network.eu/wiki/</a>' + '</p></div>';
        // appender += (translation.length !== 0) ? '<div id="tinline" ><p><a target="_blanck" href="' + jQuery(translation.find("recordSourceInfo")[0]).attr("landingPage") + '">' + jQuery(translation[0]).find("text").text() + '</a></p></div>' : '<div id="tinline" ><p>' + 'No translation available, to contribute with a new translation please visit <a href="http://www.eagle-network.eu/wiki/" target="_blank"> http://www.eagle-network.eu/wiki/</a>' + '</p></div>';

        var source = jQuery(xml.find("recordSourceInfo "));
        html += '<li class="left artMenu"><a target="_blanck" href="' + jQuery(source[0]).attr("landingPage") + '">Original source</a></li>';
        html += '<li class="left artMenu" onclick="Search.showFBoxSavingForm(\'' + jQuery.trim(jQuery(xml.find("dnetResourceIdentifier")[0]).text()) + '\');" >Save result</li>';
        html += '<li class="left artMenu" onclick="Search.exportEpidoc(\'' + jQuery.trim(jQuery(xml.find("dnetResourceIdentifier")[0]).text()) + '\');" >Export</li>';
        html += '</ul>';
        html += '<div class="clear">&nbsp;</div>';

        // appender += '</div>';

        var hasVisualRapresentation = jQuery(xml.find("hasVisualRepresentation"));

        if (hasVisualRapresentation.length > 0)
        {
            var image = jQuery(hasVisualRapresentation.find("thumbnail"));
            var imageLarge = jQuery(hasVisualRapresentation.find("url"));
            if (imageLarge.length === 0)
                imageLarge = image;
            html += '<table><tr><td class="artFototc">';
            if (image.length !== 0) {
                for (i = 0; i < image.length; i++) {

                    var urlvisualdnet = jQuery(hasVisualRapresentation[i]).find("dnetResourceIdentifier").text();
                    var urlvisualdnet = urlvisualdnet.replace("::", "..")
                    urlvisualdnet = urlvisualdnet.replace("::", "..")
                    urlvisualdnet = urlvisualdnet.replace("::", "..")
                    urlvisualdnet = 'http://virserv101.isti.cnr.it/eagle-images/thumbnails/' + urlvisualdnet + '.jpg';

                    html += '<div class="left galleryFotoC" ><a data-lightbox="roadtrip" title="' + jQuery(hasVisualRapresentation[i]).find("dnetResourceIdentifier").text() +'" href="' + encodeURI(jQuery(imageLarge[i]).text()) + '"><img data-dnetId="' + jQuery(hasVisualRapresentation[i]).find("dnetResourceIdentifier").text() + '" src="' + urlvisualdnet + ' "onerror=this.onerror=null;this.src="' + encodeURI(jQuery(image[i]).text()) + '" /></a></div>';

                }

                html += '<div class="clear">&nbsp;</div>';
            }
            html += '</td><td class="artDecrtc">';
        }
        var cpId = jQuery(xml.find("recordSourceInfo")[0]).attr("providerName");
        if (cpId === "")
            cpId = "not available";
        var tmId = jQuery(xml.find("tmId")[0]).text();
        //jQuery(xml.find("tmId")[0]).text();
        if (tmId === "" || /n\/a_/.test(tmId))
        {
            tmId = "not available";
        } else
        {
            var tmIdLink = 'http://www.trismegistos.org/text/' + tmId;
            tmId = htmlContentLink(tmIdLink, tmId);
        }

        var inscripT = jQuery(xml.find("inscriptionType")[0]).text();
        var inscripLink = jQuery(xml.find("inscriptionType")[0]).attr("uri");
        inscripT = htmlContentLink(inscripLink, inscripT);

        var objT = jQuery(xml.find("objectType")[0]).text();
        var objLink = jQuery(xml.find("objectType")[0]).attr("uri");
        objT = htmlContentLink(objLink, objT);

        var material = jQuery(xml.find("material")[0]).text();
        var materialLink = jQuery(xml.find("material")[0]).attr("uri");
        material = htmlContentLink(materialLink, material);

        var afsR = jQuery(xml.find("romanProvinceItalicRegion")[0]).text();
        var afsRlLink = jQuery(xml.find("romanProvinceItalicRegion")[0]).attr("uri");
        afsR = htmlContentLink(afsRlLink, afsR);

        var afsC = jQuery(xml.find("ancientFindSpot")[0]).text();
        var afsClLink = jQuery(xml.find("ancientFindSpot")[0]).attr("uri");
        afsC = htmlContentLink(afsClLink, afsC);

        var mfs = jQuery(xml.find("modernFindSpot")[0]).text();
        var mfsLink = jQuery(xml.find("modernFindSpot")[0]).attr("uri");
        mfs = htmlContentLink(mfsLink, mfs);

        var museum = jQuery(xml.find("museum")[0]).text();
        var museumLink = jQuery(xml.find("museum")[0]).attr("uri");
        museum = htmlContentLink(museumLink, museum);

        var cc = jQuery(xml.find("conservationCity")[0]).text();
        var ccLink = jQuery(xml.find("conservationCity")[0]).attr("uri");
        cc = htmlContentLink(ccLink, cc);

        var cr = jQuery(xml.find("conservationRegion")[0]).text();
        var crLink = jQuery(xml.find("conservationRegion")[0]).attr("uri");
        cr = htmlContentLink(crLink, cr);

        var cco = jQuery(xml.find("conservationCountry")[0]).text();
        var ccoLink = jQuery(xml.find("conservationCountry")[0]).attr("uri");
        cco = htmlContentLink(ccoLink, cco);

        var location = '';
        var locationArr = new Array();
        if (cc !== 'not available')
            locationArr.push(cc);
        if (cr !== 'not available')
            locationArr.push(cr);
        if (cco !== 'not available')
            locationArr.push(cco);
        if (museum !== 'not available')
            locationArr.push(museum);

        location = locationArr.join();

        if (location === "")
            location = "not available";

        var date = jQuery(xml.find("originDating")[0]).text();
        if (date === "")
            date = "not available";
//        var transcr = jQuery(xml.find("transcription")[0]).find("text").text();

        if (entity !== "documental")
            var transcr = xml.find("hasTranscription").find("text");
        else
            var transcr = xml.find("transcription").find("text");
        transcr = jQuery(transcr[0]).text();
        if (transcr === "")
            transcr = "not available";
        html += '<ul class="artDet">';
        html += '<li><strong>Content Provider: </strong><span>' + cpId + '</span></li>';
        html += '<li><strong>Trismegistos ID: </strong><span>' + tmId + '</span></li>';
        html += '<li><strong>Type of inscription: </strong><span>' + inscripT + '</span></li>';
        html += '<li><strong>Type of object: </strong><span>' + objT + '</span></li>';
        html += '<li><strong>Material: </strong><span>' + material + '</span></li>';
        html += '<li><strong>Ancient find spot Region: </strong><span>' + afsR + '</span></li>';
        html += '<li><strong>Ancient find spot City: </strong><span>' + afsC + '</span></li>';
        html += '<li><strong>Modern find spot: </strong><span>' + mfs + '</span></li>';
        html += '<li><strong>Current Location: </strong><span>' + location + '</span></li>';
        html += '<li><strong>Date: </strong><span>' + date + '</span></li>';
        html += '</ul>';

        html += '<p class="artTransc">' + htmlEntities(transcr) + '</p></td></tr></table></div>';

        fboxSuggestion = '<div id="tinline" ><p>' + 'If you wish to suggest a modification in the metadata of the object, please submit your suggestions by email at <a href="mailto:info@eagle-network.eu">info@eagle-network.eu </a>.<br>The EAGLE editorial board will check your proposal and come back to you as soon as possible.><br>Alternatively, you can contact directly the original data source where the object is stored. To do so, please follow the link "Original data source" that is available in the record page.</p></div>';

        html += '<p div class="artDetMainC">';
        html += '<ul class="artSubMenu">';
        var suggestion_a = '<a onclick="Search.showSuggestion();" class="" href="#">Make a suggestion</a>';
        html += '<li class="left artMenu">' + suggestion_a + '</li>';
        html += '<li class="left artMenu"><a target="_blanck" href="http://www.eagle-network.eu/?s&post_type=story&esa_item_source=eagle&esa_item_id=' + jQuery.trim(jQuery(xml.find("dnetResourceIdentifier")[0]).text()) + '">View related stories</li>';

        html += '</ul>';
        html += '</div></p>';
        html += '<div class="clear"></div>';
        var title = xml.find("title").text();
        jQuery("h1.page_title").html(title);
        jQuery("h1.search_help a").attr("href", "http://www.eagle-network.eu/inscriptions-search-engine-online-manual#ContentArt");

        return html;
    }

    function getHtmlFromStringDataArchives(xmlString) {
        var html = '';
        var xmlDoc = jQuery.parseXML(xmlString);
        var xml = jQuery(xmlDoc);
        html += '<div class="artDetMainC">';
        html += '<ul class="artSubMenu">';
//        onclick="window.location.href=\'basic-search\'"
        //html += '<li class="left artMenu" onclick="Search.returnToImageSearchList();" >Back to result list</li>';
        html += (view === "items") ? '<li class="left artMenu" onclick="Search.archivesRelist(\'items\',0);" >Back to object saved list</li>' : '<li class="left artMenu" onclick="Search.returnToListArchives();" >Back to result list</li>';

        /*Bibliography info*/
        var bibliography = jQuery(xml.find("bibliography"));
        if (bibliography.length !== 0) {
            var bibliography_a = '<ul id="binline" class="biblioF">';
            for (var i = 0; i < bibliography.length; i++) {
                bibliography_a += '<li>' + jQuery(bibliography[i]).text() + '</li>';
            }
            bibliography_a += '</ul>';
            // appender += bibliography_a;
            fboxBibliography = bibliography_a;
            html += '<li class="left artMenu"><a onclick="Search.showBibliography();" class="" href="#">Bibliography</a></li>';
        } else
            fboxBibliography = '<p>not available</p>';

        /*Traslation info*/
        var translation = jQuery(xml.find("hasTranslation"));
        //var translation_a = (translation.length !== 0) ? '<a class="fancybox" href="#tinline">Traslation available</a>' : '<a style="cursor:text;" onclick="return false;" href="#">NO translation available</a>';
        var translation_a = '<a onclick="Search.showTranslation();" class="" href="#">View translations</a>';
        html += '<li class="left artMenu">' + translation_a + '</li>';
        //if (translation.length !== 0) {
        //    appender += (translation.length !== 0) ? '<div id="tinline" ><p>' + jQuery(translation[0]).find("text").text() + '</p></div>' : '';
        //}
        if (translation.length !== 0) {
            var translation_b = '';
            for (var i = 0; i < translation.length; i++) {
                translation_b += jQuery(translation[i]).find("text").text() + '<br>';
            }
        }

        fboxTranslation = (translation.length !== 0) ? '<div id="tinline" ><p> <b>Translation</b><br>' + translation_b + 'For further information and for possible translations in other languages please visit the record page in the EAGLE MediaWiki at <a target="_blanck" href="' + jQuery(translation.find("recordSourceInfo")[0]).attr("landingPage") + '">' + jQuery(translation.find("recordSourceInfo")[0]).attr("landingPage") + '</a></p></div>' : '<div id="tinline" ><p>' + 'No translation available,<br>To request a new translation please contact <a href="mailto:info@eagle-network.eu">info@eagle-network.eu </a>.<br>To contribute with a new translation please visit <a href="https://wiki.eagle-network.eu/wiki/" target="_blank"> https://wiki.eagle-network.eu/wiki/</a>' + '</p></div>';
        //fboxTranslation = (translation.length !== 0) ? '<div id="tinline" ><p> <b>Translation</b><br>' + jQuery(translation[0]).find("text").text() + '<br>For further information and for possible translations in other languages please visit the record page in the EAGLE MediaWiki at <a target="_blanck" href="' + jQuery(translation.find("recordSourceInfo")[0]).attr("landingPage") + '">' + jQuery(translation.find("recordSourceInfo")[0]).attr("landingPage") + '</a></p></div>' : '<div id="tinline" ><p>' + 'No translation available,<br>To request a new translation please contact <a href="mailto:info@eagle-network.eu">info@eagle-network.eu </a>.<br>To contribute with a new translation please visit <a href="http://www.eagle-network.eu/wiki/" target="_blank"> http://www.eagle-network.eu/wiki/</a>' + '</p></div>';

        //fboxTranslation = (translation.length !== 0) ? '<div id="tinline" ><p><a target="_blanck" href="' + jQuery(translation.find("recordSourceInfo")[0]).attr("landingPage") + '">' + jQuery(translation[0]).find("text").text() + '</a></p></div>' : '<div id="tinline" ><p>' + 'No translation available, to contribute with a new translation please visit <a href="http://www.eagle-network.eu/wiki/" target="_blank"> http://www.eagle-network.eu/wiki/</a>' + '</p></div>';
        // appender += (translation.length !== 0) ? '<div id="tinline" ><p><a target="_blanck" href="' + jQuery(translation.find("recordSourceInfo")[0]).attr("landingPage") + '">' + jQuery(translation[0]).find("text").text() + '</a></p></div>' : '<div id="tinline" ><p>' + 'No translation available, to contribute with a new translation please visit <a href="http://www.eagle-network.eu/wiki/" target="_blank"> http://www.eagle-network.eu/wiki/</a>' + '</p></div>';

        var source = jQuery(xml.find("recordSourceInfo "));
        html += '<li class="left artMenu"><a target="_blanck" href="' + jQuery(source[0]).attr("landingPage") + '">Original source</a></li>';
        // html += '<li class="left artMenu" onclick="Search.showFBoxSavingForm(\'' + jQuery.trim(jQuery(xml.find("dnetResourceIdentifier")[0]).text()) + '\');" >Save result</li>';
        html += '<li class="left artMenu" onclick="Search.exportEpidoc(\'' + jQuery.trim(jQuery(xml.find("dnetResourceIdentifier")[0]).text()) + '\');" >Export</li>';
        html += '</ul>';
        html += '<div class="clear">&nbsp;</div>';

        // appender += '</div>';
        var entity = xml.find("entityType").text();

        if (entity === "visual")
        {
            var VisualRapresentation = jQuery(xml.find("VisualRepresentation"));

            var image = encodeURI(xml.find("thumbnail").text());
            var imageLarge = encodeURI(xml.find("url").text());

            if (imageLarge.length === 0)
                imageLarge = image;


            html += '<table><tr><td class="artFototc">';
//			    if (image.length !== 0) 
//			    {

            var visualdnet = xml.find("dnetResourceIdentifier").text();
            var pos = visualdnet.indexOf("visual");
            if (pos != -1)
            {
                visualdnet = visualdnet.substring(0, pos + 6);
            }

            var urlvisualdnet = visualdnet.replace("::", "..")
            urlvisualdnet = urlvisualdnet.replace("::", "..")
            urlvisualdnet = urlvisualdnet.replace("::", "..")
            urlvisualdnet = 'http://virserv101.isti.cnr.it/eagle-images/thumbnails/' + urlvisualdnet + '.jpg';
            html += '<div class="left galleryFotoC" ><a data-lightbox="roadtrip" title="' + visualdnet + '" href="' + imageLarge + '"><img data-dnetId="' + urlvisualdnet + '" src="' + urlvisualdnet + ' "onerror=this.onerror=null;this.src="' + image + '" /></a></div>';
            html += '<div class="clear">&nbsp;</div>';
//			}	
            html += '</td><td class="artDecrtc">';

        } else
        {
            var hasVisualRapresentation = jQuery(xml.find("hasVisualRepresentation"));

            if (hasVisualRapresentation.length > 0)
            {
                var image = jQuery(hasVisualRapresentation.find("thumbnail"));
                var imageLarge = jQuery(hasVisualRapresentation.find("url"));
                if (imageLarge.length === 0)
                    imageLarge = image;


                html += '<table><tr><td class="artFototc">';
                if (image.length !== 0)
                {
                    for (i = 0; i < image.length; i++) {

                        var urlvisualdnet = jQuery(hasVisualRapresentation[i]).find("dnetResourceIdentifier").text();
                        var urlvisualdnet = urlvisualdnet.replace("::", "..")
                        urlvisualdnet = urlvisualdnet.replace("::", "..")
                        urlvisualdnet = urlvisualdnet.replace("::", "..")
                        urlvisualdnet = 'http://virserv101.isti.cnr.it/eagle-images/thumbnails/' + urlvisualdnet + '.jpg';

                        html += '<div class="left galleryFotoC" ><a data-lightbox="roadtrip" title="' + jQuery(hasVisualRapresentation[i]).find("dnetResourceIdentifier").text() + '" href="' + encodeURI(jQuery(imageLarge[i]).text()) + '"><img data-dnetId="' + jQuery(hasVisualRapresentation[i]).find("dnetResourceIdentifier").text() + '" src="' + urlvisualdnet + ' "onerror=this.onerror=null;this.src="' + encodeURI(jQuery(image[0]).text()) + '" /></a></div>';
                    }

                    html += '<div class="clear">&nbsp;</div>';
                }
                html += '</td><td class="artDecrtc">';
            }

        }
        var cpId = jQuery(xml.find("recordSourceInfo")[0]).attr("providerName");
        if (cpId === "")
            cpId = "not available";
        var tmId = jQuery(xml.find("tmId")[0]).text();
        //jQuery(xml.find("tmId")[0]).text();
        if (tmId === "" || /n\/a_/.test(tmId))
        {
            tmId = "not available";
        } else
        {
            var tmIdLink = 'http://www.trismegistos.org/text/' + tmId;
            tmId = htmlContentLink(tmIdLink, tmId);
        }

        var inscripT = jQuery(xml.find("inscriptionType")[0]).text();
        var inscripLink = jQuery(xml.find("inscriptionType")[0]).attr("uri");
        inscripT = htmlContentLink(inscripLink, inscripT);

        var objT = jQuery(xml.find("objectType")[0]).text();
        var objLink = jQuery(xml.find("objectType")[0]).attr("uri");
        objT = htmlContentLink(objLink, objT);

        var material = jQuery(xml.find("material")[0]).text();
        var materialLink = jQuery(xml.find("material")[0]).attr("uri");
        material = htmlContentLink(materialLink, material);

        var afsR = jQuery(xml.find("romanProvinceItalicRegion")[0]).text();
        var afsRlLink = jQuery(xml.find("romanProvinceItalicRegion")[0]).attr("uri");
        afsR = htmlContentLink(afsRlLink, afsR);

        var afsC = jQuery(xml.find("ancientFindSpot")[0]).text();
        var afsClLink = jQuery(xml.find("ancientFindSpot")[0]).attr("uri");
        afsC = htmlContentLink(afsClLink, afsC);

        var mfs = jQuery(xml.find("modernFindSpot")[0]).text();
        var mfsLink = jQuery(xml.find("modernFindSpot")[0]).attr("uri");
        mfs = htmlContentLink(mfsLink, mfs);

        var museum = jQuery(xml.find("museum")[0]).text();
        var museumLink = jQuery(xml.find("museum")[0]).attr("uri");
        museum = htmlContentLink(museumLink, museum);

        var cc = jQuery(xml.find("conservationCity")[0]).text();
        var ccLink = jQuery(xml.find("conservationCity")[0]).attr("uri");
        cc = htmlContentLink(ccLink, cc);

        var cr = jQuery(xml.find("conservationRegion")[0]).text();
        var crLink = jQuery(xml.find("conservationRegion")[0]).attr("uri");
        cr = htmlContentLink(crLink, cr);

        var cco = jQuery(xml.find("conservationCountry")[0]).text();
        var ccoLink = jQuery(xml.find("conservationCountry")[0]).attr("uri");
        cco = htmlContentLink(ccoLink, cco);

        var location = '';
        var locationArr = new Array();
        if (cc !== 'not available')
            locationArr.push(cc);
        if (cr !== 'not available')
            locationArr.push(cr);
        if (cco !== 'not available')
            locationArr.push(cco);
        if (museum !== 'not available')
            locationArr.push(museum);

        location = locationArr.join();

        if (location === "")
            location = "not available";

        var date = jQuery(xml.find("originDating")[0]).text();
        if (date === "")
            date = "not available";
//        var transcr = jQuery(xml.find("transcription")[0]).find("text").text();

        if (entity !== "documental")
            var transcr = xml.find("hasTranscription").find("text");
        else
            var transcr = xml.find("transcription").find("text");
        transcr = jQuery(transcr[0]).text();
        if (transcr === "")
            transcr = "not available";
        html += '<ul class="artDet">';
        html += '<li><strong>Content Provider: </strong><span>' + cpId + '</span></li>';
        html += '<li><strong>Trismegistos ID: </strong><span>' + tmId + '</span></li>';
        html += '<li><strong>Type of inscription: </strong><span>' + inscripT + '</span></li>';
        html += '<li><strong>Type of object: </strong><span>' + objT + '</span></li>';
        html += '<li><strong>Material: </strong><span>' + material + '</span></li>';
        html += '<li><strong>Ancient find spot Region: </strong><span>' + afsR + '</span></li>';
        html += '<li><strong>Ancient find spot City: </strong><span>' + afsC + '</span></li>';
        html += '<li><strong>Modern find spot: </strong><span>' + mfs + '</span></li>';
        html += '<li><strong>Current Location: </strong><span>' + location + '</span></li>';
        html += '<li><strong>Date: </strong><span>' + date + '</span></li>';
        html += '</ul>';

        html += '<p class="artTransc">' + htmlEntities(transcr) + '</p></td></tr></table></div>';

        fboxSuggestion = '<div id="tinline" ><p>' + 'If you wish to suggest a modification in the metadata of the object, please submit your suggestions by email at <a href="mailto:info@eagle-network.eu">info@eagle-network.eu </a>.<br>The EAGLE editorial board will check your proposal and come back to you as soon as possible.><br>Alternatively, you can contact directly the original data source where the object is stored. To do so, please follow the link "Original data source" that is available in the record page.</p></div>';

        html += '<p div class="artDetMainC">';
        html += '<ul class="artSubMenu">';
        var suggestion_a = '<a onclick="Search.showSuggestion();" class="" href="#">Make a suggestion</a>';
        html += '<li class="left artMenu">' + suggestion_a + '</li>';
        html += '<li class="left artMenu"><a target="_blanck" href="http://www.eagle-network.eu/?s&post_type=story&esa_item_source=eagle&esa_item_id=' + jQuery.trim(jQuery(xml.find("dnetResourceIdentifier")[0]).text()) + '">View related stories</li>';

        html += '</ul>';
        html += '</div></p>';
        html += '<div class="clear"></div>';
        var title = xml.find("title").text();
        jQuery("h1.page_title").html(title);
        jQuery("h1.search_help a").attr("href", "http://www.eagle-network.eu/inscriptions-search-engine-online-manual#ContentArtArchives");

        return html;
    }

    /**
     * @param {Int} row The lastResponse ROW index
     * @return {Array} Returns an Array with correlated DnetResourceId list
     * If no correlated DnetResourceId are present an empty Array is returned
     * */
    function getCorrelatedDnetResourceList(row) {
        var correlatedTmIdList = new Array();
        var element = lastResponse.grouped.tmid.groups[row];
        /*All elements have the same HASTMID list*/
        var xmlDoc = jQuery.parseXML(element.doclist.docs[0].__result[0]);
        var xml = jQuery(xmlDoc);
        var alternateIdList = xml.find("alternateId");
        for (var i = 0; i < alternateIdList.length; i++) {
            searach = jQuery(alternateIdList[i]).text();
            if (correlatedTmIdList.indexOf(searach) === -1)
                correlatedTmIdList.push(searach);
        }
        return correlatedTmIdList;
    }



    function htmlContentArtArchives(row, col) {
        //row = (view !== "") ? parseInt(row) + (10 * (page)) : parseInt(row);
        // jQuery("#appender").remove();
        //var appender = '<div id="appender" style="display:none;">';
        /*TODO creare vista artifact dettaglio a seconda della riga nel lastResponse e colonna (docs[col]) vedi htmlMenuArt() */
        var element = lastResponse.grouped.tmid.groups[row];
        var html = '';
        var xmlDoc = jQuery.parseXML(element.doclist.docs[col].__result[0]);
        var xml = jQuery(xmlDoc);
        html += '<div class="artDetMainC">';
        html += '<ul class="artSubMenu">';
//        onclick="window.location.href=\'basic-search\'"
        html += (view === "items") ? '<li class="left artMenu" onclick="Search.archivesRelist(\'items\',0);" >Back to object saved list</li>' : '<li class="left artMenu" onclick="Search.returnToListArchives();" >Back to result list</li>';

        /*Bibliography info*/
        var bibliography = jQuery(xml.find("bibliography"));
        if (bibliography.length !== 0) {
            var bibliography_a = '<ul id="binline" class="biblioF">';
            for (var i = 0; i < bibliography.length; i++) {
                bibliography_a += '<li>' + jQuery(bibliography[i]).text() + '</li>';
            }
            bibliography_a += '</ul>';
            fboxBibliography = bibliography_a;
            html += '<li class="left artMenu"><a onclick="Search.showBibliography();" class="" href="#">Bibliography</a></li>';
        } else
            fboxBibliography = '<p>not available</p>';

        /*Traslation info*/
        var translation = jQuery(xml.find("hasTranslation"));
        //var translation_a = (translation.length !== 0) ? '<a class="fancybox" href="#tinline">Traslation available</a>' : '<a style="cursor:text;" onclick="return false;" href="#">No translation available</a>';
        var translation_a = '<a onclick="Search.showTranslation();" class="" href="#">View translations</a>';
        html += '<li class="left artMenu">' + translation_a + '</li>';
        //if (translation.length !== 0) {
        //    appender += (translation.length !== 0) ? '<div id="tinline" ><p>' + jQuery(translation[0]).find("text").text() + '</p></div>' : '';
        //}
        fboxTranslation = (translation.length !== 0) ? '<div id="tinline" ><p><a target="_blanck" href="' + jQuery(translation.find("recordSourceInfo")[0]).attr("landingPage") + '">' + jQuery(translation[0]).find("text").text() + '</a></p></div>' : '<div id="tinline" ><p>' + 'No translation available, to contribute with a new translation please visit <a href="https://wiki.eagle-network.eu/wiki/" target="_blank"> https://wiki.eagle-network.eu/wiki/</a>' + '</p></div>';

        var source = jQuery(xml.find("recordSourceInfo "));
        html += '<li class="left artMenu"><a target="_blanck" href="' + jQuery(source[0]).attr("landingPage") + '">Original source</a></li>';
        //html += '<li class="left artMenu">Save</li>';
        html += '<li onclick="Search.exportEpidoc(\'' + jQuery.trim(jQuery(xml.find("dnetResourceIdentifier")[0]).text()) + '\');" class="left artMenu">Export</li>';
        html += '</ul>';
        html += '<div class="clear">&nbsp;</div>';

        //appender += '</div>';
//        var hasVisualRapresentation = jQuery(xml.find("hasVisualRepresentation"));

        if (entity === "visual")
        {
            var VisualRapresentation = jQuery(xml.find("VisualRepresentation"));

            var image = encodeURI(xml.find("thumbnail").text());
            var imageLarge = encodeURI(xml.find("url").text());

            if (imageLarge.length === 0)
                imageLarge = image;


            html += '<table><tr><td class="artFototc">';
//			    if (image.length !== 0) 
//			    {

            var visualdnet = xml.find("dnetResourceIdentifier").text();
            var pos = visualdnet.indexOf("visual");
            if (pos != -1)
            {
                visualdnet = visualdnet.substring(0, pos + 6);
            }

            var urlvisualdnet = visualdnet.replace("::", "..")
            urlvisualdnet = urlvisualdnet.replace("::", "..")
            urlvisualdnet = urlvisualdnet.replace("::", "..")
            urlvisualdnet = 'http://virserv101.isti.cnr.it/eagle-images/thumbnails/' + urlvisualdnet + '.jpg';
            html += '<div class="left galleryFotoC" ><a data-lightbox="roadtrip" title="' + visualdnet + '" href="' + imageLarge + '"><img data-dnetId="' + urlvisualdnet + '" src="' + urlvisualdnet + ' "onerror=this.onerror=null;this.src="' + image + '" /></a></div>';
            html += '<div class="clear">&nbsp;</div>';
//			}	
            html += '</td><td class="artDecrtc">';

        } else
        {
            var hasVisualRapresentation = jQuery(xml.find("hasVisualRepresentation"));

            if (hasVisualRapresentation.length > 0)
            {
                var image = jQuery(hasVisualRapresentation.find("thumbnail"));
                var imageLarge = jQuery(hasVisualRapresentation.find("url"));
                if (imageLarge.length === 0)
                    imageLarge = image;


                html += '<table><tr><td class="artFototc">';
                if (image.length !== 0)
                {
                    for (i = 0; i < image.length; i++) {

                        var urlvisualdnet = jQuery(hasVisualRapresentation[i]).find("dnetResourceIdentifier").text();
                        var urlvisualdnet = urlvisualdnet.replace("::", "..")
                        urlvisualdnet = urlvisualdnet.replace("::", "..")
                        urlvisualdnet = urlvisualdnet.replace("::", "..")
                        urlvisualdnet = 'http://virserv101.isti.cnr.it/eagle-images/thumbnails/' + urlvisualdnet + '.jpg';

                        html += '<div class="left galleryFotoC" ><a data-lightbox="roadtrip" title="' + jQuery(hasVisualRapresentation[i]).find("dnetResourceIdentifier").text() + '" href="' + encodeURI(jQuery(imageLarge[i]).text()) + '"><img data-dnetId="' + jQuery(hasVisualRapresentation[i]).find("dnetResourceIdentifier").text() + '" src="' + urlvisualdnet + ' "onerror=this.onerror=null;this.src="' + encodeURI(jQuery(image[0]).text()) + '" /></a></div>';
                    }

                    html += '<div class="clear">&nbsp;</div>';
                }
                html += '</td><td class="artDecrtc">';
            }

        }
        var cpId = jQuery(xml.find("recordSourceInfo")[0]).attr("providerName");
        if (cpId === "")
            cpId = "not available";
        var tmId = element.groupValue;

        // jQuery(xml.find("tmId")[0]).text();
        if (tmId === "" || /n\/a_/.test(tmId))
        {
            tmId = "not available";
        } else
        {
            var tmIdLink = 'http://www.trismegistos.org/text/' + tmId;
            tmId = htmlContentLink(tmIdLink, tmId);
        }

        var inscripT = jQuery(xml.find("inscriptionType")[0]).text();
        var inscripLink = jQuery(xml.find("inscriptionType")[0]).attr("uri");
        inscripT = htmlContentLink(inscripLink, inscripT);

        var objT = jQuery(xml.find("objectType")[0]).text();
        var objLink = jQuery(xml.find("objectType")[0]).attr("uri");
        objT = htmlContentLink(objLink, objT);

        var material = jQuery(xml.find("material")[0]).text();
        var materialLink = jQuery(xml.find("material")[0]).attr("uri");
        material = htmlContentLink(materialLink, material);

        var afsR = jQuery(xml.find("romanProvinceItalicRegion")[0]).text();
        var afsRlLink = jQuery(xml.find("romanProvinceItalicRegion")[0]).attr("uri");
        afsR = htmlContentLink(afsRlLink, afsR);

        var afsC = jQuery(xml.find("ancientFindSpot")[0]).text();
        var afsClLink = jQuery(xml.find("ancientFindSpot")[0]).attr("uri");
        afsC = htmlContentLink(afsClLink, afsC);

        var mfs = jQuery(xml.find("modernFindSpot")[0]).text();
        var mfsLink = jQuery(xml.find("modernFindSpot")[0]).attr("uri");
        mfs = htmlContentLink(mfsLink, mfs);

        var museum = jQuery(xml.find("museum")[0]).text();
        var museumLink = jQuery(xml.find("museum")[0]).attr("uri");
        museum = htmlContentLink(museumLink, museum);

        var cc = jQuery(xml.find("conservationCity")[0]).text();
        var ccLink = jQuery(xml.find("conservationCity")[0]).attr("uri");
        cc = htmlContentLink(ccLink, cc);

        var cr = jQuery(xml.find("conservationRegion")[0]).text();
        var crLink = jQuery(xml.find("conservationRegion")[0]).attr("uri");
        cr = htmlContentLink(crLink, cr);

        var cco = jQuery(xml.find("conservationCountry")[0]).text();
        var ccoLink = jQuery(xml.find("conservationCountry")[0]).attr("uri");
        cco = htmlContentLink(ccoLink, cco);

        var location = '';
        var locationArr = new Array();
        if (cc !== 'not available')
            locationArr.push(cc);
        if (cr !== 'not available')
            locationArr.push(cr);
        if (cco !== 'not available')
            locationArr.push(cco);
        if (museum !== 'not available')
            locationArr.push(museum);

        location = locationArr.join();

        if (location === "")
            location = "not available";

        var date = jQuery(xml.find("originDating")[0]).text();
        if (date === "")
            date = "not available";
//        var transcr = jQuery(xml.find("transcription")[0]).find("text").text();

        if (entity !== "documental")
            var transcr = xml.find("hasTranscription").find("text");
        else
            var transcr = xml.find("transcription").find("text");
        transcr = jQuery(transcr[0]).text();
        if (transcr === "")
            transcr = "not available";
        html += '<ul class="artDet">';
        html += '<li><strong>Content Provider: </strong><span>' + cpId + '</span></li>';
        html += '<li><strong>Trismegistos ID: </strong><span>' + tmId + '</span></li>';
        html += '<li><strong>Type of inscription: </strong><span>' + inscripT + '</span></li>';
        html += '<li><strong>Type of object: </strong><span>' + objT + '</span></li>';
        html += '<li><strong>Material: </strong><span>' + material + '</span></li>';
        html += '<li><strong>Ancient find spot Region: </strong><span>' + afsR + '</span></li>';
        html += '<li><strong>Ancient find spot City: </strong><span>' + afsC + '</span></li>';
        html += '<li><strong>Modern find spot: </strong><span>' + mfs + '</span></li>';
        html += '<li><strong>Current Location: </strong><span>' + location + '</span></li>';
        html += '<li><strong>Date: </strong><span>' + date + '</span></li>';
        html += '</ul>';

        html += '<p class="artTransc">' + htmlEntities(transcr) + '</p></td></tr></table></div>';

        fboxSuggestion = '<div id="tinline" ><p>' + 'If you wish to suggest a modification in the metadata of the object, please submit your suggestions by email at <a href="mailto:info@eagle-network.eu">info@eagle-network.eu </a>.<br>The EAGLE editorial board will check your proposal and come back to you as soon as possible.><br>Alternatively, you can contact directly the original data source where the object is stored. To do so, please follow the link "Original data source" that is available in the record page.</p></div>';

        html += '<p div class="artDetMainC">';
        html += '<ul class="artSubMenu">';
        var suggestion_a = '<a onclick="Search.showSuggestion();" class="" href="#">Make a suggestion</a>';
        html += '<li class="left artMenu">' + suggestion_a + '</li>';
        html += '<li class="left artMenu"><a target="_blanck" href="http://www.eagle-network.eu/?s&post_type=story&esa_item_source=eagle&esa_item_id=' + jQuery.trim(jQuery(xml.find("dnetResourceIdentifier")[0]).text()) + '">View related stories</li>';

        html += '</ul>';
        html += '</div></p>';
        html += '<div class="clear"></div>';
        var title = xml.find("title").text();
        jQuery("h1.page_title").html(title);
        jQuery("h1.search_help a").attr("href", "http://www.eagle-network.eu/inscriptions-search-engine-online-manual#ContentArtArchives");

        state = 21;
        //jQuery("body").append(appender);
        return html;

    }

    function httpMatchReform(uri) {
        if (!uri.match("^(http)://")) {
            return "http://" + uri;
        }
        return uri;
    }

    /**
     *  Restituisce l'elemento da mostrare
     *  e riordina il gruppo di elementi sul quale è chiamata
     *   
     **/
    function preorder_by_criteria(i) {
        var element = lastResponse.grouped.tmid.groups[i];
        if (element === undefined)
            return element;
        if (element.doclist.docs.length < 2) {
            return element;
        } else {

            var first = -1;
            var cpAcron = '';
            var matchedOther = new Array();

            for (var j = 0; j < element.doclist.docs.length; j++) {
                xmlDoc = jQuery.parseXML(element.doclist.docs[j].__result[0]);
                xml = jQuery(xmlDoc);
                cpAcron = jQuery.trim(jQuery(xml.find("recordSourceInfo")[0]).attr("providerAcronym"));
                if (cpAcron === 'EDB') {
                    return reorder_and_return(element, j);
                } else {
                    romanProvinceItalicRegion = jQuery.trim(xml.find("romanProvinceItalicRegion").text());
                    if (match_level2EDR(romanProvinceItalicRegion)) {
                        first = j;
                    } else if (match_level2OTHER(romanProvinceItalicRegion)) {
                        matchedOther.push({'elementID': j, 'provider': cpAcron});
                    } else if (cpAcron === 'EDH') {
                        first = j;

                    } else if (cpAcron === 'Ubi Erat Lupa') {
                        first = j;

                    } else if (cpAcron === 'Petrae') {
                        first = j;

                    } else if (cpAcron === 'UBB') {
                        first = j;

                    } else if (cpAcron === 'ELTE') {
                        first = j;

                    } else if (cpAcron === 'RIB') {
                        first = j;

                    } else if (cpAcron === 'InsAph') {
                        first = j;

                    } else if (cpAcron === 'IRT') {
                        first = j;

                    } else if (cpAcron === 'MAMA') {
                        first = j;

                    } else if (cpAcron === 'Vindolanda') {
                        first = j;

                    } else if (cpAcron === 'IMJ') {
                        first = j;

                    } else if (cpAcron === 'EPNet') {
                        first = j;

                    } else if (cpAcron === 'Arachne') {
                        first = j;

                    } else if (cpAcron === 'EDCS') {
                        first = j;
                    }
                }
            }



            if (matchedOther.length > 0) {
                var lastIndexOfEDH = -1;
                for (var obj in matchedOther) {
                    if (obj.provider === 'HEP') {
                        /*Order Elements and return*/
                        return reorder_and_return(element, obj.elementID);
//                        element_to_add = element.doclist.docs[obj.elementID];
//                        delete element.doclist.docs[obj.elementID];
//                        element.doclist.splice(0, 0, element_to_add);
//                        return element;
                    } else if (obj.provider === 'EDH') {
                        lastIndexOfEDH = obj.elementID;
                    }
                }
                if (lastIndexOfEDH !== -1) {
                    /*Order Elements and return*/
                    return reorder_and_return(element, lastIndexOfEDH);
//                    element_to_add = element.doclist.docs[lastIndexOfEDH];
//                    delete element.doclist.docs[lastIndexOfEDH];
//                    element.doclist.splice(0, 0, element_to_add);
                } else {
                    /*Order Elements and return*/
                    first_el = matchedOther.pop();
                    return reorder_and_return(element, first_el.elementID);
                }
            } else if (first !== -1) {
                /*Order Elements and return*/
                return reorder_and_return(element, first);
//                element_to_add = element.doclist.docs[first];
//                delete element.doclist.docs[first];
//                element.doclist.docs.splice(0, 0, element_to_add);
            }
            return element;
        }
    }


    function reorder_and_return(element, index) {
        element_to_add = element.doclist.docs[index];
        element.doclist.docs.splice(index, 1);
        element.doclist.docs.splice(0, 0, element_to_add);
        return element;
    }

    /**
     * @param {String} romanProvinceItalicRegion The source string
     * @return {Boolean} Returns true  if romanProvinceItalicRegion contains
     *  the required literals for provider EDR:
     * 
     Sardinia
     Sicilia, Melita
     Roma
     Latium et Campania (Regio I)
     Apulia et Calabria (Regio II)
     Bruttium et Lucania (Regio III)
     Samnium (Regio IV)
     Picenum (Regio V)
     Umbria (Regio VI)
     Etruria (Regio VII)
     Aemilia (Regio VIII)
     Liguria (Regio IX)
     Venetia et Histria (Regio X)
     Transpadana (Regio XI)
     * 
     * */
    function match_level2EDR(romanProvinceItalicRegion) {
        for (var pointer = 0; pointer < EDR_MATCH_CONDITIONS.length; pointer++) {
            pattern = new RegExp('.*' + EDR_MATCH_CONDITIONS[pointer] + '.*', 'i');
            if (pattern.test(romanProvinceItalicRegion))
                return true;
        }
        return false;
    }

    /**
     * @param {String} romanProvinceItalicRegion The source string
     * @return {Boolean} Returns true  if romanProvinceItalicRegion contains
     *  the required literals for Other Providers:
     * 
     hispania
     Baetica
     Lusitania
     Hispania citerior
     * 
     * */
    function match_level2OTHER(romanProvinceItalicRegion) {
        for (var pointer = 0; pointer < OTHER_MATCH_CONDITIONS.length; pointer++) {
            pattern = new RegExp('.*' + OTHER_MATCH_CONDITIONS[pointer] + '.*', 'i');
            if (pattern.test(romanProvinceItalicRegion))
                return true;
        }
        return false;
    }


    function isSimpleSearch() {
        return searchType === 0;
    }

    function isAdvancedSearch() {
        return searchType === 1;
    }

    function htmlContent() {
        jQuery("#appender").remove();
        var appender = '<div id="appender" style="display:none;">';
        var html = '<div class="search-padder">';
        if (view !== "archives") {
            html += '<h5 onclick="Search.showFBoxSavingForm();" class="mygrey saveres">Save result</h5>';
            html += '<span class="mygrey saveres" onclick="Search.generatePDF();">PDF</span>';
            html += '<span class="mygrey saveres" onclick="Search.generateCSV();">CSV</span>';
        }
        lastPage = (Math.floor(lastResponse.grouped.tmid.ngroups / parseInt(lastResponse.responseHeader.params.rows)) + 1);


        var entupper = '';

        switch (entity) {
            case "artifact":
                entupper = 'ARTEFACT';
                break;
            case "documental":
                entupper = 'TEXT';
                break;
            case "visual":
                entupper = 'IMAGES';
                break;
        }

        html += '<h5 class="resultCount">' + lastResponse.grouped.tmid.matches + ' results found in the category ' + entupper + ' of which ' + lastResponse.grouped.tmid.ngroups + ' are unique results (i.e. related to the same inscription)</h5>';
        html += '<h5 class="mygrey saveres">  page ' + (page + 1) + ' of ' + lastPage + '</h5>';
        html += '<div class="clear"></div>';
        switch (entity) {
            case "artifact":
            {
//                    for (var i = 0; i < lastResponse.response.docs.length; i++) {
                for (var i = 0; i < lastResponse.grouped.tmid.groups.length; i++) {
//                        var element = lastResponse.response.docs[i];

                    var element = preorder_by_criteria(i);
//                        var xmlDoc = jQuery.parseXML(element.__result[0]);
                    var xmlDoc = jQuery.parseXML(element.doclist.docs[0].__result[0]);
                    var xml = jQuery(xmlDoc);


                    var image = xml.find("thumbnail");
                    var hasVisualRapresentation = jQuery(xml.find("hasVisualRepresentation"));

                    if (hasVisualRapresentation.length > 0)
                    {
                        var visualdnet = jQuery(hasVisualRapresentation.find("dnetResourceIdentifier"));
                        var urlvisualdnet = jQuery(visualdnet[0]).text();
                        var urlvisualdnet = urlvisualdnet.replace("::", "..")
                        urlvisualdnet = urlvisualdnet.replace("::", "..")
                        urlvisualdnet = urlvisualdnet.replace("::", "..")
                        urlvisualdnet = 'http://virserv101.isti.cnr.it/eagle-images/thumbnails/' + urlvisualdnet + '.jpg';

                    }
                    image = (image.length !== 0) ? '<div class="artifactImgCont left"><img id="img' + i + '" class="portal" src="' + urlvisualdnet + ' "onerror=this.onerror=null;this.src="' + encodeURI(jQuery(image[0]).text()) + '" /></div>' : '<div class="artifactImgCont left"><img class="artifactImg" src="/wp-content/plugins/eagle-search/img/default.jpg" /></div>';
                    //  image = (image.length !== 0) ? '<div class="artifactImgCont left"><img id="img' + i + '" class="portal" src="' + jQuery(image[0]).text() + '" /></div>' : '<div class="artifactImgCont left"><img class="artifactImg" src="/wp-content/plugins/eagle-search/img/default.jpg" /></div>';
                    var title = xml.find("title").text();
//                  var cpId = xml.find("recordSourceInfo").attr("providerName");
                    var cpId = jQuery.trim(jQuery(xml.find("recordSourceInfo")[0]).attr("providerName"));
                    cpId = (cpId !== "") ? '<strong>Content Provider: </strong><span class="cpid">' + cpId + '</span>' : '<strong>Content Provider: </strong><span class="cpid">not available</span>';

                    var rpir = xml.find("romanProvinceItalicRegion").text();
                    var afsp = xml.find("ancientFindSpot").text();

                    var location = '';
                    var locationArr = new Array();
                    if (rpir !== '')
                        locationArr.push('<span>' + rpir + '</span>');
                    if (afsp !== '')
                        locationArr.push('<span>' + afsp + '</span>');

                    location = locationArr.join();

                    if (location === '')
                        location = "<br/><strong>Ancient findspot: </strong><span>not available</span>";
                    else
                        location = "<br/><strong>Ancient findspot: </strong>" + location;

                    var modernFindspot = jQuery.trim(xml.find("modernFindSpot").text());
                    modernFindspot = (modernFindspot !== "") ? '<br/><strong>Modern findspot: </strong><span>' + modernFindspot + '</span>' : '<br/><strong>Modern findspot: </strong><span>not available</span>';
                    var transcription = jQuery.trim(xml.find("hasTranscription").find("text").text().substring(0, 256));
                    transcription = (transcription !== "") ? '<p><strong>Text:</strong> ' + htmlEntities(transcription) + '</p>' : '<p><strong>Text:</strong>not available</p>';
                    var data = jQuery.trim(xml.find("originDating").text());
                    data = (data !== "") ? '<strong>Date: </strong><span>' + data + '</span>' : '<strong>Date: </strong><span>not available</span>';

                    if (i % 2 === 0) {
                        html += '<div onclick="Search.showArtifactExtraInfo(' + i + ',0,event);" class="row0">' + image + '<div class="artifactInfoCont left"><h4 class="artifactTitle mygrey">' + title + '</h4><div class="artifactExtraInfo">' + cpId + location + modernFindspot + '</div>' + transcription + '<div class="artifactDataInfo">' + data + '</div></div><div class="clear"></div></div>';
                    } else {
                        html += '<div onclick="Search.showArtifactExtraInfo(' + i + ',0,event);" class="row1">' + image + '<div class="artifactInfoCont left"><h4 class="artifactTitle mygrey">' + title + '</h4><div class="artifactExtraInfo">' + cpId + location + modernFindspot + '</div>' + transcription + '<div class="artifactDataInfo">' + data + '</div></div><div class="clear"></div></div>';
                    }
                }
                break;
            }
            case "documental":
            {

                //                    for (var i = 0; i < lastResponse.response.docs.length; i++) {
                for (var i = 0; i < lastResponse.grouped.tmid.groups.length; i++) {
//                        var element = lastResponse.response.docs[i];
                    //var element = lastResponse.grouped.tmid.groups[i];
                    var element = preorder_by_criteria(i);
//                        var xmlDoc = jQuery.parseXML(element.__result[0]);
                    var xmlDoc = jQuery.parseXML(element.doclist.docs[0].__result[0]);
                    var xml = jQuery(xmlDoc);
                    var image = xml.find("thumbnail");
                    var hasVisualRapresentation = jQuery(xml.find("hasVisualRepresentation"));

                    if (hasVisualRapresentation.length > 0)
                    {
                        var visualdnet = jQuery(hasVisualRapresentation.find("dnetResourceIdentifier"));
                        var urlvisualdnet = jQuery(visualdnet[0]).text();
                        var urlvisualdnet = urlvisualdnet.replace("::", "..")
                        urlvisualdnet = urlvisualdnet.replace("::", "..")
                        urlvisualdnet = urlvisualdnet.replace("::", "..")
                        urlvisualdnet = 'http://virserv101.isti.cnr.it/eagle-images/thumbnails/' + urlvisualdnet + '.jpg';

                    }
                    image = (image.length !== 0) ? '<div class="artifactImgCont left"><img id="img' + i + '" class="portal" src="' + urlvisualdnet + ' "onerror=this.onerror=null;this.src="' + encodeURI(jQuery(image[0]).text()) + '" /></div>' : '<div class="artifactImgCont left"><img class="artifactImg" src="/wp-content/plugins/eagle-search/img/default.jpg" /></div>';

//                    image = (image.length !== 0) ? '<div class="artifactImgCont left"><img id="img' + i + '" class="portal" src="' + jQuery(image[0]).text() + '" /></div>' : '<div class="artifactImgCont left"><img class="artifactImg" src="/wp-content/plugins/eagle-search/img/default.jpg" /></div>';
                    var title = xml.find("title").text();
//                        var cpId = xml.find("recordSourceInfo").attr("providerName");
                    var cpId = jQuery.trim(jQuery(xml.find("recordSourceInfo")[0]).attr("providerName"));
                    var cpIdSave = jQuery.trim(jQuery(xml.find("dnetResourceIdentifier")[0]).text());
                    cpId = (cpId !== "") ? '<strong>Content Provider: </strong><span class="cpid">' + cpId + '</span>' : '<strong>Content Provider: </strong><span class="cpid">not available</span>';

                    var rpir = xml.find("romanProvinceItalicRegion").text();
                    var afsp = xml.find("ancientFindSpot").text();

                    var location = '';
                    var locationArr = new Array();
                    if (rpir !== '')
                        locationArr.push('<span>' + rpir + '</span>');
                    if (afsp !== '')
                        locationArr.push('<span>' + afsp + '</span>');

                    location = locationArr.join();

                    if (location === '')
                        location = "<br/><strong>Ancient findspot: </strong><span>not available</span>";
                    else
                        location = "<br/><strong>Ancient findspot: </strong>" + location;

                    var modernFindspot = jQuery.trim(xml.find("modernFindSpot").text());
                    modernFindspot = (modernFindspot !== "") ? '<br/><strong>Modern findspot: </strong><span>' + modernFindspot + '</span>' : '<br/><strong>Modern findspot: </strong><span>not available</span>';

                    var transcription = xml.find("transcription").find("text");
                    transcription = jQuery(transcription[0]).text().substring(0, 1024);
                    transcription = (transcription !== "") ? '<p><strong>Text:</strong> ' + htmlEntities(transcription) + '</p>' : '<p><strong>Text:</strong>not available</p>';

                    var data = jQuery.trim(xml.find("originDating").text());
                    data = (data !== "") ? '<strong>Date: </strong><span>' + data + '</span>&nbsp;' : '<strong>Date: </strong><span>not available</span>&nbsp;';


                    var translation = xml.find("hasTranslation");
                    var translation_a = (translation.length !== 0) ? '<a class="fancybox mygrey" href="#inline' + i + '">Available</a>' : '<span class="mygrey" >NO translation available</span>';
                    appender += (translation.length !== 0) ? '<div id="inline' + i + '" style=""><p>' + jQuery(translation[0]).find("text").text() + '</p></div>' : '';

//                        var alterCpID = '';
//                        for (var j = 0; j < element.doclist.docs.length; j++) {
//                            var xmlDocAltCP = jQuery.parseXML(element.doclist.docs[j].__result[0]);
//                            var xmlAltCP = jQuery(xmlDocAltCP);
//                            var tmpProvider = jQuery(xmlAltCP.find("recordSourceInfo")[0]).attr("providerName");
//                            if (cpId !== tmpProvider)
//                                alterCpID += (alterCpID === '') ? tmpProvider: ' , ' + tmpProvider;
//                        }
                    var alterCpID = 0;
                    for (var j = 0; j < element.doclist.docs.length; j++) {
                        var xmlDocAltCP = jQuery.parseXML(element.doclist.docs[j].__result[0]);
                        var xmlAltCP = jQuery(xmlDocAltCP);
                        var tmpProvider = jQuery.trim(jQuery(xmlAltCP.find("dnetResourceIdentifier")[0]).text());
                        if (cpIdSave !== tmpProvider)
                            alterCpID++;
                    }

                    alterCpID = (alterCpID > 0) ? '<strong>Other instances available: </strong><span class="mygrey">yes</span>' : '<strong>Other instances available: </strong><span class="mygrey">no</span>';
                    if (i % 2 === 0) {
                        html += '<div onclick="Search.showArtifactExtraInfo(' + i + ',0,event);" class="row0">' + image + '<div class="artifactInfoCont left"><h4 class="artifactTitle mygrey">' + title + '</h4><div class="artifactExtraInfo">' + cpId + location + modernFindspot + '</div>' + transcription + '<div class="artifactDataInfo">' + data + '<br/><strong>Translation: </strong>' + translation_a + '<br/>' + alterCpID + '</div></div><div class="clear"></div></div>';
                    } else {
                        html += '<div onclick="Search.showArtifactExtraInfo(' + i + ',0,event);" class="row1">' + image + '<div class="artifactInfoCont left"><h4 class="artifactTitle mygrey">' + title + '</h4><div class="artifactExtraInfo">' + cpId + location + modernFindspot + '</div>' + transcription + '<div class="artifactDataInfo">' + data + '<br/><strong>Translation: </strong>' + translation_a + '<br/>' + alterCpID + '</div></div><div class="clear"></div></div>';
                    }

                }
                break;
            }
            case "visual":
            {
                html += '<div class="visual-cont">';
                //                    for (var i = 0; i < lastResponse.response.docs.length; i++) {
                for (var i = 0; i < lastResponse.grouped.tmid.groups.length; i++) {
//                        var element = lastResponse.response.docs[i];
                    //var element = lastResponse.grouped.tmid.groups[i];
                    var element = preorder_by_criteria(i);
//                        var xmlDoc = jQuery.parseXML(element.__result[0]);
                    var xmlDoc = jQuery.parseXML(element.doclist.docs[0].__result[0]);
                    var xml = jQuery(xmlDoc);
                    var image = xml.find("thumbnail");
//		    
                    var visualdnet = xml.find("dnetResourceIdentifier").text();
                    var pos = visualdnet.indexOf("visual");
                    if (pos != -1)
                    {
                        visualdnet = visualdnet.substring(0, pos + 6);


                        var urlvisualdnet = visualdnet.replace("::", "..")
                        urlvisualdnet = urlvisualdnet.replace("::", "..")
                        urlvisualdnet = urlvisualdnet.replace("::", "..")
                        urlvisualdnet = 'http://virserv101.isti.cnr.it/eagle-images/thumbnails/' + urlvisualdnet + '.jpg';
                    }
                    ;

                    image = (image.length !== 0) ? '<div class="artifactImgVisualCont left"><img class="artifactImg visual" src="' + urlvisualdnet + ' "onerror=this.onerror=null;this.src="' + encodeURI(jQuery(image[0]).text()) + '" /></div>' : '<div class="artifactImgCont left"><img class="artifactImg" src="/wp-content/plugins/eagle-search/img/default.jpg" /></div>';

//                 image = (image.length !== 0) ? '<div class="artifactImgVisualCont" ><img  class="artifactImg visual" src="' + jQuery(image[0]).text() + '" /></div>' : '<div class="artifactImgCont"><img  class="artifactImg visual" src="/wp-content/plugins/eagle-search/img/default.jpg" /></DIV>';
                    var title = xml.find("title").text();
//                        var cpId = xml.find("recordSourceInfo").attr("providerName");
                    var cpId = jQuery(xml.find("recordSourceInfo")[0]).attr("providerName");

                    title = (title !== undefined) ? title.substring(0, 20) + '...' : '';
                    cpId = (cpId !== undefined) ? cpId.substring(0, 20) + '...' : '';

                    html += '<div onclick="Search.showArtifactExtraInfo(' + i + ',0,event);" onmouseover="Search.showVisualExtraInfo(this,\'over\');" onmouseleave="Search.showVisualExtraInfo(this,\'leave\');" class="single-viasual">';
                    html += '<div  class="descr-viasual">';
                    html += '<h3>' + title + '</h3>';
                    html += '<h5>cp.id: ' + cpId + '</h5>';
                    html += '</div>';
                    html += image;
                    html += '</div>';



                }
                html += '<div class="clear"></div>';
                html += '</div>';
                break;
            }
        }
        appender += '</div>';
        jQuery("body").append(appender);
        html += '</div>';
        jQuery("h1.search_help a").attr("href", "http://www.eagle-network.eu/inscriptions-search-engine-online-manual#ListContent");

        state = (searchType === 0) ? 1 : 10;
        return html;
    }


    function htmlContentArchives() {
        jQuery("#appender").remove();
        var appender = '<div id="appender" style="display:none;">';
        var html = '<div class="search-padder">';
        var entupper = '';

        switch (entity) {
            case "artifact":
                entupper = 'ARTEFACT';
                break;
            case "documental":
                entupper = 'TEXT';
                break;
            case "visual":
                entupper = 'IMAGES';
                break;
        }

        html += '<h5 class="resultCount">' + lastResponse.grouped.tmid.matches + ' results found in the category ' + entupper + ' of which ' + lastResponse.grouped.tmid.ngroups + ' are unique results (i.e. related to the same inscription)</h5>';
        html += '<h5 class="mygrey saveres">  page ' + (page + 1) + ' of ' + lastPage + '</h5>';
        html += '<div class="clear"></div>';
        switch (entity) {
            case "artifact":
            {
                var limit = (page === (lastPage - 1)) ? lastResponse.grouped.tmid.groups.length : (page + 1) * 10;
                for (var i = page * 10; i < (limit); i++) {
                    //var element = lastResponse.grouped.tmid.groups[i];
                    var element = preorder_by_criteria(i);
                    var xmlDoc = jQuery.parseXML(element.doclist.docs[0].__result[0]);
                    var xml = jQuery(xmlDoc);
                    var image = xml.find("thumbnail");
                    var hasVisualRapresentation = jQuery(xml.find("hasVisualRepresentation"));

                    if (hasVisualRapresentation.length > 0)
                    {
                        var visualdnet = jQuery(hasVisualRapresentation.find("dnetResourceIdentifier"));
                        var urlvisualdnet = jQuery(visualdnet[0]).text();
                        var urlvisualdnet = urlvisualdnet.replace("::", "..")
                        urlvisualdnet = urlvisualdnet.replace("::", "..")
                        urlvisualdnet = urlvisualdnet.replace("::", "..")
                        urlvisualdnet = 'http://virserv101.isti.cnr.it/eagle-images/thumbnails/' + urlvisualdnet + '.jpg';

                    }
                    image = (image.length !== 0) ? '<div class="artifactImgCont left"><img class="artifactImg visual" src="' + urlvisualdnet + ' "onerror=this.onerror=null;this.src="' + encodeURI(jQuery(image[0]).text()) + '" /></div>' : '<div class="artifactImgCont left"><img class="artifactImg" src="/wp-content/plugins/eagle-search/img/default.jpg" /></div>';
//                    if (image.length !== 0) {
//                        var src = jQuery(image[0]).text();
//                        image = '<div class="artifactImgCont left"><img id="img' + i + '" class="portal" src="' + src + '" /></div>';
//                            var img = new Image();
//                            img.src = src;
//                            img.onload = imageResize(i,img);

//                    } else {
//                        image = '<div class="artifactImgCont left"><img class="artifactImg" src="/wp-content/plugins/eagle-search/img/default.jpg" /></div>';
//                    }
                    var title = xml.find("title").text();
//                        var cpId = xml.find("recordSourceInfo").attr("providerName");
                    var cpId = jQuery.trim(jQuery(xml.find("recordSourceInfo")[0]).attr("providerName"));
                    cpId = (cpId !== "") ? '<strong>Content Provider: </strong><span class="cpid">' + cpId + '</span>' : '<strong>Content Provider: </strong><span class="cpid">not available</span>';

                    var rpir = xml.find("romanProvinceItalicRegion").text();
                    var afsp = xml.find("ancientFindSpot").text();

                    var location = '';
                    var locationArr = new Array();
                    if (rpir !== '')
                        locationArr.push('<span>' + rpir + '</span>');
                    if (afsp !== '')
                        locationArr.push('<span>' + afsp + '</span>');

                    location = locationArr.join();

                    if (location === '')
                        location = "<br/><strong>Ancient findspot: </strong><span>not available</span>";
                    else
                        location = "<br/><strong>Ancient findspot: </strong>" + location;

                    var modernFindspot = jQuery.trim(xml.find("modernFindSpot").text());
                    modernFindspot = (modernFindspot !== "") ? '<br/><strong>Modern findspot: </strong><span>' + modernFindspot + '</span>' : '<br/><strong>Modern findspot: </strong><span>not available</span>';

                    var transcription = jQuery.trim(xml.find("hasTranscription").find("text").text().substring(0, 256));
                    transcription = (transcription !== "") ? '<p><strong>Text:</strong> ' + htmlEntities(transcription) + '</p>' : '<p><strong>Text:</strong>not available</p>';
                    var data = jQuery.trim(xml.find("originDating").text());
                    data = (data !== "") ? '<strong>Date: </strong><span>' + data + '</span>' : '<strong>Date: </strong><span>not available</span>';

                    if (i % 2 === 0) {
                        html += '<div onclick="Search.showArtifactExtraInfoArchives(' + i + ',0,event);" class="row0">' + image + '<div class="artifactInfoCont left"><h4 class="artifactTitle mygrey">' + title + '</h4><div class="artifactExtraInfo">' + cpId + location + modernFindspot + '</div>' + transcription + '<div class="artifactDataInfo">' + data + '</div></div><div class="clear"></div></div>';
                    } else {
                        html += '<div onclick="Search.showArtifactExtraInfoArchives(' + i + ',0,event);" class="row1">' + image + '<div class="artifactInfoCont left"><h4 class="artifactTitle mygrey">' + title + '</h4><div class="artifactExtraInfo">' + cpId + location + modernFindspot + '</div>' + transcription + '<div class="artifactDataInfo">' + data + '</div></div><div class="clear"></div></div>';
                    }
                }
                break;
            }
            case "documental":
            {

                var limit = (page === (lastPage - 1)) ? (lastResponse.grouped.tmid.groups.length % 10) + ((page + 1) * 10) : (page + 1) * 10;
                for (var i = page * 10; i < (limit); i++) {
                    //var element = lastResponse.grouped.tmid.groups[i];
                    var element = preorder_by_criteria(i);

                    var xmlDoc = jQuery.parseXML(element.doclist.docs[0].__result[0]);
                    var xml = jQuery(xmlDoc);
                    var image = xml.find("thumbnail");
                    var hasVisualRapresentation = jQuery(xml.find("hasVisualRepresentation"));

                    if (hasVisualRapresentation.length > 0)
                    {
                        var visualdnet = jQuery(hasVisualRapresentation.find("dnetResourceIdentifier"));
                        var urlvisualdnet = jQuery(visualdnet[0]).text();
                        var urlvisualdnet = urlvisualdnet.replace("::", "..")
                        urlvisualdnet = urlvisualdnet.replace("::", "..")
                        urlvisualdnet = urlvisualdnet.replace("::", "..")
                        urlvisualdnet = 'http://virserv101.isti.cnr.it/eagle-images/thumbnails/' + urlvisualdnet + '.jpg';

                    }
                    image = (image.length !== 0) ? '<div class="artifactImgCont left"><img class="artifactImg visual" src="' + urlvisualdnet + ' "onerror=this.onerror=null;this.src="' + encodeURI(jQuery(image[0]).text()) + '" /></div>' : '<div class="artifactImgCont left"><img class="artifactImg" src="/wp-content/plugins/eagle-search/img/default.jpg" /></div>';
//                   image = (image.length !== 0) ? '<div class="artifactImgCont left"><img class="artifactImg" src="' + jQuery(image[0]).text() + '" /></div>' : '<div class="artifactImgCont left"><img class="artifactImg" src="/wp-content/plugins/eagle-search/img/default.jpg" /></div>';
                    var title = xml.find("title").text();
//                        var cpId = xml.find("recordSourceInfo").attr("providerName");
                    var cpId = jQuery.trim(jQuery(xml.find("recordSourceInfo")[0]).attr("providerName"));
                    var cpIdSave = jQuery.trim(jQuery(xml.find("dnetResourceIdentifier")[0]).text());

                    cpId = (cpId !== "") ? '<strong>Content Provider: </strong><span class="cpid">' + cpId + '</span>' : '<strong>Content Provider: </strong><span class="cpid">not available</span>';

                    var rpir = xml.find("romanProvinceItalicRegion").text();
                    var afsp = xml.find("ancientFindSpot").text();

                    var location = '';
                    var locationArr = new Array();
                    if (rpir !== '')
                        locationArr.push('<span>' + rpir + '</span>');
                    if (afsp !== '')
                        locationArr.push('<span>' + afsp + '</span>');

                    location = locationArr.join();

                    if (location === '')
                        location = "<br/><strong>Ancient findspot: </strong><span>not available</span>";
                    else
                        location = "<br/><strong>Ancient findspot: </strong>" + location;

                    var modernFindspot = jQuery.trim(xml.find("modernFindSpot").text());
                    modernFindspot = (modernFindspot !== "") ? '<br/><strong>Modern findspot: </strong><span>' + modernFindspot + '</span>' : '<br/><strong>Modern findspot: </strong><span>not available</span>';

                    var transcription = xml.find("transcription").find("text");
                    transcription = jQuery(transcription[0]).text().substring(0, 1024);
                    transcription = (transcription !== "") ? '<p><strong>Text:</strong> ' + htmlEntities(transcription) + '</p>' : '<p><strong>Text:</strong>not available</p>';

                    var data = jQuery.trim(xml.find("originDating").text());
                    data = (data !== "") ? '<strong>Date: </strong><span>' + data + '</span>&nbsp;' : '<strong>Date: </strong><span>not available</span>&nbsp;';


                    var translation = xml.find("hasTranslation");
                    var translation_a = (translation.length !== 0) ? '<a class="fancybox mygrey" href="#inline' + i + '">Available</a>' : '<span class="mygrey" >NO translation available</span>';
                    appender += (translation.length !== 0) ? '<div id="inline' + i + '" style=""><p>' + jQuery(translation[0]).find("text").text() + '</p></div>' : '';

//                        var alterCpID = '';
//                        for (var j = 0; j < element.doclist.docs.length; j++) {
//                            var xmlDocAltCP = jQuery.parseXML(element.doclist.docs[j].__result[0]);
//                            var xmlAltCP = jQuery(xmlDocAltCP);
//                            alterCpID += (alterCpID === '') ? jQuery(xmlAltCP.find("recordSourceInfo")[0]).text() : ' , ' + jQuery(xmlAltCP.find("recordSourceInfo")[0]).text();
//                        }
//                        alterCpID = (alterCpID !== "") ? '<strong>Alternative Content Providers: </strong><span class="mygrey">' + alterCpID + '</span>' : '';


                    var alterCpID = 0;
                    for (var j = 0; j < element.doclist.docs.length; j++) {
                        var xmlDocAltCP = jQuery.parseXML(element.doclist.docs[j].__result[0]);
                        var xmlAltCP = jQuery(xmlDocAltCP);
                        var tmpProvider = jQuery.trim(jQuery(xmlAltCP.find("dnetResourceIdentifier")[0]).text());
                        if (cpIdSave !== tmpProvider)
                            alterCpID++;
                    }

                    alterCpID = (alterCpID > 0) ? '<strong>Other instances available: </strong><span class="mygrey">yes</span>' : '<strong>Other instances available: </strong><span class="mygrey">no</span>';
                    if (i % 2 === 0) {
                        html += '<div onclick="Search.showArtifactExtraInfoArchives(' + i + ',0,event);" class="row0">' + image + '<div class="artifactInfoCont left"><h4 class="artifactTitle mygrey">' + title + '</h4><div class="artifactExtraInfo">' + cpId + location + modernFindspot + '</div>' + transcription + '<div class="artifactDataInfo">' + data + '<strong>Translation: </strong>' + translation_a + '<br/>' + alterCpID + '</div></div><div class="clear"></div></div>';
                    } else {
                        html += '<div onclick="Search.showArtifactExtraInfoArchives(' + i + ',0,event);" class="row1">' + image + '<div class="artifactInfoCont left"><h4 class="artifactTitle mygrey">' + title + '</h4><div class="artifactExtraInfo">' + cpId + location + modernFindspot + '</div>' + transcription + '<div class="artifactDataInfo">' + data + '<strong>Translation: </strong>' + translation_a + '<br/>' + alterCpID + '</div></div><div class="clear"></div></div>';
                    }

                }
                break;
            }
            case "visual":
            {
                html += '<div class="visual-cont">';
                var limit = (page === (lastPage - 1)) ? (lastResponse.grouped.tmid.groups.length % 10) + ((page + 1) * 10) : (page + 1) * 10;
                for (var i = page * 10; i < (limit); i++) {
                    // var element = lastResponse.grouped.tmid.groups[i];
                    var element = preorder_by_criteria(i);
                    if (element === undefined)
                        break;

                    var xmlDoc = jQuery.parseXML(element.doclist.docs[0].__result[0]);
                    var xml = jQuery(xmlDoc);
                    var image = xml.find("thumbnail");
                    // var hasVisualRapresentation = jQuery(xml.find("hasVisualRepresentation"));
                    var visualdnet = xml.find("dnetResourceIdentifier").text();
                    var pos = visualdnet.indexOf("visual");
                    if (pos != -1)
                    {
                        visualdnet = visualdnet.substring(0, pos + 6);


                        var urlvisualdnet = visualdnet.replace("::", "..")
                        urlvisualdnet = urlvisualdnet.replace("::", "..")
                        urlvisualdnet = urlvisualdnet.replace("::", "..")
                        urlvisualdnet = 'http://virserv101.isti.cnr.it/eagle-images/thumbnails/' + urlvisualdnet + '.jpg';
                    }
                    ;

                    image = (image.length !== 0) ? '<div class="artifactImgVisualCont left"><img class="artifactImg visual" src="' + urlvisualdnet + ' "onerror=this.onerror=null;this.src="' + encodeURI(jQuery(image[0]).text()) + '" /></div>' : '<div class="artifactImgVisualCont"><img class="artifactImg visual" src="/wp-content/plugins/eagle-search/img/default.jpg" /></div>';
//                    image = (image.length !== 0) ? '<div class="artifactImgVisualCont" ><img  class="artifactImg visual" src="' + jQuery(image[0]).text() + '" /></div>' : '<div class="artifactImgVisualCont" ><img  class="artifactImg visual" src="/wp-content/plugins/eagle-search/img/default.jpg" /></div>';
//  		}                   
                    var title = xml.find("title").text();
//                        var cpId = xml.find("recordSourceInfo").attr("providerName");
                    var cpId = jQuery(xml.find("recordSourceInfo")[0]).attr("providerName");

                    title = (title !== undefined) ? title.substring(0, 20) + '...' : '';
                    cpId = (cpId !== undefined) ? cpId.substring(0, 20) + '...' : '';

                    html += '<div onclick="Search.showArtifactExtraInfoArchives(' + i + ',0,event);" onmouseover="Search.showVisualExtraInfo(this,\'over\');" onmouseleave="Search.showVisualExtraInfo(this,\'leave\');" class="single-viasual">';
                    html += '<div  class="descr-viasual">';
                    html += '<h3>' + title + '</h3>';
                    html += '<h5>cp.id: ' + cpId + '</h5>';
                    html += '</div>';
                    html += image;
                    html += '</div>';
                }
                html += '<div class="clear"></div>';
                html += '</div>';
                break;
            }
        }
        appender += '</div>';
        jQuery("body").append(appender);
        html += '</div>';
        return html;
    }

    function imageListResize() {
        var imageList = jQuery("div.artifactImgCont img.portal");
        for (var i = 0; i < imageList.length; i++) {
            var image = jQuery(imageList[i]);
            var w = image.width();
            var h = image.height();
            if (w > h)
                image.addClass("artifactImgMaxWidth");
            else
                image.addClass("artifactImgMaxHeight");
        }
    }

    function imageItemResize() {
        var imageList = jQuery("div.galleryFotoC img");
        for (var i = 0; i < imageList.length; i++) {
            var image = jQuery(imageList[i]);
            var w = image.width();
            var h = image.height();
            if (w > h)
                image.addClass("maxW");
            else
                image.addClass("maxH");
        }


    }

    function imageVisualResize() {
        var imageList = jQuery("div.single-viasual img.visual");
        for (var i = 0; i < imageList.length; i++) {
            var image = jQuery(imageList[i]);
            var w = image.width();
            var h = image.height();
            if (w > h) {
                image.css("width", "200px");
                var newH = h * 200 / w;
                image.css("left", "0px");
                image.css("top", ((200 - newH) / 2) + "px");
            } else {
                image.css("height", "200px");
                var newW = w * 200 / h;
                image.css("left", ((200 - newW) / 2) + "px");
                image.css("top", "0px");
            }
        }


    }

    function pagination() {
        var start = 1;
        var limit = 6;
        var paginatorCurrent = parseInt(page) + 1;
        var html = '<ul class="searchPagination">';
        if (lastPage > 5) {
            if (paginatorCurrent > 1) {
                html += '<li onclick="Search.gotoPage(0);" class="searchPBack left">First</li>';
                html += '<li onclick="Search.backPage();" class="searchPBack left">Previous</li>';
            }

            if (paginatorCurrent > 2 && (lastPage - paginatorCurrent) > 2) {
                start = paginatorCurrent - 2;
                limit = paginatorCurrent + 3;
            } else if (paginatorCurrent > 2 && (lastPage - paginatorCurrent) <= 2) {
                start = lastPage - 4;
                limit = lastPage + 1;
            }

            for (var i = start; i < limit; i++) {
                html += (i === (paginatorCurrent)) ? '<li class="searchPCurrent left">' + (paginatorCurrent) + '</li>' : '<li onclick="Search.gotoPage(' + (i - 1) + ');" class="searchPBack left">' + (i) + '</li>';
            }
            if (paginatorCurrent < lastPage) {
                html += '<li onclick="Search.nextPage();" class="searchPNext left" >Next</li>';
                html += '<li onclick="Search.gotoPage(' + (lastPage - 1) + ');" class="searchPBack left">Last</li>';
            }
        } else {
            if (paginatorCurrent > 1) {
                html += '<li onclick="Search.gotoPage(0);" class="searchPBack left">First</li>';
                html += '<li onclick="Search.backPage();" class="searchPBack left">Previous</li>';
            }
            for (var i = start; i < lastPage + 1; i++) {
                html += (i === (paginatorCurrent)) ? '<li class="searchPCurrent left">' + (paginatorCurrent) + '</li>' : '<li onclick="Search.gotoPage(' + (i - 1) + ');" class="searchPBack left">' + (i) + '</li>';
            }
            if (paginatorCurrent < lastPage) {
                html += '<li onclick="Search.nextPage();" class="searchPNext left" >Next</li>';
                html += '<li onclick="Search.gotoPage(' + (lastPage - 1) + ');" class="searchPBack left">Last</li>';
            }
        }
        html += '</ul>';
        return html;
    }

    function paginationArchives() {
        var start = 1;
        var limit = 6;
        var paginatorCurrent = page + 1;
        var html = '<ul class="searchPagination">';
        if (lastPage > 5) {
            if (paginatorCurrent > 1) {
                html += '<li onclick="Search.gotoPageArchives(0);" class="searchPBack left">First</li>';
                html += '<li onclick="Search.backPageArchives();" class="searchPBack left">Previous</li>';
            }

            if (paginatorCurrent > 2 && (lastPage - paginatorCurrent) > 2) {
                start = paginatorCurrent - 2;
                limit = paginatorCurrent + 3;
            } else if (paginatorCurrent > 2 && (lastPage - paginatorCurrent) <= 2) {
                start = lastPage - 4;
                limit = lastPage + 1;
            }

            for (var i = start; i < limit; i++) {
                html += (i === (paginatorCurrent)) ? '<li class="searchPCurrent left">' + (paginatorCurrent) + '</li>' : '<li onclick="Search.gotoPageArchives(' + (i - 1) + ');" class="searchPBack left">' + (i) + '</li>';
            }
            if (paginatorCurrent < lastPage) {
                html += '<li onclick="Search.nextPageArchives();" class="searchPNext left" >Next</li>';
                html += '<li onclick="Search.gotoPageArchives(' + (lastPage - 1) + ');" class="searchPBack left">Last</li>';
            }
        } else {
            if (paginatorCurrent > 1) {
                html += '<li onclick="Search.gotoPageArchives(0);" class="searchPBack left">First</li>';
                html += '<li onclick="Search.backPageArchives();" class="searchPBack left">Previous</li>';
            }
            for (var i = start; i < lastPage + 1; i++) {
                html += (i === (paginatorCurrent)) ? '<li class="searchPCurrent left">' + (paginatorCurrent) + '</li>' : '<li onclick="Search.gotoPageArchives(' + (i - 1) + ');" class="searchPBack left">' + (i) + '</li>';
            }
            if (paginatorCurrent < lastPage) {
                html += '<li onclick="Search.nextPageArchives();" class="searchPNext left" >Next</li>';
                html += '<li onclick="Search.gotoPageArchives(' + (lastPage - 1) + ');" class="searchPBack left">Last</li>';
            }
        }
        html += '</ul>';
        return html;
    }

    function htmlEntities(str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    window.encodeURIComponent = function (str) {
        return _fn(str).replace(/\(/g, "%28").replace(/\)/g, "%29");
    };

    function isEmpty(obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop))
                return false;
        }

        return true && JSON.stringify(obj) === JSON.stringify({});
    }
    
    
    String.prototype.hashCode = function () {
        var hash = 0;
        if (this.length == 0)
            return hash;
        for (i = 0; i < this.length; i++) {
            char = this.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }


}());
