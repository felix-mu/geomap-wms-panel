
export interface CustomizableControl {
    removeCssClassFromElement(classToRemove: string): void;

    addCssClassToElement(classToAdd: string): void;
}