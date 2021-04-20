<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Eagle;

/**
 * Description of EagleParserArtifact
 *
 * @author mikidg1984
 */
class EagleParserArtifact extends EagleParser {

    public static $FIELD_NAME_2_XPATH = array(
        'has-image' =>
        array(
            'path' => 'metadata/eagleObject/artifact/hasVisualRepresentation',
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
            'path' => 'metadata/eagleObject/artifact/findingSpot/ancientFindSpot',
            'attributes' => array(),
            'options' => array()
        ),
        'roman-province-italic-region'=>
        array(
            'path' => 'metadata/eagleObject/artifact/findingSpot/romanProvinceItalicRegion',
            'attributes' => array(),
            'options' => array()
        ),
        'modern-findspot' =>
        array(
            'path' => 'metadata/eagleObject/artifact/findingSpot/modernFindSpot',
            'attributes' => array(),
            'options' => array()
        ),
        'text' =>
        array(
            'path' => 'metadata/eagleObject/artifact/inscription/hasTranscription/text',
            'attributes' => array(),
            'options' => array()
        ),
        'date' =>
        array(
            'path' => 'metadata/eagleObject/artifact/originDating',
            'attributes' => array(),
            'options' => array()
        )
    );

    public function directFieldGetter($field_name) {
        $fieldPath = EagleParserArtifact::$FIELD_NAME_2_XPATH[$field_name]['path'];
        $fieldAttribs = EagleParserArtifact::$FIELD_NAME_2_XPATH[$field_name]['attributes'];
        $fieldOptions = EagleParserArtifact::$FIELD_NAME_2_XPATH[$field_name]['options'];
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
