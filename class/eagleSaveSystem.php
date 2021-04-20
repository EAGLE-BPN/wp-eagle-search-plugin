<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of eagleSaveSystem
 *
 * @author mikidg1984
 */
class EagleSaveSystem {

    public static function getLastResearchSaved($uid) {
        global $wpdb;
        $table_name = $wpdb->prefix . "esi_query";
        $dbOBJ = $wpdb->get_results("SELECT * FROM $table_name WHERE user_id=$uid ORDER BY query_id DESC");
        return ($wpdb->num_rows > 0) ? $dbOBJ : null;
    }

    public static function getLastObjectSaved($uid) {
        global $wpdb;
        $table_name = $wpdb->prefix . "esi_eagle_instance";
        $dbOBJ = $wpdb->get_results("SELECT * FROM $table_name WHERE user_id=$uid ORDER BY eagle_instance_id DESC");
        return ($wpdb->num_rows > 0) ? $dbOBJ : null;
    }

    /* Salva un xml da string to xml file in uploads/xml/randfile.xml */

    public static function saveResearchToBD($fiels = array()) {
        global $wpdb;
        $table_name = $wpdb->prefix . "esi_query";
        return ($wpdb->query($wpdb->prepare(
                                "INSERT INTO $table_name"
                                . "( user_id, query_type, query, page_number, tot_page_saved, title, comment, resource, data ) VALUES "
                                . "( %d, %s, %s, %d, %d, %s, %s, %s, %s )", $fiels['user_id'], $fiels['query_type'], $fiels['query'], $fiels['page_number'], $fiels['tot_page_saved'], $fiels['title'], $fiels['comment'], $fiels['resource'], $fiels['data']
                )) !== false) ? $wpdb->insert_id : false;
    }

    public static function updateResearchToBD($fiels = array(), $query_id = 0, $user_id = 0) {
        global $wpdb;
        $table_name = $wpdb->prefix . "esi_query";
        $q = $wpdb->update($table_name, $fiels, array("query_id" => $query_id, "user_id" => $user_id));
        //error_log($wpdb->last_query);
        return ($q !== false) ? true : false;
    }

    public static function updateObjectToBD($fiels = array(), $query_id = 0, $user_id = 0) {
        global $wpdb;
        $table_name = $wpdb->prefix . "esi_eagle_instance";
        $q = $wpdb->update($table_name, $fiels, array("eagle_instance_id" => $query_id, "user_id" => $user_id));
        // error_log($wpdb->last_query);
        return ($q !== false) ? true : false;
    }

    public static function getResearchFromDB($query_id = 1, $user_id = 1) {
        global $wpdb;
        $table_name = $wpdb->prefix . "esi_query";
        $q = $wpdb->get_row("SELECT * FROM $table_name WHERE query_id=$query_id AND user_id=$user_id");
        //error_log($wpdb->last_query);
        return $q;
    }

    public static function deleteResearchFromDB($query_id = 1, $user_id = 1, $path = "") {
        $element = EagleSaveSystem::getResearchFromDB($query_id, $user_id);
        if (!is_null($element)) {
            global $wpdb;
            $table_name = $wpdb->prefix . "esi_query";

            $select = $wpdb->get_results("SELECT * FROM $table_name WHERE query_id=$query_id AND user_id=$user_id");

            if ($wpdb->query($wpdb->prepare("DELETE FROM $table_name WHERE query_id=$query_id AND user_id=$user_id")) !== false) {
                foreach ($select as $sel) {
                    unlink($path . $sel->resource);
                }
                return 1;
            }

            return 0;
        }
        return 0;
    }

    public static function deleteObjectFromDB($query_id = 1, $user_id = 1, $path = "") {
        $element = EagleSaveSystem::getObjectFromDB($query_id, $user_id);
        if (!is_null($element)) {
            global $wpdb;
            $table_name = $wpdb->prefix . "esi_eagle_instance";
            $select = $wpdb->get_results("SELECT * FROM $table_name WHERE eagle_instance_id=$query_id AND user_id=$user_id");

            if ($wpdb->query($wpdb->prepare("DELETE FROM $table_name WHERE eagle_instance_id=$query_id AND user_id=$user_id")) !== false) {
                foreach ($select as $sel) {
                    unlink($path . $sel->resource);
                }
                return 1;
            }
            return 0;
        }
        return 0;
    }

    public static function getObjectFromDB($eagle_instance_id = 1, $user_id = 1) {
        global $wpdb;
        $table_name = $wpdb->prefix . "esi_eagle_instance";
        $q = $wpdb->get_row("SELECT * FROM $table_name WHERE eagle_instance_id=$eagle_instance_id AND user_id=$user_id");
        //error_log($wpdb->last_query);
        return $q;
    }

    public static function saveObjectToBD($fiels = array()) {
        global $wpdb;
        $table_name = $wpdb->prefix . "esi_eagle_instance";
        return ($wpdb->query($wpdb->prepare(
                                "INSERT INTO $table_name"
                                . "( user_id, col, row, page, resource, comment, title, data ) VALUES "
                                . "( %d, %d, %d, %d, %s, %s, %s, %s )", $fiels['user_id'], $fiels['col'], $fiels['row'],$fiels["page_number"], $fiels['resource'], $fiels['comment'], $fiels['title'], $fiels['data']
                )) !== false) ? $wpdb->insert_id : false;
    }

}
