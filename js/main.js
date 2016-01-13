var colors = {
	"bar": "gold",//rgb(234,223,139)", //"rgb(249,249,121)",//"rgb(233,249,121)", //"lightblue",
	"highlighted_bar": "rgb(253,111,154)",//"rgb(252,205,233)",//,//"rgb(214,229,200)",
	"r1": "blue",
	"r2": "red",
	"dot_border": "white"
};

var schools = [];

var highlighted = [];

var pym_child = false;

$(function () {

	pym_child = new pym.Child();


	var container = {};
	var gaps = [];


	$(window).on("resize", draw);

	function relativeWidth(width){

		return d3.scale.linear()
			.domain([container.min_gap, container.max_gap])
			.range([0, container.width - container.padding * 2])
			(width);
	}

	var substringMatcher = function(strs) {
	  return function findMatches(q, cb) {
	    var matches, substringRegex;

	    // an array that will be populated with substring matches
	    matches = [];

	    // regex used to determine if a string contains the substring `q`
	    substrRegex = new RegExp(q, 'i');

	    // iterate through the pool of strings and for any string that
	    // contains the substring `q`, add it to the `matches` array
	    $.each(strs, function(i, str) {
	      if (substrRegex.test(str)) {
	        matches.push(str);
	      }
	    });

	    cb(matches);
	  };
	};


	function draw(){
		container.padding = 10;
		container.elem_padding = 3;
		container.bar_height = 8;
		container.width = window.innerWidth;
		container.height = window.innerHeight;
		container.min_gap = 0;
		container.max_gap = 100;


		d3.selectAll("#d3svg g").remove();

		d3.select("#d3svg")
			.append("g")
			.attr("id", "bar_g");

		d3.select("#d3svg")
			.append("g")
			.attr("id", "label_bg_g");

		d3.select("#d3svg")
			.append("g")
			.attr("id", "label_g");


		d3.select("#d3svg")
		.attr("width", window.innerWidth);

		addGaps();

		$('#school_search').typeahead({
		  classNames:{
		  	input: "gaps-tt-input"
		  },
		  hint: false,
		  highlight: true,
		  minLength: 1
		},
		{
		  name: 'states',
		  source: substringMatcher(schools)
		});

		$('#school_search').bind("typeahead:selected", function (obj, datum, name){
			//console.log(datum);
			showDistrict(datum.split(" ").join(""));
			highlighted.push(datum.split(" ").join(""));
			$(".tt-hint").hide();
		});

		showDistrict("Statewide");
		highlighted.push("Statewide");
		pym_child.sendHeight();	
	
	}

	function addGaps(){
		gaps.sort(function(a, b){
			return a.width - b.width;
		});

		schools = [];
		highlighted = [];

		for (var gap in gaps) {
			//console.log(gaps[gap]);
			addGap(gaps[gap]);
			schools.push(gaps[gap].label);
		}
	}


	function showDistrict(district){
		d3.select("#" + district + "_label")
			.style("opacity", 1);

		d3.select("#" + district+ "_bar")
			.style("fill", colors.highlighted_bar)

		d3.select("#" + district + "_label_bg")
			.style("opacity", 0.9);

	}

	function hideDistrict(district){

		if (highlighted.indexOf(district) >= 0) return;

		d3.select("#" + district + "_label")
			.style("opacity", 0);

		d3.select("#" + district + "_label_bg")
			.style("opacity", 0);

		d3.select("#" + district + "_bar")
			.style("fill", colors.bar)

	}

	function addGap(options){

		options.svg = "d3svg";
		options.gap_id = options.label.split(" ").join("");

		// remove old one, if it exists
		d3.select("#" + options.gap_id).remove();
		d3.select("#" + options.gap_id + "_label").remove();


		// push all others down
		d3.selectAll(".gap_elem")
			.each( function () {
				var new_y = Number(d3.select(this).attr("y")) 
					+ container.bar_height 
					+ container.elem_padding;
				d3.select(this)
				.attr("y", new_y);
			});

		var left_pos = container.padding + relativeWidth(options.r1) - container.bar_height - container.elem_padding;
		var right_pos = container.padding + relativeWidth(options.r2) - container.bar_height - container.elem_padding;

		var bar_color = colors.bar;//"lightblue";

		if (options.width < 0){
			//bar_color = "lightblue";
		}

		// add new one
		d3.select("#bar_g")
			.append("rect")
			.classed("gap", true)
			.classed("gap_elem", true)
			.attr("width",relativeWidth(Math.abs(options.width)))// - container.elem_padding * 2 - container.bar_height)
			.attr("height",container.bar_height)
			.attr("x", Math.min(left_pos, right_pos) + container.bar_height / 2) //+ container.elem_padding + container.bar_height)
			.attr("y",container.padding )//+ container.bar_height)
			.attr("fill", bar_color)
			.attr("id", options.gap_id + "_bar")
			.attr("data-school_name", options.label)
			.on("mouseover", function (){
				//d3.select(this)
				//	.style("fill", "indianred");
				//console.log("in")

				// reposition label

				// make label visible

				showDistrict(options.gap_id);


			})
			.on("mouseout", function () {


				//console.log("out");
				//d3.select(this)
			//		.style("fill", bar_color);

				hideDistrict(options.gap_id);


			});



		// add label
		d3.select("#label_g")
			.append("text")
			.classed("gap", true)
			.classed("gap_elem", true)
			//.attr("x", Math.min(left_pos, right_pos) + container.bar_height / 2 + relativeWidth(Math.abs(options.width)) + container.bar_height + 2) //+ container.elem_padding + container.bar_height)
			.attr("y",container.padding + container.bar_height)//+ container.bar_height)
			.attr("fill", bar_color)
			.attr("id", options.gap_id + "_label")
			.attr("data-school_name", options.label)
			.style("font-size", Math.max(container.bar_height, 12) )
			.style("opacity", 0)
			//.attr("display", "none")
			.style("fill", "gray")
			.style("background-color", "white")
			.on('mouseover', function (){
				showDistrict(options.gap_id);
			})
			.on('mouseout', function () {
				hideDistrict(options.gap_id);
			});
//			.html(options.label + " | Gap: " + options.width);


		d3.select("#" + options.gap_id + "_label")
				.append("tspan")
				.text(options.label);

		d3.select("#" + options.gap_id + "_label")
			.append("tspan")
			.text(" | Gap: " + options.width);


		// reposition label
		var label_bbox = 	d3.select("#" + options.gap_id + "_label").node().getBBox();
		var svg_bbox = d3.select("#bar_g").node().getBBox();
		var bar_bbox = d3.select("#" + options.gap_id + "_bar").node().getBBox();
		$("#" + options.gap_id + "_label")
			.attr("x", 4);

		label_bbox = d3.select("#" + options.gap_id + "_label").node().getBBox();

		//console.log(label_bbox);

		// add backgrond for label
		d3.select("#label_bg_g")
			.append("rect")
			.classed("gap", true)
			.classed("gap_elem", true)
			.attr("id", options.gap_id + "_label_bg")
			.attr("x", label_bbox.x)
			.attr("y", label_bbox.y)
			.attr("height", label_bbox.height)
			.attr("width", Math.max(label_bbox.width + 2, bar_bbox.x - container.bar_height))
			.style("fill", "white")
			.style("opacity", "0")
			.on('mouseover', function (){
				showDistrict(options.gap_id);
			})
			.on('mouseout', function () {
				hideDistrict(options.gap_id);
			});
;
		d3.select("#bar_g")
			.append("rect")
			.classed("gap", true)
			.classed("gap_elem", true)
			.classed("left", true)
			.attr("x", left_pos)
			.attr("rx", container.bar_height)
			.attr("y", container.padding)
			.attr("width", container.bar_height)
			.attr("height", container.bar_height)
			.attr("id", options.gap_id + "_left")
			.style("stroke-width", 1.5)
			.style("stroke", colors.dot_border);
;


		d3.select("#bar_g")
			.append("rect")
			.classed("gap", true)
			.classed("gap_elem", true)
			.classed("right", true)
			.attr("x", right_pos)
			.attr("rx", container.bar_height)
			.attr("y", container.padding)
			.attr("width", container.bar_height)
			.attr("height", container.bar_height)
			.attr("id", options.gap_id + "_right")
			.style("stroke-width", 1.5)
			.style("stroke", colors.dot_border);


		var g_bbox =d3.select ("#" + options.svg + " g").node().getBBox();
		var g_height = g_bbox.height + g_bbox.y ;
		var svg_height =  d3.select ("#" + options.svg).node().getBBox().height;

		 d3.select ("#" + options.svg)
		 	.attr("height", g_height + 30);


	}

	//console.log(getData("white", "black", "math"));

	update();

	$("#r1").change(update);
	$("#r2").change(update);
	$("#s").change(update);

	function update(){
		var r1 = $("#r1 option:selected").val();
		var r2 = $("#r2 option:selected").val();
		var s = $("#s option:selected").val();

		getData(r1, r2, s);
	}

	function getData(r1, r2, subject){

		//console.log(r1, r2, subject);
		var url = "http://projects.ctmirror.org/content/2015/12/gap_by_school/q.php?d=all"
		+ "&r1=" + r1 + "&r2=" + r2 + "&s=" + subject ;

		var ret_data = {};
		//console.log(url);
		$.getJSON(url, function (data_json) {
			//console.log (data_json);
			setData(data_json);
		});
		//console.log(ret_data);
		return ret_data;
	}

	function setData(data){
		gaps = [];
		for (var i in data){
			if (data[i]["status"] == "SUCCESS"){
				var obj = {
					width: data[i]["gap"],
					label: data[i]["district"],
					r1: data[i]["r1"],
					r2: data[i]["r2"]
				};
				gaps.push(obj);
			}
		}
		draw();

	}
	$("#school_search").width(Math.max("#r1"),$("#school_search").width() );
	draw();
});

