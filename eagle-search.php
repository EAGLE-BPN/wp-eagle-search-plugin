<?php

/*
  Plugin Name: Eagle Search Inscriptions
  Plugin URI: http://www.googate.it/eagle-search-inscriptions
  Description: This plugin implements a search inscription engine from CNR Solr database
  Author: Michele Del Giudice
  Author URI: http://www.googate.it
  Version: 1.0
  License: GPL2
  Text Domain: eagle-search
  Copyright 2014  Michele Del Giudice  (email : michele@fedece.com)

  This program is free software; you can redistribute it and/or modify
  it under the terms of the GNU General Public License, version 2, as
  published by the Free Software Foundation.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program; if not, write to the Free Software
  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 */

require_once 'settings.php';

global $esi_db_version;
global $esi_script_onload;

$esi_db_version = "1.0";

function esi_database_install() {
    global $wpdb;
    global $esi_db_version;
    require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );

    $table_name = $wpdb->prefix . "esi_query";

    $sql = "CREATE TABLE IF NOT EXISTS $table_name (
query_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY ,
user_id INT NOT NULL ,
query_type VARCHAR( 6 ) NOT NULL ,
query TEXT NOT NULL ,
page_number SMALLINT UNSIGNED NOT NULL ,
tot_page_saved TINYINT UNSIGNED NOT NULL ,
title VARCHAR( 80 ) NOT NULL ,
comment TEXT NOT NULL,
resource VARCHAR( 256 ) NOT NULL ,
data DATETIME NOT NULL
) ENGINE = INNODB;";

    dbDelta($sql);

    $table_name = $wpdb->prefix . "esi_eagle_instance";

    $sql = "CREATE TABLE IF NOT EXISTS $table_name (
eagle_instance_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY ,
user_id INT NOT NULL ,
col TINYINT UNSIGNED NOT NULL ,
row TINYINT UNSIGNED NOT NULL ,
resource VARCHAR( 256 ) NOT NULL ,
data DATETIME NOT NULL ,
comment TEXT NOT NULL ,
title VARCHAR( 80 ) NOT NULL
) ENGINE = INNODB";

    dbDelta($sql);
//
//    $sql = "ALTER TABLE  $table_name ADD INDEX (eagle_object_id)";
//    dbDelta($sql);
//    $sql = "ALTER TABLE  $table_name ADD FOREIGN KEY (eagle_object_id) REFERENCES  wp_esi_eagle_object (eagle_object_id) ON DELETE CASCADE ON UPDATE NO ACTION ;";
//    dbDelta($sql);

    add_option("esi_db_version", $esi_db_version);
    flush_rewrite_rules(true);
}

register_activation_hook(__FILE__, 'esi_database_install');

function esi_database_uninstall() {
//    global $wpdb;
//    global $esi_db_version;


//
//    $table_name = $wpdb->prefix . "esi_eagle_object";
//    $sql = "DROP TABLE  $table_name";
//    $wpdb->query($sql);
//
//    $table_name = $wpdb->prefix . "esi_query_result_page";
//    $sql = "DROP TABLE  $table_name";
//    $wpdb->query($sql);



//    $table_name = $wpdb->prefix . "esi_eagle_instance";
//    $sql = "DROP TABLE  $table_name";
//    $wpdb->query($sql);
//
//    $table_name = $wpdb->prefix . "esi_query";
//    $sql = "DROP TABLE  $table_name";
//    $wpdb->query($sql);
//
//    delete_option($esi_db_version);

    flush_rewrite_rules(true);
}

register_uninstall_hook(__FILE__, 'esi_database_uninstall');

