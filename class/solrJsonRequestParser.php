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
class solrJsonRequestParser {

    private static $SOLR_REQUET_URL = "http://node0.d.eagle.research-infrastructures.eu:8080/is/mvc/index/EMF-index-cleaned/solr.do/select?q=";
    //private static $XSD_REQUEST_URL = "http://svn-public.driver.research-infrastructures.eu/driver/dnet-spring4/modules/dnet-eagle-workflows/trunk/src/main/resources/eu/dnetlib/msro/eagle/eagle%20schema/EAGLE%20schema%20(EMF).xsd";
    private $xml = null;
    //private $xsd=null;
    private $errors = null;
//    private $eagleObjects = Array();
//    private $page = 0;
//    private $elements = 0;

    function __construct($query = "*") {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_URL, solrJsonRequestParser::$SOLR_REQUET_URL . $query);
        $this->xml = curl_exec($ch);
        if ($this->xml===false) {
            $this->errors = "Curl Exec Error::Could not retrive JSON from SOLR!!";
            return;
        }
        curl_close($ch);
//        $xml->loadXML($this->xml, LIBXML_NOBLANKS);
//        $result = $xml->getElementsByTagName('result');
//        $this->page = $result->item(0)->getAttribute('start');
//        $this->elements = $result->item(0)->getAttribute('numFound');
//        $eagleObjects = $xml->getElementsByTagName('arr');
//        foreach ($eagleObjects as $node) {
//            foreach ($node->attributes as $attribute) {
//                if ($attribute->value === "__result") {
//                    $sxml = simplexml_load_string($node->firstChild->textContent);
//                    $this->eagleObjects[] = $sxml;
//                }
//            }
//        }
    }

    public function getErrror() {
        return (is_null($this->errors)) ? false : $this->errors;
    }

    public function getJsonResponse() {
        return $this->xml;
    }
//
//    public function getEagleList() {
//        return $this->eagleObjects;
//    }
//
//    public function getCurrentPage() {
//        return ($this->page%10>0)?((int)($this->page/10))+1:(int)($this->page/10);
//    }
//
//    public function getStartElement() {
//        return $this->page;
//    }
//
//    public function getElementNumber() {
//        return $this->elements;
//    }

