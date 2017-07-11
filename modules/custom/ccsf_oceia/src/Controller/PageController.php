<?php
namespace Drupal\ccsf_oceia\Controller;

use Drupal\Core\Controller\ControllerBase;

/**
 * Page controller.
 */
class PageController extends ControllerBase {

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
        $vars['results'] = $this->getResults(); 
        break;
    }
    return [
      '#theme' => 'page_content',
      '#page_name' => $name,
      '#page_vars' => $vars,
    ];
  }

  protected function getResults(){
    $results = array(); 
    $result_nodes = \Drupal::entityTypeManager()->getStorage('node')->loadByProperties(array('type' => 'result_page')); 
    $lang_code = \Drupal::service('language_manager')->getCurrentLanguage()->getId();

    foreach($result_nodes as $node){
      if($node->isPublished() || $node->access('create')){
        if($node->hasTranslation($lang_code)){
          $node = $node->getTranslation($lang_code); 
        }
        $title = $node->get('title')->value;
        $url = $node->url();
        $results[] = array('title'=>$title, 'url'=>$url); 
      }
    }
    return $results; 
  }

}