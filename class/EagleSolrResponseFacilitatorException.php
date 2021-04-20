<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Eagle;

/**
 * Description of EagleSolrResponseFacilitatorException
 *
 * @author mikidg1984
 */
class EagleSolrResponseFacilitatorException extends \Exception {
    
    private $response;
    
    public function __construct($message, $code = 0, Exception $previous = null,$response) {
        parent::__construct($message, $code, $previous);
        $this->response=$response;
    }
    
    public function getResponse(){
        return $this->response;
    }

    public function __toString() {
        return __CLASS__ . ": [{$this->code}]: {$this->message}\n";
    }
}
