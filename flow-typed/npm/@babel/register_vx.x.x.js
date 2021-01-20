declare module '@babel/register' {
  declare module.exports: (
    options?: {
      cwd?: string,
      plugins?: Array<mixed>,
      presets?: Array<mixed>
    }
  ) => void;
}

declare module '@babel/template' {
  declare module.exports: any;
}