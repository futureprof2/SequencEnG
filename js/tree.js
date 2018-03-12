

var isMobile = false; //initiate as false
// device detection
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true

//Size Control
const CURRENT_WINDOW_SIZE = screen.width;
const TREE_FIELD_WIDTH = screen.width * 0.8;
const TREE_HEIGHT = 1500;


//d3 Tree structure 
let treeData = {
  "name" : "Training",
   "parent": "null",
    "children": []

}

let selection_data = [];

//=============== Common functions ================
 function collapse(d) {
    if(d.children) {
      d._children = d.children
      d._children.forEach(collapse)
      d.children = null
    }
  }

   function expand(d){   
    var children = (d.children)?d.children:d._children;
    if (d._children) {        
        d.children = d._children;
        d._children = null;       
    }
    if(children)
      children.forEach(expand);
  }



function expandAll(root, update){
      expand(root); 
      if(!isMobile){
         $("#tree svg").height(TREE_HEIGHT);
      }
      update(root);
  }

  function collapseAll(root, update){
      root.children.forEach(collapse);

      update(root);
  }



//find path in tree 
function searchTree(data, search, path){




    if(data && data.children){
       for(let i =0; i < data.children.length;i++){


          if(data.children[i].name === search){
              path.push(search); // push leaf node
              path.push(data.name); // push parent node 
             
              
              return path;
          }


          else{
            

            //find path to leaf node 
            let found = searchTree(data.children[i], search, path);
            
            if(found){
              found.push(data.name); // push node that is part of paths
               


              //find all paths through tree
              return found.concat(searchTree(data.children[i+1], search, []) || []);

            }







          }


      }

    }
   



}

//expand after search 
  function searchExpand(d, paths){
    //part of paths 

    $(".node").removeClass("found");
    $(".link").removeClass("found");
    if(paths.indexOf(d.data.name) !== -1){
      d.class = "found";
      if (d._children) {        
        d.children = d._children;
        d._children = null;       
      }
      let children = (d.children)?d.children:d._children;
      if(children){
        paths.splice(paths.indexOf(d.data.name),1);
        children.forEach(node => searchExpand(node, paths));
      }
    }

    //collapse otherwise 
    else{
      d.class = "";
      let children = (d.children)?d.children:d._children;
      if(children){
         children.forEach(node => searchExpand(node, paths));
      }
     
      collapse(d);
    }

  }


  function clearAll(d, update){
      searchExpand(d, []);
      $('#search').val(null).trigger('change');

      if (d.parent === null && d._children) {        
        d.children = d._children;
        d._children = null;       
      }

      update(d);
  }


  function show_description(data){

    

      let $divContainer = $("<div>", {id: "desc-detail", "class": "container chart-wrapper"});
    
      // notes, seq_fullname, year, paper_title paper_link
        let $divRowName = data.seq_fullname?
                          $("<div>", {"class": "chart-title row justify-content-center"})
                          .append("<div>" + data.seq_fullname + "</div>"):"";

        
        let $divRowNote = data.notes?
                          $("<div>", {"class": "row chart-notes"})
                          .append("<div>Notes : " + data.notes + "</div>"):"";
        
        let $divRowYear = data.year?
                          $("<div>", {"class": "row chart-notes"})
                         .append("<div>Year : " + data.year + "</div>"):""; 
        
        let $divRowPaper = data.paper_link?
                          $("<div>", {"class": "row chart-notes"})
                          .append("Paper :  <a target='_blank' href='"+ data.paper_link + "'>" + data.paper_title + "</a>"):"";

             
        let $divRowButton = $("<div>", {"class": "row justify-content-md-center button-row"});
        let hasStep = data.has_step?"<button class='btn btn-success show-chart'>Show steps</button>":"";
        if(data.has_step){
          $("#chart").empty();
          pipeline_load(data.seq_name);
        }

        let $rcr = $("<div>", {"class": "row chart-notes rcr"});
        let $rcr_tooltip = $("<span>", {"class": "rcr-tooltip"});
        $rcr.append("RCR :");
        $rcr.append($rcr_tooltip);
        $rcr_tooltip.append("Relative Citation Ratio represents a citation-based measure of scientific influence of one or more articles. It is calculated as the cites/year of each paper, normalized to the citations per year received by NIH-funded papers in the same field and year. A paper with an RCR of 1.0 has received the same number of cites/year as the average NIH-funded paper in its field, while a paper with an RCR of 2.0 has received twice as many cites/year as the average NIH-funded paper in its field. The displayed values are the maximum, the mean, the standard error of the mean (SEM), and the median (MED) of the papers in the group.");

        $divRowButton.append(hasStep);

        let $imgBox = $("<div>", {"class" : "row"});

        if(data.plot===1){

          let $figure = $("<figure>",{"class" : "figure-box"});
          let $descimg = $("<img>", {"id" : "descimg", "alt" : "Image of " + data.seq_fullname, "src" : "./img/"+data.seq_name+".jpeg", "title" : "Click for bigger image"});
          $figure.append($descimg);
          $imgBox.append($figure);


          let $modal = $("#modalbox");
          let $imgmodal = $("#img-modal");

          //modal event
          $descimg.click(function(){
              $modal.show();
              $imgmodal.attr("src",  "./img/"+data.seq_name+".jpeg");
              $("#caption").text(data.seq_fullname);
          });

        }

        
       
        $.ajax('https://icite.od.nih.gov/api/pubs?pmids=23456789').done(function(response){
            console.log(response);
            $divContainer.append($divRowName, $divRowNote, $divRowYear, $divRowPaper,$rcr, $imgBox, $divRowButton);
            $(".show-chart").on('click', show_chart);
            
        });
       


        return $divContainer;


}





