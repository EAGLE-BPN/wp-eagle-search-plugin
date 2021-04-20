<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of localVocabularyParser
 *
 * @author Michele Del Giudice
 */
class localVocabularyParser {

    private static $REPO_PATH = "repository/epidocupconversion/allinone";
    private static $vocFileAssoc = array(
        "datingvoc" => "eagle-vocabulary-dating-criteria.rdf",
        "decorationvoc" => "eagle-vocabulary-decoration.rdf",
        "materialvoc" => "eagle-vocabulary-material.rdf",
        "objecttypevoc" => "eagle-vocabulary-object-type.rdf",
        "stateofpreservationvoc" => "eagle-vocabulary-state-of-preservation.rdf",
        "inscriptiontypevoc" => "eagle-vocabulary-type-of-inscription.rdf",
        "writingtypevoc" => "eagle-vocabulary-writing.rdf"
    );
    private static $SKOS_CONCEPT_CHILD_LANGUAGE_LABEL_ELEMENTS = array('prefLabel', 'altLabel');
    private $vocType = "";
    private $xml;
    private $errors = null;
    private $langiso;

    public static function get($name) {

        if ($name == "Vocabulary")
            return self::$vocFileAssoc;
        else
            throw new Exception(_("$name is not a valid member"));
    }

    function __construct($vocType, $langiso = null) {
        $this->xml = null;
        $this->errors = null;
        $this->vocType = $vocType;
        $this->langiso = $langiso;
    }

    public function getVocabolaryData($keySort = -100) {
        global $esiLogger;
        $dataResult = array();
        $xmlString = file_get_contents($_SERVER['DOCUMENT_ROOT'] . "/" . localVocabularyParser::$REPO_PATH . "/" . localVocabularyParser::$vocFileAssoc[$this->vocType]);
        if ($xmlString === false) {
            $this->errors = "Fread error::Could not retrive RDF file!!";
            return;
        }

        $this->xml = simplexml_load_string($xmlString);
        $rows = $this->xml->children('skos', TRUE);
        foreach ($rows as $row) {
            try {
                $dataResult[] = $this->conceptNodeVocabularyParser($row);
            } catch (localVocabularyParserException $ex) {
                $esiLogger->warning($ex->getMessage());
            }
        }
        if ($keySort !== -100) {
            // Obtain a list of columns
            $labels=array();
            foreach ($dataResult as $key => $row) {
                $labels[$key] = $row['vocLabel'];
                //$values[$key] = $row['vocValue'];
            }
            // Sort the data with volume descending, edition ascending
            // Add $data as the last parameter, to sort by the common key
            array_multisort($labels, SORT_ASC, $keySort, $dataResult);

            //asort($dataResult, $keySort);
        }
        return $dataResult;
    }

    public function getVocabolaryAssocWithName($keySort = -100) {
        global $esiLogger;
        $dataResult = array();
        $xmlString = file_get_contents($_SERVER['DOCUMENT_ROOT'] . "/" . localVocabularyParser::$REPO_PATH . "/" . localVocabularyParser::$vocFileAssoc[$this->vocType]);
        if ($xmlString === false) {
            $this->errors = "Fread error::Could not retrive RDF file!!";
            return;
        }

        $this->xml = simplexml_load_string($xmlString);
        $rows = $this->xml->children('skos', TRUE);

        $vocName = $this->conceptSchemeVocabularyParser($rows[0]);
        $vocName = explode('-', $vocName);
        $vocName = trim($vocName[count($vocName) - 1]);
        
        $dataResult=$this->getVocabolaryData();
        
        if ($keySort !== -100) {
            // Obtain a list of columns
            $labels=array();
            foreach ($dataResult as $key => $row) {
                $labels[$key] = $row['vocLabel'];
                //$values[$key] = $row['vocValue'];
            }
            // Sort the data with volume descending, edition ascending
            // Add $data as the last parameter, to sort by the common key
            array_multisort($labels, SORT_ASC, $keySort, $dataResult);

            //asort($dataResult, $keySort);
        }

        return array_merge(array("vocName" => $vocName), $dataResult);
    }

    public function getVocabolaryAssoc() {
        $dataResult = array();
        $xmlString = file_get_contents($_SERVER['DOCUMENT_ROOT'] . "/" . localVocabularyParser::$REPO_PATH . "/" . localVocabularyParser::$vocFileAssoc[$this->vocType]);
        if ($xmlString === false) {
            $this->errors = "Fread error::Could not retrive RDF file!!";
            return;
        }

        $this->xml = new DOMDocument();
        $this->xml->loadXML($xmlString, LIBXML_NOBLANKS);
        $skos = $this->xml->getElementsByTagNameNS("*", "Concept");
        $ConceptScheme = $this->xml->getElementsByTagNameNS("*", "ConceptScheme");
        $vocName = "";
        for ($index = 0; $index < $ConceptScheme->length; $index++) {
            /* Retrive vocabolary title */
            $childs = $ConceptScheme->item($index)->childNodes;
            for ($indexx = 0; $indexx < $childs->length; $indexx++) {
                if ($childs->item($indexx)->nodeName === "dc:title") {
                    $vocName = $childs->item($indexx)->nodeValue;
                    break;
                }
            }
        }
        $localResult = explode("-", $vocName);
        $vocName = trim($localResult[count($localResult) - 1]);

        for ($index = 0; $index < $skos->length; $index++) {
            $dataValue = "";
            $dataName = "";
            /* Retrive vocabolary value */
            foreach ($skos->item($index)->attributes as $attribute) {
                if ($attribute->name === "about") {
                    $dataValue = preg_replace("/http:\/\//", "", $attribute->value);
                    break;
                }
            }
            /* Retrive vocabolary name */
            $childs = $skos->item($index)->childNodes;
            for ($indexx = 0; $indexx < $childs->length; $indexx++) {
                if ($childs->item($indexx)->nodeName === "skos:prefLabel") {
                    $dataName = $childs->item($indexx)->nodeValue;
                    break;
                }
            }
            /* Add element in data structure */
//            error_log(trim($dataName));
//            if ((trim($dataName) !== "") and (strstr($dataValue,"http://www.eagle-network.eu/voc/")))
            if ((trim($dataName) !== ""))
                $dataResult[] = array("vocLabel" => $dataName, "vocValue" => $dataValue);
        }
        return array_merge(array("vocName" => $vocName), $dataResult);
    }

