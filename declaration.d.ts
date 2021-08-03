// 定义所有的less 文件，相对引用
declare module '*.less' {
    const content: any;
    export default content;
}

declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.css' {
    const content: any;
    export default content;
}

interface Window {
    r: string[];
}
