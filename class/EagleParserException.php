<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Eagle;

/**
 * Description of EagleParserException
 *
 * @author mikidg1984
 */
class EagleParserException extends \Exception {
    
    private $xmlString;
    
    public function __construct($message, $code = 0, Exception $previous = null,$xmlString) {
        parent::__construct($message, $code, $previous);
        $this->xmlString=$xmlString;
    }
    
    public function getXMLString(){
        return $this->xmlString;
    }

    public function __toString() {
        return __CLASS__ . ": [{$this->code}]: {$this->message}\n";
    }
}
