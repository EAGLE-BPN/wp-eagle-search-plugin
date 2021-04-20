<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of solrXmlRequestSimple
 *
 * @author Michele Del Giudice
 */
class solrXmlRequestSimple {

    private static $SOLR_REQUET_URL = "http://node0.d.eagle.research-infrastructures.eu:8080/is/mvc/index/EMF-index-cleaned/solr.do/select?q=";
    private $xml = null;
    private $errors = null;

    function __construct($query = "*") {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_URL, solrXmlRequestSimple::$SOLR_REQUET_URL . $query);
        $this->xml = curl_exec($ch);
        if ($this->xml === false) {
            $this->errors = "Curl Exec Error::Could not retrive XML file!!";
            return;
        }
        curl_close($ch);
    }

    public function getErrror() {
        return (is_null($this->errors)) ? false : $this->errors;
    }

    public function getXmlResponse() {
        return $this->xml;
    }

    /*Questa funzione restituisce il valore di $attributeName del tag $tagName dell'elemento eagle numero $elementListID  */
    public function getListInstanceFieldAttributeValue($elementListID, $tagName, $attributeName) {
        $xml = new DOMDocument();
        $xml->loadXML($this->xml, LIBXML_NOBLANKS);
        $doc = $xml->getElementsByTagName('doc');
        $sxml=new DOMDocument();
        $sxml->loadXML($doc->item($elementListID)->childNodes->item(2)->firstChild->textContent, LIBXML_NOBLANKS);
        foreach ($sxml->getElementsByTagName($tagName)->item(0)->attributes as $attribute) {
            if ($attribute->name === $attributeName)
                return $attribute->value;
        }
        return null;
    }

}

?>