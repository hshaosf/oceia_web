<?php
namespace Drupal\ccsf_oceia\Controller;

use Drupal\Core\Controller\ControllerBase;

/**
 * Page controller.
 */
class OceiaController extends ControllerBase {

  /**
   * {@inheritdoc}
   */
  public function content($name='') {
    $vars = array(); 
    if(empty($name)){
      $current_path = \Drupal::service('path.current')->getPath();
      $name = trim($current_path, '/');
    }
    switch($name){
      case 'home' : 
        $vars['results'] = self::getResults(); 
        break;
    }
    return [
      '#theme' => 'page_content',
      '#page_name' => $name,
      '#page_vars' => $vars,
    ];
  }

  public static function get(...$input){
    $parts = explode('.', $input[0]); 
    if(count($parts) > 1){
      $method = 'get'.ucwords($parts[1]);
      if(method_exists(get_class(), $method)){
        array_shift($input);
        return self::$method(...$input); 
      } 
    }
    error_log(get_class().'.get:'.$input.'('.$method.') not found'); 
    return; 
  }

  protected static function getResults(){
    $results = array(); 
    $result_nodes = \Drupal::entityTypeManager()->getStorage('node')->loadByProperties(array('type' => 'result_page')); 
    $lang_code = \Drupal::service('language_manager')->getCurrentLanguage()->getId();

    foreach($result_nodes as $node){
      if($node->isPublished() || $node->access('create')){
        if($node->hasTranslation($lang_code)){
          $node = $node->getTranslation($lang_code); 
        }
        $nid = $node->id(); 
        $title = $node->get('title')->value;
        $title_short = $node->get('field_title_short')->value;
        $url = $node->url();
        $cta_class = $node->get('field_css_class_1')->value;
        $fa_icon = $node->get('field_css_class_2')->value;
        $results[] = array('nid'=>$nid, 'title'=>$title, 'title_short'=>$title_short, 'url'=>$url, 'cta_class'=>$cta_class, 'fa_icon'=>$fa_icon); 
      }
    }
    return $results; 
  }

  protected static function getLanguages(){
    $lang_terms = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree('language_services', 0, 1); 
    return $lang_terms; 
  }

  protected static function getResources($node){ 
    $resources = \Drupal::entityTypeManager()->getStorage('node')->loadByProperties(array('type' => 'resources', 'field_results' => $node->id())); 
    usort($resources, function($a, $b){ return strcmp($a->get('title')->value, $b->get('title')->value); }); 
    $view_resources = array();
    foreach ($resources as $node) {
      if($node->isPublished() || $node->access('create')){
        $view_resources[] = \Drupal::entityTypeManager()->getViewBuilder('node')->view($node, 'full');
      }    
    }
    return $view_resources;
  }


}