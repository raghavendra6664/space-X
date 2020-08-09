let lauchData;
let currYr;
let currLaunch;
let currLand;
window.addEventListener('load', function () {
    axios.get(`https://api.spacexdata.com/v3/launches?pmit=100`).then((res) => {
        if (res.status === 200 && res.data && res.data.length > 0) {
            lauchData = res.data.reduce((acc, v, i) => {
                if(acc[v.launch_year]){
                   
                    acc[v.launch_year][v.flight_number] = v;
                   
                }else{
                    acc[v.launch_year] = {
                        [v.flight_number] : v
                    }
                }
                return acc;
            }, {});
            console.log('res.data :::: ', lauchData);
            renderLeft(lauchData);
           
        }
    });
});
function renderLeft(data){
    var op ="";
    op+="<h3>Filter</h3>";
    op+="<ul id='top' class='left-cards'>";
   
    op+="<label>Launch Year</label>";
    for(let item in data){ 
        op+="<li>";
        op+="<button id='launch_"+item+"' onclick='btnClick("+item+")'>"+item+"</button>";
        op+="</li>";
    }
    op+="</ul>";
    op += renderLeftbottom();
    document.querySelector(".left").innerHTML=op;
    
    defaultRender(lauchData);
}
function renderLeftbottom(){
    var op ="";
    op+="<ul id='bottom' class='left-cards'>";
    op+="<label>SuccessFul Launcher</label>";   
    op+="<li><button id='launch_true' class='launch' onclick='launchClick(true)'>true</button></li>";
    op+="<li><button id='launch_false' class='launch' onclick='launchClick(false)'>false</button></li>";
    op+="<label>SuccessFul Landing</label>";   
    op+="<li><button id='land_true' class='land' onclick='landClick(true)'>true</button></li>";
    op+="<li><button id='land_false' class='land' onclick='landClick(false)'>false</button></li>";
    op+="</ul>";
    
    return op;
}
function launchClick(v){
    // currLaunch = v;
    if(currLaunch !== undefined && currLaunch === v){
        currLaunch = undefined;
        document.getElementById(`launch_${v}`).classList.remove('highlight');
        
    }else{
        currLaunch = v;
        if(document.querySelector('button.launch.highlight') !== null){
            document.querySelector('button.launch.highlight').classList.remove('highlight')
        }
        document.getElementById(`launch_${v}`).classList.add('highlight');
    }
    commonFun();
}
function commonFun(){
    if(currYr){
        const filData = Object.keys(lauchData[currYr]).reduce((acc, v) => {
            const tempLu = lauchData[currYr][v].launch_success;
            const tempLa = lauchData[currYr][v].rocket.first_stage.cores[0].land_success;
            if(currYr && currLaunch !== undefined && currLand === undefined){
                if(tempLu !== null && currLaunch === tempLu){
                    // acc = [...acc, lauchData[currYr][v]];
                    if(acc[currYr]){
                        acc[currYr][v] = lauchData[currYr][v];
                    }else{
                        acc[currYr] = {
                            [v] : lauchData[currYr][v]
                        }
                    }
                }
            }else if(currYr && currLaunch === undefined && currLand !== undefined){
                if(tempLa !== null && currLand === tempLa){
                    // acc = [...acc, lauchData[currYr][v]];
                    if(acc[currYr]){
                        acc[currYr][v] = lauchData[currYr][v];
                    }else{
                        acc[currYr] = {
                            [v] : lauchData[currYr][v]
                        }
                    }
                }
            }else if(currYr && currLaunch !== undefined && currLand !== undefined){
                if(tempLu !== null && tempLa !== null && currLand === tempLa && currLaunch === tempLu){
                    // acc = [...acc, lauchData[currYr][v]];
                    if(acc[currYr]){
                        acc[currYr][v] = lauchData[currYr][v];
                    }else{
                        acc[currYr] = {
                            [v] : lauchData[currYr][v]
                        }
                    } 
                }
            }else{
                if(acc[currYr]){
                    acc[currYr][v] = lauchData[currYr][v];
                }else{
                    acc[currYr] = {
                        [v] : lauchData[currYr][v]
                    }
                }
            }
            return acc;
        }, {});
        console.log('filData ::: ', filData);
        defaultRender(filData);
    }
    else{
        const filData = Object.keys(lauchData).reduce((acc, v) => {
            acc[v] = { ...Object.keys(lauchData[v]).reduce((acc, subV) => {
                    const tempLu = lauchData[v][subV].launch_success;
                    const tempLa = lauchData[v][subV].rocket.first_stage.cores[0].land_success;
                    if(currLaunch !== undefined && currLand === undefined){
                        if(tempLu !== null && currLaunch === tempLu){
                            acc = [...acc, lauchData[v][subV]];   
                        }
                    }else if(currLaunch === undefined && currLand !== undefined){
                        if(tempLa !== null && currLand === tempLa){
                            acc = [...acc, lauchData[v][subV]];    
                        }
                    }else if(currLaunch !== undefined && currLand !== undefined){
                        if(tempLu !== null && tempLa !== null && currLand === tempLa && currLaunch === tempLu){
                            acc = [...acc, lauchData[v][subV]];  
                        }
                    }
                    return acc;
                }, [])};
            return acc;
        }, {});
        console.log('no yr selected', filData);
        defaultRender(filData);
    }
    
}

function landClick(v){
    if(currLand !== undefined && currLand === v){
        currLand = undefined;
        document.getElementById(`land_${v}`).classList.remove('highlight');
    }else{
        currLand = v;
        if(document.querySelector('button.land.highlight') !== null){
            document.querySelector('button.land.highlight').classList.remove('highlight')
        }
        document.getElementById(`land_${v}`).classList.add('highlight'); 
    }
    commonFun();
}

function defaultRender(data){
    let op = '';
    op+="<ul class='right-cards'>";
    for(let item in data){
        let each = data[item];
        for(let key in each){
            op+="<li>";
            op+="<img src="+each[key].links.mission_patch_small+" />";
            op+="<h1>"+each[key].mission_name+" # "+each[key].flight_number+"</h1>";
            op+="<p>Mission_Id : "+each[key].mission_id+"</p>";
            op+="<p>Launch_Year : "+each[key].launch_year+"</p>";
            op+="<p>SuccessFull_Launches : "+each[key].launch_success+"</p>";
            op+="<p>SuccessFull_Landings : "+each[key].rocket.first_stage.cores[0].land_success+"</p>";
            op+="</li>";
        }
    }
    op+="</ul>";
    document.querySelector(".right").innerHTML=op;
}
function renderRight(data){
    let op = '';
    for(let item in data){
            op+="<li>";
            op+="<img src="+data[item].links.mission_patch_small+" />";
            op+="<h1>"+data[item].mission_name+" # "+item+"</h1>";
            op+="<p>Mission_Id : "+data[item].mission_id+"</p>";
            op+="<p>Launch_Year : "+data[item].launch_year+"</p>";
            op+="<p>SuccessFull_Launches : "+data[item].launch_success+"</p>";
            op+="<p>SuccessFull_Landings : "+data[item].rocket.first_stage.cores[0].land_success+"</p>";
            op+="</li>";
    }
    document.querySelector(".right .right-cards").innerHTML=op;
}
function btnClick(v){
    // console.log('btnClick :::::', v, lauchData);
    currYr = v;
    if(document.querySelector('#top button.highlight') !== null){
        document.querySelector('#top button.highlight').classList.remove('highlight')
    }
    document.getElementById(`launch_${v}`).classList.add('highlight');
    //renderRight(lauchData[v])
    commonFun();
}