//=================TREE DATA========================
//Get data 
$.getJSON("./data/tree.json")
    .done(function( data ) {

      $(".modalclose").click(function(){
          $("#modalbox").hide();
      });

      

      //select2 data id 
      let id = 1; 


      //arry for removing duplicates 
      let select_array =[];
      

      let dataObject = {};


      for(let i= 0; i < data.length; i++){

        //select2 data 
        let select_model_mid_node = {};
        let select_model_leaf_node = {};
        if(select_array.indexOf(data[i].seq_goal_level2) === -1){
            select_model_mid_node.id = id++;
            select_model_mid_node.text = data[i].seq_goal_level2;
            select_array.push(data[i].seq_goal_level2);
            selection_data.push(select_model_mid_node);
        }
        if(select_array.indexOf(data[i].seq_name) === -1){
           select_model_leaf_node.id = id++;
            select_model_leaf_node.text = data[i].seq_name;
            select_array.push(data[i].seq_name);
            selection_data.push(select_model_leaf_node);

        }

        if(typeof dataObject[data[i].seq_goal_level1] !== 'undefined'){
          let leafNode = data[i];
          leafNode.name = data[i].seq_name;
          if(typeof dataObject[data[i].seq_goal_level1].child[data[i].seq_goal_level2] !== "undefined"){
            dataObject[data[i].seq_goal_level1].child[data[i].seq_goal_level2].push(leafNode);
          }

          else{
            dataObject[data[i].seq_goal_level1].child[data[i].seq_goal_level2] = [];
            dataObject[data[i].seq_goal_level1].child[data[i].seq_goal_level2].push(leafNode);
          }

        }
        else{
          dataObject[data[i].seq_goal_level1] = {};
          dataObject[data[i].seq_goal_level1].child = {};

          dataObject[data[i].seq_goal_level1].child[data[i].seq_goal_level2] = [];


          let leafNode = data[i];
          leafNode.name = data[i].seq_name;
          dataObject[data[i].seq_goal_level1].child[data[i].seq_goal_level2].push(leafNode);


        }


      } //Organize data 

      
     
      //Data to d3 tree structure 
      for(let key in dataObject){
        let child_node = {};
        child_node.name = key; 
        child_node.children = []; 

        for(let childKey in dataObject[key].child){
          let childObject = {};
          childObject.name = childKey;
          childObject.children = dataObject[key].child[childKey];
          child_node.children.push(childObject);
        }

        treeData.children.push(child_node);

      } //make tree structure 



     


//Desktop
if(!isMobile){

    
  
  draw_tree();

}


//tablet, mobile
else{

  draw_table();
  

}


}); //json get 



//show step chart 
function show_chart(){
   $(".tree-button").hide();
     $(".tree-field").slideUp('slow');
    $("#main").delay('850').slideDown('slow',function(){
        $("#chart-button").click();
    });
  
 
}

