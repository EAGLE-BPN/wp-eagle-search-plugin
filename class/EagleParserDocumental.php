<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Eagle;

/**
 * Description of EagleParserDocumental
 *
 * @author mikidg1984
 */
class EagleParserDocumental extends EagleParser {

    public static $FIELD_NAME_2_XPATH = array(
        'has-image' =>
        array(
            'path' => 'metadata/eagleObject/documentalManifestation/hasVisualRepresentation/url',
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
            'path' => 'metadata/eagleObject/documentalManifestation/hasArtifact/findingSpot/ancientFindSpot',
            'attributes' => array(),
            'options' => array()
        ),
        'roman-province-italic-region'=>
        array(
            'path' => 'metadata/eagleObject/documentalManifestation/hasArtifact/findingSpot/romanProvinceItalicRegion',
            'attributes' => array(),
            'options' => array()
        ),
        'modern-findspot' =>
        array(
            'path' => 'metadata/eagleObject/documentalManifestation/hasArtifact/findingSpot/modernFindSpot',
            'attributes' => array(),
            'options' => array()
        ),
        'text' =>
        array(
            'path' => 'metadata/eagleObject/documentalManifestation/transcription/text',
            'attributes' => array(),
            'options' => array()
        ),
        'date' =>
        array(
            'path' => 'metadata/eagleObject/documentalManifestation/hasArtifact/originDating',
            'attributes' => array(),
            'options' => array()
        )
    );

    public function directFieldGetter($field_name) {
        $fieldPath = EagleParserDocumental::$FIELD_NAME_2_XPATH[$field_name]['path'];
        $fieldAttribs = EagleParserDocumental::$FIELD_NAME_2_XPATH[$field_name]['attributes'];
        $fieldOptions = EagleParserDocumental::$FIELD_NAME_2_XPATH[$field_name]['options'];
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
