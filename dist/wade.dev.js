(()=>{
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
    customElements.define('wade-import', class extends HTMLElement {
        connectedCallback() {
            this.outerHTML = `<iframe style="display:none;" src="${this.getAttribute('src')}" onload="wade.createComponent(this);this.remove();"></iframe>`;
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
                    setTimeout(() => {
                        window.history.pushState({path}, path, path);
                        document.querySelector('.wade-routes').innerHTML = this.innerHTML;
                    }, 450);
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
                    constructor() {
                        super();
                        this.attachShadow({mode:'open'});
                        this.render();
                    };
                    render(){
                        let tm_ = e.innerHTML;
                        if(tm_.match(/\{\{([^}]+)\}\}/g)){
                            tm_ = tm_.replace(/\{\{([^}]+)\}\}/g,(pr)=>{
                                pr = pr.slice(2, -2).trim();
                                let gA = this.getAttribute(pr);
                                this.removeAttribute(pr);
                                return gA;
                            });
                        }
                        this.shadowRoot.innerHTML = tm_;
                    }
                });
            });
        }
    }
})();
