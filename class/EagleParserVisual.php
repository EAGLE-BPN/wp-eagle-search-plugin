<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Eagle;

/**
 * Description of EagleParserVisual
 *
 * @author mikidg1984
 */
class EagleParserVisual extends EagleParser {

    public static $FIELD_NAME_2_XPATH = array(
        'has-image' =>
        array(
            'path' => 'metadata/eagleObject/visualRepresentation/url',
            'attributes' => array(),
            'options' => array('exist')
        ),
        'title' =>
        array(
            'path' => 'metadata/eagleObject/title',
            'attributes' => array(),
            'options' => array(),
        ),
        'content-provider' =>
        array(
            'path' => 'metadata/eagleObject/recordSourceInfo',
            'attributes' => array('providerAcronym', 'providerName'),
            'options' => array()
        ),
        'ancient-findspot' =>
        array(
            'path' => 'metadata/eagleObject/visualRepresentation/hasArtifact/findingSpot/ancientFindSpot',
            'attributes' => array(),
            'options' => array()
        ),
        'roman-province-italic-region'=>
        array(
            'path' => 'metadata/eagleObject/visualRepresentation/hasArtifact/findingSpot/romanProvinceItalicRegion',
            'attributes' => array(),
            'options' => array()
        ),
        'modern-findspot' =>
        array(
            'path' => 'metadata/eagleObject/visualRepresentation/hasArtifact/findingSpot/modernFindSpot',
            'attributes' => array(),
            'options' => array()
        ),
        'text' =>
        array(
            'path' => 'metadata/eagleObject/visualRepresentation/hasTranscription/text',
            'attributes' => array(),
            'options' => array()
        ),
        'date' =>
        array(
            'path' => 'metadata/eagleObject/visualRepresentation/hasArtifact/originDating',
            'attributes' => array(),
            'options' => array()
        )
    );

    public function directFieldGetter($field_name) {
        $fieldPath = EagleParserVisual::$FIELD_NAME_2_XPATH[$field_name]['path'];
        $fieldAttribs = EagleParserVisual::$FIELD_NAME_2_XPATH[$field_name]['attributes'];
        $fieldOptions = EagleParserVisual::$FIELD_NAME_2_XPATH[$field_name]['options'];
        try {
            $parsedField = $this->EXPath($fieldPath,$fieldOptions,$fieldAttribs);
            if (is_array($parsedField)) {
                return implode(' - ', $parsedField);
            }
            return $parsedField;
        } catch (EagleParserException $exc) {
            return '';
        }
    }

}
