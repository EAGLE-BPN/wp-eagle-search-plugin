<?php

require_once('Apache/Solr/Service.php');

/*
 * This class wrap SOLR interface towards Wordpress application
 * @author Andrea Cappalunga<info@cappalunga.it>
 */
if (!defined('DS')) {
    define('DS', DIRECTORY_SEPARATOR);
}

define('HERE', dirname(__FILE__));

class EagleSearch {

    const FLD_ENTITYTYPE = 'entitytype';
    const ENT_ARTIFACT = 'artifact';
    const ENT_DOCUMENTAL = 'documental';
    const ENT_VISUAL = 'visual';
    const DEFAULT_SAVE_PATH = "/tmp/cache/search/";
    const LIST_DIR = 'list';
    const OBJECT_DIR = 'items';

    /**
     * Number of results per page
     */
    const PAGE_SIZE = 10;

    /**
     * Number of pages to be saved when requested
     */
    const SAVE_PAGES = 10;
    const SAVE_PAGES_STARTING_BACK = 5;

    /**
     * Solr base url
     * @deprecated
     */
    const SOLR_URL = "http://search.eagle.research-infrastructures.eu/solr/EMF-index-cleaned/select?q=*";
    const SORL_EPIDOC_API_URL = "http://node0.d.eagle.research-infrastructures.eu/is/mvc/epidoc/";
    const CNR_SIMILARITY_SEARCH_URL = "http://virserv101.isti.cnr.it/fma/services/IRServices/searchSimilar";
    const CNR_SIMILARITY_SEARCH_BYID_URL = "http://virserv101.isti.cnr.it/fma/services/IRServices/searchSimilarByID";
    const CNR_GET_METADATA_URL = "http://virserv101.isti.cnr.it/fma/services/IRServices/getMetadata";
    const SOLR_HOST = "search.eagle.research-infrastructures.eu";
    const SOLR_PORT = 80;
    const SOLR_PATH = "/solr/EMF-index-cleaned/";

    /**
     * Solr Object
     * @var Apache_Solr_Service
     */
    protected $solr = null;

    /**
     * Last Executed Query
     * @var string
     */
    protected $last_query = "";

    /**
     * File Save Path
     * @var string
     */
    protected $save_path;

    /**
     * List of fields to use in facets
     * @var Array
     */
    protected $facet_fields;

    /**
     * Enable facet search
     * @var bool
     */
    protected $facet_enabled;

    /**
     * List of virtual fieds to use in fq
     * @var Array
     */
    protected $virtual_fields;

    /**
     * Enable virtual fields
     * @var bool
     */
    protected $virtual_enabled;

    /**
     *  Default constructor
     */
    public function __construct() {
        $this->save_path = self::DEFAULT_SAVE_PATH;

        $this->facet_fields = array();
        $this->facet_enabled = false;
        $this->virtual_enabled = false;

        // create a new solr service instance - host, port, and webapp
        // path (all defaults in this example)
        $this->solr = new Apache_Solr_Service(self::SOLR_HOST, self::SOLR_PORT, self::SOLR_PATH);
    }

    /**
     * Set the list of facet fields used in all queries
     */
    public function setFacetFields($field_array) {
        $this->facet_fields = $field_array;
    }

    /**
     * Return list of facet fields
     * @return array
     */
    public function getFacetFields() {
        return $this->facet_fields;
    }

    /**
     * Add a single field
     * @var string $field
     */
    public function addFacetField($field) {

        $facet_fields = $this->facet_fields;
        $facet_fields[] = $field;
        $this->facet_fields = array_unique($facet_fields);
    }

    /**
     * Enable/Disable use of facet search
     * @var bool $value
     */
    public function setFacetEnabled($value = true) {
        $this->facet_enabled = $value;
    }

    /**
     * Return if facet is enabled or not
     *  @return bool
     */
    public function isFacetEnabled() {
        return $this->facet_enabled;
    }

    /**
     * Set the list of virtual fields used in all queries
     */
    public function setVirtualtFields($field_array) {
        $this->virtual_fields = $field_array;
    }

    /**
     * Return list of virtual fields
     * @return array
     */
    public function getVirtualFields() {
        return $this->virtual_fields;
    }

    /**
     * Add a single field
     * @var string $field
     */
    public function addVirtualField($field) {
        $virtual_fields = $this->virtual_fields;
        $key = array_shift(array_keys($field));
        $virtual_fields[$key] = $field[$key];
        $this->virtual_fields = $virtual_fields;
    }