function esi_process_shortcode($atts = null) {
    global $languages;

    $defaultAttrVal = array("page_name" => "basic search", "preload" => "undefined");
    extract(shortcode_atts($defaultAttrVal, $atts, 'esi_shortcode'));

    if ($page_name === "basic search") {
        require_once __DIR__ . '/class/localVocabularyParser.php';
        wp_enqueue_script('jquery', '/wp-content/plugins/eagle-search/js/jquery-1.10.1.min.js');
        wp_enqueue_script('lightbox', '/wp-content/plugins/eagle-search/js/lightbox.min.js');
        wp_enqueue_script('eagle-search', '/wp-content/plugins/eagle-search/js/search.js');
        wp_enqueue_style('lightboxstyle', '/wp-content/plugins/eagle-search/css/lightbox.css');
        /* keyboard required */
        wp_enqueue_style('jqueryuistyle', '/wp-content/plugins/eagle-search/css/jquery-ui.min.css');
        wp_enqueue_style('mykeyboard', '/wp-content/plugins/eagle-search/css/mykeyboard.css');
        wp_enqueue_script('jqueryui', '/wp-content/plugins/eagle-search/js/jquery-ui.js', array('jquery'));
        wp_enqueue_script('mykeyboard', '/wp-content/plugins/eagle-search/js/mykeyboard.js', array('jqueryui'));
        /* Preset */
        wp_enqueue_script('preset', '/wp-content/plugins/eagle-search/js/preset.js');

        wp_enqueue_style('esi-style', '/wp-content/plugins/eagle-search/css/simple-search.css');
        $menu = '<ul class="menu-search"><li class="left selected"><a class="selected" href="/basic-search">basic search</a></li><li class="left"><a href="/advanced-search">advanced search</a></li><li class="left"><a href="/image-search">image search</a></li><li class="left"><a href="/archives">archives</a></li></ul>';

//$datingCriteria = new localVocabularyParser("datingvoc");
        $objectType = new localVocabularyParser("objecttypevoc");
        $typeOfInscription = new localVocabularyParser("inscriptiontypevoc");
        $material = new localVocabularyParser("materialvoc");
        $decoration = new localVocabularyParser("decorationvoc");
        $state = new localVocabularyParser("stateofpreservationvoc");
        $writing = new localVocabularyParser("writingtypevoc");

        $js = '<script type="text/javascript">jQuery(document).ready(function() {';


// $js.='Search.advFacetCache["datingvoc"]=' . json_encode($datingCriteria->getVocabolaryAssocWithName()) . ';';
        $js.='Search.advFacetCache["objecttypevoc"]=' . json_encode($objectType->getVocabolaryAssocWithName(SORT_STRING)) . ';';
        $js.='Search.advFacetCache["inscriptiontypevoc"]=' . json_encode($typeOfInscription->getVocabolaryAssocWithName(SORT_STRING)) . ';';
        $js.='Search.advFacetCache["materialvoc"]=' . json_encode($material->getVocabolaryAssocWithName(SORT_STRING)) . ';';
        $js.='Search.advFacetCache["decorationvoc"]=' . json_encode($decoration->getVocabolaryAssocWithName(SORT_STRING)) . ';';
        $js.='Search.advFacetCache["stateofpreservationvoc"]=' . json_encode($state->getVocabolaryAssocWithName(SORT_STRING)) . ';';
        $js.='Search.advFacetCache["writingtypevoc"]=' . json_encode($writing->getVocabolaryAssocWithName(SORT_STRING)) . ';';
        $generic_true_false_voc_choice = array();
        $generic_true_false_voc_choice[] = array("vocLabel" => "No", "vocValue" => "false");
        $generic_true_false_voc_choice[] = array("vocLabel" => 'Yes', "vocValue" => "true");
        $js.='Search.advFacetCache["hasimage"]=' . json_encode(array_merge(array("vocName" => "hasimage"), $generic_true_false_voc_choice)) . ';';
        $js.='Search.advFacetCache["hastranslation"]=' . json_encode(array_merge(array("vocName" => "hastranslation"), $generic_true_false_voc_choice)) . ';';

        $js.='});</script>';
        $jsOnLoad = '<script type="text/javascript">jQuery(window).load(function() {';
        if ($preload != 'undefined' && $preload != '') {
            $decoded = urldecode($preload);
            parse_str($decoded, $parsed_request);
            if (!array_key_exists('fields', $parsed_request)) {
                $jsOnLoad.='Search.bookmarkSimple("' . $parsed_request['query'] . '","' . $parsed_request['page'] . '","' . $parsed_request['entity'] . '","' . urlencode($parsed_request['facet']) . '","' . $parsed_request['artifactSelectedRow'] . '","' . $parsed_request['artifactSelectedCol'] . '");';
            } else {
                $jsOnLoad.='Search.bookmarkSimple("' . $parsed_request['query'] . '","' . $parsed_request['page'] . '","' . $parsed_request['entity'] . '","' . urlencode($parsed_request['facet']) . '","' . $parsed_request['artifactSelectedRow'] . '","' . $parsed_request['artifactSelectedCol'] . '","' . urlencode($parsed_request['fields']) . '");';
            }
        }
        $jsOnLoad.='});</script>';

        $languageHtml = '<select id="lang" onchange="Search.advFacetCacheRefresh();" class="search-element select">';
        $languageHtml.='<option selected="selected" value="null" >Default Language</option>';
        foreach ($languages as $language) {
            $languageHtml.='<option value="' . $language['iso'] . '" >' . $language['name'] . '</option>';
        }

// $imgUploadSearch = '<div class="img_search_cont"><label>Search by Image</label><br/><input type="file" name="img_search" id="img_search" /><button onclick="Search.searchByImage()" >Image Search</button></div>';
//        $polytonic = '<table class="policont"><tr><td class="label">Greek keyboard</td><td><input type="checkbox" class="search-element checkbox" id="politonic_enable" /></td><td whidth="300"><button class="action-button" type="button" onclick="Search.simpleSearchAll();">Browse All</button></td><td>' . $languageHtml . '</td></tr></table>';
//        $polytonic = '<table class="policont"><tr><td><input type="checkbox" class="search-element checkbox" id="politonic_enable" /></td><td class="label">Greek keyboard</td><td class="label">Include substrings (search might take more time)</td><td><input type="checkbox" class="search-element checkbox" id="ckstring" /></td></tr><tr><td><input type="checkbox" class="search-element checkbox" id="hebrew_enable" disabled /></td><td class="label">Hebrew keyboard</td><td whidth="300"><button class="action-button" type="button" onclick="Search.simpleSearchAll();">Browse All</button></td></tr></table>';
        $polytonic = '<table class="policont"><tr><td><input type="checkbox" class="search-element checkbox" id="ckstring" /></td><td colspan="3" class="label">Include substrings (search might take more time)</td></tr><tr><td ><input data-keylanguage="greek" type="checkbox" class="search-element checkbox keySwitcher" id="politonic_enable" /></td><td class="label">Greek keyboard</td><td><input data-keylanguage="hebrew" type="checkbox" class="search-element checkbox keySwitcher" id="hebrew_enable" /></td><td class="label">Hebrew keyboard</td></tr></table>';
        $browseAll = '<h5 class="resultCount">Type a keyword and press ENTER, or <a onclick="Search.simpleSearchAll();" class="" href="#">browse all the EAGLE collections</a></h5>';
        $buttonHelp ='<button onclick="Search.showHelp();" class="help-button" id="send">?</button>';

        $research = '<div class="search-padder">' . $browseAll . '<div class="search-box"><img onclick="Search.simpleSearch(event,\'artifact\');" class="lente" src="' . plugins_url('img/lente.png', __FILE__) . '" /><input class="politonic" onkeydown="Search.simpleSearch(event,\'artifact\');" type="text" placeholder="Search free text"  value="" name="mysearch" id="mysearch" />'.$buttonHelp .'</div>' . $polytonic . $imgUploadSearch .'</div>' . $js.$jsOnLoad;
    } else if ($page_name === "advanced search") {
        require_once __DIR__ . '/class/localVocabularyParser.php';
        /* Make instance of each required vocabolary */
//$datingCriteria = new localVocabularyParser("datingvoc");
        $objectType = new localVocabularyParser("objecttypevoc");
        $typeOfInscription = new localVocabularyParser("inscriptiontypevoc");
        $material = new localVocabularyParser("materialvoc");
        $decoration = new localVocabularyParser("decorationvoc");
        $state = new localVocabularyParser("stateofpreservationvoc");
        $writing = new localVocabularyParser("writingtypevoc");
        /* Enqueue required script */
        wp_enqueue_script('jquery', '/wp-content/plugins/eagle-search/js/jquery-1.10.1.min.js');
        wp_enqueue_script('lightbox', '/wp-content/plugins/eagle-search/js/lightbox.min.js');
        wp_enqueue_script('eagle-search', '/wp-content/plugins/eagle-search/js/search.js');
        wp_enqueue_style('lightboxstyle', '/wp-content/plugins/eagle-search/css/lightbox.css');
        wp_enqueue_script('preset', '/wp-content/plugins/eagle-search/js/preset.js');
        wp_enqueue_style('esi-style', '/wp-content/plugins/eagle-search/css/adv-search.css');
        /* keyboard required */
        wp_enqueue_style('jqueryuistyle', '/wp-content/plugins/eagle-search/css/jquery-ui.min.css');
        wp_enqueue_style('mykeyboard', '/wp-content/plugins/eagle-search/css/mykeyboard.css');
        wp_enqueue_script('jqueryui', '/wp-content/plugins/eagle-search/js/jquery-ui.js', array('jquery'));
        wp_enqueue_script('mykeyboard', '/wp-content/plugins/eagle-search/js/mykeyboard.js', array('jqueryui'));

        /* JS caching advFields */
        $js = '<script type="text/javascript">jQuery(document).ready(function() {';
// $js.='Search.advFacetCache["notbefore"]=' . json_encode($datingCriteria->getVocabolaryAssocWithName()) . ';';
        $js.='Search.advFacetCache["objecttypevoc"]=' . json_encode($objectType->getVocabolaryAssocWithName(SORT_STRING)) . ';';
        $js.='Search.advFacetCache["inscriptiontypevoc"]=' . json_encode($typeOfInscription->getVocabolaryAssocWithName(SORT_STRING)) . ';';
        $js.='Search.advFacetCache["materialvoc"]=' . json_encode($material->getVocabolaryAssocWithName(SORT_STRING)) . ';';
        $js.='Search.advFacetCache["decorationvoc"]=' . json_encode($decoration->getVocabolaryAssocWithName(SORT_STRING)) . ';';
        $js.='Search.advFacetCache["stateofpreservationvoc"]=' . json_encode($state->getVocabolaryAssocWithName(SORT_STRING)) . ';';
        $js.='Search.advFacetCache["writingtypevoc"]=' . json_encode($writing->getVocabolaryAssocWithName(SORT_STRING)) . ';';
        $generic_true_false_voc_choice = array();
        $generic_true_false_voc_choice[] = array("vocLabel" => "No", "vocValue" => "false");
        $generic_true_false_voc_choice[] = array("vocLabel" => 'Yes', "vocValue" => "true");
        $js.='Search.advFacetCache["hasimage"]=' . json_encode(array_merge(array("vocName" => "hasimage"), $generic_true_false_voc_choice)) . ';';
        $js.='Search.advFacetCache["hastranslation"]=' . json_encode(array_merge(array("vocName" => "hastranslation"), $generic_true_false_voc_choice)) . ';';
//        $js.='});</script>';
        /* Make internal menu */
//$menu = '<ul class="menu-search"><li class="left"><a  href="/basic-search">basic search</a></li><li class="left selected"><a class="selected" href="/advanced-search">advanced search</a></li><li class="left"><a href="/image-search">image search</a></li><li class="left"><a href="/archives">archives</a></li></ul>';
        /* Append research box */
        $research = '<div class="search-padder">';
        $research.='<textarea placeholder="Text of the inscription" onkeydown="Search.advKeySearch(event);" onclick="Search.resetAdvTextarea(this);" class="search-element textareat" name="inscriptiontext" ></textarea> <button onclick="Search.showHelp();" class="help-button" valign="top" id="send">?</button><br/>';
        $research.='<select onkeydown="Search.advKeySearch(event);" class="search-element select" name="objecttypevoc" >';
        $research.='<option selected="selected" value="" >Object type</option>';
        $data = $objectType->getVocabolaryData(SORT_REGULAR);
        $js.='Search.advFieldCache["objecttypevoc"]=' . json_encode($data) . ';';
        foreach ($data as $objT) {
            $research.='<option value="' . $objT['vocValue'] . '" >' . $objT['vocLabel'] . '</option>';
        }
        $research.='</select><br/>';
        $research.='<input type="text" placeholder="Ancient findspot" onkeydown="Search.advKeySearch(event);" onclick="Search.resetAdvText(this);" class="search-element input" name="ancientfindspot" value="" /><br/>';
        $research.='<select onkeydown="Search.advKeySearch(event);" class="search-element select" name="inscriptiontypevoc" >';
        $research.='<option selected="selected" value="" >Type of inscription</option>';
        $data = $typeOfInscription->getVocabolaryData(SORT_REGULAR);
        $js.='Search.advFieldCache["inscriptiontypevoc"]=' . json_encode($data) . ';';
        foreach ($data as $objT) {
            $research.='<option value="' . $objT['vocValue'] . '" >' . $objT['vocLabel'] . '</option>';
        }
        $research.='</select><br/>';
//        $research.='<select class="search-element select" name="notbefore" >';
//        $research.='<option selected="selected" value="" >Not Before</option>';
//        $data = $datingCriteria->getVocabolaryData(SORT_REGULAR);
//        //var_dump($data); die();
//        $js.='Search.advFieldCache["notbefore"]=' . json_encode($data) . ';';
//        foreach ($data as $objT) {
//            $research.='<option value="' . $objT['vocValue'] . '" >' . $objT['vocLabel'] . '</option>';
//        }
//        $research.='</select><br/>';
        $research.='<textarea placeholder="Bibliography" onkeydown="Search.advKeySearch(event);" onclick="Search.resetAdvTextarea(this);" class="search-element textareab" name="bibliography" ></textarea><br/>';
        $research.='<table><tr><td><input type="checkbox" class="search-element checkbox" name="hasimage" value="" /></td><td class="label">Only with image</td></tr></table>';
        $research.='<table><tr><td><input type="checkbox" class="search-element checkbox" name="hastranslation" value="" /></td><td class="label">Only with translation</td></tr></table>';
        $research.='<input type="text" placeholder="Not Before - Year" onkeydown="Search.advKeySearch(event);" onclick="Search.resetAdvTextarea(this);" type="text" class="search-element input date" name="notbefore" value="" /><br/>';
        $research.='<input type="text" placeholder="Not After - Year" onkeydown="Search.advKeySearch(event);" onclick="Search.resetAdvTextarea(this);" type="text" class="search-element input date" name="notafter" value="" /><br/>';
        $research.='<div id="fieldsAppender"></div>';
        $research.='<table class="policont"><tr><td><input type="checkbox" class="search-element checkbox" name="ckstringadv" /></td><td colspan="3" class="label">Include substrings (search might take more time)</td></tr></table>';
        $research.='<button onclick="Search.advSearch(\'documental\');" class="action-button" id="send">Search</button>';
        $research.='</div>';
        $js.='});</script>';

        $jsOnLoad = '<script type="text/javascript">jQuery(window).load(function() {';
         if ($preload != 'undefined' && $preload != '') {
            $decoded = urldecode($preload);
            parse_str($decoded, $parsed_request);
           // var_dump($parsed_request['fields']); die();
            $jsOnLoad.='Search.bookmarkAdvanced("' . $parsed_request['query'] . '","' . urlencode($parsed_request['fields']) . '","' . $parsed_request['page'] . '","' . $parsed_request['entity'] . '","' . $parsed_request['artifactSelectedRow'] . '","' . $parsed_request['artifactSelectedCol'] . '","' . urlencode($parsed_request['facet']) . '");';
        }
        $jsOnLoad.='});</script>';
        $research.=$js.$jsOnLoad;
    } else if ($page_name === "archives") {
        wp_enqueue_script('jquery', '/wp-content/plugins/eagle-search/js/jquery-1.10.1.min.js');
        wp_enqueue_script('lightbox', '/wp-content/plugins/eagle-search/js/lightbox.min.js');
        wp_enqueue_script('eagle-search', '/wp-content/plugins/eagle-search/js/search.js');
        wp_enqueue_style('lightboxstyle', '/wp-content/plugins/eagle-search/css/lightbox.css');
        wp_enqueue_script('preset', '/wp-content/plugins/eagle-search/js/preset.js');
        wp_enqueue_style('esi-style', '/wp-content/plugins/eagle-search/css/archives.css');
        wp_enqueue_style('esi-style', '/wp-content/plugins/eagle-search/css/simple-search.css');
        /* keyboard required */
        wp_enqueue_style('jqueryuistyle', '/wp-content/plugins/eagle-search/css/jquery-ui.min.css');
        wp_enqueue_style('mykeyboard', '/wp-content/plugins/eagle-search/css/mykeyboard.css');
        wp_enqueue_script('jqueryui', '/wp-content/plugins/eagle-search/js/jquery-ui.js', array('jquery'));
        wp_enqueue_script('mykeyboard', '/wp-content/plugins/eagle-search/js/mykeyboard.js', array('jqueryui'));
        $research = '';
        $menu = '<ul class="menu-search arcmenu"><li class="left selected" onclick="Search.archivesRelist(\'results\',0);">Search results</li><li class="left" onclick="Search.archivesRelist(\'items\',0);">Single items</li></ul>';
        $submenu = '';
        $table = '<div id="archivesCont"><table class="tableArchives"><tr><td>You must be logged in to access this section</td></tr>';
        if (is_user_logged_in()) {
            require_once __DIR__ . '/class/EagleSaveSystem.php';
            $dbRow = EagleSaveSystem::getLastResearchSaved(get_current_user_id());
            $submenu = '<ul class="archivesSubMenu"><li onclick="Search.archiveSelectAll();" class="left">Check All</li><li onclick="Search.archiveDeselectAll();" class="left">Uncheck All</li><li class="left selected"><button class="action-button" type="button" onclick="Search.deleteAllArchives();">Delete</button></li></ul>';

            $table = '<div id="archivesCont"><table class="tableArchives"><thead><tr><th>Checked</th><th>Title</th><th>Date</th><th>Actions</th></tr></thead>';
            $index = 0;
            if (count($dbRow) > 0) {
                foreach ($dbRow as $row) {
                    $onclick = ($row->query_type == "string:similarity" || $row->query_type == "string:recognize") ? 'Search.archivesSimilarityView(\'results\',' . $row->query_id . ',event);' : 'Search.archivesView(\'results\',' . $row->query_id . ',event);';
                    $table.='<tr id="row' . $index . '" class="row' . ($index % 2) . '"><td><input tableid="' . $row->query_id . '" mytype="results"  type="checkbox" value="' . $row->query_id . '" /></td><td>' . $row->title . '</td><td class="date">' . $row->data . '</td><td><button class="action-button" type="button" onclick="Search.archivesDelete(\'results\',' . $row->query_id . ',' . $index . ');">Delete</button><button class="action-button" type="button" onclick="Search.archivesModify(\'results\',' . $row->query_id . ',' . $index . ');">Edit</button><button class="action-button" type="button" onclick="' . $onclick . '">View</button></td></tr>';
                    $index++;
                }
            } else {
                $table = '<div id="archivesCont"><table class="tableArchives"><tr><td>No result Found</td></tr>';
            }
        }
        $table.='</table></div>';
        $research = $table . $submenu;
    } elseif ($page_name === "image-search") {
        require_once __DIR__ . '/class/localVocabularyParser.php';
        wp_enqueue_script('jquery', '/wp-content/plugins/eagle-search/js/jquery-1.10.1.min.js');
        wp_enqueue_script('lightbox', '/wp-content/plugins/eagle-search/js/lightbox.min.js');
        wp_enqueue_script('eagle-search', '/wp-content/plugins/eagle-search/js/search.js');
        wp_enqueue_style('lightboxstyle', '/wp-content/plugins/eagle-search/css/lightbox.css');
        /* keyboard required */
        wp_enqueue_style('jqueryuistyle', '/wp-content/plugins/eagle-search/css/jquery-ui.min.css');
        wp_enqueue_style('mykeyboard', '/wp-content/plugins/eagle-search/css/mykeyboard.css');
        wp_enqueue_script('jqueryui', '/wp-content/plugins/eagle-search/js/jquery-ui.js', array('jquery'));
        wp_enqueue_script('mykeyboard', '/wp-content/plugins/eagle-search/js/mykeyboard.js', array('jqueryui'));
                /* Preset */
        wp_enqueue_script('preset', '/wp-content/plugins/eagle-search/js/preset.js');

        wp_enqueue_style('esi-style', '/wp-content/plugins/eagle-search/css/simple-search.css');
        $menu = '<ul class="menu-search"><li class="left"><a class="selected" href="/basic-search">basic search</a></li><li class="left"><a href="/advanced-search">advanced search</a></li><li class="left selected"><a href="/image-search">image search</a></li><li class="left"><a href="/archives">archives</a></li></ul>';
        $js = '';
//        $objectType = new localVocabularyParser("objecttypevoc");
//        $typeOfInscription = new localVocabularyParser("inscriptiontypevoc");
//        $material = new localVocabularyParser("materialvoc");
//        $decoration = new localVocabularyParser("decorationvoc");
//        $state = new localVocabularyParser("stateofpreservationvoc");
//        $writing = new localVocabularyParser("writingtypevoc");
//$js = '<script type="text/javascript">jQuery(document).ready(function() {';
//        // $js.='Search.advFacetCache["datingvoc"]=' . json_encode($datingCriteria->getVocabolaryAssocWithName()) . ';';
//        $js.='Search.advFacetCache["objecttypevoc"]=' . json_encode($objectType->getVocabolaryAssocWithName()) . ';';
//        $js.='Search.advFacetCache["inscriptiontypevoc"]=' . json_encode($typeOfInscription->getVocabolaryAssocWithName()) . ';';
//        $js.='Search.advFacetCache["materialvoc"]=' . json_encode($material->getVocabolaryAssocWithName()) . ';';
//        $js.='Search.advFacetCache["decorationvoc"]=' . json_encode($decoration->getVocabolaryAssocWithName()) . ';';
//        $js.='Search.advFacetCache["stateofpreservationvoc"]=' . json_encode($state->getVocabolaryAssocWithName()) . ';';
//        $js.='Search.advFacetCache["writingtypevoc"]=' . json_encode($writing->getVocabolaryAssocWithName()) . ';';
//        $generic_true_false_voc_choice = array();
//        $generic_true_false_voc_choice[] = array("vocLabel" => "No", "vocValue" => "false");
//        $generic_true_false_voc_choice[] = array("vocLabel" => 'Yes', "vocValue" => "true");
//        $js.='Search.advFacetCache["hasimage"]=' . json_encode(array_merge(array("vocName" => "hasimage"), $generic_true_false_voc_choice)) . ';';
//        $js.='Search.advFacetCache["hastranslation"]=' . json_encode(array_merge(array("vocName" => "hastranslation"), $generic_true_false_voc_choice)) . ';';
//        $js.='});</script>';

        $imgUploadSearch = '<div class="img_search_cont"><h4>Search by Image</h4><br/><input type="file" name="img_search" id="img_search" /><button  class="action-button" onclick="Search.searchByImage()" >Search</button></div>';
//$polytonic = '<table class="policont"><tr><td class="label">Greek keyboard</td><td><input type="checkbox" class="search-element checkbox" id="politonic_enable" /></td></tr></table>';

        $research = '<div class="search-padder">' . $imgUploadSearch . '</div>' . $js;
    }
    return $menu . $research;
}

