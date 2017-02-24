var dlNav = (function() { //main
  
  //must set to same values at top of SCSS
  var childDtSize = 140, currentDtSize = 210, parentDtSize = 100; 
  var currentDtTopMargin = 0.2; //top position of current node 
  var currentDdVertOffset = 0.58;  //relative to height of current dt

  var dtSpacing = 0.1; //vertical spacing proportional to childDtSize
  var childDdVertOffset = 0.44;  //relative to height of child dt
//  var dts, article, topHome, botHome; //DOM element references; set on load
  var topDl, dts, article, topHome, botHome; //DOM element references; set on load
  
  document.onclick = function(evt, yadda) { //general click handler
    if ((evt.target.id==="top-home")||(evt.target.id==="bot-home")) {
      setCurrentNode();
      return;
    }
    switch (evt.target.tagName) {
      case "DT":  
        if (evt.target.className==="current-node"&&!isTopNode(evt.target)) {
            tapDt(evt.target.parentElement.parentElement.previousElementSibling);
        } else { //set clicked dt as current dt
            tapDt(evt.target);
        }
        break;
      case "DD":  //set associated dt as current dt if click on a dd
        if (evt.target.previousElementSibling.className==="current-node"&&!isTopNode(evt.target.previousElementSibling)) {
          tapDt(evt.target.previousElementSibling.parentElement.parentElement.previousElementSibling);
        } else {
          tapDt(evt.target.previousElementSibling);
        }
        break;
      
      }
  }
  
  window.addEventListener("load", init() );

  function getChildNodes(node, tagName) {
    //return immediate children of passed node; only matching tagName (if given)
    var children = new Array();
    for(var child in node.childNodes) {
        if((node.childNodes[child].nodeType === 1)&&((node.childNodes[child].tagName===tagName)||(!tagName))) {
            children.push(node.childNodes[child]);
        }
    }
    return (children.length!==0?children:false);
  }

  function getIndexInParent(node, onlySiblings) {
    //this node is what nth child node of parent node? (for elements of same type if onlySiblings is true)
    var peers = (onlySiblings?getChildNodes(node.parentNode, node.tagName):getChildNodes(node.parentNode));
    for (i=0;i<peers.length;i++) {
      if (peers[i]===node) {
        return (i);
      };
    }
    return (-1);
  }
  
  function init() {
//    dts = document.getElementsByTagName("dt");  //enumerate dt elements
    topDl = document.getElementById("nav-dl");
    dts = topDl.getElementsByTagName("dt");  //enumerate dt elements
    article = document.getElementById("nav-article");
    topDl = document.getElementById("nav-dl");

    article.className = "";  //remove no-js class from article tag if js active
    //header = document.getElementsByTagName("header")[0];
    header = document.getElementById("nav-header");
    header.className = "";  //remove no-js class from header tag if js active
    topHome = document.getElementById("top-home");
    botHome = document.getElementById("bot-home");
    botHome.className = "";
    setCurrentNode();  //set the highest-level node as the current node
  }

  
  function isTopNode(node) {
    //passed node should be a dt; check whether it's the first dt in the document
    return (node===dts[0]);
  }
  
  
  function setCurrentNode(currentDt) {
  //display the current node, its parent, its direct children, hide everything else
  //all the js style changes that trigger the CSS animations happen here

    var childDts, i, j, k;
//    var vOffSet = 0;  //vertical offset val for child dts
    var vOffSet = 0;  //vertical offset val for child dts
    if (currentDt===undefined) {
      //if no dt node passed, set highest-level dt as current
//      currentDt = dts[0];
      currentDt = dts[0];
    }

//      //reset classes on all dts
      //reset classes on all dts
      for (j=0;j<dts.length;j++) {
        dts[j].className = "";
      }
      //set passed dt node as current dt
      currentDt.className = "current-node";
            
      //if contained within another dt, 
      if (currentDt.parentElement.parentElement.previousElementSibling.tagName==="DT") { 
        currentDt.style.top = -parentDtSize/2 + (currentDtSize*currentDtTopMargin) + "px";  //relative to dd of parent dt
        currentDt.nextElementSibling.style.top = -parentDtSize/2 + (currentDtSize*(currentDtTopMargin+currentDdVertOffset)) + "px";
        //set parent style on parent dt
        currentDt.parentElement.parentElement.previousElementSibling.className = "parent-node";
        topHome.disabled = false; //enable the home buttons
        botHome.disabled = false;
      } else {
        //if the topmost node is current
        topHome.disabled = true;  //disable the home buttons 
        botHome.disabled = true;
      
      }
      
//      //set upward vertical offset val for child dts to compensate for current dt's position among its siblings
      vOffSet = -(currentDtSize*(childDdVertOffset+currentDtTopMargin));
     
//      //set style on child and grandchild dts
      childDts = getChildNodes(currentDt.nextElementSibling.childNodes[1], "DT");
      for (i=0;i<childDts.length;i++) {
        childDts[i].className = "child-node";
        childDts[i].style.top = (((i*childDtSize)*(1+dtSpacing))) + vOffSet + "px";
        childDts[i].nextElementSibling.style.top = (((i*childDtSize)*(1+dtSpacing))+(childDtSize*childDdVertOffset)) + vOffSet + "px";
        if (childDts[i].nextElementSibling.getElementsByTagName("dt").length===0) {  //set leaf node style if no children
          childDts[i].className += " leaf-node";
        }
      }
      //set article height
      article.style["height"] = (childDts.length*((childDtSize)*(1+dtSpacing))) + "px";
  }
  
  function tapLeafDt(tappedLeafDt) {
    //if a leaf node contains only one <a> tag, follow it when click anywhere on leaf node
    var dtLinks, ddLinks, ret;
    //get all anchor elements that are direct children of the dt or dd  (more deeply nested <a> tags not followed)
    dtLinks = getChildNodes(tappedLeafDt, "A");
    ddLinks = getChildNodes(tappedLeafDt.nextElementSibling, "A");
//    if ((isNaN(dtLinks.length)?0:dtLinks.length), (isNaN(ddLinks.length)?0:ddLinks.length), ((isNaN(dtLinks.length)?0:dtLinks.length)+(isNaN(ddLinks.length)?0:ddLinks.length)===1)) {

    if ((isNaN(dtLinks.length)?0:dtLinks.length)+(isNaN(ddLinks.length)?0:ddLinks.length)===1) {
    
    if (!isNaN(dtLinks.length)) {
      ret = dtLinks[0].href;
  } else if (!isNaN(ddLinks.length)) {
      ret = ddLinks[0].href; 
  } else {
      console.log("couldnt find link"); 
  }
      console.log (ret);
      location.href = ret;

 }
      

  }
  
  function tapDt(tappedDt) {
    if (!(tappedDt.nextElementSibling.getElementsByTagName("dt").length===0)) { 
      setCurrentNode(tappedDt); 
    } else {
      tapLeafDt(tappedDt);
    }
  }

  
}());