//    public function getArtifactInfo() {
//        $eObj = $this->eagleObjects[0]->metadata->eagleObject->artifact;
////        var_dump($this->eagleObjects); die();
//        $result = '<fieldset class="es-fieldset"><legend>Artifact</legend>';
//        $result.='<label class="label">artifactType</label><span class="value"> ' . $eObj->artifactType . '</span><br/>';
//        $result.='<label class="label">monumentType</label><span class="value"> ' . $eObj->monumentType . '</span><br/>';
//        $result.='<label class="label">material</label><span class="value"> ' . $eObj->material . '</span><br/>';
//        $attr = "";
//
//        foreach ($eObj->dimensions->attributes() as $a => $b) {
//            $attr.=$a . '=' . $b;
//        }
//        $result.='<fieldset><legend>dimensions ' . $attr . '</legend>';
//        $result.='<label class="label">width</label><span class="value"> ' . $eObj->dimensions->width . '</span><br/>';
//        $result.='<label class="label">height</label><span class="value"> ' . $eObj->dimensions->height . '</span><br/>';
//        $result.='<label class="label">depth</label><span class="value"> ' . $eObj->dimensions->depth . '</span>';
//        $result.='</fieldset><br/><br/>';
//        $result.='<label class="label">decoration</label><span class="value"> ' . $eObj->decoration . '</span><br/>';
//        $result.='<label class="label">stateOfPreservation</label><span class="value"> ' . $eObj->stateOfPreservation . '</span><br/>';
//        $result.='<label class="label">originDating</label><span class="value"> ' . $eObj->originDating . '</span><br/>';
//        $result.='<label class="label">yearOfFinding</label><span class="value"> ' . $eObj->yearOfFinding . '</span><br/>';
//
//        $result.='<fieldset><legend>findingSpot</legend>';
//        $result.='<label class="label">romanProvinceItalicRegion</label><span class="value"> ' . $eObj->findingSpot->romanProvinceItalicRegion . '</span><br/>';
//        $result.='<label class="label">ancientFindSpot</label><span class="value"> ' . $eObj->findingSpot->ancientFindSpot . '</span><br/>';
//        $result.='<label class="label">modernFindSpot</label><span class="value"> ' . $eObj->findingSpot->modernFindSpot . '</span><br/>';
//        $result.='<label class="label">modernCountry</label><span class="value"> ' . $eObj->findingSpot->modernCountry . '</span><br/>';
//        $result.='<label class="label">modernRegion</label><span class="value"> ' . $eObj->findingSpot->modernRegion . '</span><br/>';
//        $result.='<label class="label">modernProvince</label><span class="value"> ' . $eObj->findingSpot->modernProvince . '</span>';
//        $result.='</fieldset><br/><br/>';
//
//        $result.='<fieldset><legend>conservationPlace</legend>';
//        $result.='<label class="label">conservationCountry</label><span class="value"> ' . $eObj->conservationPlace->conservationCountry . '</span><br/>';
//        $result.='<label class="label">conservationRegion</label><span class="value"> ' . $eObj->conservationPlace->conservationRegion . '</span><br/>';
//        $result.='<label class="label">conservationCity</label><span class="value"> ' . $eObj->conservationPlace->conservationCity . '</span><br/>';
//        $result.='<label class="label">museum</label><span class="value"> ' . $eObj->conservationPlace->museum . '</span><br/>';
//        $result.='<label class="label">position</label><span class="value"> ' . $eObj->conservationPlace->position . '</span><br/>';
//        $result.='<label class="label">inventoryNumber</label><span class="value"> ' . $eObj->conservationPlace->inventoryNumber . '</span>';
//        $result.='</fieldset><br/><br/>';
//
//        $result.='<fieldset><legend>inscription</legend>';
//        $result.='<label class="label">refersTrismegistosCard</label><span class="value"> ' . $eObj->inscription->refersTrismegistosCard . '</span><br/>';
//        $result.='<label class="label">inscriptionType</label><span class="value"> ' . $eObj->inscription->inscriptionType . '</span><br/>';
//        $result.='<label class="label">engravingTechnique</label><span class="value"> ' . $eObj->inscription->engravingTechnique . '</span><br/>';
//        $result.='<label class="label">metre</label><span class="value"> ' . $eObj->inscription->metre . '</span><br/>';
//        $attr = "";
//        foreach ($eObj->inscription->fieldSize[0]->attributes() as $a => $b) {
//            $attr.=$a . '=' . $b;
//        }
//        $result.='<fieldset><legend>fieldSize ' . $attr . '</legend>';
//        $result.='<label class="label">width</label><span class="value"> ' . $eObj->inscription->fieldSize->width . '</span><br/>';
//        $result.='<label class="label">height</label><span class="value"> ' . $eObj->inscription->fieldSize->height . '</span>';
//        $result.='</fieldset><br/><br/>';
//
//        $result.='<label class="label">paleographicCharacteristics</label><span class="value"> ' . $eObj->inscription->paleographicCharacteristics . '</span><br/>';
//        $attr = "";
//        foreach ($eObj->inscription->letterSize[0]->attributes() as $a => $b) {
//            $attr.=$a . '=' . $b;
//        }
//        $result.='<fieldset><legend>letterSize ' . $attr . '</legend>';
//        $result.='<label class="label">width</label><span class="value">' . $eObj->inscription->letterSize->width . '</span><br/>';
//        $result.='<label class="label">height</label><span class="value">' . $eObj->inscription->letterSize->height . '</span>';
//        $result.='</fieldset><br/><br/>';
//
//        $result.='<label class="label">hasTranslation</label><span class="value">' . $eObj->inscription->hasTranslation . '</span><br/>';
//        $result.='<label class="label">hasTranscription</label><span class="value">' . $eObj->inscription->hasTranscription . '</span>';
//
//
//        $result.='</fieldset>';
//        $result.='</fieldset>';
//        return $result;
//    }

}

?>
