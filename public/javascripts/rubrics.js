function load_levels(id) {
    $('working').show();
    new Ajax.Request('../list_levels', {method: 'get',asynchronous:true, evalScripts:true,parameters: {'criterion_id':id,'authenticity_token': encodeURIComponent(authenticity_token)}, onComplete: function(transport) { $('working').hide();}});
}

function hide_levels() {
   $('rubric_levels_pane_list').update('');
}

function hide_help() {
   $('rubrics_help').hide();
}

function show_help() {
   $('selected_criterion_name').update('');
   $('rubrics_help').show();
}


function focus_criterion(id) {
    if(selected_criterion_id){
      unfocus_criterion(selected_criterion_id);
    }
    if(selected_criterion_id != id){
      hide_help();
      show_criterion(id);
      selected_criterion_id = id;
      load_levels(id);
    }
}

function unfocus_criterion(id) {
    hide_levels();
    hide_criterion(id);
    selected_criterion_id = null;
    show_help();
}

function hide_criterion(id) {
    $('criterion_'+id).removeClassName('criterion_holder_selected');
}

function show_criterion(id) {
    $('working').show();
    $('selected_criterion_name').update('');
    $('criterion_'+id).addClassName('criterion_holder_selected');
}

function criterion_weight_bump(amount, input, criterion_id) {
    var weight = parseFloat($F(input));
    if (weight + amount > 0) {
        weight += amount;
        $(input).value = weight;
    }
    criterion_input_edited('weight', input, criterion_id);
    //TODO:  Update title_div weight display for this criterion
}

function level_input_edited(input_type, input, level_id) {
  $('working').show();
  $(input).disable();
  new Ajax.Request('../update_level', {
      asynchronous:true, 
      evalScripts:true, 
      onSuccess:function(request){
          data = request.responseText.evalJSON();
          if(data.status == 'OK') {
              $(input).enable();
              //Update the title_div name and description, in case these have been changed
          }
          else if(data.status == 'error') {
              //TODO:  Visually alert user that update did not take place
              $(input).value = data.old_value;
              $(input).enable();
          }
      }, 
      onFailure: function(request) {
           alert('Server communications failure:  this value was not updated.');
           $(input).disable();
      },
      onComplete: function(request) {
          $('working').hide();
      },
      parameters: {'level_index': level_id,'criterion_id':selected_criterion_id, 'update_type': input_type, 'new_value': $F(input), 'authenticity_token':  authenticity_token}
   }
 );
}

function criterion_input_edited(input_type, input, criterion_id) {
  $('working').show();
  $(input).disable();
  //Reset error displays
  $('criterion_error').update('');
  $('criterion_error').hide();
  $('criterion_inputs_'+criterion_id+'_name').removeClassName('editing');
  $('criterion_inputs_'+criterion_id+'_weight').removeClassName('editing');
  
  new Ajax.Request('../update_criterion/1', {
      asynchronous:true, 
      evalScripts:true, 
      onSuccess:function(request){
          data = request.responseText.evalJSON();
          if(data.status == 'OK') {
              $(input).enable();
              //Update the title_div name and description, in case these have been changed
              if(input_type == 'name') {
                  $('selected_criterion_name').update($F(input));
                  $('criterion_title_'+criterion_id).update($F(input));
              }
              else if(input_type == 'weight') {
                  $('criterion_weight_'+criterion_id).update($F(input));
              }
          }
          else if(data.status == 'error') {
              //TODO:  Visually alert user that update did not take place
              $('criterion_error').update(data.message);
              $('criterion_error').show();
              $(input).value = data.old_value;
              $(input).enable();
          }
      }, 
      onFailure: function(request) {
           alert('Server communications failure:  this value was not updated.');
           $(input).disable();
      },
      onComplete: function(request) {
          $('working').hide();
      },
      parameters: {'criterion_id': criterion_id, 'update_type': input_type, 'new_value': $F(input), 'authenticity_token':  authenticity_token}
   }
 );
}


