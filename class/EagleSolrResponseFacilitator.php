<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Eagle;

/**
 * Description of EagleSolrJsonResponseFacilitator
 *
 * @author mikidg1984
 */
class EagleSolrJsonResponseFacilitator {
    /* Solr Http response */

    private $solrResponse;
    private $asObject;

    public function __construct($solrResponse) {
        $this->asObject = json_decode($solrResponse);
        if (json_last_error() != JSON_ERROR_NONE)
            throw new EagleSolrResponseFacilitatorException(__('Solr JSON Response is not on json format!', 'eagle'), 1, null, $solrResponse);
        $this->solrResponse = $solrResponse;
        
    }

    public function __get($property) {
        if (!property_exists($this, $property)) {
            $solrResponseNode=$this->asObject->{$property};
            if (is_null($solrResponseNode))
                throw new EagleSolrResponseFacilitatorException(__("Property $property not Found!", 'eagle'), 4, null, $solrResponse);
            return $solrResponseNode;
        }
        return $this->{$property};
    }

}
