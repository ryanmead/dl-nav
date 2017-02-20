var app = (function() { //main
  
  var childNodeSize = 140, currentNodeSize = 210, parentNodeSize = 100; //must set to same values in SASS
  var nodeSpacing = 0.1; //vertical spacing proportional to childNodeSize
  var currentNodeTopMargin = 0.2; //top position of current node 
  var currentDdVertOffset = 0.48;  //relative to height of current dt
  var childDdVertOffset = 0.44;  //relative to height of child dt
  var dts, article, topHome, botHome; //DOM element references; set on load
  
  document.onclick = function(evt, yadda) { //general click handler
    if ((evt.target.id==="top-home")||(evt.target.id==="bot-home")) {
      setCurrentNode();
      return;
    }
    switch (evt.target.tagName) {
      case "DT":  
        if (evt.target.className==="current-node"&&!isTopNode(evt.target)) {
            setCurrentNode(evt.target.parentElement.parentElement.previousElementSibling);
        } else { //set clicked dt as current dt
            setCurrentNode(evt.target);
        }
        break;
      case "DD":  //set associated dt as current dt if click on a dd
        if (evt.target.previousElementSibling.className==="current-node"&&!isTopNode(evt.target.previousElementSibling)) {
          setCurrentNode(evt.target.previousElementSibling.parentElement.parentElement.previousElementSibling);
        } else {
          setCurrentNode(evt.target.previousElementSibling);
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
    dts = document.getElementsByTagName("dt");  //enumerate dt elements
    article = document.getElementsByTagName("article")[0];
    article.className = "";  //remove no-js class from article tag if js active
    header = document.getElementsByTagName("header")[0];
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
    var childDts, grandChildDts, i, j, k;
    var vOffSet = 0;  //vertical offset val for child dts
    if (currentDt===undefined) {
      //if no dt node passed, set highest-level dt as current
      currentDt = dts[0];
    }
    
    if (!(currentDt.nextElementSibling.getElementsByTagName("dt").length===0)) { //if not leaf node (i.e. if dd contains dts)
      //reset classes on all dts
      for (j=0;j<dts.length;j++) {
        dts[j].className = "";
      }
      //set passed dt node as current dt
      currentDt.className = "current-node";
            
      //if contained within another dt, 
      if (currentDt.parentElement.parentElement.previousElementSibling.tagName==="DT") { 
        currentDt.style.top = -parentNodeSize/2 + (currentNodeSize*currentNodeTopMargin) + "px";  //relative to dd of parent dt
        currentDt.nextElementSibling.style.top = -parentNodeSize/2 + (currentNodeSize*(currentNodeTopMargin+currentDdVertOffset)) + "px";
        //set parent style on parent dt
        currentDt.parentElement.parentElement.previousElementSibling.className = "parent-node";
        topHome.disabled = false;
        botHome.disabled = false;
      } else {
        topHome.disabled = true;
        botHome.disabled = true;
      
      }
      
      //set upward vertical offset val for child dts to compensate for current dt's position among its siblings
      vOffSet = -(currentNodeSize*(childDdVertOffset+currentNodeTopMargin));
     
      //set style on child and grandchild dts
      childDts = getChildNodes(currentDt.nextElementSibling.childNodes[1], "DT");
      for (i=0;i<childDts.length;i++) {
        childDts[i].className = "child-node";
        childDts[i].style.top = (((i*childNodeSize)*(1+nodeSpacing))) + vOffSet + "px";
        childDts[i].nextElementSibling.style.top = (((i*childNodeSize)*(1+nodeSpacing))+(childNodeSize*childDdVertOffset)) + vOffSet + "px";
        if (childDts[i].nextElementSibling.getElementsByTagName("dt").length===0) {  //set leaf node style if no children
          childDts[i].className += " leaf-node";
        }
      }
      //set article height
      article.style["height"] = (childDts.length*((childNodeSize)*(1+nodeSpacing))) + "px";
    }
    return;
  }  
  
}());