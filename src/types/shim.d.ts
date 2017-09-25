declare module '*.html' {
    const template: string;
    export default template;
}

declare module '*.css' {
    const template: string;
    export default template;
}

declare module 'niceware' {
    const content: any;
    function generatePassphrase(bytes: number): string[];
    export default content;
}
