(()=>{
    /**
     * 
     * @param {*} element 
     * @param {*} props 
     * @param {*} innerHTML 
     * @returns 
     */
    const createElement = (element, props,innerHTML="") => {
        if(props == null || undefined){
        return `<${element}>${innerHTML}</${element}>`
        }else{
        let Attribute = "";
        Object.keys(props).forEach((element) => {
            Attribute += `${element}="${props[element]}"`
        });
        return `<${element} ${Attribute}>${innerHTML}</${element}>`
        };
    };
    /**
     * 
     * @param {*} template template to bind
     * @param {*} data data to put in the template
     * @param {*} attribute Variables to be used in templates
     * @returns 
     */
    const placeholders = (template, data, attribute) => {
        'use strict';
        template = typeof (template) === 'function' ? template() : template;
        if (['string', 'number'].indexOf(typeof template) === -1) throw 'WADE DOM : please provide a valid template!';
        if (!data) return template;
        template = template.replace(/\{\{([^}]+)\}\}/g, function (match) {
            match = match.slice(2, -2);
            attribute = new RegExp(`${attribute}\\.`,"g"); 
            if (match.match(attribute)) {
                match = match.replace(attribute,"");
                var sub = match.split('.');
                if (sub.length > 1) {
                    var temp = data;
                        
                    sub.forEach(function (item) {
                        var item = item.trim();
                        if (!temp[item]) {
                        temp = '{{' + match.trim() + '}}';
                        return;
                        }
                        temp = temp[item];
                    });
                    return eval(`data.${match.trim()}`);
                }else {
                    if(match.match(/\[.*\]/g)){
                        return eval(`data.${match.trim()}`);
                    };
                    if (!data[match.trim()]){
                        return '{{' + match.trim() + '}}'
                    }else{
                        return data[match.trim()];
                    };
                };
            }else{
                return data;
            }
            
        });
        return template;
    };

    customElements.define('wade-import', class extends HTMLElement {
        connectedCallback() {
            this.outerHTML = `<iframe style="display:none;" src="${this.getAttribute('src')}"
            onload="wade.createComponent(this);this.remove();"></iframe>`;
        };
    });
    
    customElements.define('wade-head', class extends HTMLElement {
        connectedCallback() {
            this.outerHTML = this.innerHTML;
        };
    });
    
    customElements.define('wade-app', class extends HTMLElement {
        connectedCallback() {
            let lang = navigator.language || navigator.userLanguage;
            if (lang.match(this.getAttribute('lang'))) {
                document.querySelector('html').lang = lang;
                this.outerHTML = this.innerHTML;
            }else{
                this.outerHTML = "";
            }
        };
    });

    customElements.define('wade-for', class extends HTMLElement {
        connectedCallback() {
            let forData = new Function(`return ${this.getAttribute('data')}`)()
            let HTML = "";
            let innerHTML = this.innerHTML;

            forData.forEach((e)=>{
                HTML += placeholders(innerHTML,e,this.getAttribute('in'));   
            });

            this.outerHTML = HTML;

        };
    });

    // Routes
    customElements.define('wade-routes', class extends HTMLElement {
        connectedCallback() {
            this.outerHTML = `<div class="wade-routes">${this.innerHTML}</div>`;
        };
    });

    customElements.define('wade-route', class extends HTMLElement {
        connectedCallback() {
            let path = window.location.pathname;

            if(path == this.getAttribute('path')){
                this.outerHTML = this.innerHTML;
            }else{
                this.outerHTML = "";
            }

            document.querySelectorAll(`.wade-router[href^="/"]`).forEach(el => 
                el.addEventListener("click", evt => {
                    evt.preventDefault();
                    const {pathname: path} = new URL(evt.target.href);
                    window.history.pushState({path}, path, path);
                    document.querySelector('.wade-routes').innerHTML = this.innerHTML;
                })
            );

        };
    });

    customElements.define('wade-link', class extends HTMLElement {
        connectedCallback() {
            let props = {
                class : "wade-router",
                href : this.getAttribute('href')
            };
            this.getAttributeNames().forEach((attr)=>{
                if(!attr.match(/href/g)){
                    if(props[attr]){
                        props[attr] += ` ${this.getAttribute(attr)}`;
                    }else{
                        props[attr] = `${this.getAttribute(attr)}`;
                    };
                }
            });
            this.outerHTML = createElement('a',props,this.innerHTML);
        };
    });

    return wade = {
        createComponent(component){
            component.contentDocument.querySelectorAll('template').forEach((e)=>{
                customElements.define(e.getAttribute('name'), class extends HTMLElement {
                    connectedCallback() {
                        this.outerHTML = createElement('div',{id:'app',class:e.getAttribute('name')});
                    };
                });
                document.querySelectorAll(`div#app.${e.getAttribute('name')}`).forEach((sR)=>{
                    sR.attachShadow({mode:'open'});
                    sR.shadowRoot.innerHTML = e.innerHTML;
                });
            });
        }
    }
})();
