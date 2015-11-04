window.onload = function(){

var techData = {}; 
techData.nodes = []; 
techData.links = []; 

var w = 960;
var h = 900;
var force = null;
var inner_circle_cutoff = 13;
var link_color = "#ddd";
var stroke_width = 0.8;
var category0; 
var category1;
var category2;
var fillnew = d3.scale.ordinal().range(["#4798b3", "#92af6d", "#de9b44", "#db5f3b", "#adc4ca", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf", "#b56626b", "#6c9380", "#c0cc55", "#f07c6c", "#ad5472"]);

var fillColor = ["#4798b3", "#92af6d", "#de9b44", "#db5f3b", "#adc4ca", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf", "#b56626b", "#6c9380", "#c0cc55", "#f07c6c", "#ad5472","#4798b3", "#92af6d", "#de9b44", "#db5f3b", "#adc4ca", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf", "#b56626b", "#6c9380", "#c0cc55", "#f07c6c", "#ad5472"]; 
var vis = d3.select("#tech_integration")
              .append("svg")
              .attr("id", "vis-svg")
              .attr("width", w)
              .attr("height", h);
category0 = {
    "CRM": true,
    "Portfolio Management": true,
    "Platform": true,
    "Portfolio Rebalancing": true,
    "Polio Reporting": true,
    "Financial Planning": true,
    "Marketing": true,
    "Portfolio Management": true,
    "Websites": true
}

category1 = {
    "CRM": true,
    "Portfolio Management": true,
    "Platform": true,
    "Portfolio Rebalancing": true,

  };

category2 = {
    "Polio Reporting": true,
    "Financial Planning": true,
    "Marketing": true,
    "Portfolio Management": true,
    "Websites": true
  };


$.ajax({
type : 'GET',
url: 'http://apps3.investmentnews.com/workspace/mike/index.php/tech-vendors/api',
dataType: "jsonp",
jsonpCallback: "dataObj",
success: function(data){

var masterData = data.Response; 


 $.each(masterData, function(i, d) {
  techData.nodes.push(d);
  var temp;

  if(d.integrations === null){
  	temp = "N/A";
  }else{
  	temp = d.integrations.replace(/\s/g, '').split(',');
  }
   $.each(temp, function(j, target){
   	techData.links.push({
  	source: d.id, 
  	target: target,
  })
   })
  
     
});

  var cateArray=[];
  var proArray=[];  
  var idArray = [];  
  var productCategoryArray=[];

   $.each(techData.nodes, function( i, d ) {
      cateArray.push(d.category); 
   });

   $.each(techData.nodes, function( i, d ) {
      proArray.push(d.name); 
   });

   $.each(techData.nodes, function( i, d ) {
      idArray.push(d.id);
   });

   $.each(cateArray, function( index, val ) {
      var product = {
          category: val,
          sum : 1,
          getCategoryName : function() {
             return this.category;
          }
      };

      var exist = false;
      if(productCategoryArray.length == 0)
          {
            productCategoryArray.push(product);
            exist = true;
          }
      else
      {
        $.each(productCategoryArray, function( index, val ) {
            if(val.getCategoryName().toString() == product.getCategoryName().toString())
            {
              val.sum++;
              exist = true;
            }
          });

      }
      if(!exist)
      {
        productCategoryArray.push(product);
      }


   });
   
   $.each(productCategoryArray, function( index, val ) {
         var productDetails=[];
         var matrixArray=[];
         matrixArray.push({
           category: val.category,
           sum : val.sum,
          getCategoryName : function() {
             return this.category;
          }
         })

         var matrix = {
          category: val.category,
          sum : val.sum,
          getCategoryName : function() {
             return this.category;
          }
          };

          // console.log(val.category +":   sum " + val.sum);
          // console.log("category details: ");
          $.each(cateArray, function( i, d ) {
              if(d.toString() == val.getCategoryName().toString())
                productDetails.push(" "+proArray[i]); 
                // console.log(d +  ":product: " + proArray[i]);
           });

         var key_array=[]; 
          $.each(productCategoryArray, function(index, val) {
              key_array.push(val.category);
          });

         var cicle_legend = "<svg class='legend_circle' width='25' height='20'><circle cx='8' cy='8' r='8'  stroke-width='0' fill= " + fillColor[index] + "/></svg>"
         // selectAll('.legend_circle')
         //                       .data(key_array)
         //                       .enter()
         //                       .attr("class", ".legend_circle")
         //                       .append("circle")
         //                       .attr("r", 5)
         //                       .style("fill", fillnew);
        

        $("#cateList").append("<div class='widget'><div class='widget-toggle'>" + cicle_legend  + val.category + "<span class='val_sum'>"+ val.sum +"</span>" + "</div><div class='widget-content'>" + productDetails+  "</div></div>" );     
    });
  

   // console.log(productCategoryArray); 


  //append the svg canvas


      vis.append("rect")
      .attr("width", w)
      .attr("height", h)
      .attr("fill", "none")
      .attr("id", "vis-canvas")
      .attr("pointer-events", "all");

      force = d3.layout.force()
                .charge(-120)
                .gravity(0.14)
                .size([w, h])
                .linkDistance(50);
   var add_edges;
   var set_centers; 
   var data = null;
   var node_category = null;
   var setup_nodes;
   var current_show_type = "current";
   var current_color_type = "category";
   var current_sort_type = "size";
   var outer_radius = w / 2;
   var inner_radius = w / 4;
   var stroke_opacity = 0.6;
   var tick_count = 0;
   var size= {};
   var node = [];
   var node_links = {};
   var node_category = null;
   //use data to refer techData
   data = techData; 
   //push data to object size
   $.each(data.nodes, function( key, value ) {
      size[value.id] = parseInt(value.size);
   });
   
   node_category = vis.append('g')
                      .attr('class', 'node_category');

  //return radial x y location
  var radial_location = function(v, rad) { 
  var x, y;
    x = (w / 2) + rad * Math.cos(v * Math.PI / 180);
    y = (h / 2) + rad * Math.sin(v * Math.PI / 180);
    return [x, y];
  }; 

   //set up color soring 
  var color_sort = (function(l) {
    return function(type, d) {
      var dis, ref;
      return fillnew(d.category);

    };
  })(this);

  //set up arrows: 
  var setup_arrows = function(){
     link.attr("marker-end", "url(#end)");
   };
         

  //d: data object; i: index; el: circle object
  var setup_tooltip = function(d, i, el) {
    var tooltip_box, box, msg, tech_link, tooltip_width;
            tooltip_box = el.getBBox();
            box = {
              "height": tooltip_box.height,
              "width": tooltip_box.width,
              "x": tooltip_box.x,
              "y": tooltip_box.y
            };

            // box.x = Math.round(box.x) + 0;
            // box.y = Math.round(box.y) + 0;
            box.width = Math.round(box.width);
            box.height = Math.round(box.height);
            tech_link = node_links[d.id];
       
    // console.log(tech_link); tech_link log array of source&target
    
    if (tech_link) {
      highlight_links(tech_link, true);
    }

    //get the width of #tooltip
    // tooltip_width = parseInt(d3.select('#tooltip').style('width').split('px').join(''));
    var bug = d3.select('#tooltip'); 
   
  
    //generate array of integrations
    var temp; 
    if (d["integrations"]!==null){
      temp = d["integrations"].split(",");
    }else if(d["integrations"]==null){
      temp="N/A";
    };
    var hover_data =d;
    var tooltip_display=[]; 

          $.each(temp, function(i, id) {
          $.each(data.nodes, function(j, node){
            if(node.id==id){
            tooltip_display.push(node.name);
            }
        });
       });
   // ################################# ERROS WITH NULL IN THE INTEGRATION DATA #####################################
     var total;
     if (tech_link) {
      if(d["size"]==0){
       total = ' (0 connections: N/A)'; 
      }else{
       total =' ('+ d["size"] + ' connections)';
      }     
    }
    msg = '<table>';
    msg += '<tr><td class="tooltip_name">' + d["name"]+ total +'</td></tr>';
    msg += '<tr><td class="tooltip_category">' + ' Category: ' + d["category"] + '</td></tr>';
     msg += '<tr><td class="tooltip_description">' + '<b> Description: </b>' + d["description"] + '</td></tr>';
    // if (tech_link) {
    //   if(d["size"]==0){
    //     msg += '<tr><td class="tooltip_integration"> <b>' + ' 0 connections: N/A</b>' +'</td></tr>'; 
    //   }else{
    //     msg += '<tr><td class="tooltip_integration"> <b>' + d["size"] + ' connections: </b>' +'</td></tr>';
    //   }
      
    // }
    msg += '</table>';
    d3.select('#tooltip').classed('hidden', false);
    d3.select('#tooltip .content').html(msg);
    // ################################# ADJUST THE POSITION OF TOOLTIPS #####################################
    // d3.select('#tooltip').style('left', box.x + Math.round(box.width / 2) - (tooltip_width / 2) + 24 + 'px').style('top', box.y + (box.height / 3) - 50 + 'px');
    d3.select('#box').style('left', box.x + 'px').style('top', box.y + 'px').style('width', box.width + 'px').style('height', box.height + 'px').classed('hidden', false);
  };

  
   //for the legend

  var key_array=[]; 
  $.each(productCategoryArray, function(index, val) {
      key_array.push(val.category);
  });

  var legend_box = d3.select("#legend"); 
  var legend = legend_box.selectAll(".legend")
    .data(key_array)
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) {
      if(i%3==0){
        return "translate(" + (-600) + "," + (i * 6) + ")"
      }else if(i%3==1){
        return "translate(" + (-460) + "," + (i * 6-6) + ")"
      }else{
        return "translate(" + (-320) + "," + (i * 6-12) + ")"
      }
    });

      



legend.append("text")
    .attr("x", w - 340)
    .attr("y", 8)
    .attr("dy", ".35em")
    .style("text-anchor", "start")
    .text(function(d) { return d; });


  var update_key = (function(l) {
    return function(type) {
      var active_categorys, diss, key_data, key_h, key_r, key_w, keys, keys_vis;
      key_data = [];
      if (type === "category") {
        active_categorys = [];
        if (current_show_type === "current") {
          active_categorys = d3.merge([d3.keys(category0), d3.keys(category2)]);
        } else if (current_show_type === "all") {
          active_categorys = d3.merge([d3.keys(category0), d3.keys(category01), d3.keys(category2)]);
        } else if (current_show_type === "labs_only") {
          active_categorys = d3.merge([d3.keys(category0)]);
        } else if (current_show_type === "category2_only") {
          active_categorys = d3.merge([d3.keys(category2)]);
        } else {
          active_categorys = d3.merge([d3.keys(category0), d3.keys(category01), d3.keys(category2)]);
        }
        key_data = active_categorys.map(function(d) {
          return {
            "category": d,
            "name": d,
            "color": fillnew(d)
          };

        });
      } else if (type === "function") {
        key_data = [
          {
            "category": "bioinformatics center",
            "name": "core",
            "color": fill_lab("core")
          }, {
            "category": "lab",
            "name": "lab",
            "color": fill_lab("lab")
          }
        ];
      } else if (type === "discipline") {
        diss = {};
        d3.values(disciplines).forEach(function(d) {
          return diss[d] = true;
        });
        key_data = d3.keys(diss).map(function(d) {
          return {
            "name": d,
            "color": fill_dis(d)
          };
        });
        key_data = d3.merge([
          key_data, [
            {
              "name": "other",
              "color": fill_dis("other")
            }
          ]
        ]);
      } else {
        key_data = [];
      }
      key_w = 220;
      key_h = 30;
      key_r = 15;
      d3.select("#key").selectAll('.key').remove();
      keys = d3.select("#key").selectAll('.key').data(key_data).enter().append('div').attr('class', 'key');
      keys_vis = keys.append("svg").attr("width", key_w).attr("height", key_h).append("g").attr("transform", "translate(" + key_r + "," + key_r + ")");
      keys_vis.append("circle").attr("r", 5).attr("fill", function(d) {
        return d.color;
      });
      return keys_vis.append("text").attr("class", "key_title").text(function(d) {
        return d.name;
      }).attr("dy", (key_r / 2) - 3).attr("dx", key_r);
    };
  })(this);

   //ranking and sorting

  var hide_edges = function(edges) {
    return edges.attr("stroke-opacity", 0).attr("x1", 0).attr("x2", 0).attr("y1", 0).attr("y2", 0);
  };

  //if sorting by color
  var color_sort = (function(l) {
    return function(type, d) {
      var dis, ref;
      if (type === "category") {
        return fillnew(d.category);
      } else {
        return fillnew(d.category);
      }
    };
  })(this);

    tech_product.show_categorys = (function(l) {
    return function(type) {

      setup_nodes(type);
      setup_edges();
      setup_edge_counts();
      current_show_type = type;
      tech_product.move_categorys(current_sort_type);
      return update_key(current_color_type);
    };
  })(this);

  tech_product.move_categorys = (function(l) {
    return function(type) {
      current_sort_type = type;
      hide_edges(link);
      set_centers(type);
      tick_count = 0;
      return force.start();
    };
  })(this);

  tech_product.find_nodes = (function(l) {
    return function(search_term) {
      var found_nodes;
      return found_nodes = node.each(function(d) {
        var full_name, match;
        match = -1;
        if (search_term.length > 0) {
          full_name = d.name;
          match = full_name.toLowerCase().search(new RegExp(search_term.toLowerCase()));
        }
        if (match < 0) {
          return d3.select(this).style("fill", function(d) {
            return color_sort(current_color_type, d);
          }).attr("stroke-width", 0).attr("stroke-opacity", 0.0);
        } else {
          return d3.select(this).style("fill", "#F38630").attr("stroke", "#444").attr("stroke-width", 2.5).attr("stroke-opacity", 1.0);
        }
      });
    };
  })(this);




  //setup nodes function
  setup_nodes = (function(_this) {
    return function(type) {
      var filter_data;
      filter_data = data.nodes;
      // console.log(filter_data); 
      // if (type === "current") {
      //   filter_data = filter_data.filter(function(d) {
      //     return !category1[d["category"]];
      //   });
      // }
      // if (type === "category1") {
      //   filter_data = filter_data.filter(function(d) {
      //     return !category1[d["category"]] && !category2[d["category"]];
      //   });
      // }
      // if (type === "category2") {
      //   filter_data = filter_data.filter(function(d) {
      //     return !category1[d["category"]] && category2[d["category"]];
      //   });
      // }
      // if (type === "category3") {
      //   filter_data = filter_data.filter(function(d) {
      //     var key;
      //     key = d.name.toLowerCase() + " " + d.id.toLowerCase();
      //     return size[key] && !category1[d["category"]];
      //   });
      // }

      force.nodes(filter_data);


      node_group = node_category.selectAll(".node")
                          .data(filter_data, function(d) {return d["id"];});
      node_group.enter()
          .append("g")
          .attr("class", "node_group")
          .call(force.drag);
      var circleWidth;

      var node = node_group.append("circle")
          .attr("class", "node")
          .style('cursor', 'pointer')
          .attr("r", function(d) {
            if(d.size == 0){circleWidth = 1; return 1;}
            else{circleWidth = d.size*1.2; return d.size*1.2;}    
          })
          .call(force.drag)
              // var key, ref, weight;
              // key =d.id.toLowerCase();
              // weight = (ref = size[key]) != null ? ref : 1;
              // if(weight<5){
              //   return 2*weight;
              // }else{
              //   return 1 * weight;
              // }
            // })
          .style("fill", function(d) {return color_sort(current_color_type, d);})
          .style("opacity", 0.6);
     
      var node_text = node_group.append("svg:text")
        .attr("class", "text_note")
        // .attr("dx", 0)
        // .attr("dy", ".5em")
        .attr('background-color', '#fff')
        .attr("x",    function(d, i) { return circleWidth + 5; })
        .attr("y",  function(d, i) { if (i>0) { return circleWidth + 0 } else { return 8 } })
        .text(function(d) { return d.name})
        .style("opacity", 0).call(getBB);

      node_text.insert("rect","text_note")
          .attr("width", function(d){return d.bbox.width})
          .attr("height", function(d){return d.bbox.height})
          .style("fill", "yellow");

      function getBB(selection) {
          selection.each(function(d){d.bbox = this.getBBox();})
      }

      node.on("mouseover", function(d, i) {
        var highlight_node=[]; 
        var temp;
        if(d.integrations!=null){
          temp=d.integrations.replace(/\s/g, '').split(',');
        }else{
          temp=[]; 
        }
         
        $.each(temp, function( index, value ) {
          var linked = parseInt(value-1);
          d3.select(node[0][linked]).moveToFront();
          d3.select(node_text[0][linked]).moveToFront();
          d3.select(node_text[0][linked]).style("opacity", 1);
          d3.select(node[0][linked]).attr("stroke", "#444").attr("stroke-width", 1.5).attr("stroke-opacity", 1.0).style("opacity", 1.0);
          d3.select()
          });
        // if(node.id == temp){}
        d3.select(this).moveToFront();
        d3.select(this).attr("stroke", "#444").attr("stroke-width", 1.5).attr("stroke-opacity", 1.0).style("opacity", 1.0);
        return setup_tooltip(d, i, this);
      });

      d3.selection.prototype.moveToFront = function() {
        return this.each(function(){
          this.parentNode.appendChild(this);
        });
      };

      node.on("mouseout", function(d, i) {
        var highlight_node=[]; 
        var temp;
        if(d.integrations!=null){
          temp=d.integrations.replace(/\s/g, '').split(',');
        }else{
          temp=[]; 
        }
    
        $.each(temp, function( index, value ) {
          var linked = parseInt(value-1);
           d3.select(node_text[0][linked]).style("opacity", 0);
          d3.select(node[0][linked]).attr("stroke", "#444").attr("stroke-width", 0).attr("stroke-opacity",0 ).style("opacity", 0.6);
          });

        d3.select(this).attr("stroke", "#444").attr("stroke-width", 0).attr("stroke-opacity", 0).style("opacity", 0.6);
        var tech_link;
        d3.select('#tooltip').classed('hidden', true);
        d3.select('#box').classed('hidden', true);
        tech_link = node_links[d.id];
        if (tech_link) {
          return highlight_links(tech_link, false);
        }
      });
      node_group.exit().remove();
      return update_key(current_color_type);
    };
  })(this);

   //set up the arrows
   vis.append("svg:defs").selectAll("marker")
    .data(["end"])      // Different link/path types can be defined here
  .enter().append("svg:marker")    // This section adds in the arrows
    .attr("id", String)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 1)
    .attr("refY", 0)
    .attr("fill", "#B92025")
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
  .append("svg:path")
    .attr("d", "M0,-5L10,0L0,5");


  //set edges
  setup_edges = (function(l) {
    return function() {
      var filter_data;
      filter_data = data.links.filter(function(d) {
        return force.nodes().filter(function(e) {
          return e.id === d.source;
        })[0] && force.nodes().filter(function(e) {
          return e.id === d.target;
        })[0];
      });
      // filter_data = techData.links; 
      // console.log(filter_data);
      // console.log(techData.links); 
      link = vis.selectAll("line.link").data(filter_data);
      link.enter()
          .insert("line", ".node_category")
          .attr("class", "link")
          .attr("stroke", link_color)
          .attr("stroke-opacity", 0)
          .attr("stroke-width", stroke_width);
      return link.exit().remove();
    };
  })(this);

  //set edge counts
  setup_edge_counts = (function(l) {
    return function() {
      edge_counts = {};
      node_links = {};
      return node_group.each(function(d) {
        var name;
        node_links[d.id] = vis.selectAll('line.link').filter(function(l) {
          return l.source === d.id;
        });
        edge_counts[name = d.category] || (edge_counts[name] = 0);
        return edge_counts[d.category] += node_links[d.id][0].length;
      });
    };
  })(this);

  //individual ranking spiral layout

    spiral_layout = (function(l) {
    return function() {
      var inc, pos, rad, rad_inc, sorted_keys, sorted_links;
      sorted_links = d3.entries(node_links).sort(function(a, b) {
        return b.value[0].length - a.value[0].length;
      });
      sorted_keys = sorted_links.map(function(d) {
        return d.key;
      });
      rad = 12;
      pos = 0;
      inc = 8;
      rad_inc = 2;
      return sorted_keys.forEach(function(key, i) {
        var x_y;
        x_y = radial_location(pos, rad);
        center_nodes[key] = {
          x: x_y[0],
          y: x_y[1]
        };
        pos += inc;
        rad_inc = i > 20 ? 4 : 8;
        return rad += rad_inc;
      });
    };
  })(this);



  //set center
  set_centers = (function(l) {
    return function(type) {
      var categorys, inner_count, inner_category, inner_increment, inner_pos, outer_category, outer_increment, outer_pos, sorted_counts;
      inner_category = [];
      outer_category = [];
      center_nodes = {};
      if (type === "spiral") {
        spiral_layout();
      } else if (type === "edge") {
        sorted_counts = d3.entries(edge_counts).sort(function(a, b) {
          return b.value - a.value;
        });
        inner_count = sorted_counts.length > 13 ? 12 : 6;
        inner_category = sorted_counts.slice(0, inner_count).map(function(c) {
          return c.key;
        });
        outer_category = sorted_counts.slice(inner_count).map(function(c) {
          return c.key;
        });
      } else if (type === "lab_core") {
        inner_category = d3.keys(cores);
        outer_category = d3.keys(current_labs);
        if (current_show_type === "all") {
          outer_category = d3.merge([outer_category, d3.keys(category01)]);
        }
      } else {
        categorys = {};
        node_group.each(function(d) {
          var name;
          categorys[name = d.category] || (categorys[name] = 0);
          return categorys[d.category] += 1;
        });
        inner_category = d3.keys(categorys).filter(function(key) {
          return categorys[key] > inner_circle_cutoff;
        });
        outer_category = d3.keys(categorys).filter(function(key) {
          return categorys[key] <= inner_circle_cutoff;
        });
      }
      if (type !== "spiral") {
        inner_pos = -90;
        inner_increment = 360 / inner_category.length;
        inner_category.forEach(function(key) {
          var x_y;
          x_y = radial_location(inner_pos, inner_radius);
          center_nodes[key] = {
            x: x_y[0],
            y: x_y[1]
          };
          return inner_pos += inner_increment;
        });
        outer_pos = -160;
        outer_increment = 360 / outer_category.length;
        return outer_category.forEach(function(key, i) {
          var x_y;
          x_y = radial_location(outer_pos, outer_radius);
          center_nodes[key] = {
            x: x_y[0],
            y: x_y[1]
          };
          return outer_pos += outer_increment;
        });
      }
    };
  })(this);


  //hoverovrer and highlight links
  var highlight_links = function(edges, on_off) {
    if (on_off) {
      return edges.attr('stroke', '#B92025').attr("stroke-width", 1.2).attr("stroke-opacity", 1).attr("marker-end", "url(#end)");
    } else {
      return edges.attr('stroke', link_color).attr("stroke-width", stroke_width).attr("stroke-opacity", 0.8).attr("marker-end", false);
    }
  };

  var display_edge_table = function(edges, nodes, current_node_index) {
    var titles;
    titles = '<table id=\'link_table\'><tr><th>Paper</th><th>Connection</th>';
    edges.each(function(l) {
      var connection_index, connection_node;
      connection_index = l.source === current_node_index ? l.target : l.source;
      connection_node = nodes[connection_index];
      titles += '<tr><td>' + l['title'] + '</td>';
      return titles += '<td>' + connection_node.name + ' ' + connection_node.id + '</td></tr>';
    });
    titles += '</table>';
    return d3.select('#titles').html(titles);
  };

  //activate setups
  setup_nodes(current_show_type);
  setup_edges();
  setup_edge_counts();
  set_centers(current_sort_type);


   add_edges = function() {
      return link.attr("stroke-opacity", stroke_opacity)
                 .attr("x1", function(d) {
                   return force.nodes().filter(function(e) {
                   return e.id === d.source;
                  })[0].x;
                  })
                 .attr("y1", function(d) {
        return force.nodes().filter(function(e) {
          return e.id === d.source;
        })[0].y;
      }).attr("x2", function(d) {
        return force.nodes().filter(function(e) {
          return e.id === d.target;
        })[0].x;
      }).attr("y2", function(d) {
        return force.nodes().filter(function(e) {
          return e.id === d.target;
        })[0].y;
      });
    };
    force.start();
    return force.on('tick', function(e) {
      var k;
      k = e.alpha * .1;
      node_group.each(function(d, i) {

        var center_node;
        center_node = current_sort_type !== "spiral" ? center_nodes[d.category] : center_nodes[d.id];


        if (center_node) {
          d.x += (center_node.x - d.x) * k;
          d.y += (center_node.y - d.y) * k;
          if (tick_count % 2 === 0) {
            d3.select(this).attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
          }
        }
      });
      tick_count += 1;
      if (tick_count > 100) {
        // force.stop();
        return add_edges();
      }
    });


// for(i=0;i<data.Response.length;i++){

// }
}
});
}


var tech_product;
tech_product = this; 

$('#featured input').click(function() {
  $('#featured input').removeClass("active");
  var typeId = $(this).attr("id");
  $(this).addClass("active");
  move_categorys(typeId);
  });

// var Tech = {
// 	data: {},
// 	initial: function(){

// 	},
// 	useData: function(data){

// 	}
// }; 



// function useData(){

// }




 	// console.log(techData.links);

                                                                                      