add_shortcode('esi_shortcode', 'esi_process_shortcode');

/* This function make a proxy ajax advanced search request from client interface */

function esi_process_ajax_research($return = false) {
    require_once __DIR__ . '/class/EagleSearch.php';
    require_once __DIR__ . '/class/localVocabularyParser.php';
    $eagle = new EagleSearch();
    try {
        /* Enable Facet */
//$eagle->addFacetField("datingvoc");
//$eagle->addFacetField("dating");
        $eagle->addFacetField("decorationvoc");
        $eagle->addFacetField("materialvoc");
        $eagle->addFacetField("objecttypevoc");
        $eagle->addFacetField("stateofpreservationvoc");
        $eagle->addFacetField("inscriptiontypevoc");
        $eagle->addFacetField("writingtypevoc");
        $eagle->addFacetField("ancientfindspotforbrowsing");
        $eagle->addFacetField("modernfindspotforbrowsing");
        $eagle->addFacetField("hasimage");
        $eagle->addFacetField("hastranslation");
        $eagle->addFacetField("repositorynameforbrowsing");


        $eagle->setFacetEnabled();

		//if (isset($_POST['ckstringadv']))
		if ($_POST['ckstringadv'] == 'true')
		{
			$CkSubStr=1;
		}
        if (isset($_POST['fields'])) {
            $fields = json_decode(stripcslashes($_POST['fields']), true);
            $adv = "";
            $advq = "";
            $dating = array();
            if (count($fields)) {
                foreach ($fields as $key => $value) {
                    if ($key === "modernfindspot") {
                        $advq .= ($advq === "") ? "((modernfindspot:(" .  getSubStr($value,$CkSubStr)  . "))OR(moderncountry:(" .  getSubStr($value,$CkSubStr)  . "))OR(modernregion:(" .  getSubStr($value,$CkSubStr)  . "))OR(modernprovince:(" .  getSubStr($value,$CkSubStr)  . ")))" : "AND((modernfindspot:(" .  getSubStr($value,$CkSubStr)  . "))OR(moderncountry:(" .  getSubStr($value,$CkSubStr)  . "))OR(modernregion:(" .  getSubStr($value,$CkSubStr)  . "))OR(modernprovince:(" .  getSubStr($value,$CkSubStr)  . ")))";
                    } else if ($key === "ancientfindspot") {
                        $advq .= ($advq === "") ? "((romanprovinceitalicregion:(" .  getSubStr($value,$CkSubStr)  . "))OR(ancientfindspot:(" .  getSubStr($value,$CkSubStr)  . ")))" : "AND((romanprovinceitalicregion:(" .  getSubStr($value,$CkSubStr)  . "))OR(ancientfindspot:(" .  getSubStr($value,$CkSubStr)  . ")))";
                    } else if ($key === "location") {
                        $adv .= ($adv === "") ? "((conservationcountry:(" .  getSubStr($value,$CkSubStr)  . "))OR(conservationregion:(" .  getSubStr($value,$CkSubStr)  . "))OR(conservationcity:(" .  getSubStr($value,$CkSubStr)  . "))OR(museum:(" .  getSubStr($value,$CkSubStr)  . ")))" : "AND((conservationcountry:(" .  getSubStr($value,$CkSubStr)  . "))OR(conservationregion:(" .  getSubStr($value,$CkSubStr)  . "))OR(conservationcity:(" .  getSubStr($value,$CkSubStr)  . "))OR(museum:(" .  getSubStr($value,$CkSubStr)  . ")))";
                    } else if ($key === "inscriptiontext") {
                        $advq .= ($advq === "") ? "(inscriptiontext:(" .  getSubStr($value,$CkSubStr)  . "))" : "AND(inscriptiontext:(" .  getSubStr($value,$CkSubStr)  . "))";
                    } else if ($key === "bibliography") {
                        $advq .= ($advq === "") ? "(bibliography:(" .  getSubStr($value,$CkSubStr)  . "))" : "AND(bibliography:(" . getSubStr($value,$CkSubStr) .  "))";
                    } else if ($key === 'notafter' || $key === 'notbefore') {
                        $dating[$key] = $value;
                    } else {
                        $adv .= ($adv === "") ? "(" . $key . ":" . "\"" . $value . "\"" . ")" : "AND(" . $key . ":" . "\"" . $value . "\"" . ")";
                    }
                }

                if (array_key_exists('notbefore', $dating) && array_key_exists('notafter', $dating)) {
//                    $adv .= ($adv === "") ? "(((notbefore:[" . $dating["notbefore"] . " TO *])OR(notafter:[* TO " . $dating["notafter"] . "]))AND((notbefore:[* TO " . $dating["notbefore"] . "])OR(notafter:[" . $dating["notafter"] . " TO *])))" : "AND(((notbefore:[" . $dating["notbefore"] . " TO *])OR(notafter:[* TO " . $dating["notafter"] . "]))AND((notbefore:[* TO " . $dating["notbefore"] . "])OR(notafter:[" . $dating["notafter"] . " TO *])))";
                    $adv .= ($adv === "") ? "(((notbefore:[" . $dating["notbefore"] . " TO " . $dating["notafter"] . "])OR(notafter:[" . $dating["notbefore"] . " TO " . $dating["notafter"] . "])))": "AND(((notbefore:[" . $dating["notbefore"] . " TO " . $dating["notafter"] . "])OR(notafter:[" . $dating["notbefore"] . " TO " . $dating["notafter"] . "])))";
//nicola ha sostituito or con and   $adv .= ($adv === "") ? "(((notbefore:[" . $dating["notbefore"] . " TO *])OR(notafter:[* TO " . $dating["notafter"] . "]))OR((notbefore:[* TO " . $dating["notbefore"] . "])OR(notafter:[" . $dating["notafter"] . " TO *])))" : "AND(((notbefore:[" . $dating["notbefore"] . " TO *])OR(notafter:[* TO " . $dating["notafter"] . "]))OR((notbefore:[* TO " . $dating["notbefore"] . "])OR(notafter:[" . $dating["notafter"] . " TO *])))";
                } else if (array_key_exists('notbefore', $dating)) {
                    $adv .= ($adv === "") ? "((notbefore:[" . $dating["notbefore"] . " TO *])OR(notafter:[" . $dating["notbefore"] . " TO *]))" : "AND((notbefore:[" . $dating["notbefore"] . " TO *])OR(notafter:[" . $dating["notbefore"] . " TO *]))";
                } else if (array_key_exists('notafter', $dating)) {
//   $adv .= ($adv === "") ? "(((notbefore:[" . $dating["notbefore"] . " TO " . $dating["notafter"] . "]))OR((notafter:[" . $dating["notbefore"] . " TO " . $dating["notafter"] . "])))" : "AND(((notbefore:[" . $dating["notbefore"] . " TO " . $dating["notafter"] . "]))OR((notafter:[" . $dating["notbefore"] . " TO " . $dating["notafter"] . "])))";
                    $adv .= ($adv === "") ? "((notbefore:[* TO " . $dating["notafter"] . "])OR(notafter:[* TO " . $dating["notafter"] . "]))" : "AND((notbefore:[* TO " . $dating["notafter"] . "])OR(notafter:[* TO " . $dating["notafter"] . "]))";
                }
            }
            if (isset($_POST['facet']) && !empty($_POST['facet']))
                $result = $eagle->advancedSearch($advq, $adv, $_POST['page'], $_POST['entity'], preg_replace('/^\s*AND\s*/', '', stripcslashes($_POST['facet'])));
            else
                $result = $eagle->advancedSearch($advq, $adv, $_POST['page'], $_POST['entity']);
        } else {
            $result = $eagle->simpleSearch($_POST['query'], $_POST['page'], $_POST['entity'], preg_replace('/^\s*AND\s*/', '', stripcslashes($_POST['facet'])));
        }
    } catch (EagleSearchException $ex) {
        $result = json_encode(array("error" => $ex->getMessage()));
    }
    if ($return)
        return $result;
    echo $result;
    exit();
}

