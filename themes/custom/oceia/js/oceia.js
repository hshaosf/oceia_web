"use strict";
(function(_w, _d, $, _v){
  var cmn = {
    supportLocalStorage : function(){ return (_w.localStorage!=undefined); },
    setItem : function(key,value){ if(this.supportLocalStorage()){_w.localStorage.setItem(key,value);return true;}return false;},
    getItem : function(key){if(this.supportLocalStorage()){ return _w.localStorage.getItem(key);}return null;},
    setItemObj : function(key,value){return setItem(key,JSON.stringify(value));},
    getItemObj : function(key){var o = getItem(key); if(o){o=JSON.parse(o);} return o;},
    removeItem : function(key){if(this.supportLocalStorage()){return _w.localStorage.removeItem(key);}return false;},
    clearStorage : function(){ if(this.supportLocalStorage()){return _w.localStorage.clear();}return false;},
    set : function(key,value){ _v[key] = value;},
    get : function(key){return _v[key];},
  }
  var oceia = {
    msg : {
      clear : function(){
        $('.oceia-message').remove();
      },
      display : function(m, el){
        el = el?el:$('#main-content');
        el.after('<div class="message is-reserved oceia-message"><span class="message-text">'+(m?m:'Error')+'</span></div>'); 
      }
    },
    qs : function(){
      var _t = this, hide = function(){$('.question').hide(); }
      $('.question button[data-next]').click(function(e){
        var el = $(this), name = el.data('name'), next = el.data('next'), value = false; 
        _t.msg.clear();
        
        if(name){
          var selected = [], input = $('.question *[name="'+name+'"]');
          if(input.length){ 
            if(input.attr('type')=='checkbox' || input.attr('type')=='radio'){
              input.map(function(i,e){
                if($(e).is(':checked')){ 
                  value = $(e).val();
                  selected.push($(e).val())
                }}); 
            }else{
              value = input.val();
              selected.push(input.val());
            }
            if(!selected.length){
              _t.msg.display((el.data('error')?el.data('error'):'Required'),el.closest('.question').find('div:not(.form-back)').first());
              return;
            }
          }
        }

        if(next){ 
          next = (next=='value' && value !== false)?value:next;
          if($('#'+next).length){
            hide(); $('#'+next).show(); 
          }else{
            if(next){
              _w.location.href=next;
            } 
          }
          return; 
        }
      }); 

      $('.question .form-back a').click(function(e){
        e.preventDefault(); 
        var el = $(this), back = el.data('href');
        if($('#'+back).length){
          hide(); $('#'+back).show(); 
        }
      });
      return this; 
    },
    toggles : function(){
      var _t = this, 
          hide =  function(el, elToggle, text){
            el.text(text);
            elToggle.hide(); 
          },
          show = function(el, elToggle, text){
            el.text(text);
            elToggle.show(); 
          }; 
      $('button[data-toggle]').each(function(i){
        var el = $(this);
        hide(el, $('#'+el.data('toggle')), el.data('hidden')); 
      });
      $('button[data-toggle]').click(function(e){
        e.preventDefault();
        var el = $(this), elToggle = $('#'+el.data('toggle')); 
        if(elToggle.is(':visible')){
          hide(el, elToggle, el.data('hidden')); 
        }else{
          show(el, elToggle, el.data('shown')); 
        }

      });
      return this; 
    },
    menu : function(){
      $('nav.top-bar button.button-link').click(function(e){
        e.preventDefault();
        $('.nav-mobile_container').removeClass('hidden');
      }); 
      $('.nav-mobile_container button.nav-mobile_menu-icon').click(function(e){
        e.preventDefault();
        $('.nav-mobile_container').addClass('hidden');
      }); 
      return this; 
    },
    ready : function(){ 
      console.log('ready');
      this.menu().qs().toggles(); 
    }
  }; 
  $(document).ready(function(){oceia.ready()});
})(window, document, jQuery, {});