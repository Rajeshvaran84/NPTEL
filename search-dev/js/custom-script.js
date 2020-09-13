const customFilter = (products, filters) => {
	return products.filter((product) => {
		return Object.entries(filters).every(([filterProperty, filterValues]) => {
			switch(Object.prototype.toString.call(product[filterProperty])) {
				case '[object Object]':
					return Object.entries(filterValues).every(([extFilterProperty, extFilterValue]) => {
					return new Map(Object.entries(product[filterProperty])).get(extFilterProperty) === extFilterValue;
					});

				case '[object Array]':
					return product[filterProperty].some((productValue) => {
					return filterValues.includes(productValue);
					});

				default:
					return filterValues.includes(product[filterProperty]);
			}
		});
	});
};
		
var radios;
var request = new XMLHttpRequest();
request.onreadystatechange=reportStatus;
request.open("GET","json_files/all_courses.json", false);
request.overrideMimeType("application/json");
request.send();

function reportStatus()
{
	var jsonData = JSON.parse(this.responseText);
	radios = JSON.parse(jsonData.payload);
	filldata(radios);
}

function loadsearch(searchtext)
{
	var cat=document.getElementById('hidcat').value;
	var courseresults=radios;
 
	if (searchtext!="")
		courseresults = radios.filter(d => d.title.includes(searchtext) ||  d.instructor_name.includes(searchtext));
		
	if (cat!="All")
		courseresults = courseresults.filter(d => d.category === cat)
		
 	filldata(courseresults);
}

function loadcourses(radvalue)
{
	document.getElementById('hidcat').value=radvalue;
	var courseresults;
	 
	if (radvalue=="All")
		courseresults=radios;
	else
	{
		var filters={category:[radvalue]};
		courseresults=customFilter(radios,filters);
	}
	
	var searchtext=document.getElementById('search').value;
	if (searchtext!="")
		courseresults = courseresults.filter(d => d.title.includes(searchtext) ||  d.instructor_name.includes(searchtext));
 
	filldata(courseresults);
}

function filldata(courseresults)
{
	var count = Object.keys(courseresults).length;
	document.getElementById('coursedata').innerHTML = '<div class="col-sm-12"><br><h6>'+ count +' courses open for registration</h6></div>';
	
	for (const [key, value] of Object.entries(courseresults)) {
		var courses=value;
		var htmlelement='';
		var title = '';
		var instructor_name= '';
		var description = '';
		var start_date = '';
		var end_date = '';
		var estimated_workload='';
		
		for (const [key, value] of Object.entries(courses)) {
			console.log(key,value);
			switch(key) {
				case 'title':
					title=value;
					break;

				case 'instructor_name':
					instructor_name=value;
					break;

				case 'description':
					description=value;
					break;

				case 'start_date':
					start_date=value;
					break;

				case 'end_date':
					end_date=value;
					break;
				
				case 'estimated_workload':
					estimated_workload=value;
					break;
				
				default:
				// code block
			} 
		}
		
		var date1 = new Date(start_date) ;
		date1.setHours(0,0,0,0);
		
		var date2 = new Date(end_date) ;
		date2.setHours(0,0,0,0);
		 
		var d = new Date();
		var today =  new Date(d.getFullYear()  + "-" + (d.getMonth()+1) + "-" + d.getDate()) ;
		today.setHours(0,0,0,0);

		var regExp = /(\d{1,2})\-(\d{1,2})\-(\d{2,4})/;
		
		var a = moment([date1.getFullYear(), date1.getMonth(), date1.getDate()]);
		var b = moment([date2.getFullYear(), date2.getMonth(), date2.getDate()]);
		weeks = b.diff(a, 'weeks');
		
		if (weeks>0)
			weeks=weeks + ' week course, ';
		else
			weeks=weeks + ' days course, ';
			
		var status='';
		if (Date.parse(today) < Date.parse(date1))
			status='Pre-registration';
		else if (date1 < today && today < date2)
			status='On going';
		else if (Date.parse(date2) < Date.parse(today))
			status='Completed';
	 
		htmlelement='<div class="col-sm-4" style="margin-top:30px;"><div class="card"><div class="row"><div class="col-sm-3"><img src="img/circle.png" style="margin:10px 0px 0px 10px;"></div><div class="col-sm-9"><div style="text-align:left;margin:10px 0px 0px 0px;"><p><b>'+ title  +'</b><br><span style="font-size:13px;">'+ instructor_name +'</span></p></div></div></div><div class="row"><div class="col-sm-3"><i class="fa fa-info-circle" style="font-size:20px;margin:15px 0px 0px 40px;"></i></div><div class="col-sm-9"><div style="text-align:left;margin:10px 0px 0px 0px;"><p style="font-size:13px;">'+ description +'</p></div></div></div><div class="row"><div class="col-sm-3"><i class="fa fa-calendar-check-o" style="font-size:20px;margin:15px 0px 0px 40px;"></i></div><div class="col-sm-9"><div style="text-align:left;margin:10px 0px 0px 0px;"><p style="font-size:13px;"><b>'+ status  +'</b><br><span style="font-size:12px;"><b>' + start_date +' - '+ end_date +'</b></span><br><span style="font-size:12px;">'+ weeks + estimated_workload+'</span></p></div></div></div></div></div>';
		
		console.log(htmlelement);
		document.getElementById('coursedata').innerHTML += htmlelement;
	}
}

var text = "";
var request = new XMLHttpRequest();
request.onreadystatechange=catStatus;
request.open("GET","json_files/all_categories.json", false);
request.overrideMimeType("application/json");
request.send();

function catStatus()
{
	var jsonData = JSON.parse(this.responseText);
	console.log(jsonData);
	var radios = JSON.parse(jsonData.payload);
	
	$('#container')
		.append('<input type="radio" id="All" name="contact" value="All" checked  onclick="loadcourses(this.value);"> <label for="All">All</label></div><br>');
		
	for (var value of radios)
	{
		$('#container')
		.append('<input type="radio" id="'+value+'" name="contact" value="'+value+'" onclick="loadcourses(this.value);">')
		.append('  <label for="'+value+'">'+value+'</label></div>')
		.append('<br>');
	}
}