add_action('wp_ajax_esi_process_ajax_research', 'esi_process_ajax_research');
add_action('wp_ajax_nopriv_esi_process_ajax_research', 'esi_process_ajax_research');

add_shortcode('esi_do_proxyimage', 'esi_proxyimage');

function esi_proxyimage() {
    $url = $_GET['url'];
// $url="http://laststatues.classics.ox.ac.uk/database/detail-base.php?image=Image_3_Large&recid=545";
//    var_dump($url);
//    var_dump($_GET['url']);
//    die();
    $upload_dir = wp_upload_dir();
    $upload_dir = $upload_dir['basedir'] . '/proxyimg/';
    $imgname = md5($url);
    if (!file_exists($upload_dir . $imgname)) {
        error_log("File not exists");
        /* Request File */
        $ch = curl_init();
        $timeout = 0;
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);

// Getting binary data
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Accept-Encoding: gzip,deflate'));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_BINARYTRANSFER, 1);

        $image = curl_exec($ch);
        $savefile = fopen($upload_dir . $imgname, 'w');
        fwrite($savefile, $image);
        fclose($savefile);
        curl_close($ch);
    }

    $size = getimagesize($upload_dir . $imgname);
    $fp = fopen($upload_dir . $imgname, "rb");
    if ($size && $fp) {
        header("Content-type: {$size['mime']}");
        fpassthru($fp);
        exit;
    } else {
        echo 'An error occurred.';
    }

//    die();
//
//    $ch = curl_init($_GET['url']);
//    curl_setopt($ch, CURLOPT_HEADER, 0);
//    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
//    curl_setopt($ch, CURLOPT_BINARYTRANSFER, 1);
//    $rawdata = curl_exec($ch);
//    curl_close($ch);
//
//    echo $rawdata;
//    die();
//
//    $im = imagecreatefromstring(file_get_contents(($_GET['url'])));
//    $data = file_get_contents();
//    var_dump(urldecode($_GET['url']));
//    var_dump($data); die();
//    $imgString = base64_decode($data);
//
//    $im = imagecreatefromstring($imgString);
//    if ($im !== false) {
//        header('Content-Type: image/png');
//        imagepng($im);
//        imagedestroy($im);
//    } else {
//        echo 'An error occurred.';
//    }
//    $resource = file_get_contents(urldecode($_GET['url']));
//    //$image= imagecreatefromstring ( $resource );
//    header('Content-Type: image/jpeg');
//    echo $resource;
    exit;
}

add_action('wp_ajax_esi_similar_from_dnetresourceid', 'esi_similar_from_dnetresourceid');
add_action('wp_ajax_nopriv_esi_similar_from_dnetresourceid', 'esi_similar_from_dnetresourceid');

function esi_similar_from_dnetresourceid() {

}

add_action('wp_ajax_esi_object_from_dnetresourceid', 'esi_object_from_dnetresourceid');
add_action('wp_ajax_nopriv_esi_object_from_dnetresourceid', 'esi_object_from_dnetresourceid');

function esi_object_from_dnetresourceid() {
    require_once __DIR__ . '/class/EagleSearch.php';
    $eagle = new EagleSearch();
    try {
// var_dump(json_decode(stripslashes($_POST['dnetresourceidentifierList'])));
        echo $eagle->getObjectFromDnetResourceIdentifier(json_decode(stripslashes($_POST['dnetresourceidentifierList'])), $_POST['entity']);
    } catch (EagleSearchException $ex) {
        echo json_encode(array("error" => $ex->getMessage()));
    }
    exit();
}

add_action('wp_ajax_esi_image_search', 'esi_image_search');
add_action('wp_ajax_nopriv_esi_image_search', 'esi_image_search');

function getCurlValue($filename, $contentType, $postname) {
// PHP 5.5 introduced a CurlFile object that deprecates the old @filename syntax
// See: https://wiki.php.net/rfc/curl-file-upload
    if (function_exists('curl_file_create')) {
        return curl_file_create($filename, $contentType, $postname);
    }

// Use the old style if using an older version of PHP
    $value = "@$filename;filename=" . $postname;
    if ($contentType) {
        $value .= ';type=' . $contentType;
    }

    return $value;
}







function getSubStr($AllStr,$CkSubStr) {
// Nicola Ricevo tutta la stringa e la elaboro
	$countquote= substr_count($AllStr, '"');
	$retstr="";
	$strret="";
	if ($CkSubStr===1)
	{
	//if ($countquote % 2 == 0)
	//{
		$arr = explode(" ", rtrim(ltrim($AllStr)));
		$quoted=0;
		for ($i=0 ; $i < count($arr); $i++)
		{
		$strret = $arr[$i];

		switch ($arr[$i])
			{
		    case "OR":
		       $retstr .= $arr[$i]." ";
		        break;
		    case "AND":
		       $retstr .= $arr[$i]." ";
		        break;
		    default:
		        if (substr($strret, 0, 1)==='"')
		       	{
		       		$retstr.= $arr[$i]." ";
		       		$quoted +=1;
		       	}
		       	else
		       	{
		       		if (strrpos($arr[$i], '"'))
		       		{
		       		$quoted +=1;
		       		$retstr .= $arr[$i]." ";
		       		}
		       		else
		       		{
		       		if ($quoted % 2 === 0)
		       		{
		       		$retstr .= "*".$arr[$i]."*"." ";
		       		}
		       		else
		       		{
		       		$retstr .= $arr[$i]." ";
		       		}
		       		}
		       	}
			}
		}
	//}
	$retstr=rtrim(ltrim($retstr));
	}
	else
	{
	$retstr=$AllStr;
	}
	         $match = array('\\', '+', '-', '&&', '||', '!', '(', ')', '{', '}', '[', ']', '^', '~',  '?', ':',';');
			 $replace = array('\\\\', '\\+', '\\-', '\\&&', '\\||', '\\!', '\\(', '\\)', '\\{', '\\}', '\\[', '\\]', '\\^', '\\~',  '\\?', '\\:','\\;');
			 $retstr = str_replace($match, $replace, $retstr);
	// var_dump($retstr); die();
    return $retstr;
}