//===================Draw Tree(Desktop)=======================
function draw_tree(){
  let margin = {top: 20, right: 90, bottom: 30, left: 90},
      width = (TREE_FIELD_WIDTH) - margin.left - margin.right,
      height = TREE_HEIGHT - margin.top - margin.bottom;

  let svg = d3.select("#tree").append("svg")
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .attr("transform", "translate("
            + margin.left + "," + margin.top + ")");

  let svg_width = $("svg").width();


  let box_size =  (CURRENT_WINDOW_SIZE - svg_width);
         
  $("#desc").css("width", box_size);
 
  let i = 0,
      duration = 750,
      root;

  let tree_detail_box_width = box_size + TREE_FIELD_WIDTH;

  $(".tree-field").width(tree_detail_box_width);

  //tree option buttons 
   $("#expand-all").click(() => expandAll(root, update));
  $("#collapse-all").click(() => collapseAll(root, update));
  $("#clear-all").click(() => clearAll(root, update));

  let tree = d3.tree().size([height, width]);

  root = d3.hierarchy(treeData, function(d) { return d.children; });
  root.x0 = height / 2;
  root.y0 = 0;

  root.children.forEach(collapse);


  //select2 init
  let select = $("#search").select2({
         placeholder: 'Select an Node',
         data: selection_data
      });

 

 //select2 event 
  select.on('select2:select', function (e) {
     
      let result = searchTree(treeData, e.params.data.text, []);

      searchExpand(root, result);

      update(root);
        


    });

  

  update(root);




  function update(source) {

    let tData = tree(root);

    let nodes = tData.descendants(),
        links = tData.descendants().slice(1);

    // Normalize for fixed-depth.
    nodes.forEach(function(d){ 
      d.y = d.depth * 220});

    let node = svg.selectAll('g.node')
        .data(nodes, function(d) {return d.id || (d.id = ++i); });

    let nodeEnter = node.enter().append('g')
        .attr('class', 'node')
        .attr("transform", function(d) {
          return "translate(" + source.y0 + "," + source.x0 + ")";
      })
      .on('click', click);

    nodeEnter.append('circle')
        .attr('class', 'node')
        .attr('r', 1e-6)
        .style("fill", function(d) {
            return d._children ? "springgreen" : "#fff";
        });

    nodeEnter.append('text')
        .attr("dy", ".35em")
        .attr("x", function(d) {
            return d.children || d._children ? -20 : 20;
        })
        .attr("text-anchor", function(d) {
            return d.children || d._children ? "end" : "start";
        })
        .attr("font-size", function(d){
          return d.children || d._children ? "14" : "16";
        })
        .attr("font-weight",function(d){
          return d.children || d._children ? "normal" : "bold";
        })
        .text(function(d) { return d.data.name; })
        .on("click", function(d){
          
            //console.log(d);
            if(typeof d.data.children === 'undefined'){
                let $descText = show_description(d.data);
                $descText.hide();

                $("#desc").html($descText);
               

                
                $descText.fadeIn('slow');
                $("#desc").fadeIn('slow');
            }
        
        });

   
    let nodeUpdate = nodeEnter.merge(node);

   
    nodeUpdate.transition()
      .duration(duration)
      .attr("transform", function(d) { 
          return "translate(" + d.y + "," + d.x + ")";
       });

   
    nodeUpdate.select('circle.node')
      .attr('r', 15)
      .style("fill", function(d) {
          return d._children ? "springgreen" : "#fff";
      })
      .attr('cursor', 'pointer')
      .attr('class', function(d){
          if(d.class === "found"){
            return 'node found';
          }
          else{
            return 'node';
          }
          
        });


   
    let nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", function(d) {
            return "translate(" + source.y + "," + source.x + ")";
        })
        .remove();

   
    nodeExit.select('circle')
      .attr('r', 1e-6);

    
    nodeExit.select('text')
      .style('fill-opacity', 1e-6);

  
    let link = svg.selectAll('path.link')
        .data(links, function(d) { return d.id; });

   
    let linkEnter = link.enter().insert('path', "g")
        .attr("class", "link")
        .attr('d', function(d){
          let o = {x: source.x0, y: source.y0}
          return diagonal(o, o)
        });

   
    let linkUpdate = linkEnter.merge(link);

    
    linkUpdate.transition()
        .duration(duration)
        .attr('d', function(d){ return diagonal(d, d.parent) })
        .attr('class', function(d){
          if(d.class === "found"){
            return 'link found';
          }
          else{
            return 'link';
          }
          
        });;

   
    let linkExit = link.exit().transition()  
        .duration(duration)
        .attr('d', function(d) {
          let o = {x: source.x, y: source.y}
          return diagonal(o, o)
        })
        .remove();

   
    nodes.forEach(function(d){
      d.x0 = d.x;
      d.y0 = d.y;
    });

    
    function diagonal(s, d) {

      let path = `M ${s.y} ${s.x}
              C ${(s.y + d.y) / 2} ${s.x},
                ${(s.y + d.y) / 2} ${d.x},
                ${d.y} ${d.x}`

      return path
    }

    //click node event 
    function click(d) {
      if (d.children) {
          d._children = d.children;
          d.children = null;
        } else {
          d.children = d._children;
          d._children = null;
        }
      update(d);
    }
  }


 

    

}


