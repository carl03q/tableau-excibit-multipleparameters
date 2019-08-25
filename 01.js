'use strict';
 
(function () {
  $(document).ready(function () {
    // Inicializa la extensión
    tableau.extensions.initializeAsync().then(function () {
        refresh();
    }, function () { console.log('Error while Initializing: ' + err.toString()); });
  });
 
  let measures_list = [];
  function refresh() {
    
    // Obtiene la lista de hojas de trabajo y agrega cada una a la página web como botones.
    $("#worksheets").text("");
    const worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;
    
    worksheets.forEach(function (worksheet) {
        $("#worksheets").append("<button class='btn btn-secondary btn-block'>"+worksheet.name+"</button>");
    });
    var worksheet = worksheets.find(function (sheet) {
      return sheet.name === "Sheet 1";
    });

    worksheet.getSummaryDataAsync().then(function (dataTable) {
      console.log(dataTable);
      let field = dataTable.columns.find(column => column.fieldName === 'Measure Names');
      
      for (let row of dataTable.data) {
        measures_list.push({value: row[field.index].formattedValue, checked:false});
      }
      console.log(measures_list)
      createCheckboxList(measures_list);
      updateParameterUI(measures_list)  
            
    });
    
  }

  function updateParameterUI (list) {
    
    let parameterString = list.filter(t => t.checked == true).map(t => t.value).join()

    tableau.extensions.dashboardContent.dashboard.getParametersAsync().then(function (parameters) {
      let p = parameters.find(param => param.parameterImpl.name === "Parametro multiple")
      p.changeValueAsync(parameterString)
    });
  }

  function createCheckboxList(items) {
    // clear the former content of a given <div id="some_div"></div>
    document.getElementById('checkboxlist').innerHTML = '';

    var myDiv = document.getElementById("checkboxlist");
    myDiv.innerHTML = '';

    items.forEach(item => {
      var container = document.createElement("div"); 
      var checkBox = document.createElement("input");
      var label = document.createElement("label");

      container.className = 'form-check'
      checkBox.className = 'form-check-input'
      label.className = 'form-check-label'

      checkBox.type = "checkbox";
      checkBox.value = item.value;
      checkBox.checked = item.checked;
      container.appendChild(checkBox);
      container.appendChild(label);
      myDiv.appendChild(container);
      label.appendChild(document.createTextNode(item.value));
    });

    $("[type=checkbox]").click(function(){
        var clicked = $(this);
        //alert(clicked.text() +" === "+clicked.val());
        updateParameterList(clicked.val(), clicked[0].checked)
    });
  }

  function updateParameterList(value, checked){
    console.log('updatingparamter list')
    console.log(measures_list)
    measures_list.find(p => p.value === value).checked = checked

    updateParameterUI(measures_list)
  }


})();