function esi_image_search() {
    $ret = new stdClass();
    $ret->error = false;
    if (isset($_FILES['image'])) {
        require_once __DIR__ . '/class/EagleSearch.php';
        $image = $_FILES['image']['tmp_name'];
        $imageType = $_FILES['image']['type'];
        $imageName = basename($_FILES['image']['name']);

        $maxImageNumber = 30;

        $cfile = getCurlValue($image, $imageType, $imageName);
//        $cfile = curl_file_create($image, $imageType, $imageName);

        $postData = array('img' => $cfile, 'nResults' => $maxImageNumber);



        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, EagleSearch::CNR_SIMILARITY_SEARCH_URL);
        curl_setopt($curl, CURLOPT_POST, true);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $postData);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
//        curl_setopt($curl, CURLOPT_SAFE_UPLOAD, true);
        $r = curl_exec($curl);


        if (curl_errno($curl)) {
            $ret->error = false;
            $ret->msg = 'SimilarityAPI_Erros: ' . curl_error($curl);
            curl_close($curl);
        } else {
            curl_close($curl);
            $xml = new SimpleXMLElement($r);

            $response = array();
            foreach ($xml->results->result as $result) {
//$response[]=array("id"=>addslashes($result->id),"thumbnail"=>addslashes($result->thumbnail),"title"=>addslashes($result->title));
                $response[] = array("id" => $result->id, "thumbnail" => $result->thumbnail, "title" => $result->title);
            }
            $ret->results = $response;
        }
    } else if (isset($_POST['dnetResurceIdentifier'])) {
        require_once __DIR__ . '/class/EagleSearch.php';

        $request = file_get_contents(EagleSearch::CNR_GET_METADATA_URL . '?id=' . $_POST['dnetResurceIdentifier']);

        $xml = new SimpleXMLElement($request);
        $response = "";
        foreach ($xml->result->doc->children() as $arr) {
            if ($arr['name'] == '__result') {
                $response = $arr->str;
                break;
            }
        }
        $ret->results = $response;
    } else if (isset($_POST['dnetResurceIdentifierById'])) {
        require_once __DIR__ . '/class/EagleSearch.php';

        $request = file_get_contents(EagleSearch::CNR_SIMILARITY_SEARCH_BYID_URL . '?docID=' . $_POST['dnetResurceIdentifierById']);
        //file_put_contents(__DIR__.'/logger/'.$_POST['dnetResurceIdentifierById'].'.xml', $request);
        try {
            $xml = new SimpleXMLElement($request);

            $response = array();
            foreach ($xml->results->result as $result) {
                $response[] = array("id" => $result->id, "thumbnail" => $result->thumbnail, "title" => $result->title);
            }
            if (count($response))
                $ret->results = $response;
            else {
                $ret->error = true;
                $ret->msg = 'No similar image found!';
            }
        } catch (Exception $e) {
            $ret->error = true;
            $ret->msg = 'This request : ' . EagleSearch::CNR_SIMILARITY_SEARCH_BYID_URL . '?docID=' . $_POST['dnetResurceIdentifierById'] . ' could not be parsed as XML!';
        }

        //$ret->results = $request;
    } else {
        $ret->error = true;
        $ret->msg = 'No image uploaded!';
    }
    echo json_encode($ret);
    exit();
}

add_action('wp_ajax_esi_ajax_registration', 'esi_ajax_registration');
add_action('wp_ajax_nopriv_esi_ajax_registration', 'esi_ajax_registration');

function esi_ajax_registration() {

    $result = new stdClass();

    $result->error = false;

    if (isset($_POST['registerFields'])) {

        $registration = json_decode(stripcslashes($_POST['registerFields']));

        if (!is_null($registration)) {

            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, "https://www.google.com/recaptcha/api/siteverify");
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, "secret=" . urlencode("6LcwsAcTAAAAAAOgXymMrsUMROYbDN8rJcuNSs4p") . "&response=" . urlencode($registration->grecaptcharesponse));
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            $server_output = curl_exec($ch);
            curl_close($ch);
            $server_output = json_decode($server_output);
//var_dump($server_output);
            if ($server_output->success === false) {
                $result->msg = 'Captcha code error!';
                $result->error = true;
                echo json_encode($result);
                exit;
            }



            $user_id = username_exists($registration->username);

            if ($user_id) {

                $result->msg = 'Username already present';
            }

            $emailCheck = email_exists($registration->email);

            if ($emailCheck) {

                $result->msg = 'Email already present';
            }

            if (!$user_id and $emailCheck == false) {

                $random_password = wp_generate_password(12, false);



                $userdata = array(
                    'user_login' => $registration->username,
                    'user_email' => $registration->email,
                    'user_pass' => $random_password,
                    'display_name' => $registration->first_name . ' ' . $registration->last_name,
                    'first_name' => $registration->first_name,
                    'last_name' => $registration->last_name,
                );



                $user_id = wp_insert_user($userdata);

                if (is_wp_error($user_id)) {

                    $result->error = true;

                    $result->msg = 'Register fields failed ';
                } else {
                    $result->msg = 'Thank you for your registration, your request has been forwarded to the site administrator. As soon as he approves it, an email containing your password will be sent to the email address that you have specified in the registration request.';
                }
            } else {

                $result->error = true;
            }
        } else {

            $result->error = true;

            $result->msg = 'Parameters format mismatch';
        }
    } else {

        $result->error = true;

        $result->msg = 'Register fields empty';
    }

    echo json_encode($result);

    exit;
}

add_action('wp_ajax_esi_mk_keyboard', 'esi_mk_keyboard');
add_action('wp_ajax_nopriv_esi_mk_keyboard', 'esi_mk_keyboard');

/*
 * AJAX Callback
 * Manage KeyBoard Action
 */

function esi_mk_keyboard() {
    global $wbcllogger;
    $result = new stdClass();
    $result->error = false;

    switch ($_REQUEST['type']) {
        case "greek": {
                ob_start();
                echo file_get_contents(ESI_LAYOUTS . 'greek.html');
                $result->html = ob_get_clean();
                break;
            }
        case "hebrew": {
                ob_start();
                echo file_get_contents(ESI_LAYOUTS . 'hebrew.html');
                $result->html = ob_get_clean();
                break;
            }
        default: {
                $result->error = true;
                $result->msg = __('Unknow KeyBoard type or empty!', 'eagle');
            }
    }
    echo json_encode($result);
    die();
}

add_action('wp_ajax_esi_generate_csv', 'esi_generate_csv');
add_action('wp_ajax_nopriv_esi_generate_csv', 'esi_generate_csv');

function esi_generate_csv() {
    $result = new stdClass();
    $result->error = false;

    $research = esi_process_ajax_research(true);
    try {
        $result->redirect = \Eagle\EagleHelper::eagleResearchList2CSV($research, $_POST['entity']);
    } catch (\Eagle\EagleHelperException $eee) {
        $result->error = true;
        $result->msg = $eee->getMessage();
    }
    echo json_encode($result);
    exit;
}

add_action('wp_ajax_esi_generate_pdf', 'esi_generate_pdf');
add_action('wp_ajax_nopriv_esi_generate_pdf', 'esi_generate_pdf');

function esi_generate_pdf() {
    $result = new stdClass();
    $result->error = false;

    if (isset($_POST['dom_string'])) {
        try {
            $result->redirect = \Eagle\EagleHelper::dom2PDF($_POST['dom_string']);
        } catch (\Eagle\EagleHelperException $e) {
            $result->error = true;
            $result->msg = $e->getMessage();
        }
    } else {
        $result->error = true;
        $result->msg = 'DOM String missing!';
    }

    echo json_encode($result);
    exit;
}

add_shortcode('esi_do_getepidoc', 'esi_getepidoc');

function esi_getepidoc() {
//error_log("ddddd");
    if (isset($_GET['objectid'])) {
// error_log($_GET['objectid']);
        require_once __DIR__ . '/class/EagleSearch.php';
//        $eagle = new EagleSearch();
        try {
            list($provider, $resourceID, $contentType) = explode('::', $_GET['objectid']);
            $epidoc = file_get_contents(EagleSearch::SORL_EPIDOC_API_URL . $provider . '::' . $resourceID);
            if ($epidoc == "EpiDoc representation not available for this record") {
                header("Content-Type:text/html");
                echo $epidoc;
            } else {
//            $xml = new SimpleXMLElement($eagle->epidocEagleObj($_GET['objectid']));
                $filename = (str_replace(":", '_', $_GET['objectid']));
                header("Content-disposition: attachment; filename=$filename.xml");
                header("Content-Type:text/xml");
                echo $epidoc;
//            $epidoc = new SimpleXMLElement($xml->result->doc->arr->str);
//            echo ($epidoc->metadata->eagleObject->asXML());
                header("Expires: 0");
            }
        } catch (EagleSearchException $ex) {
            echo json_encode(array("error" => $ex->getMessage()));
        }
    }
}

function esi_login_check() {
    if (is_user_logged_in())
        echo json_encode(array("logged" => true));
    else
        echo json_encode(array("logged" => false, "msg" => "<p>You must to be logged to save your research!</p>"));
    exit();
}

add_action('wp_ajax_esi_login_check', 'esi_login_check');
add_action('wp_ajax_nopriv_esi_login_check', 'esi_login_check');


/* Save function */