    public function getErrror() {
        return (is_null($this->errors)) ? false : $this->errors;
    }

    public function getXmlResponse() {
        return $this->xml;
    }

    //array("vocLabel" => $dataName, "vocValue" => $dataValue)
    private function conceptNodeVocabularyParser($concept_simple_xml_child) {
        global $esiLogger;
        /* Check if this node is a Concept Node */
        if ($concept_simple_xml_child->getName() !== 'Concept')
            throw new localVocabularyParserException(sprintf(__('Invalid conceptNode! Node was %s', 'eagle-search'), $concept_simple_xml_child->getName()));
        /* Get Local VocURI */
        $voc = $this->getUriOnSkosNode($concept_simple_xml_child);
        /* Get all concept childs */
        $conceptRows = $concept_simple_xml_child->children('skos', TRUE);
//        try {
        /* Search label on concept childs */
        $label = $this->filterLabelByLanguage($conceptRows);
        /* Search for exactMatc */
        $conceptPerfectMatchChildsIndex = $this->conceptNodeHasExactMatch($conceptRows);
        if ($conceptPerfectMatchChildsIndex != -1) {
            /* HasExactMatch */
            try {
                $voc = $this->getUriOnSkosNode($conceptRows[$conceptPerfectMatchChildsIndex]);
                $perfectMatchConceptRows = $conceptRows[$conceptPerfectMatchChildsIndex]->children('skos', TRUE);
                $label = $this->filterLabelByLanguage($perfectMatchConceptRows);
            } catch (localVocabularyParserException $lvpEx) {
                $esiLogger->warning($lvpEx->getMessage());
            }
        }
        return array("vocLabel" => ucfirst($label), "vocValue" => $voc);
    }

    //array("vocLabel" => $dataName, "vocValue" => $dataValue)
    private function conceptSchemeVocabularyParser($concept_simple_xml_child) {
        global $esiLogger;
        /* Check if this node is a Concept Node */
        if ($concept_simple_xml_child->getName() !== 'ConceptScheme')
            throw new localVocabularyParserException(sprintf(__('Invalid ConceptScheme! Node was %s', 'eagle-search'), $concept_simple_xml_child->getName()));
        /* Get all ConceptScheme childs */
        $conceptSchemeRows = $concept_simple_xml_child->children('dc', TRUE);
        return (string) $conceptSchemeRows->title;
    }

    /* return -1 on not found exactMatch $childIndex if found */

    private function conceptNodeHasExactMatch($conceptChilds) {
        for ($i = 0; $i < count($conceptChilds); $i++) {
            if ($conceptChilds[$i]->getName() == "exactMatch")
                return $i;
        }
        return -1;
    }

    private function filterLabelByLanguage($conceptRows) {
        for ($i = 0; $i < count($conceptRows); $i++) {
            if (is_null($this->langiso)) {
                /* Get only prefLabel */
                if ($conceptRows[$i]->getName() == 'prefLabel') {
                    foreach ($conceptRows[$i]->attributes('xml', TRUE) as $attrName => $attrValue) {
                        if ($attrName == 'lang')
                            return ucfirst((string) $conceptRows[$i]);
                    }
                }
            }
            else if (in_array($conceptRows[$i]->getName(), localVocabularyParser::$SKOS_CONCEPT_CHILD_LANGUAGE_LABEL_ELEMENTS)) {
                foreach ($conceptRows[$i]->attributes('xml', TRUE) as $attrName => $attrValue) {
                    if ($attrName == 'lang' && $this->langiso == $attrValue) {
//                        $e=print_r($conceptRows[$i],true);
//                        var_export((string)$conceptRows[$i]);
//                        die();
                        return ucfirst((string) $conceptRows[$i]);
                    }
                }
            }
        }
        throw new localVocabularyParserException(sprintf(__('Language not found on concept childs! Lang Was %s', 'eagle-search'), $this->langiso));
    }

    private function getUriOnSkosNode($conceptNode) {
        foreach ($conceptNode->attributes('rdf', TRUE) as $attrName => $attrValue) {
            if ($attrName == 'about' && $this->matchEagleUrl($attrValue))
                return (string) $attrValue;
        }
        throw new localVocabularyParserException(__('Vocabulary URI not found!', 'eagle-search'));
    }

    private function matchEagleUrl($url) {
        return preg_match('/^(http):\/\/www.eagle-network.eu\/voc\/[A-Za-z0-9\/]/i', $url);
    }

}

?>