<?php

$uploads = wp_upload_dir();

define('ESI_VERSION', '0.1');
define('ESI_DS', '/');
define('ESI_PLUGIN', __FILE__);
define('ESI_PLUGIN_BASENAME', plugin_basename(ESI_PLUGIN));
define('ESI_PLUGIN_BASE_URL', plugins_url(ESI_DS, ESI_PLUGIN));
define('ESI_PLUGIN_BASE_PATH', dirname(ESI_PLUGIN));
define('ESI_PLUGIN_NAME', trim(dirname(ESI_PLUGIN_BASENAME), '/'));
define('ESI_PLUGIN_DIR', untrailingslashit(dirname(ESI_PLUGIN_NAME)));
define('ESI_LOG_FILE', ESI_DS . 'var' . ESI_DS . 'log' . ESI_DS . 'eagle' . ESI_DS . ESI_PLUGIN_NAME . '.log');
define('ESI_LANGUAGES_BASE_PATH', dirname(plugin_basename(__FILE__)) . '/languages/');
define('ESI_DEBUG', 0);
define('ESI_VENDOR', ESI_PLUGIN_BASE_PATH . ESI_DS . 'vendor' . ESI_DS);
define('ESI_AUTOLOAD', ESI_VENDOR . 'autoload.php');
define('ESI_PDF_BASE_PATH', $uploads['basedir'] . ESI_DS . 'pdf' . ESI_DS);
define('ESI_PDF_BASE_URL', $uploads['baseurl'] . ESI_DS . 'pdf' . ESI_DS);
define('ESI_CSV_BASE_PATH', $uploads['basedir'] . ESI_DS . 'csv' . ESI_DS);
define('ESI_CSV_BASE_URL', $uploads['baseurl'] . ESI_DS . 'csv' . ESI_DS);
define('ESI_LAYOUTS', ESI_PLUGIN_BASE_PATH . ESI_DS . 'layouts' . ESI_DS);



define('ESI_ENTITY_TYPE_ARTIFACT', 'artifact');
define('ESI_ENTITY_TYPE_DOCUMENTAL', 'documental');
define('ESI_ENTITY_TYPE_IMAGE', 'visual');

require_once ESI_PLUGIN_BASE_PATH . ESI_DS . 'class/MyLogPHP.php';
require_once ESI_PLUGIN_BASE_PATH . ESI_DS . 'class/localVocabularyParser.php';
require_once ESI_PLUGIN_BASE_PATH . ESI_DS . 'class/localVocabularyParserException.php';
/* New Parser Class */
require_once ESI_PLUGIN_BASE_PATH . ESI_DS . 'class/EagleHelper.php';
require_once ESI_PLUGIN_BASE_PATH . ESI_DS . 'class/EagleHelperException.php';
require_once ESI_PLUGIN_BASE_PATH . ESI_DS . 'class/EagleParser.php';
require_once ESI_PLUGIN_BASE_PATH . ESI_DS . 'class/EagleParserArtifact.php';
require_once ESI_PLUGIN_BASE_PATH . ESI_DS . 'class/EagleParserVisual.php';
require_once ESI_PLUGIN_BASE_PATH . ESI_DS . 'class/EagleParserDocumental.php';
require_once ESI_PLUGIN_BASE_PATH . ESI_DS . 'class/EagleParserException.php';
require_once ESI_PLUGIN_BASE_PATH . ESI_DS . 'class/EagleSolrResponseFacilitator.php';
require_once ESI_PLUGIN_BASE_PATH . ESI_DS . 'class/EagleSolrResponseFacilitatorException.php';
//require ESI_AUTOLOAD;

global $languages;
$languages[] = ['name' => 'Latin', 'iso' => 'la'];
$languages[] = ['name' => 'German', 'iso' => 'de'];
$languages[] = ['name' => 'Italian', 'iso' => 'it'];
$languages[] = ['name' => 'French', 'iso' => 'fr'];
$languages[] = ['name' => 'Hebrew', 'iso' => 'he'];
$languages[] = ['name' => 'Spanish', 'iso' => 'es'];
$languages[] = ['name' => 'English', 'iso' => 'en'];
$languages[] = ['name' => 'Hungarian', 'iso' => 'hu'];
$languages[] = ['name' => 'Greek', 'iso' => 'el'];
$languages[] = ['name' => 'Arabic', 'iso' => 'ar'];
$languages[] = ['name' => 'Bulgarian', 'iso' => 'bg'];
$languages[] = ['name' => 'Turkish', 'iso' => 'tr'];

/* Init Logger */
global $esiLogger;
if (!isset($esiLogger))
    $esiLogger = new MyLogPHP(ESI_LOG_FILE);

//require_once ESI_PLUGIN_BASE_PATH .MBB_DS.'class/MBBCategory.php';
//require_once MBB_PLUGIN_BASE_PATH .MBB_DS.'class/MBBHelper.php';
//require_once WPWBCL_PLUGIN_BASE_PATH .WPWBCL_DS.'class/WBCLUser.php';
//require_once WPWBCL_PLUGIN_BASE_PATH .WPWBCL_DS.'class/WBCLDevice.php';
//require_once WPWBCL_PLUGIN_BASE_PATH .WPWBCL_DS.'class/WBCLProduct.php';



