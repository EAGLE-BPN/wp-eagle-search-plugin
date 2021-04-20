<?php
require_once __DIR__ . '/class/localVocabularyParser.php';

//error handler function
function customError($errno, $errstr) {
  echo "<b>Error:</b> [$errno] $errstr";
}

//set error handler
set_error_handler("customError");


$filePath=$_SERVER['DOCUMENT_ROOT'] . "/repository/epidocupconversion/allinone/eagle-vocabulary-material.rdf";
$myfile = fopen($filePath, "r"); //or die(sprintf("Unable to open file----> %s",$_SERVER['DOCUMENT_ROOT'] . "/repository/epidocupconversion/allinone/eagle-vocabulary-material.rdf"));
if($myfile===false)
exit;
$xmlString=fread($myfile,filesize($filePath));
fclose($myfile);
die("OK!");
