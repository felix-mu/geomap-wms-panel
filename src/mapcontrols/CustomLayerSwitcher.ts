import LayerSwitcher, { Options } from "ol-layerswitcher";

export class CustomLayerSwitcher extends LayerSwitcher {
    protected shownClassNameButton: string;
    protected hiddenClassNameButton: string;
    protected icon: HTMLElement;
    protected text: Text;

    constructor(opts: CustomOptions) {
      const {shownClassNameButton, hiddenClassNameButton, ...opt_options} = opts;
      super({ ...opt_options });

      this.shownClassNameButton = shownClassNameButton ? shownClassNameButton : "";
      this.hiddenClassNameButton = hiddenClassNameButton ? hiddenClassNameButton : "";

      this.icon = document.createElement('i');
      this.icon.setAttribute("class", hiddenClassNameButton!);
      this.button.appendChild(this.icon);

      this.text = document.createTextNode("");
      this.button.appendChild(this.text);

      this.updateButton();
    }
    
    protected updateButton(): void {

      if (!this.icon || !this.text) {
        return;
      }

      if (this.element.classList.contains(this.shownClassName)) {
        // this.button.textContent = this.collapseLabel;
        // this.button.innerText = this.collapseLabel;
        this.button.setAttribute('title', this.collapseTipLabel);
        this.button.setAttribute('aria-label', this.collapseTipLabel);
        if (this.text) {
          this.text.textContent = this.collapseLabel;
        }
        if (this.icon) {
              this.icon.setAttribute("class", this.shownClassNameButton);
        }
      } else {
        // this.button.textContent = this.label;
        // this.button.innerText = this.label;
        this.button.setAttribute('title', this.tipLabel);
        this.button.setAttribute('aria-label', this.tipLabel);
        if (this.text) {
          this.text.textContent = this.label;
        }
        if (this.icon) {
              this.icon.setAttribute("class", this.hiddenClassNameButton);
        }
      }
    }
}

interface CustomOptions extends Options {
  shownClassNameButton?: string,
  hiddenClassNameButton?: string
}