function esi_save_ajax_research() {
    $result = array();
    if (is_user_logged_in()) {
        require_once __DIR__ . '/class/EagleSearch.php';
        require_once __DIR__ . '/class/EagleSaveSystem.php';
        $eagle = new EagleSearch();
        $adv = "";
        $dating = array();
        $fq = null;
        try {
            if (isset($_POST['fields'])) {

                if (isset($_POST['searchType']) && $_POST['searchType'] === 0) {
                    $adv = preg_replace('/^\s*AND\s*/', '', stripcslashes($_POST['fields']));
                } else if (isset($_POST['searchType']) && $_POST['searchType'] === 1) {
                    $fields = json_decode(stripcslashes($_POST['fields']), true);
                    if (count($fields)) {
                        foreach ($fields as $key => $value) {
                            if ($key === "detailedspot") {
//error_log($key);
//$eagle->addVirtualField(array('detailedspot' => array('modernfindspot', 'moderncountry', 'modernregion', 'modernprovince')));
// $eagle->setVirtualEnabled();
//$adv .= ($adv === "") ? "(" . $key . ":" . "\"" . $value . "\"" . ")" : "AND(" . $key . ":" . "\"" . $value . "\"" . ")";
                                $adv .= ($adv === "") ? "((modernfindspot:" . "\"" . $value . "\"" . ")OR(moderncountry:" . "\"" . $value . "\"" . ")OR(modernregion:" . "\"" . $value . "\"" . ")OR(modernprovince:" . "\"" . $value . "\"" . "))" : "AND((modernfindspot:" . "\"" . $value . "\"" . ")OR(moderncountry:" . "\"" . $value . "\"" . ")OR(modernregion:" . "\"" . $value . "\"" . ")OR(modernprovince:" . "\"" . $value . "\"" . "))";
                            } else if ($key === "location") {
//error_log($key);
//$eagle->addVirtualField(array('location' => array('conservationcountry', 'conservationregion', 'conservationcity', 'museum')));
//$eagle->setVirtualEnabled();
// $adv .= ($adv === "") ? "(" . $key . ":" . "\"" . $value . "\"" . ")" : "AND(" . $key . ":" . "\"" . $value . "\"" . ")";
                                $adv .= ($adv === "") ? "((conservationcountry:" . "\"" . $value . "\"" . ")OR(conservationregion:" . "\"" . $value . "\"" . ")OR(conservationcity:" . "\"" . $value . "\"" . ")OR(museum:" . "\"" . $value . "\"" . "))" : "AND((conservationcountry:" . "\"" . $value . "\"" . ")OR(conservationregion:" . "\"" . $value . "\"" . ")OR(conservationcity:" . "\"" . $value . "\"" . ")OR(museum:" . "\"" . $value . "\"" . "))";
                            } else if ($key === 'notafter' || $key === 'notbefore') {
//error_log($key);
                                $dating[$key] = $value;
//$adv .= ($adv === "") ? "(($key:\"[$value TO *]\")OR(notafter:\"[$value TO *]\"))" : "OR(notafter:\"[$value TO *]\"))";
                            } else {
//error_log($key);
                                $adv .= ($adv === "") ? "(" . $key . ":" . "\"" . $value . "\"" . ")" : "AND(" . $key . ":" . "\"" . $value . "\"" . ")";
                            }
                        }

                        if (array_key_exists('notbefore', $dating) && array_key_exists('notafter', $dating)) {
                            $adv .= ($adv === "") ? "(((notbefore:[" . $dating["notbefore"] . " TO *])OR(notafter:[* TO " . $dating["notafter"] . "]))OR((notbefore:[* TO " . $dating["notbefore"] . "])OR(notafter:[" . $dating["notafter"] . " TO *])))" : "AND(((notbefore:[" . $dating["notbefore"] . " TO *])OR(notafter:[* TO " . $dating["notafter"] . "]))OR((notbefore:[* TO " . $dating["notbefore"] . "])OR(notafter:[" . $dating["notafter"] . " TO *])))";
                        } else if (array_key_exists('notbefore', $dating)) {
                            $adv .= ($adv === "") ? "((notbefore:[" . $dating["notbefore"] . " TO *])OR(notafter:[" . $dating["notbefore"] . " TO *]))" : "AND((notbefore:[" . $dating["notbefore"] . " TO *])OR(notafter:[" . $dating["notbefore"] . " TO *]))";
                        } else if (array_key_exists('notafter', $dating)) {
//$adv .= ($adv === "") ? "(((notbefore:[" . $dating["notbefore"] . " TO " . $dating["notafter"] . "]))OR((notafter:[" . $dating["notbefore"] . " TO " . $dating["notafter"] . "])))" : "AND(((notbefore:[" . $dating["notbefore"] . " TO " . $dating["notafter"] . "]))OR((notafter:[" . $dating["notbefore"] . " TO " . $dating["notafter"] . "])))";
                            $adv .= ($adv === "") ? "((notbefore:[* TO " . $dating["notafter"] . "])OR(notafter:[* TO " . $dating["notafter"] . "]))" : "AND((notbefore:[* TO " . $dating["notafter"] . "])OR(notafter:[* TO " . $dating["notafter"] . "]))";
                        }
                    }
                }
                if (isset($_POST['facetOnAdvanced']) && !empty($_POST['facetOnAdvanced']) && !is_null($_POST['facetOnAdvanced'])) {
// error_log("valuto i facet on advanced");
                    $fq = preg_replace('/^\s*AND\s*/', '', stripcslashes($_POST['facetOnAdvanced']));
                }
//                $fields = json_decode(stripcslashes($_POST['fields']), true);
//                $adv = "";
//                if (count($fields)) {
//                    foreach ($fields as $key => $value) {
//                        $adv .= "AND(" . $key . ":" . "\"" . $value . "\"" . ")";
//                    }
//                }
            }
            $eagle->setSavePath(WP_CONTENT_DIR . '/');
            $filename = $eagle->saveAdvancedSearch($_POST['query'], $adv, $_POST['entity'], intval($_POST['page']), $_POST['searchType'], $fq);
            if (is_null($filename)) {
                $result["error"] = true;
                $result["msg"] = "<p>Errore durante il salvataggio dei dati sul server!</p>";
                echo json_encode($result);
                exit();
            }

            $fields["user_id"] = get_current_user_id();
            $fields["query_type"] = "string" . ":" . $_POST['entity'];
            $fields["query"] = (is_null($fq)) ? $_POST['query'] . $adv : $_POST['query'] . $adv . $fq;
            $fields["page_number"] = $_POST['page'];
            $fields["tot_page_saved"] = EagleSearch::SAVE_PAGES;
            $fields["title"] = $_POST['title'];
            $fields["comment"] = $_POST['notes'];
            $fields["resource"] = $filename;
            $fields["data"] = date("Y-m-d H:i:s");

            $fields["row"] = $_POST['row'];
            $fields["col"] = $_POST['col'];


            if ($_POST['row'] == -1 && $_POST['col'] == -1) {
                $save = EagleSaveSystem::saveResearchToBD($fields);
// error_log("research");
            } else {
                $save = EagleSaveSystem::saveObjectToBD($fields);
//error_log("object");
            }

            if ($save === false) {
//error_log("non salvato");
                $result["error"] = true;
                $result["msg"] = "<p>Errore durante il salvataggio dei dati sul database!</p>";
                echo json_encode($result);
                exit();
            }
            $result["error"] = false;
            $result["msg"] = "<p>Data successfully saved!</p>";
            echo json_encode($result);
            exit();
        } catch (EagleSearchException $ex) {
            echo json_encode(array("error" => true, "msg" => $ex->getMessage()));
        }
    } else {
        $result["error"] = true;
        $result["msg"] = "<p>You must to be logged to save your research!</p>";
        echo json_encode($result);
        exit();
    }
}

add_action('wp_ajax_esi_save_ajax_research', 'esi_save_ajax_research');
add_action('wp_ajax_nopriv_esi_save_ajax_research', 'esi_save_ajax_research');

function esi_similarity_save_ajax_research() {
    $result = array();
    if (is_user_logged_in()) {
        require_once __DIR__ . '/class/EagleSaveSystem.php';
        require_once __DIR__ . '/class/EagleSearch.php';
        try {

            if (isset($_FILES['image'])) {
                require_once __DIR__ . '/class/EagleSearch.php';
                $image = $_FILES['image']['tmp_name'];
                $imageType = $_FILES['image']['type'];
                $imageName = basename($_FILES['image']['name']);

                $maxImageNumber = 30;

                $cfile = getCurlValue($image, $imageType, $imageName);

                $postData = array('img' => $cfile, 'nResults' => $maxImageNumber);

                $curl = curl_init();
                curl_setopt($curl, CURLOPT_URL, EagleSearch::CNR_SIMILARITY_SEARCH_URL);
                curl_setopt($curl, CURLOPT_POST, true);
                curl_setopt($curl, CURLOPT_POSTFIELDS, $postData);
                curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
                $r = curl_exec($curl);


                if (curl_errno($curl)) {
                    $result["error"] = true;
                    $result["msg"] = "<p>imilarityAPI_Erros: " . curl_error($curl) . "</p>";
                    curl_close($curl);
                    echo json_encode($result);
                    exit();
                }
            } else if (isset($_POST['dnetResurceIdentifier'])) {
                $request = file_get_contents(EagleSearch::CNR_GET_METADATA_URL . '?id=' . $_POST['dnetResurceIdentifier']);
            }

            $filename = (isset($_POST['dnetResurceIdentifier'])) ? saveData($request, 'similarityObj') : saveData($r, 'similarityList');
            if (is_null($filename)) {
                $result["error"] = true;
                $result["msg"] = "<p>Errore durante il salvataggio dei dati sul server!</p>";
                echo json_encode($result);
                exit();
            }

            $fields["user_id"] = get_current_user_id();
            $fields["query_type"] = "string:similarity";
            $fields["query"] = '';
            $fields["page_number"] = 1;
            $fields["tot_page_saved"] = 1;
            $fields["title"] = $_POST['title'];
            $fields["comment"] = $_POST['notes'];
            $fields["resource"] = $filename;
            $fields["data"] = date("Y-m-d H:i:s");

            $fields["row"] = -1;
            $fields["col"] = -1;

            $save = (isset($_POST['dnetResurceIdentifier'])) ? EagleSaveSystem::saveObjectToBD($fields) : EagleSaveSystem::saveResearchToBD($fields);

            if ($save === false) {
//error_log("non salvato");
                $result["error"] = true;
                $result["msg"] = "<p>Errore durante il salvataggio dei dati sul database!</p>";
                echo json_encode($result);
                exit();
            }
            $result["error"] = false;
            $result["msg"] = "<p>Data successfully saved!</p>";
            echo json_encode($result);
            exit();
        } catch (EagleSearchException $ex) {
            echo json_encode(array("error" => true, "msg" => $ex->getMessage()));
        }
    } else {
        $result["error"] = true;
        $result["msg"] = "<p>You must to be logged to save your research!</p>";
        echo json_encode($result);
        exit();
    }
}

