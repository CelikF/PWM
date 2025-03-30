function xLuIncludeFile() {
    let elements = document.querySelectorAll("[xlu-include-file]");
    
    if (elements.length === 0) {
      document.dispatchEvent(new Event("templatesLoaded"));
      console.log("templatesLoaded event dispatched");
      return;
    }
    
    let elem = elements[0];
    let file = elem.getAttribute("xlu-include-file");
    let xhttp = new XMLHttpRequest();
  
    xhttp.onreadystatechange = function () {
      if (xhttp.readyState === 4 && xhttp.status === 200) {
        // Create an "empty" clone of the element to be updated
        let clone = elem.cloneNode(false);
        clone.removeAttribute("xlu-include-file");
        
        // Get the content of the file
        let content = xhttp.responseText;
        
        // Hydrate template: replace placeholders with the values of data-attributes
        let templateData = {};
        for (let attr of clone.attributes) {
          if (attr.name.startsWith("data-")) {
            let key = attr.name.slice(5);
            templateData[key] = attr.value;
          }
        }
        for (let key in templateData) {
          let placeholder = new RegExp(`{{${key}}}`, "g");
          content = content.replace(placeholder, templateData[key] || '');
        }
        
        // Insert the updated content into the element
        clone.innerHTML = content;
        elem.parentNode.replaceChild(clone, elem);
        
        // Execute any scripts present in the template
        let scripts = clone.getElementsByTagName("script");
        for (let script of scripts) {
          if (script.src) {
            let newScript = document.createElement("script");
            newScript.src = script.src;
            document.body.appendChild(newScript);
          } else {
            // If inline scripts, execute them (if necessary)
            eval(script.innerText);
          }
        }
        
        xLuIncludeFile();
      }
    };
  
    xhttp.open("GET", file, false);
    xhttp.send();
  }
  
  function replaceArticleTemplatePlaceholders(content, element) {
    let articleData = {
      title: element.getAttribute("data-title"),
      subtitle: element.getAttribute("data-subtitle"),
      date: element.getAttribute("data-date"),
      displayDate: element.getAttribute("data-display-date"),
      content: element.getAttribute("data-content"),
      image: element.getAttribute("data-image"),
      imageCaption: element.getAttribute("data-image-caption")
    };
  
    return content
      .replace(/{{title}}/g, articleData.title ?? "{{title}}")
      .replace(/{{subtitle}}/g, articleData.subtitle ?? "{{subtitle}}")
      .replace(/{{date}}/g, articleData.date ?? "{{date}}")
      .replace(/{{displayDate}}/g, articleData.displayDate ?? "{{displayDate}}")
      .replace(/{{content}}/g, articleData.content ?? "{{content}}")
      .replace(/{{image}}/g, articleData.image ?? "{{image}}")
      .replace(/{{imageCaption}}/g, articleData.imageCaption ?? "{{imageCaption}}");
  }
  
  function redirectToArticle(event, element) {
    event.preventDefault(); // Prevent the default navigation
  
    // Get the article data from the related data-attributes
    let params = new URLSearchParams();
    params.append("title", element.getAttribute("data-title"));
    params.append("subtitle", element.getAttribute("data-subtitle"));
    params.append("date", element.getAttribute("data-date"));
    params.append("displayDate", element.getAttribute("data-display-date"));
    params.append("content", element.getAttribute("data-content"));
    params.append("image", element.getAttribute("data-image") || "");
    params.append("imageCaption", element.getAttribute("data-image-caption") || "");
  
    // Redirect to article.html with the parameters
    window.location.href = "article.html?" + params.toString();
  }
  
  // Start including templates once the DOM has loaded
  window.addEventListener("DOMContentLoaded", function() {
    xLuIncludeFile()
  });
  
//Temporary set the users ID in local storage to test event views planned of different hosts
function setUserId(userID) {
  localStorage.setItem('userID', userID);
}
function getUserId() {
  return localStorage.getItem('userID')
}

function setEventId(id) {
  localStorage.setItem("eventId", id);
}

function getEventId() {
  return localStorage.getItem("eventId");
}

setUserId(1)
setEventId(1)
