(()=>{
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

    const createComponent = (name, path) => {
        if(!name.match(/\-/g)){
            console.error(`WADE Framework Error : An error occurred because the specified name "${name}" does not contain a '-'.`);
        }else{
            if(name.match(/wade|dom/g)){
                console.error(`WADE Framework Error : The name you specify "${name}" can be used as a reserved word and cause errors in the DOM element. (Reserved word : wade | dom)`);
            };
            customElements.define(`${name}`, class extends HTMLElement {
                connectedCallback() {
                    let props = ``;
                    this.getAttributeNames().forEach(prop => {
                        props += ` ${prop}="${this.getAttribute(prop)}"`;
                    });
                    let component = `
                    <iframe
                        src="${path}"
                        ${props}
                        onload="
                            let component = this.contentDocument.body.innerHTML;
    
                            component.match(/\{\{([^}]+)\}\}/g).forEach(el => {
                                let match = el.slice(2, -2);
        
                                component = component.replace(el, this.getAttribute(match.trim()));
                            });
        
                            this.contentDocument.body.innerHTML = component;
                            this.before((this.contentDocument.body||this.contentDocument).children[0]);
                            this.remove();
                        ">
                    </iframe>
                    `;
        
                    this.outerHTML = component;
                };
            });
        }
    };
    
    customElements.define('wade-import', class extends HTMLElement {
        connectedCallback() {
            this.outerHTML = "";
            createComponent(this.getAttribute('name'), this.getAttribute('src')) 
    
        };
    });
    
    customElements.define('wade-head', class extends HTMLElement {
        connectedCallback() {
            this.outerHTML = "";
        };
    });
    
    customElements.define('wade-app', class extends HTMLElement {
        connectedCallback() {
            this.outerHTML = this.innerHTML;
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
})();