    /**
     * Enable/Disable use of virtual search fields
     * @var bool $value
     */
    public function setVirtualEnabled($value = true) {
        $this->virtual_enabled = $value;
    }

    /**
     * Return if virtual fields is enabled or not
     *  @return bool
     */
    public function isVirtualEnabled() {
        return $this->virtual_enabled;
    }

    /**
     * Search the given string into SOLR service
     * @param string $query
     * @param int [optional] $page
     * @param string [optional] $entity
     * @param string [optional] $fq
     */
    public function simpleSearch($query = null, $page = 0, $entity = self::ENT_ARTIFACT, $fq = null) {
        if (!$query OR ! is_string($query)) {
            throw new EagleSearchInputException("Input query must be not null and of type string");
        }

        $filter = self::FLD_ENTITYTYPE . ':' . $entity;

        if ($fq != null) {
            $filter .= " AND $fq";
        }
        $query = stripslashes($query);

//        error_log("Q: ".$query);
//        error_log("FQ: ".$filter);
        return $this->query($query, $filter, $page);
    }

    /**
     * General search with criteria on multiple fields
     * @param string $query
     * @param mixed $fields array (HASH with filed->value) or SOLR fq string
     * @param array $options unused
     */
    public function advancedSearch($query, $fields = array(), $page = 0, $entity = self::ENT_ARTIFACT, $fq = null) {

        //Perform same query of simple, but adding to the filter also the requested fields

        $quote = urlencode('"');

        $filter = self::FLD_ENTITYTYPE . ':' . $entity;

        if (is_array($fields) AND ! empty($fields)) {
            $params = array();
            foreach ($fields as $k => $v)
                $params [] = "$k:$v"; //$k:$quote$v$quote";

            $filter .= ' AND ' . implode(' AND ', $params);
        } elseif (is_string($fields) AND trim($fields)) {
            $filter .= ' AND ' . $fields;
        } else {
            //Nothing
        }

        if (rtrim(ltrim($query)) == "") {
            $query= "*";
        }

        if ($fq != null) {
            $filter .= " AND $fq";
        }

        return $this->query($query, $filter, $page);
        /**  http://node1.d.eagle.research-infrastructures.eu:8080/is/mvc/index/EMF-index-cleaned/solr.do/select?wt=json&q=*:*&rows=10&start=0&fq=inscriptiontypevoc:%22http://www.eagle-network.eu/voc/typeins/lod/92%22 */
    }

    /**
     * Perform search and save first SAVE_PAGES pages
     * @param string $query
     * @param int $page
     * @param string $entity
     * @return filename
     */
    public function saveSearch($query, $entity = self::ENT_ARTIFACT) {

        if (!$query OR ! is_string($query)) {
            throw new EagleSearchInputException("Input query must be not null and of type string");
        }

        $filter = self::FLD_ENTITYTYPE . ':' . $entity;

        $page = 0;
        $rows = self::SAVE_PAGES * self::PAGE_SIZE;

        return $this->saveList($this->query($query, $filter, $page, $rows));
    }

    /**
     * Save results for advanced Search
     * @param string $query
     * @param array $fields
     * @param string $entity
     * @return filename
     */
    public function saveAdvancedSearch($query, $fields = array(), $entity = self::ENT_ARTIFACT, $page = 0, $searchType, $fq = null) {

        //Perform same query of simple, but adding to the filter also the requested fields

        $filter = self::FLD_ENTITYTYPE . ':' . $entity;
        if (!is_null($fq)) {
            $filter .= " AND $fq";
        }

        if ($searchType == 0 AND ! empty($fields)) {

            $filter .= " AND $fields";
        } else if (is_array($fields) AND ! empty($fields)) {
            $params = array();
            foreach ($fields as $k => $v)
                $params [] = "$k:$v"; //$k:$quote$v$quote";

            $filter .= ' AND ' . implode(' AND ', $params);
        } elseif (is_string($fields) AND trim($fields)) {
            $filter .= ' AND ' . $fields;
        } else {
            //Nothing
        }





//        $params = array();
//        foreach ($fields as $k => $v) {
//            $params [] = "$k:" . urlencode($v);
//        }
//
//        $k = self::FLD_ENTITYTYPE;
//        $v = $entity;
//
//        $params [] = "($k:\"" . urlencode($v)."\")";
//
//        $filter = implode(' AND ', $params);

        if ($page > self::SAVE_PAGES_STARTING_BACK)
            $page-=self::SAVE_PAGES_STARTING_BACK;
        else
            $page = 0;

        $rows = self::PAGE_SIZE * self::SAVE_PAGES;

        //var_dump($filter); die();

        return $this->saveList($this->querySave($query, $filter, $page, $rows));

        /**
          http://node1.d.eagle.research-infrastructures.eu:8080/is/mvc/index/EMF-index-cleaned/solr.do/select?wt=json&q=*:*&rows=10&start=0&fq=inscriptiontypevoc:%22http://www.eagle-network.eu/voc/typeins/lod/92%22
         */
    }