add_action('wp_ajax_esi_similarity_save_ajax_research', 'esi_similarity_save_ajax_research');

function esi_fma_sync() {
    $result = array();
    if (is_user_logged_in()) {
        require_once __DIR__ . '/class/EagleSaveSystem.php';
        try {
            EagleSaveSystem::fMA_Sync();
            $result["error"] = false;
            $result["msg"] = "<p>FMA Sync Completed!</p>";
        } catch (Exception $e) {
            $result["error"] = true;
            $result["msg"] = "<p>" . $e->getMessage() . "</p>";
        }
    } else {
        $result["error"] = true;
        $result["msg"] = "<p>You must to be logged to sync your research!</p>";
    }
    echo json_encode($result);
    exit();
}

add_action('wp_ajax_esi_fma_sync', 'esi_fma_sync');

function esi_fma_delete_all() {
    $result = array();
    if (is_user_logged_in()) {
        require_once __DIR__ . '/class/EagleSaveSystem.php';
        try {
            EagleSaveSystem::fMA_Delete_All();
            $result["error"] = false;
            $result["msg"] = "<p>FMA Delete Completed!</p>";
        } catch (Exception $e) {
            $result["error"] = true;
            $result["msg"] = "<p>" . $e->getMessage() . "</p>";
        }
    } else {
        $result["error"] = true;
        $result["msg"] = "<p>You must to be logged to sync your research!</p>";
    }
    echo json_encode($result);
    exit();
}

add_action('wp_ajax_esi_fma_delete_all', 'esi_fma_delete_all');

function esi_field_ajax_request() {
    require_once __DIR__ . '/class/localVocabularyParser.php';
    /* Make instance of each required vocabolary */
    $_POST["langiso"] = (isset($_POST["langiso"]) && $_POST["langiso"] !== 'null') ? $_POST["langiso"] : null;

    if ($_POST["voc"] == "all") {
        $objectType = new localVocabularyParser("objecttypevoc", $_POST["langiso"]);
        $result[] = ["fieldName" => "objecttypevoc", "fieldData" => $objectType->getVocabolaryData(SORT_REGULAR)];

        $typeOfInscription = new localVocabularyParser("inscriptiontypevoc", $_POST["langiso"]);
        $result[] = ["fieldName" => "inscriptiontypevoc", "fieldData" => $typeOfInscription->getVocabolaryData(SORT_REGULAR)];

        $material = new localVocabularyParser("materialvoc", $_POST["langiso"]);
        $result[] = ["fieldName" => "materialvoc", "fieldData" => $material->getVocabolaryData(SORT_REGULAR)];

        $decoration = new localVocabularyParser("decorationvoc", $_POST["langiso"]);
        $result[] = ["fieldName" => "decorationvoc", "fieldData" => $decoration->getVocabolaryData(SORT_REGULAR)];

        $state = new localVocabularyParser("stateofpreservationvoc", $_POST["langiso"]);
        $result[] = ["fieldName" => "stateofpreservationvoc", "fieldData" => $state->getVocabolaryData(SORT_REGULAR)];

        $writing = new localVocabularyParser("writingtypevoc", $_POST["langiso"]);
        $result[] = ["fieldName" => "writingtypevoc", "fieldData" => $writing->getVocabolaryData(SORT_REGULAR)];
    } else {
        $voc = new localVocabularyParser($_POST["voc"], $_POST["langiso"]);
        $result = $voc->getVocabolaryData(SORT_REGULAR);
    }
    echo json_encode($result);
    exit();
}

add_action('wp_ajax_esi_field_ajax_request', 'esi_field_ajax_request');
add_action('wp_ajax_nopriv_esi_field_ajax_request', 'esi_field_ajax_request');

function esi_facet_ajax_request() {
    require_once __DIR__ . '/class/localVocabularyParser.php';
    $_POST["langiso"] = (isset($_POST["langiso"]) && $_POST["langiso"] !== 'null') ? $_POST["langiso"] : null;
    /* Make instance of each required vocabolary */
    if ($_POST["voc"] == "all") {
        $objectType = new localVocabularyParser("objecttypevoc", $_POST["langiso"]);
        $result[] = ["fieldName" => "objecttypevoc", "fieldData" => $objectType->getVocabolaryAssocWithName(SORT_REGULAR)];

        $typeOfInscription = new localVocabularyParser("inscriptiontypevoc", $_POST["langiso"]);
        $result[] = ["fieldName" => "inscriptiontypevoc", "fieldData" => $typeOfInscription->getVocabolaryAssocWithName(SORT_REGULAR)];

        $material = new localVocabularyParser("materialvoc", $_POST["langiso"]);
        $result[] = ["fieldName" => "materialvoc", "fieldData" => $material->getVocabolaryAssocWithName(SORT_REGULAR)];

        $decoration = new localVocabularyParser("decorationvoc", $_POST["langiso"]);
        $result[] = ["fieldName" => "decorationvoc", "fieldData" => $decoration->getVocabolaryAssocWithName(SORT_REGULAR)];

        $state = new localVocabularyParser("stateofpreservationvoc", $_POST["langiso"]);
        $result[] = ["fieldName" => "stateofpreservationvoc", "fieldData" => $state->getVocabolaryAssocWithName(SORT_REGULAR)];

        $writing = new localVocabularyParser("writingtypevoc", $_POST["langiso"]);
        $result[] = ["fieldName" => "writingtypevoc", "fieldData" => $writing->getVocabolaryAssocWithName(SORT_REGULAR)];
    } else {
        $voc = new localVocabularyParser($_POST["voc"], $_POST["langiso"]);
        $result = $voc->getVocabolaryAssocWithName(SORT_REGULAR);
    }
    echo json_encode($result);
    exit();
}

add_action('wp_ajax_esi_facet_ajax_request', 'esi_facet_ajax_request');
add_action('wp_ajax_nopriv_esi_facet_ajax_request', 'esi_facet_ajax_request');

