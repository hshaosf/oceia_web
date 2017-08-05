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
    supportHistory : function(){ 
      return (this.supportLocalStorage() && history.pushState);
    },
    pushHistory : function(state, title, url){ 
      if(this.supportHistory()){ 
        if(!title){ title = _d.title; }
        history.pushState(state, title, url); 
      }}
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
    qs : {
      init : function(){
        var _t = this, _o = oceia;
        _t.first = $('.question:first').attr('id');
        $('.question button[data-next]').click(function(e){
          var el = $(this), name = el.data('name'), next = el.data('next'), value = false; 
          _o.msg.clear();
          
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
                _o.msg.display((el.data('error')?el.data('error'):'Required'),el.closest('.question').find('div:not(.form-back)').first());
                return;
              }
            }
          }

          if(next){ 
            next = (next=='value' && value !== false)?value:next;
            if(next.substring(0,1).match(/[a-zA-Z]/) && $('#'+next).length){
              _t.goto(next);
            }else{
              if(next){
                _t.setLast(_t.current);
                _w.location.href=next;
              } 
            }
            return; 
          }
        }); 

        $('.question .form-back a').click(function(e){
          e.preventDefault(); 
          var el = $(this), back = el.data('href');
          _t.goto(back, true);
        });

        if(cmn.supportHistory() && _t.getLast()){
          _t.load(_t.getLast())
        }

      },
      hide : function(){
        $('.question').hide();
      },
      push : function(q){
        cmn.pushHistory({oceia_qs:q});
      },
      goto : function(p, is_back){
        var _t = this;
        if($('#'+p).length){
            if(!is_back && cmn.supportHistory()){
              _t.push(p); 
              _t.current = p;
            }
            if(is_back && cmn.supportHistory()){
              history.back();
            }else{
              _t.load(p);
            }
            
            return true;
        }
        return false;
      },
      loadState : function(e){
        var s = this.first;
        if(e && e.oceia_qs){
          s = e.oceia_qs;
        }
        this.load(s);
      },
      load : function(p){
        if($('#'+p).length){
          this.hide(); $('#'+p).show();
        }
      },
      setLast : function(l){
        if(cmn.supportHistory){
          cmn.setItem('last_qs', l);
        }
      },
      getLast : function(){
        return cmn.getItem('last_qs');
      },
      clearLast : function(){
        cmn.setItem('last_qs', '');
      }
    },
    checkbox : function(id, item, field, alert){
      var el = $('#'+id),
        refresh = function(el){
          $(alert).hide();
          if(boxes.length){
            var checked = boxes.filter(':checked'),checked_values=[],match=0; 
            if(checked.length){
              checked.each(function(i,e){checked_values.push($(e).val());})
              $(item).each(function(i,e){var s=$(e).find(field).filter(function(j,f){return $.inArray($(f).data('value')+'',checked_values)>-1;}); if(s.length){$(e).slideDown();match+=1;}else{$(e).slideUp();}}); 
              if(!match){
                $(alert).show();
                $(item).slideDown();
              }
            }else{
              $(item).slideDown(); 
            }
          }
        }
      ; 
      if(el.length){
        var boxes = el.find('input[type="checkbox"]'); 
        var clear = el.find('.toggle-clear');
        if(boxes.length){
          boxes.click(function(e){
            refresh();
          });
          if(clear.length){
            clear.click(function(e){
              e.preventDefault();
              boxes.prop('checked', false); 
              refresh(el); 
            });
          }
        }
        
      }
      return this;   
    },
    toggles : function(){
      var _t = this, 
          hide =  function(el, elToggle){
            el.children('.toggle-less').hide();
            el.children('.toggle-more').show();
            elToggle.slideUp(); 
          },
          show = function(el, elToggle){
            el.children('.toggle-less').show();
            el.children('.toggle-more').hide();
            elToggle.slideDown(); 
          }; 
      $('a[data-toggle]').each(function(i){
        var el = $(this);
        hide(el, $('#'+el.data('toggle'))); 
      });
      $('a[data-toggle]').click(function(e){
        e.preventDefault();
        var el = $(this), elToggle = $('#'+el.data('toggle')); 
        if(elToggle.is(':visible')){
          hide(el, elToggle); 
        }else{
          show(el, elToggle); 
        }

      });
      return this; 
    },
    gotoSelect : function(){
      var _t = this; 
      $('a[data-select]').click(function(e){
        e.preventDefault();
        var el = $(this), name = el.data('select');
        if(name){
          var select = $('#'+name);
          if(select.length && select.val()){
            _t.goto(select.val());
          }
        }
      });
      return this; 
    },
    goto : function(url){
      _w.location.href = url; 
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
    tooltip : function(el){
      if(el.length){
        el.tooltip({
          close : function(e, u){$('[role=log].ui-helper-hidden-accessible').remove();}
        }); 
      }
      return this;
    },
    ready : function(){ 
      console.log('This site is in ALPHA. We\'re just getting started! We\'d love to get your feedback.');
      var _t = this;
      _t.menu().tooltip($('.translate-bar')).toggles().gotoSelect().checkbox('results-languages', '.block-item-resources', '.field-languages', '#results-languages-alert'); 

      if($('#oceia-help').length){
        _t.qs.init();
        cmn.setItem('last_page', 'help');
        _t.qs.clearLast();
      }else{
        if(!($('body').hasClass('page-node-type-result-page') 
            && cmn.getItem('last_page')=='help')){
          _t.qs.clearLast();
        }
        cmn.setItem('last_page', 'other');
      }

      _w.onpopstate = function(e){
        if($('#oceia-help').length){
          _t.qs.loadState(e.state);
        }  
      }
      
    }
  }; 
  $(document).ready(function(){oceia.ready()});
})(window, document, jQuery, {});