//===================Draw Tree(Mobile)=======================

function draw_table(){
  let margin = {top: 30, right: 20, bottom: 30, left: 20},
      width = TREE_FIELD_WIDTH - margin.right - margin.left,
      barHeight = 30,
      barWidth = width;


  let i = 0,
      duration = 400,
      root;


  let svg = d3.select("#tree").append("svg")
      .attr('width', width + margin.right + margin.left)
      .attr('height', "100%")
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  $("#expand-all").click(() => expandAll(root, update));
  $("#collapse-all").click(() => collapseAll(root, update));



  root = d3.hierarchy(treeData) // Constructs a root node from the specified hierarchical data.

  let tree = d3.tree().nodeSize([0, 30]); //Invokes tree

  root.children.forEach(collapse);
  

  function update(source) {

    
     nodes = tree(root); //returns a single node with the properties of d3.tree()
     nodesSort = [];



    // returns all nodes and each descendant in pre-order traversal (sort)
    nodes.eachBefore(function (n) {

       nodesSort.push(n); 
    });

    // Compute the "layout".
    nodesSort.forEach(function (n,i) {
      n.x = i *barHeight;
    })


    $("#tree svg").height(nodesSort.length * barHeight + margin.top + margin.bottom);

    d3.select("svg").transition()
        .duration(duration)
        // .attr("height", nodesSort.length * barHeight + margin.top + margin.bottom);

    // Update the nodes…
    let node = svg.selectAll("g.node")
        .data(nodesSort, function(d) { return d.id || (d.id = ++i); }); //assigning id for each node

    let nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) {  return "translate(" + source.y + "," + source.x + ")"; })
        .style("opacity", 1e-6);

    // Enter any new nodes at the parent's previous position.
    nodeEnter.append("rect")
        .attr("y", -barHeight / 2)
        .attr("height", barHeight)
        .attr("width", barWidth)
        .style("fill", color)
        .on("click", click);

    nodeEnter.append("text")
        .attr("dy", 3.5)
        .attr("dx", 5.5)
        .text(function (d) {
          return d.depth == 0 ? d.data.name + " >>>" : d.depth == 1 ? d.data.name + " >>" : d.data.name ; });

    // Transition nodes to their new position.
    nodeEnter.transition()
        .duration(duration)
        .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
        .style("opacity", 1);

    node.transition()
        .duration(duration)
        .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
        .style("opacity", 1)
      .select("rect")
        .style("fill", color);

    // Transition exiting nodes to the parent's new position.
    node.exit().transition()
        .duration(duration)
        .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
        .style("opacity", 1e-6)
        .remove();

      nodes.eachBefore(function (d) {
        d.x0 = d.x;
        d.y0 = d.y
      });

  }

  // Initalize function
  update(root);


  // Toggle children on click.
  function click(d) {


    if(typeof d.data.children === 'undefined'){

                $("g.node").removeClass("mobile-selected");
                $(this).parent().addClass('mobile-selected');

                let $descText = show_description(d.data);
                $descText.hide();

                $("#desc").html($descText);

                 $(".show-chart").on('click', show_chart);

                $descText.fadeIn('slow');
                $("#desc").fadeIn('slow');
            }

    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }


    update(d);
  }

  function color(d) {
    return d._children ? "seagreen" : d.children ? "mediumseagreen" : "lightgreen";
  }


 
  


}

