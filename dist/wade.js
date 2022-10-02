(()=>{
    const createComponent = (name, path) => {
        customElements.define(`dom-${name}`, class extends HTMLElement {
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
                            let match = el.slice(2, -2);\
    
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
})();