    /**
     * Find an EagleObject by dnetresourceidentifier
     * @param type $dnetresourceidentifier
     * @return type
     */
    public function getObjectFromDnetResourceIdentifier($dnetresourceidentifierList, $entitytype) {
        // $filter = 'entitytype:' . $entitytype;
        $filter = '';
        $dnetresourceidentifierStringArr = array();
        foreach ($dnetresourceidentifierList as $dnetresourceidentifier) {
            $dnetresourceidentifierStringArr[] = "(dnetresourceidentifier:" . "\"" . $dnetresourceidentifier . "\"" . ")";
        }
        $q = implode('OR', $dnetresourceidentifierStringArr);
        //$q="dnetresourceidentifier:$dnetresourceidentifier";
        return $this->simplequery($q, $filter, 0, self::PAGE_SIZE * self::SAVE_PAGES * 10);
    }

    /**
     * Find items with same trismegistos id AND entitytype:ENT_ARTIFACT
     * @param type $tmid
     * @return type
     */
    public function trismegistosFamilyArt($tmid) {
        $filter = 'entitytype:' . self::ENT_ARTIFACT;
        if (is_array($tmid)) {
            $pieces = array();
            foreach ($tmid as $id) {
                $pieces[] = '(tmid:' . $id . ')';
            }
            $q = implode('OR', $pieces);
        } else
            $q = "tmid:" . $tmid;

        return $this->query($q, $filter, 0, self::PAGE_SIZE * self::SAVE_PAGES * 10);
    }

    /**
     * Find items with same trismegistos id AND entitytype:ENT_DOCUMENTAL
     * @param type $tmid
     * @return type
     */
    public function trismegistosFamilyDoc($tmid) {
        $filter = 'entitytype:' . self::ENT_DOCUMENTAL;
        if (is_array($tmid)) {
            $pieces = array();
            foreach ($tmid as $id) {
                $pieces[] = '(tmid:' . $id . ')';
            }
            $q = implode('OR', $pieces);
        } else
            $q = "tmid:" . $tmid;

        return $this->query($q, $filter, 0, self::PAGE_SIZE * self::SAVE_PAGES * 10);
    }

    /**
     * Find items with same trismegistos id AND entitytype:ENT_VISUAL
     * @param type $tmid
     * @return type
     */
    public function trismegistosFamilyVis($tmid) {
        $filter = 'entitytype:' . self::ENT_VISUAL;
        if (is_array($tmid)) {
            $pieces = array();
            foreach ($tmid as $id) {
                $pieces[] = '(tmid:' . $id . ')';
            }
            $q = implode('OR', $pieces);
        } else
            $q = "tmid:" . $tmid;

        return $this->query($q, $filter, 0, self::PAGE_SIZE * self::SAVE_PAGES * 10);
    }

    /**
     * Find items with same trismegistos id
     * @param type $dnetResourceId
     * @return type
     */
    public function epidocEagleObj($dnetResourceId) {
        return $this->simple_query("(dnetresourceidentifier:\"$dnetResourceId\")");
    }

    /**
     * Build query for solr
     * @param string $query
     * @param string $filter
     * @param int $page page to retrieve first is 0
     * @param int $rows num of items to retrieve, default is PAGE_SIZE
     * @return XML string
     * @throws EagleSearchResultException
     */
    protected function simple_query($query) {

        $options = array();

        $options['wt'] = 'xml';
        //$options['q'] = $query;

        /* Mikidg1984 GroupBY */
        $options['fl'] = '__result';
        /* End Mikidg1984 GroupBy */
//
//        $options['rows'] = $rows;
//        $options['start'] = $page * $rows;
//        if (trim($filter)) {
//            $options['fq'] = $filter;
//        }
        //$query = stripslashes($query);
//        var_dump($query); die();

        try {
            //$result = $this->solr->search($query);
            $result = $this->solr->search($query, 0, 1, $options);
            return $result->getRawResponse();
        } catch (Exception $e) {

            echo "Query: $query\n\n";
            throw new EagleSearchResultException($e->getMessage());
        }
    }

