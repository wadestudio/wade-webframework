(()=>{
    const createElement = (e, t, a = "") => {
        if (null == t) return `<${e}>${a}</${e}>`; {
            let r = "";
            return Object.keys(t).forEach(e => {
                r += `${e}="${t[e]}"`
            }), `<${e} ${r}>${a}</${e}>`
        }
    };
    customElements.define("wade-import", class extends HTMLElement {
        connectedCallback() {
            this.outerHTML = `<iframe style="display:none;" src="${this.getAttribute("src")}" onload="wade.createComponent(this);this.remove();"></iframe>`
        }
    }), customElements.define("wade-head", class extends HTMLElement {
        connectedCallback() {
            this.outerHTML = this.innerHTML
        }
    }), customElements.define("wade-app", class extends HTMLElement {
        connectedCallback() {
            let e = navigator.language || navigator.userLanguage;
            e.match(this.getAttribute("lang")) ? (document.querySelector("html").lang = e, this.outerHTML = this.innerHTML) : this.outerHTML = ""
        }
    }), customElements.define("wade-routes", class extends HTMLElement {
        connectedCallback() {
            this.outerHTML = `<div class="wade-routes">${this.innerHTML}</div>`
        }
    }), customElements.define("wade-route", class extends HTMLElement {
        connectedCallback() {
            window.location.pathname == this.getAttribute("path") ? this.outerHTML = this.innerHTML : this.outerHTML = "", document.querySelectorAll('.wade-router[href^="/"]').forEach(e => e.addEventListener("click", e => {
                e.preventDefault();
                let {
                    pathname: t
                } = new URL(e.target.href);
                window.history.pushState({
                    path: t
                }, t, t), document.querySelector(".wade-routes").innerHTML = this.innerHTML
            }))
        }
    }), customElements.define("wade-link", class extends HTMLElement {
        connectedCallback() {
            let e = {
                class: "wade-router",
                href: this.getAttribute("href")
            };
            this.getAttributeNames().forEach(t => {
                t.match(/href/g) || (e[t] ? e[t] += ` ${this.getAttribute(t)}` : e[t] = `${this.getAttribute(t)}`)
            }), this.outerHTML = createElement("a", e, this.innerHTML)
        }
    });
    return wade = {
        createComponent(component){
            component.contentDocument.querySelectorAll("template").forEach(e => {
                customElements.define(e.getAttribute("name"), class extends HTMLElement {
                    constructor() {
                        super(), this.attachShadow({
                            mode: "open"
                        }), this.render()
                    }
                    render() {
                        let t = e.innerHTML;
                        t.match(/\{\{([^}]+)\}\}/g) && (t = t.replace(/\{\{([^}]+)\}\}/g, e => {
                            e = e.slice(2, -2).trim();
                            let t = this.getAttribute(e);
                            return this.removeAttribute(e), t
                        })), this.shadowRoot.innerHTML = t
                    }
                })
            });
        }
    }
})();
