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

  public static function get($input){
    $parts = explode('.', $input); 
    if(count($parts) > 1){
      $method = 'get'.ucwords($parts[1]);
      if(method_exists(get_class(), $method)){
        return self::$method(); 
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
        $url = $node->url();
        $results[] = array_merge(array('nid'=>$nid, 'title'=>$title, 'url'=>$url), self::getResultExtra($nid)); 
      }
    }
    return $results; 
  }

  protected static function getResultExtra($nid){
    $extra = array(); 
    switch($nid){
      case 19 : default : 
        $extra['cta_class'] = 'bg-primary-tint';
        $extra['fa_icon'] = 'fa-id-card-o';
        break;
    }
    return $extra; 
  }



}