    /**
     * Save Trismegistos family
     * @param string $tmid
     * @return string file
     */
    public function saveTrismegistosFamilty($tmid) {
        return $this->saveList($this->trismegistosFamily($tmid));
    }

    /**
     * Save Single Object (from query)
     * @param type $objectidentifier
     * @return type
     */
    public function saveSingleObject($objectidentifier) {
        $quote = urlencode('"');
        $filter = "objidentifier:" . $quote . $objectidentifier . $quote;
        $result = $this->query("*", $filter, 0, 1);

        return $this->saveObject($result);
    }

    /**
     * Retrieve last query executed
     * @return type
     */
    public function getLastQueryUrl() {
        return $this->last_query;
    }

    public function setSavePath($path) {
        $this->save_path = $path;
    }

    public function getSavePath() {
        return $this->save_path;
    }

    /**
     * Retrieve saved object single
     * @param string $filename
     * @return string
     */
    public function getSavedObject($filename) {
        return $this->getSaved($filename, self::OBJECT_DIR);
    }

    /**
     * Retrieve saved list
     * @param string $filename
     * @return string
     */
    public function getSavedList($filename) {
        return $this->getSaved($filename, self::LIST_DIR);
    }

    /**
     * Retrieve saved items
     * @param string $filename
     * @param string $type object type
     * @return string
     */
    protected function getSaved($filename, $type) {

        if (!in_array($type, array(self::OBJECT_DIR, self::LIST_DIR))) {
            throw new Exception(_("Wrong item type"));
        }

        $file_path = $this->save_path . DS . $type . DS . $filename;

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

    /**
     * Build query for solr
     * @param string $query
     * @param string $filter
     * @param int $page page to retrieve first is 0
     * @param int $rows num of items to retrieve, default is PAGE_SIZE
     * @return JSON string
     * @throws EagleSearchResultException
     */
    protected function simplequery($query, $filter = "", $page = 0, $rows = self::PAGE_SIZE) {

        $options = array();

        $options['wt'] = 'json';
        //$options['q'] = $query;

        /* Mikidg1984 GroupBY */
//        $options['group'] = 'true';
//        $options['group.field'] = 'tmid';
//        $options['group.limit'] = '50';
//        $options['group.ngroups'] = 'true';
        $options['fl'] = '__result';
        /* End Mikidg1984 GroupBy */

        $options['rows'] = $rows;
        $options['start'] = $page * $rows;

        if (trim($filter)) {
            $options['fq'] = $filter;
        }
//
//        if ($this->facet_enabled) {
//            $options['facet'] = 'true';
//            $options['facet.mincount'] = 1;
//            $options['facet.field'] = $this->facet_fields;
//        }
        //var_dump($options); die();
//        if ($this->virtual_enabled) {
//            foreach ($this->virtual_fields as $key => $value) {
//                $solrOptionKey = "f.$key.qf";
//                $options[$solrOptionKey] = implode(' ', $value);
//            }
//        }
//        error_log($query);

        $query = stripslashes($query);


//         echo "Query: $query\n\n";
//            echo "Options: " . var_export($options);
//            die();

        try {
            $result = $this->solr->search($query, $page * $rows, $rows, $options);

            return $result->getRawResponse();
        } catch (Exception $e) {

            echo "Query: $query\n\n";
            echo "Options: " . var_export($options);

            throw new EagleSearchResultException($e->getMessage());
        }
    }

    /**
     * Build query for solr
     * @param string $query
     * @param string $filter
     * @param int $page page to retrieve first is 0
     * @param int $rows num of items to retrieve, default is PAGE_SIZE
     * @return JSON string
     * @throws EagleSearchResultException
     */
    protected function query($query, $filter = "", $page = 0, $rows = self::PAGE_SIZE) {

        $options = array();

        $options['wt'] = 'json';
        //$options['q'] = $query;

        /* Mikidg1984 GroupBY */
        $options['group'] = 'true';
        $options['group.field'] = 'tmid';
        $options['group.limit'] = '50';
        $options['group.ngroups'] = 'true';
        $options['fl'] = '__result';
        /* End Mikidg1984 GroupBy */

        $options['rows'] = $rows;
        $options['start'] = $page * $rows;

        if (trim($filter)) {
            $options['fq'] = $filter;
        }

        if ($this->facet_enabled) {
            $options['facet'] = 'true';
            $options['facet.mincount'] = 1;
            $options['facet.field'] = $this->facet_fields;
        }

        //var_dump($options); die();

        if ($this->virtual_enabled) {
            foreach ($this->virtual_fields as $key => $value) {
                $solrOptionKey = "f.$key.qf";
                $options[$solrOptionKey] = implode(' ', $value);
            }
        }

//        error_log($query);


// commentato riga sotto da nicola
//       $query = stripslashes($query);
//        $query = urlencode($query);
//       var_dump($query); die();


//         echo "Query: $query\n\n";
//            echo "Options: " . var_export($options);
//            die();

        try {
            $result = $this->solr->search($query, $page * $rows, $rows, $options);
            return $result->getRawResponse();
        } catch (Exception $e) {

            echo "Query: $query\n\n";
            echo "Options: " . var_export($options);

            throw new EagleSearchResultException($e->getMessage());
        }
    }

    /**
     * Build query for solr
     * @param string $query
     * @param string $filter
     * @param int $page page to retrieve first is 0
     * @param int $rows num of items to retrieve, default is PAGE_SIZE
     * @return JSON string
     * @throws EagleSearchResultException
     */
    protected function querySave($query, $filter = "", $page = 0, $rows = self::PAGE_SIZE) {

        $options = array();

        $options['wt'] = 'json';
        //$options['q'] = $query;

        /* Mikidg1984 GroupBY */
        $options['group'] = 'true';
        $options['group.field'] = 'tmid';
        $options['group.limit'] = '50';
        $options['group.ngroups'] = 'true';
        $options['fl'] = '__result';
        /* End Mikidg1984 GroupBy */

        $options['rows'] = $rows;
        $options['start'] = $page * self::PAGE_SIZE;

        if (trim($filter)) {
            $options['fq'] = $filter;
        }

        if ($this->facet_enabled) {
            $options['facet'] = 'true';
            $options['facet.field'] = $this->facet_fields;
        }

        if ($this->virtual_enabled) {
            foreach ($this->virtual_fields as $key => $value) {
                $solrOptionKey = "f.$key.qf";
                $options[$solrOptionKey] = implode(' ', $value);
            }
        }
//        error_log($query);

        $query = stripslashes($query);


        try {
            $result = $this->solr->search($query, $page * self::PAGE_SIZE, $rows, $options);

            return $result->getRawResponse();
        } catch (Exception $e) {

            echo "Query: $query\n\n";
            echo "Options: " . var_export($options);

            throw new EagleSearchResultException($e->getMessage());
        }

        /*
          $query_data = array();
          foreach($options as $k=>$v){
          $query_data[] = implode('=',array($k,$v));
          }

          $query_url = self::SOLR_URL . '?' . implode('&',$query_data);

          try{
          $result = $this->doQuery($query_url);

          //Store for future usage
          $this->last_query = $query_url;

          return $result;
          }catch(Exception $e){
          throw new EagleSearchResultException($e->getMessage());
          } */
    }

    /**
     * Send query to SOLR thorugh cURL
     * @param string $url
     * @return string
     */
    protected function doQuery($url) {

        $curl = curl_init($url);
        $result = "";

        if (is_resource($curl) === true) {
            curl_setopt($curl, CURLOPT_FAILONERROR, true);
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($curl, CURLOPT_ENCODING, 'gzip,deflate');
            curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
            curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($curl, CURLOPT_TIMEOUT, 120);

            $result = curl_exec($curl);

            curl_close($curl);
        } else {

            throw new EagleSearchException(_("Unable to forward query"));
        }

        return $result;
    }

    // Adde functions to:
    // Retrieve object
    // Retrieve list
    //
    // Change save methods to let them store results on files, and return the filename to the requestor

    /**
     * Save search result list
     * @param string $data
     * @return string filename
     */
    public function saveList($data) {
        return $this->saveData($data, self::LIST_DIR);
    }

    /**
     * Save single item
     * @param string $data
     * @return string filename
     */
    public function saveObject($data) {
        return $this->saveData($data, self::OBJECT_DIR);
    }

    /**
     * Perform data saving on randomly generated name
     * @param string $data file content
     * @param type $type
     * @return type
     */
    protected function saveData($data, $type) {

        $savepath = $this->save_path . DS . $type . DS;

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

    public function testme() {

        $options = array();
        $options['fq'] = ' +materialvoc:"http://www.eagle-network.eu/voc/material/lod/48"';

        $q = "africanus";
        //$q = "africanus +materialvoc:http\://www.eagle-network.eu/voc/material/lod/48";

        $result = $this->solr->search($q, 0, 1, $options);
        return $result->getRawResponse();
    }

}

class EagleSearchException extends Exception {

}

;

class EagleSearchInputException extends EagleSearchException {

}

;

class EagleSearchResultException extends EagleSearchException {

}

;
