<?php

$districts = [];

if (!isset($_GET["d"])){
	echo "{error:\"no school district specified.\"}";
	exit();
}
if (!isset($_GET["r1"])){
	echo "{error:\"no first race specified.\"}";
	exit();
}

if (!isset($_GET["r2"])){
	echo "{error:\"no second race specified.\"}";
	exit();
}
if (!isset($_GET["s"])){
	echo "{error:\"no subject specified.\"}";
	exit();
}
else {
	$districts = explode(",",$_GET["d"]);
}

function file_get_json ($json_file){
	$json_string = file_get_contents($json_file);
	return json_decode($json_string);
}


$json_file = "js/data.json";

$data = file_get_json($json_file);

$return = [];

function getGap($district_code) {
	global $data;

	$s = $_GET["s"];
	$gap = "error";


	$district = $data->$district_code->district;

//	echo "district: " . $district . "<br>";

	$r1 = $_GET["r1"];
	$r2 = $_GET["r2"];

//	echo "race: " . $r1 . "<br>";
//	echo "race: " . $r2 . "<br>";

	$r1_score = $data->$district_code->$r1->$s;
	$r2_score = $data->$district_code->$r2->$s;

//	echo "r1_score: " . $r1_score . "<br>";
//	echo "r2_score: " . $r2_score . "<br>";

	if (is_numeric($r1_score) && is_numeric($r2_score)){
		$gap = $r1_score * 100 - $r2_score * 100;
		$obj = [];
		$obj["gap"] = $gap;
		$obj["r1"] = $r1_score * 100;
		$obj["r2"] = $r2_score * 100;
		$obj["status"] = "SUCCESS";
		$obj["district"] = $district;
	}
	else {

		$obj = [];
		$obj["status"] = "ERROR";
		$obj["message"] = "Missing data";

	}

	return $obj;
}


function getAllGaps() {
	global $data;

	$return = [];

	foreach($data as $district_code => $datum){
		$return [$district_code] = getGap($district_code);
	}

	echo json_encode($return);
	exit();
}



function getGaps(){
	global $district_code;

	$return = [];

	foreach ($districts as $district_code){

		$return[$district_code] = getGap($district_code);

	}

	echo json_encode($return);
	exit();

}


if ($_GET["d"]="all") {
	getAllGaps();
}
else {
	getGaps();
}

?>