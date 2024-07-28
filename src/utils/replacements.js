import { qs, qsa } from "./core";
import Url from "./url";
import Path from "./path";

export function replaceBase(doc, section){
	var base;
	var head;
	var url = section.url;
	var absolute = (url.indexOf("://") > -1);

	if(!doc){
		return;
	}

	head = qs(doc, "head");
	base = qs(head, "base");

	if(!base) {
		base = doc.createElement("base");
		head.insertBefore(base, head.firstChild);
	}

	// Fix for Safari crashing if the url doesn't have an origin
	if (!absolute && window && window.location) {
		url = window.location.origin + url;
	}

	base.setAttribute("href", url);
}

export function replaceCanonical(doc, section){
	var head;
	var link;
	var url = section.canonical;

	if(!doc){
		return;
	}

	head = qs(doc, "head");
	link = qs(head, "link[rel='canonical']");

	if (link) {
		link.setAttribute("href", url);
	} else {
		link = doc.createElement("link");
		link.setAttribute("rel", "canonical");
		link.setAttribute("href", url);
		head.appendChild(link);
	}
}

export function replaceMeta(doc, section){
	var head;
	var meta;
	var id = section.idref;
	if(!doc){
		return;
	}

	head = qs(doc, "head");
	meta = qs(head, "link[property='dc.identifier']");

	if (meta) {
		meta.setAttribute("content", id);
	} else {
		meta = doc.createElement("meta");
		meta.setAttribute("name", "dc.identifier");
		meta.setAttribute("content", id);
		head.appendChild(meta);
	}
}

// TODO: move me to Contents
export function replaceLinks(contents, fn) {

	var links = contents.querySelectorAll("a[href]");

	if (!links.length) {
		return;
	}

	var base = qs(contents.ownerDocument, "base");
  var location = base ? base.getAttribute("href") : undefined;
  // 我在webview中得到的location变量的值为： "null/OEBPS/Text/part0001.xhtml" 正常情况下应当是："file:///OEBPS/Text/part0001.xhtml"，这是怎么回事？
  // 前四个字符串如果为null，则将其替换为file://
  // TODO 为什么会出现这种情况？
  if (location && location.substring(0, 4) === "null") {
    location = "file://" + location.substring(4);
  }
	var replaceLink = function(link){
		var href = link.getAttribute("href");

		if(href.indexOf("mailto:") === 0){
			return;
		}

		var absolute = (href.indexOf("://") > -1);

		if(absolute){

			link.setAttribute("target", "_blank");

		}else{
			var linkUrl;
			try {
				linkUrl = new Url(href, location);	
			} catch(error) {
				// NOOP
			}

			link.onclick = function(){

				if(linkUrl && linkUrl.hash) {
					fn(linkUrl.Path.path + linkUrl.hash);
				} else if(linkUrl){
					fn(linkUrl.Path.path);
				} else {
					fn(href);
				}

				return false;
			};
		}
	}.bind(this);

	for (var i = 0; i < links.length; i++) {
		replaceLink(links[i]);
	}


}

export function substitute(content, urls, replacements) {
	urls.forEach(function(url, i){
		if (url && replacements[i]) {
			// Account for special characters in the file name.
			// See https://stackoverflow.com/a/6318729.
			url = url.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
			content = content.replace(new RegExp(url, "g"), replacements[i]);
		}
	});
	return content;
}