function esi_process_archive_action() {
    require_once __DIR__ . '/class/EagleSaveSystem.php';
    $result = array();
    $result["error"] = false;
    if (!is_user_logged_in()) {
        $result["error"] = true;
        $result["msg"] = "You must be logged to see archives area..!!";
    } else if (isset($_POST['myaction']) && $_POST['myaction'] === "list" && $_POST['type'] === "results") {
        /* Ricavo la lista delle ricerche salvate dall'utente corrente */
        $dbRow = EagleSaveSystem::getLastResearchSaved(get_current_user_id());
        $table = '<table class="tableArchives"><thead><tr><th>Checked</th><th>Title</th><th>Date</th><th>Actions</th></tr></thead>';
        $index = 0;
        if (count($dbRow) > 0) {
            foreach ($dbRow as $row) {
                $onclick = ($row->query_type == "string:similarity") ? 'Search.archivesSimilarityView(\'results\',' . $row->query_id . ',event);' : 'Search.archivesView(\'results\',' . $row->query_id . ',event);';
                $table.='<tr id="row' . $index . '" class="row' . ($index % 2) . '"><td><input type="checkbox" tableid="' . $row->query_id . '" mytype="results"  value="' . $row->query_id . '" /></td><td>' . $row->title . '</td><td class="date">' . $row->data . '</td><td><button class="action-button" type="button" onclick="Search.archivesDelete(\'results\',' . $row->query_id . ',' . $index . ');">Delete</button><button class="action-button" type="button" onclick="Search.archivesModify(\'results\',' . $row->query_id . ',' . $index . ');">Edit</button><button class="action-button" type="button" onclick="' . $onclick . '">View</button></td></tr>';
                $index++;
            }
        } else {
            $table = '<table class="tableArchives"><tr><td>No result Found</td></tr>';
        }
        $table.='</table>';
        $result["html"] = $table;
    } else if (isset($_POST['myaction']) && $_POST['myaction'] === "list" && $_POST['type'] === "items") {
        /* Ricavo la lista degli oggetti salvati dall'utente corrente */
        $dbRow = EagleSaveSystem::getLastObjectSaved(get_current_user_id());
        $table = '<table class="tableArchives"><thead><tr><th>Checked</th><th>Title</th><th>Date</th><th>Actions</th></tr></thead>';
        $index = 0;
        if (count($dbRow) > 0) {
            foreach ($dbRow as $row) {
                $onclick = ($row->query_type == "string:similarity" || $row->query_type == "string:recognize" ) ? 'Search.archivesSimilarityView(\'items\',' . $row->eagle_instance_id . ',event);' : 'Search.archivesView(\'items\',' . $row->eagle_instance_id . ',event);';
                $table.='<tr id="row' . $index . '" class="row' . ($index % 2) . '"><td><input type="checkbox" tableid="' . $row->eagle_instance_id . '" mytype="items"  value="' . $row->query_id . '" /></td><td>' . $row->title . '</td><td class="date">' . $row->data . '</td><td><button class="action-button" type="button" onclick="Search.archivesDelete(\'items\',' . $row->eagle_instance_id . ',' . $index . ');">Delete</button><button class="action-button" type="button" onclick="Search.archivesModify(\'items\',' . $row->eagle_instance_id . ',' . $index . ');">Edit</button><button class="action-button" type="button" onclick="' . $onclick . '">View</button></td></tr>';
                $index++;
            }
        } else {
            $table = '<table class="tableArchives"><tr><td>No result Found</td></tr>';
        }
        $table.='</table>';
        $result["html"] = $table;
    } else if (isset($_POST['myaction']) && $_POST['myaction'] === "delete" && $_POST['type'] === "results" && isset($_POST['tableid'])) {
        /* Elimino la ricerca indicata da tableid */
        $result["tmp"] = EagleSaveSystem::deleteResearchFromDB($_POST['tableid'], get_current_user_id());
        $result["error"] = ($result["tmp"] === 1) ? false : true;
        $result["msg"] = ($result["error"] === true) ? "Research deleted!" : "Failed !!Please contact Webmaster!!";
    } else if (isset($_POST['myaction']) && $_POST['myaction'] === "delete" && $_POST['type'] === "items" && isset($_POST['tableid'])) {
        /* Elimino l'oggetto indicato da tableid */
        $result["tmp"] = EagleSaveSystem::deleteObjectFromDB($_POST['tableid'], get_current_user_id());
        $result["error"] = ( $result["tmp"] === 1) ? false : true;
        $result["msg"] = ($result["error"] === true) ? "Object deleted!" : "Failed !!Please contact Webmaster!!";
    } else if (isset($_POST['myaction']) && $_POST['myaction'] === "edit" && $_POST['type'] === "results" && isset($_POST['tableid']) && isset($_POST['comment']) && isset($_POST['title'])) {
        /* Modifico la ricerca indicata da tableid  */
        $result["error"] = EagleSaveSystem::updateResearchToBD(array("comment" => $_POST['comment'], "title" => $_POST['title']), $_POST['tableid'], get_current_user_id());
        $result["msg"] = ($result["error"] === true) ? "Record Updated!" : "Failed !!Please contact Webmaster!!";
    } else if (isset($_POST['myaction']) && $_POST['myaction'] === "edit" && $_POST['type'] === "items" && isset($_POST['tableid']) && isset($_POST['comment']) && isset($_POST['title'])) {
        /* Elimino l'oggetto indicato da tableid */
        $result["error"] = EagleSaveSystem::updateObjectToBD(array("comment" => $_POST['comment'], "title" => $_POST['title']), $_POST['tableid'], get_current_user_id());
        $result["msg"] = ($result["error"] === true) ? "Record Updated!" : "Failed !!Please contact Webmaster!!";
    } else if (isset($_POST['myaction']) && $_POST['myaction'] === "info" && $_POST['type'] === "results" && isset($_POST['tableid']) && isset($_POST['row'])) {
        /* Restituisco le info sulla ricerca salvata */
        $dbRow = EagleSaveSystem::getResearchFromDB($_POST['tableid'], get_current_user_id());
        $html = '<fieldset><legend>Modify list info</legend><label>Title</label><br/><input type="text" value="' . $dbRow->title . '" id="editTitle" /><br/><label>Comment</label><br/><textarea id="editComment">' . $dbRow->comment . '</textarea><br/><button class="action-button" type="button" onclick="Search.archivesModifySave(\'' . $_POST['type'] . '\',' . $_POST['tableid'] . ',' . $_POST['row'] . ');">Save</button></fieldset>';
        $result["html"] = $html;
    } else if (isset($_POST['myaction']) && $_POST['myaction'] === "info" && $_POST['type'] === "items" && isset($_POST['tableid']) && isset($_POST['row'])) {
        /* Restituisco le info sull'oggetto salvato */
        $dbRow = EagleSaveSystem::getObjectFromDB($_POST['tableid'], get_current_user_id());
        $html = '<fieldset><legend>Modify object info</legend><label>Title</label><br/><input type="text" value="' . $dbRow->title . '" id="editTitle" /><br/><label>Comment</label><br/><textarea id="editComment">' . $dbRow->comment . '</textarea><br/><button class="action-button" type="button" onclick="Search.archivesModifySave(\'' . $_POST['type'] . '\',' . $_POST['tableid'] . ',' . $_POST['row'] . ');">Save</button></fieldset>';
        $result["html"] = $html;
    } else if (isset($_POST['myaction']) && $_POST['myaction'] === "view" && $_POST['type'] === "results" && isset($_POST['tableid']) && isset($_POST['similarity'])) {
        /* Restituisco le info sull'oggetto salvato */
        require_once __DIR__ . '/class/EagleSearch.php';

        $dbRow = EagleSaveSystem::getResearchFromDB($_POST['tableid'], get_current_user_id());
        if ($dbRow) {
            try {
                $stringXML = getSaved($dbRow->resource, 'similarityList');

                //if ($dbRow->is_imported == 0) {
                $xml = new SimpleXMLElement($stringXML);

                $response = array();
                foreach ($xml->results->result as $Similarityresult) {
                    $response[] = array("id" => $Similarityresult->id, "thumbnail" => $Similarityresult->thumbnail, "title" => $Similarityresult->title);
                }
//                } else {
//                     $xml = new SimpleXMLElement($stringXML);
//                    $response = array();
//                    foreach ($xml->results->result as $Similarityresult) {
//                        $response[] = array("id" => $Similarityresult->id, "thumbnail" => $Similarityresult->thumbnail, "title" => $Similarityresult->title);
//                    }
//                }


                $result["error"] = false;
                $result["results"] = $response;
                $result["msg"] = "Similarity saved search found..!!";
            } catch (Exception $e) {
                $result["error"] = true;
                $result["msg"] = $e->getMessage();
                $result["json"] = "";
            }
        } else {
            $result["error"] = true;
            $result["msg"] = "Similarity saved search not found..!!";
            $result["json"] = "";
        }
    } else if (isset($_POST['myaction']) && $_POST['myaction'] === "view" && $_POST['type'] === "items" && isset($_POST['tableid']) && isset($_POST['similarity'])) {
        /* Restituisco le info sull'oggetto salvato */
        require_once __DIR__ . '/class/EagleSearch.php';

        $dbRow = EagleSaveSystem::getObjectFromDB($_POST['tableid'], get_current_user_id());
        if ($dbRow) {
            try {
                $stringXML = ($dbRow->query_type == 'string:similarity') ? getSaved($dbRow->resource, 'similarityObj') : getSaved($dbRow->resource, 'recognizeObj');
                //var_dump($stringXML);
                //die();
                $response = "";
                if ($dbRow->is_imported == 0) {
                    $xml = new SimpleXMLElement(($stringXML));

                    foreach ($xml->result->doc->children() as $arr) {
                        if ($arr['name'] == '__result') {
                            $response = $arr->str;
                            //var_dump($response); die();
                            break;
                        }
                    }
                } else {
//                    var_dump($stringXML);
//                    die();
                    $response = (object) array("0" => $stringXML);
                }
                $result["results"] = $response;
                $result["error"] = false;
                $result["msg"] = "Similarity saved search found..!!";
            } catch (Exception $e) {
                $result["error"] = true;
                $result["msg"] = $e->getMessage();
                $result["json"] = "";
            }
        } else {
            $result["error"] = true;
            $result["msg"] = "Similarity saved search not found..!!";
            $result["json"] = "";
        }
    } else if (isset($_POST['myaction']) && $_POST['myaction'] === "view" && $_POST['type'] === "results" && isset($_POST['tableid'])) {
        /* Restituisco le info sull'oggetto salvato */
        require_once __DIR__ . '/class/EagleSearch.php';
        $eagle = new EagleSearch();
        $eagle->setSavePath(WP_CONTENT_DIR . '/');
        $dbRow = EagleSaveSystem::getResearchFromDB($_POST['tableid'], get_current_user_id());
        if ($dbRow) {
            $result["error"] = false;
            $result["msg"] = "";
            $result["page"] = $dbRow->page_number;
            $result["page_number"] = $dbRow->tot_page_saved;
            $result["json"] = $eagle->getSavedList($dbRow->resource);
            list($query_type, $result["entity"]) = explode(":", $dbRow->query_type);
        } else {
            $result["error"] = true;
            $result["msg"] = "Research not found..!!";
            $result["entity"] = "";
            $result["json"] = "";
        }
    } else if (isset($_POST['myaction']) && $_POST['myaction'] === "view" && $_POST['type'] === "items" && isset($_POST['tableid'])) {
        /* Restituisco le info sull'oggetto salvato */
        require_once __DIR__ . '/class/EagleSearch.php';
        $eagle = new EagleSearch();
        $eagle->setSavePath(WP_CONTENT_DIR . '/');
        $dbRow = EagleSaveSystem::getObjectFromDB($_POST['tableid'], get_current_user_id());
        if ($dbRow) {
            $result["error"] = false;
            $result["msg"] = "";
            $result["page"] = $dbRow->page;
            $result["json"] = $eagle->getSavedList($dbRow->resource);
            $result["row"] = $dbRow->row;
            $result["col"] = $dbRow->col;
        } else {
            $result["error"] = true;
            $result["msg"] = "Items not found..!!";
            $result["json"] = "";
        }
    }
    echo json_encode($result);
    exit();
}

add_action('wp_ajax_esi_process_archive_action', 'esi_process_archive_action');

function saveData($data, $type) {

    $savepath = WP_CONTENT_DIR . DS . $type . DS;

//Create path if not exists yet
    if (!is_dir($savepath)) {
        mkdir($savepath, 0777, true);
    }

    $saved = false;
    $maxTries = 100;
    while (!$saved AND $maxTries-- > 0) {
        $savename = uniqid($type) . '.gz';
        if (!is_file($savepath . $savename)) {
            $fp = gzopen($savepath . $savename, "w9");
            if ($fp) {
                gzwrite($fp, $data);
                gzclose($fp);
                $saved = true;
            }
        }
    }

    return $saved ? $savename : null;
}

function getSaved($filename, $type) {

//    if (!in_array($type, array(self::OBJECT_DIR, self::LIST_DIR))) {
//        throw new Exception(_("Wrong item type"));
//    }

    $file_path = WP_CONTENT_DIR . DS . $type . DS . $filename;
//var_dump($file_path); die();
    if (is_file($file_path)) {

//            $gzip_data = file_get_contents($file_path);
//
//            $data = gzdecode($gzip_data);

        $gzip = file_get_contents($file_path);
        $rest = substr($gzip, -4);
        $GZFileSize = end(unpack("V", $rest));

        $HandleRead = gzopen($file_path, "rb");
        $data = gzread($HandleRead, $GZFileSize);
        gzclose($HandleRead);

        return $data;
    } else {
        throw new Exception(_("Requested item does not exists"));
    }
}

add_filter('query_vars', 'esi_add_get_vars');
add_filter('rewrite_rules_array', 'esi_rewrite_rule_for_get_vars');

function esi_add_get_vars($aVars) {
    $aVars[] = "esi_query";
    return $aVars;
}

function esi_rewrite_rule_for_get_vars($aRules) {
    $aNewRules = array(
        'basic-search/(.*)/?$' => 'index.php?pagename=basic-search&esi_query=$matches[1]',
        'advanced-search/(.*)/?$' => 'index.php?pagename=advanced-search&esi_query=$matches[1]'
//         'basic-search/([^/]+)/?$' => 'index.php?pagename=basic-search&esi_query=$matches[1]'
    );
    $aRules = $aNewRules + $aRules;
    return $aRules;
}
