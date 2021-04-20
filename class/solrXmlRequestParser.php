<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of solrXmlRequestParser
 *
 * @author Michele Del Giudice
 */
class localXmlRequest {

    private $xml = null;
    //private $xsd=null;
    private $errors = null;
    private $eagleObjects = Array();
    private $page = 0;
    private $elements = 0;

    function __construct($xmlFilePath,$page=0) {
//        $fp=fopen($xmlFilePath, "r");
//        fre
        $xmlString=file_get_contents($xmlFilePath);
        $xml = new DOMDocument();
        
        if ($xmlString===false) {
            $this->errors = "Fread error::Could not retrive XML file!!";
            return;
        }
        $xml->loadXML($xmlString, LIBXML_NOBLANKS);
        $result = $xml->getElementsByTagName('result');
        $this->page = $result->item(0)->getAttribute('start');
        $this->elements = $result->item(0)->getAttribute('numFound');
        $eagleObjects = $xml->getElementsByTagName('arr');
        foreach ($eagleObjects as $node) {
            foreach ($node->attributes as $attribute) {
                if ($attribute->value === "__result") {
                    $sxml = simplexml_load_string($node->firstChild->textContent);
                    $this->eagleObjects[] = $sxml;
                }
            }
        }
    }

    public function getErrror() {
        return (is_null($this->errors)) ? false : $this->errors;
    }

    public function getXmlResponse() {
        return $this->xml;
    }

    public function getEagleList() {
        return $this->eagleObjects;
    }

    public function getCurrentPage() {
        return ($this->page%10>0)?((int)($this->page/10))+1:(int)($this->page/10);
    }

    public function getStartElement() {
        return $this->page;
    }

    public function getElementNumber() {
        return $this->elements;
    }

}
?>