
let Task =document.querySelector("#Task");
let box=document.querySelector("#box");
let Add= document.querySelector("#Add");
let track=document.querySelector(".tracker-value");
let progress =0; 
let taskcompleted=0;
let totaltask=0;


Add.onclick=()=> {
    console.log("hello naman sir");
    //creating list
    let newtask=document.createElement("li");

    //  creating checkbox
    let check=document.createElement("input");
        check.type="checkbox";
    
    

    if (Task.value.trim()!== ""){    // if someone enter empty task
    totaltask++;
    let progress= progresstracker(taskcompleted,totaltask);                 // tracking work
            console.log(`you have completed  ${progress} % work completed`);
            track.innerText= Math.floor(progress)+"%"; 
     }

    //  creating textnode
    let Text=document.createElement("span");
    Text.innerText=Task.value;

    //  creating del div
    let deletebtn=document.createElement("div");
    // creating icon
    let del =document.createElement("i");
    del.className="fa-solid fa-trash";
    del.style.cursor="pointer";
    deletebtn.appendChild(del); // ✅ This puts the icon inside the button container


     // creating action
    let  action=document.createElement("div");
     action.className="task-action";
     action.appendChild(deletebtn);
     action.appendChild(check);
     
    if (Task.value.trim()!== ""){    // if someone enter empty task
         newtask.appendChild(Text);
         newtask.appendChild(action);
         
         box.appendChild(newtask);
    }
    Task.value= "" ;                  // ready for newentries



   
     
    // appending icon in del ( what happen on clicking delete icon)
    deletebtn.appendChild(del);
    
     deletebtn.onclick=()=>{
        totaltask--;                  // if you delete task
        if(check.checked){          // if you tick box ,then you delete it so..
        taskcompleted--;
        console.log(`taskcompleted${taskcompleted}`);
        console.log(`totaltask ${totaltask} end`);

        }

        newtask.remove();
         console.log(`taskcompleted${taskcompleted}`);
         console.log(`totaltask ${totaltask}`);
           progress= progresstracker(taskcompleted,totaltask);                       // tracking work
            console.log(`you have completed  ${progress} % work completed`);
            track.innerText= Math.floor(progress)+"%"; 
            console.log(`progress=${progress} end`);
      }
    



    //  what happen on clicking checkbox
    check.onclick=()=>{
        if (check.checked){
             taskcompleted++;
              console.log(`taskcompleted${taskcompleted}`);
              console.log(`totaltask ${totaltask}`);
           progress= progresstracker(taskcompleted,totaltask);                     // tracking work
          console.log(`you have completed  ${progress} % work completed`);
          track.innerText= Math.floor(progress)+"%";    // assing % in div
          console.log(`progress=${progress} end`);
        }
        else{
             taskcompleted--;
            console.log(`taskcompleted${taskcompleted}`);
           console.log(`totaltask ${totaltask}`);
           progress= progresstracker(taskcompleted,totaltask);                 // tracking work
            console.log(`you have completed  ${progress} % work completed`);
            track.innerText= Math.floor(progress)+"%"; 
            console.log(`progress=${progress} end`);
        }
    }


   
     
    
//  what happen on clicking summit button
 let Submmit=document.querySelector(".summbit");
 let leaf=0;
Submmit.onclick=()=>{                                                  // reward treee
   
    
let value= Math.floor(progress);
console.log(`taskcompleted${taskcompleted}`);
console.log(`totaltask ${totaltask}`);
console.log(value); 


if(value==100){
leaf++;
console.log("well done!! you have completed your 100% task");
console.log(` leaf value -${leaf} `);
          if (leaf<5){
            console.log(` you have earned ${leaf} leaf ,you have to earn ${5-leaf}  yet!!`);
            }
}
if (leaf==5){
    console.log("congratulation you completed your reward Tree");
    console.log( ` ${leaf} end`);
    

}
}







} // main
