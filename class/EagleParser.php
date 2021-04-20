<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Eagle;

/**
 * Description of EagleParser
 *
 * @author mikidg1984
 */
abstract class EagleParser {
    /* SimpleXMLElement */

    private $xml;

    /* XML Base String */
    private $xmlString;

    /* XML AS Json */
    private $asJson;

    /* XML AS Array */
    private $asArray;

    abstract function directFieldGetter($field_name);

    public function __construct($xmlString) {
        //$xml = new \SimpleXMLElement($xmlString);
        $xml = simplexml_load_string($xmlString);
        if ($xml === false)
            throw new EagleParserException(__('XML String malformed!', 'eagle'), 1, null, $xmlString);

        $this->xml = $xml;
        $this->xmlString = $xmlString;
    }

    public function __get($property) {
        if (!property_exists($this, $property)) {
            $eagleNode = $this->xml->{$property};
            if (is_null($eagleNode))
                throw new EagleParserException(__("Property $property not Found!", 'eagle'), 4, null, $this->xmlString);
            return $eagleNode;
        }
        if (is_null($this->{$property})) {
            return $this->get{$property}();
        }
        return $this->{$property};
    }

    public function getasArray() {
        if (is_null($this->asArray)) {
            $this->toArrayFormat();
        }
        return $this->asArray;
    }

    public function getasJson() {
        if (is_null($this->asJson)) {
            $this->toJsonFormat();
        }
        return $this->asJson;
    }

    protected function toArrayFormat() {
        $xmlAsArray = json_decode($this->getasJson(), TRUE);
        if (is_null($xmlAsArray))
            throw new EagleParserException(__('XML JSON to Array failed!', 'eagle'), 2, null, $this->xmlString);
        $this->asArray = $xmlAsArray;
        return $this->asArray;
    }

    protected function toJsonFormat() {
        $xmlAsJson = json_encode($this->xml);
        if ($xmlAsJson === false)
            throw new EagleParserException(__('XML JSON Encode failed!', 'eagle'), 3, null, $this->xmlString);
        $this->asJson = $xmlAsJson;
        return $this->asJson;
    }

    protected function EXPath($fieldPath, $options = array(), $attributes = array()) {
        $tempElement = $this->xml;
        $pathArray = explode('/', $fieldPath);
        foreach ($pathArray as $path) {
            $tempElement = $tempElement->{$path};
        }
        if (!is_null($tempElement)) {
            if (in_array('exist', $options))
                return __('YES', 'eagle');
            /* Il nodo cercato esiste */
            if (!empty($attributes)) {
                $result = array();
                /* Search on node attributes */
                foreach ($attributes as $attribute) {
                    $result[] = $tempElement[$attribute];
                }
                return $result;
            }
            return $tempElement->__toString();
        }
        if (in_array('exist', $options))
            return __('NO', 'eagle');
        throw new EagleParserException(sprintf(__('Searching for path "%s" but it was not found and $options exist key not present!', 'eagle'), $fieldPath), 3, null, $this->xmlString);
    }

}
