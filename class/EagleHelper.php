<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Eagle;

/**
 * Description of EagleHelper
 *
 * @author mikidg1984
 */
class EagleHelper {

    public static function eagleResearchList2CSV($eagleResearch, $entity = 'artifact') {
        try {

            /* Make the solr Research */
            $ESJRFacilitator = new \Eagle\EagleSolrJsonResponseFacilitator($eagleResearch);

            /* set the filename */
            $csvFilename = $entity . '_' . md5($ESJRFacilitator->solrResponse);
            $csvFullpathFilename = ESI_CSV_BASE_PATH . $csvFilename . '.csv';
            /* search in cache if exists */
            if (!file_exists($csvFullpathFilename)) {
                $rows = $ESJRFacilitator->asObject->grouped->tmid->groups;
                if (empty($rows))
                    throw new EagleHelperException(__('No elements found!', 'eagle'));
                /* Open csv file */
                $csvFile = fopen($csvFullpathFilename, 'w');
                if ($csvFile == false)
                    throw new EagleHelperException(sprintf(__('Impossible to create file %s!', 'eagle'), $csvFullpathFilename));
//                $charset = 'UTF-8'; 
//                stream_encoding($csvFile, $charset);
                fputcsv($csvFile, array(
                    __('TITLE', 'eagle'),
                    __('HAS IMAGE', 'eagle'),
                    __('CONTENT PROVIDER', 'eagle'),
                    __('ANCIENT FIND SPOT', 'eagle'),
                    __('MODERN FIND SPOT', 'eagle'),
                    __('TEXT', 'eagle'),
                    __('DATE', 'eagle')
                ));
                foreach ($rows as $colIndex => $groupedElement) {
                    $cols = $groupedElement->doclist->docs;
                    if (empty($cols) AND $colIndex == 0)
                        throw new EagleHelperException(__('Found a grouped element with no elements!', 'eagle'));
                    foreach ($cols as $eagleStringElement) {
                        $parserType = '\Eagle\EagleParser' . ucfirst($entity);

                        $eagleElement = new $parserType($eagleStringElement->__result[0]);
                        $title = $eagleElement->directFieldGetter('title');
                        $hasImage = $eagleElement->directFieldGetter('has-image');
                        $contentProvider = $eagleElement->directFieldGetter('content-provider');
                        $ancientFindspot = array();

                        $tmpFindSpot = trim($eagleElement->directFieldGetter('roman-province-italic-region'));
                        if ($tmpFindSpot)
                            $ancientFindspot[] = $tmpFindSpot;
                        $tmpFindSpot = trim($eagleElement->directFieldGetter('ancient-findspot'));
                        if ($tmpFindSpot)
                            $ancientFindspot[] = $tmpFindSpot;

                        $modernFindspot = $eagleElement->directFieldGetter('modern-findspot');
                        $text = $eagleElement->directFieldGetter('text');
                        $date = $eagleElement->directFieldGetter('date');

                        fputcsv($csvFile, array(
                            $title,
                            $hasImage,
                            $contentProvider,
                            implode(',', $ancientFindspot),
                            $modernFindspot,
                            $text,
                            $date
                        ));
                    }
                }
                fclose($csvFile);
            }
            return ESI_CSV_BASE_URL . $csvFilename . '.csv';
        } catch (Eagle\EagleSolrResponseFacilitatorException $ex) {
            echo "###############################<br>######### EXCEPTION ############<br/>###############################<br>";
            var_dump($ex->getResponse());
        }
    }

    public static function dom2PDF($domString) {

        $htmlTempFilename = md5($domString) . '.html';
        $htmlTempFilenameFullPath = ESI_PDF_BASE_PATH . $htmlTempFilename;
        $pdfTempFilename = md5($domString) . '.pdf';
        $pdfTempFilenameFullPath = ESI_PDF_BASE_PATH . $pdfTempFilename;
        $domString = urldecode(base64_decode($domString));

        //throw new EagleHelperException('Impossible to create html DOM file');

        if (!file_exists($pdfTempFilenameFullPath)) {
            if (file_put_contents($htmlTempFilenameFullPath, $domString) === false) {
                throw new EagleHelperException('Impossible to create html DOM file');
            }
            $htmlPageUrl = ESI_PDF_BASE_URL . $htmlTempFilename;
            $eagleParams="--encoding windows-1250 --viewport-size 1920x1080";
            $command = "xvfb-run -a wkhtmltopdf $eagleParams $htmlPageUrl $pdfTempFilenameFullPath";
            exec($command);
            unlink($htmlTempFilenameFullPath);
        }

        return ESI_PDF_BASE_URL . $pdfTempFilename;
    }

}
